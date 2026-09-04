'use client';

/**
 * Authentification locale (solution transitoire).
 *
 * Tant que l'agence n'a pas créé son compte Supabase, le cockpit est protégé
 * par une authentification multi-utilisateurs locale (rôles admin / agent) :
 * chaque utilisateur possède son propre identifiant (email) et mot de passe,
 * stockés sous forme de hash salé (SHA-256) dans le localStorage, avec une
 * session en sessionStorage.
 *
 * ⚠️ Ceci n'est PAS une sécurité serveur : il s'agit d'un verrou de confort
 * destiné à empêcher l'accès public au cockpit en attendant Supabase Auth.
 * L'interface est volontairement simple pour être remplacée sans casse par
 * l'authentification Supabase (mêmes fonctions : isAuthenticated / login /
 * logout / setupPassword).
 *
 * Les fonctions "mot de passe unique" (setupPassword / verifyPassword /
 * hasPassword / changePassword) sont conservées comme chemin de migration
 * pour les installations antérieures au multi-utilisateurs : tant qu'aucun
 * compte utilisateur n'existe, le verrou historique reste utilisable.
 */

import {
    authenticateUser,
    createUser,
    countUsers,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    hasAgencyKey,
    setAgencyKey,
    getAgencyKey,
    type CockpitUser,
    type NewCockpitUser,
} from './users';

const PASSWORD_KEY = 'nellimo_auth_password_v1';
const SESSION_KEY = 'nellimo_auth_session_v1';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12h

export interface AuthSession {
    token: string;
    expiresAt: number;
}

function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

/** Génère un sel aléatoire hexadécimal. */
function generateSalt(): string {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/** Hash SHA-256 (hex) d'une chaîne. */
async function sha256Hex(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/** Hash du mot de passe avec sel : sha256(salt + ':' + password). */
async function hashPassword(password: string, salt: string): Promise<string> {
    return sha256Hex(`${salt}:${password}`);
}

/** Un mot de passe a-t-il déjà été défini ? */
export function hasPassword(): boolean {
    if (!isBrowser()) return false;
    try {
        return !!localStorage.getItem(PASSWORD_KEY);
    } catch {
        return false;
    }
}

/** Définit le mot de passe initial (premier accès). */
export async function setupPassword(password: string): Promise<void> {
    if (!isBrowser()) return;
    if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    }
    const salt = generateSalt();
    const hash = await hashPassword(password, salt);
    localStorage.setItem(PASSWORD_KEY, JSON.stringify({ salt, hash }));
}

/** Vérifie un mot de passe. Retourne true si correct. */
export async function verifyPassword(password: string): Promise<boolean> {
    if (!isBrowser()) return false;
    try {
        const raw = localStorage.getItem(PASSWORD_KEY);
        if (!raw) return false;
        const { salt, hash } = JSON.parse(raw) as { salt: string; hash: string };
        const candidate = await hashPassword(password, salt);
        return candidate === hash;
    } catch {
        return false;
    }
}

/** Ouvre une session (appelé après vérification réussie). */
export function createSession(): void {
    if (!isBrowser()) return;
    const session: AuthSession = {
        token: generateSalt() + generateSalt(),
        expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/** L'utilisateur est-il authentifié (session valide) ? */
export function isAuthenticated(): boolean {
    if (!isBrowser()) return false;
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return false;
        const session = JSON.parse(raw) as AuthSession;
        if (Date.now() > session.expiresAt) {
            sessionStorage.removeItem(SESSION_KEY);
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

/** Déconnecte l'utilisateur (session + utilisateur courant). */
export function logout(): void {
    if (!isBrowser()) return;
    sessionStorage.removeItem(SESSION_KEY);
    clearCurrentUser();
}

/** Change le mot de passe (doit être authentifié). */
export async function changePassword(current: string, next: string): Promise<void> {
    const ok = await verifyPassword(current);
    if (!ok) throw new Error('Mot de passe actuel incorrect.');
    await setupPassword(next);
}

// --- Authentification multi-utilisateurs (rôles admin / agent) ---

/** Des comptes utilisateurs existent-ils ? (sinon, mode migration mot de passe unique). */
export function hasUsers(): boolean {
    return countUsers() > 0;
}

/**
 * Crée le premier compte administrateur (premier accès), définit la clé
 * d'agence (déverrouillage du coffre-fort partagé) puis ouvre la session.
 * @param data les informations du compte admin.
 * @param agencyKey la clé d'agence (indépendante des mots de passe) qui
 *   déverrouille le coffre-fort pour tout utilisateur authentifié.
 * @returns l'utilisateur admin créé.
 */
export async function setupFirstAdmin(
    data: NewCockpitUser,
    agencyKey: string
): Promise<CockpitUser> {
    if (countUsers() > 0) {
        throw new Error('Un compte administrateur existe déjà.');
    }
    if (hasAgencyKey()) {
        throw new Error('Une clé d\u2019agence existe déjà.');
    }
    const admin = await createUser({ ...data, role: 'admin' });
    setAgencyKey(agencyKey);
    createSession();
    setCurrentUser(admin);
    return admin;
}

/**
 * Connecte un utilisateur par email + mot de passe.
 * @returns l'utilisateur connecté, ou null si identifiants invalides / compte inactif.
 */
export async function loginUser(email: string, password: string): Promise<CockpitUser | null> {
    const user = await authenticateUser(email, password);
    if (!user) return null;
    createSession();
    setCurrentUser(user);
    return user;
}

/** L'utilisateur courant est-il connecté avec une session valide ? */
export function getSessionUser(): CockpitUser | null {
    if (!isAuthenticated()) return null;
    return getCurrentUser();
}

/** L'utilisateur courant est-il administrateur ? */
export function isAdmin(): boolean {
    return getSessionUser()?.role === 'admin';
}

// --- Coffre-fort partagé (clé d'agence) ---

/**
 * Une clé d'agence a-t-elle été définie (coffre-fort partagé disponible) ?
 * Ré-exportée depuis lib/users pour centraliser l'accès via lib/auth.
 */
export function hasAgencyKeyConfigured(): boolean {
    return hasAgencyKey();
}

/**
 * Déverrouille le coffre-fort partagé avec la clé d'agence stockée.
 * À appeler après authentification (login ou setup) pour hydrater les secrets.
 * @param unlock la fonction de déverrouillage du coffre (lib/vault.unlockVault).
 */
export async function unlockVaultWithAgencyKey(
    unlock: (passphrase: string) => Promise<void>
): Promise<boolean> {
    const key = getAgencyKey();
    if (!key) return false;
    try {
        await unlock(key);
        return true;
    } catch {
        return false;
    }
}
