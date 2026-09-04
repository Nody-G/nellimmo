'use client';

/**
 * Multi-utilisateurs & rôles (admin / agent).
 *
 * Ce module est la "couture" entre le cockpit mono-utilisateur actuel et le futur
 * multi-utilisateurs cloud (Supabase). Il expose un modèle d'utilisateur aligné sur
 * le type `Profile` (déjà présent dans lib/types.ts pour la cible Supabase) et un
 * store localStorage avec CRUD complet, afin que la bascule vers Supabase Auth
 * (Phase E) ne change aucun appelant.
 *
 * Aujourd'hui, les utilisateurs sont stockés localement (localStorage) avec un
 * mot de passe par utilisateur (hash salé SHA-256). Le premier utilisateur créé
 * est automatiquement `admin`; les suivants sont `agent` par défaut.
 *
 * Le coffre-fort local (lib/vault.ts) est déverrouillé par une **clé d'agence**
 * dédiée (passphrase indépendante des mots de passe individuels). Cette clé est
 * définie par le premier admin et permet à tout utilisateur authentifié de
 * déchiffrer les secrets partagés de l'agence (jetons Meta, SFTP, etc.).
 */

import type { Profile } from './types';

/** Rôles disponibles dans le cockpit. */
export type CockpitRole = 'admin' | 'agent';

/** Utilisateur du cockpit (aligné sur Profile + mot de passe local). */
export interface CockpitUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: CockpitRole;
    /** Hash salé du mot de passe (sha256(salt:password)). Jamais en clair. */
    passwordHash: string;
    /** Sel utilisé pour le hash. */
    salt: string;
    /** Compte actif (un compte désactivé ne peut plus se connecter). */
    active: boolean;
    created_at: string;
}

/** Données de création d'un utilisateur (sans id / dates / hash). */
export interface NewCockpitUser {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: CockpitRole;
    password: string;
}

const USERS_KEY = 'nellimo_users_v1';
const CURRENT_USER_KEY = 'nellimo_current_user_v1';

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

function readUsers(): CockpitUser[] {
    if (!isBrowser()) return [];
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CockpitUser[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeUsers(users: CockpitUser[]): void {
    if (!isBrowser()) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Normalise un email (minuscules, sans espaces). */
export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/** Liste tous les utilisateurs (triés par date de création). */
export function listUsers(): CockpitUser[] {
    return readUsers().sort((a, b) => a.created_at.localeCompare(b.created_at));
}

/** Retrouve un utilisateur par son id. */
export function getUserById(id: string): CockpitUser | undefined {
    return readUsers().find((u) => u.id === id);
}

/** Retrouve un utilisateur par son email (insensible à la casse). */
export function getUserByEmail(email: string): CockpitUser | undefined {
    const normalized = normalizeEmail(email);
    return readUsers().find((u) => normalizeEmail(u.email) === normalized);
}

/** Nombre d'utilisateurs existants (permet de déterminer le premier = admin). */
export function countUsers(): number {
    return readUsers().length;
}

/**
 * Crée un utilisateur.
 * - Le premier utilisateur créé est automatiquement `admin`.
 * - Les suivants sont `agent` par défaut (sauf rôle explicite fourni par un admin).
 */
export async function createUser(data: NewCockpitUser): Promise<CockpitUser> {
    const email = normalizeEmail(data.email);
    if (!email || !data.first_name.trim() || !data.last_name.trim()) {
        throw new Error('Nom, prénom et email sont obligatoires.');
    }
    if (data.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    }
    const users = readUsers();
    if (users.some((u) => normalizeEmail(u.email) === email)) {
        throw new Error('Un utilisateur avec cet email existe déjà.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);
    const isFirst = users.length === 0;

    const user: CockpitUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        email,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        phone: data.phone?.trim() || '',
        role: isFirst ? 'admin' : (data.role ?? 'agent'),
        passwordHash,
        salt,
        active: true,
        created_at: new Date().toISOString(),
    };

    writeUsers([...users, user]);
    return user;
}

/** Met à jour les champs d'un utilisateur (hors mot de passe). */
export function updateUser(id: string, patch: Partial<Omit<CockpitUser, 'id' | 'passwordHash' | 'salt' | 'created_at'>>): CockpitUser | undefined {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;

    // Empêcher la désactivation / rétrogradation du dernier admin actif.
    if (patch.active === false || (patch.role && patch.role !== 'admin')) {
        const target = users[idx];
        const adminsActive = users.filter((u) => u.role === 'admin' && u.active);
        if (target.role === 'admin' && adminsActive.length === 1) {
            throw new Error('Impossible : il doit rester au moins un administrateur actif.');
        }
    }

    const updated: CockpitUser = { ...users[idx], ...patch };
    if (patch.email) updated.email = normalizeEmail(patch.email);
    const next = [...users];
    next[idx] = updated;
    writeUsers(next);
    return updated;
}

/** Change le mot de passe d'un utilisateur. */
export async function changeUserPassword(id: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    }
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Utilisateur introuvable.');
    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    const next = [...users];
    next[idx] = { ...next[idx], salt, passwordHash };
    writeUsers(next);
}

/** Supprime un utilisateur (interdit la suppression du dernier admin actif). */
export function deleteUser(id: string): void {
    const users = readUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const adminsActive = users.filter((u) => u.role === 'admin' && u.active);
    if (target.role === 'admin' && adminsActive.length === 1) {
        throw new Error('Impossible : il doit rester au moins un administrateur actif.');
    }
    writeUsers(users.filter((u) => u.id !== id));
}

/** Vérifie les identifiants d'un utilisateur. Retourne l'utilisateur si OK. */
export async function authenticateUser(email: string, password: string): Promise<CockpitUser | null> {
    const user = getUserByEmail(email);
    if (!user || !user.active) return null;
    const candidate = await hashPassword(password, user.salt);
    return candidate === user.passwordHash ? user : null;
}

/** Convertit un CockpitUser en Profile (cible Supabase / API). */
export function toProfile(user: CockpitUser): Profile {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        professional_card_number: '',
        role: user.role,
        created_at: user.created_at,
    };
}

// --- Session de l'utilisateur courant (persistée) ---

/** Enregistre l'utilisateur courant connecté. */
export function setCurrentUser(user: CockpitUser): void {
    if (!isBrowser()) return;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/** Retrouve l'utilisateur courant connecté (si la session est valide). */
export function getCurrentUser(): CockpitUser | null {
    if (!isBrowser()) return null;
    try {
        const raw = localStorage.getItem(CURRENT_USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as CockpitUser;
    } catch {
        return null;
    }
}

/** Efface l'utilisateur courant (déconnexion). */
export function clearCurrentUser(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(CURRENT_USER_KEY);
}

/** L'utilisateur courant est-il admin ? */
export function isCurrentUserAdmin(): boolean {
    return getCurrentUser()?.role === 'admin';
}

// --- Clé d'agence (déverrouillage du coffre-fort partagé) ---

const AGENCY_KEY_STORAGE = 'nellimo_agency_key_v1';

/**
 * Une clé d'agence a-t-elle été définie ?
 * Indique si le coffre-fort partagé peut être déverrouillé.
 */
export function hasAgencyKey(): boolean {
    if (!isBrowser()) return false;
    try {
        return !!localStorage.getItem(AGENCY_KEY_STORAGE);
    } catch {
        return false;
    }
}

/**
 * Définit (ou change) la clé d'agence.
 * Réservé à l'admin. Cette clé déverrouille le coffre-fort partagé pour tout
 * utilisateur authentifié. Elle est stockée localement (solution transitoire) ;
 * le cloud (Supabase Vault) remplacera ce mécanisme en Phase E.
 */
export function setAgencyKey(passphrase: string): void {
    if (!isBrowser()) return;
    if (passphrase.length < 6) {
        throw new Error('La cl\u00E9 d\u2019agence doit contenir au moins 6 caract\u00E8res.');
    }
    localStorage.setItem(AGENCY_KEY_STORAGE, passphrase);
}

/** Retrouve la clé d'agence (pour déverrouiller le coffre après authentification). */
export function getAgencyKey(): string {
    if (!isBrowser()) return '';
    try {
        return localStorage.getItem(AGENCY_KEY_STORAGE) || '';
    } catch {
        return '';
    }
}

/** Vérifie une clé d'agence saisie (pour la modifier). */
export function verifyAgencyKey(candidate: string): boolean {
    const stored = getAgencyKey();
    return stored.length > 0 && candidate === stored;
}
