'use client';

/**
 * Coffre-fort local (chiffrement au repos) — solution transitoire.
 *
 * Tant que l'agence n'a pas migré vers Supabase (Vault / RLS), les secrets
 * réellement nécessaires côté navigateur (jeton Meta, mot de passe SFTP, …)
 * sont chiffrés au repos dans le localStorage avec AES-GCM 256.
 *
 * La clé est dérivée du mot de passe d'accès au cockpit (PBKDF2). Elle n'est
 * jamais persistée dans le localStorage : elle est conservée en mémoire et,
 * pour survivre aux rechargements de page au sein d'une même session, dans le
 * sessionStorage (effacé à la fermeture de l'onglet et à la déconnexion).
 *
 * ⚠️ Ceci n'est PAS une sécurité serveur : le chiffrement est effectué côté
 * client. Il protège les données au repos contre une lecture directe du
 * localStorage, en attendant Supabase Vault. L'interface est volontairement
 * simple pour être remplacée sans casse par le chiffrement serveur.
 */

import { AgencySettings } from './types';

const VAULT_KEY = 'nellimo_settings_vault_v1';
const VAULT_SESSION_KEY = 'nellimo_vault_session_v2';
const LEGACY_VAULT_SESSION_KEY = 'nellimo_vault_session_v1';
const PBKDF2_ITERATIONS = 150_000;

/**
 * Champs sensibles de AgencySettings à chiffrer au repos côté client.
 *
 * ⚠️ Sécurité & Bonnes Pratiques d'Architecture :
 * Les secrets de passerelle serveur (SFTP_PASSWORD, META_APP_SECRET, LINKEDIN_CLIENT_SECRET)
 * ont été retirés du client et sont désormais gérés exclusivement côté serveur Node.js / Vercel.
 * Seules les clés ou jetons réellement utilisés côté navigateur sont listés ici.
 */
export const SENSITIVE_SETTINGS_FIELDS: (keyof AgencySettings)[] = [
    'facebook_page_access_token',
    'google_maps_api_key',
];

let cachedKey: CryptoKey | null = null;

function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

function toBase64(buf: ArrayBuffer | Uint8Array): string {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

/** Dérive la clé AES-GCM depuis le mot de passe (PBKDF2). Clé exportable pour session RAM/sessionStorage. */
async function deriveKey(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const salt = enc.encode('nellimo-cockpit-vault-v1');
    const baseKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        true, // exportable pour stockage du tampon brut de clé de session (jamais le mot de passe)
        ['encrypt', 'decrypt']
    );
}

/** Restaure la clé depuis le sessionStorage (tampon brut de clé de session, jamais le mot de passe). */
async function restoreKeyFromSession(): Promise<void> {
    if (!isBrowser() || cachedKey) return;
    try {
        // Nettoyage proactif de l'ancien format vulnérable stockant le mot de passe en clair
        if (sessionStorage.getItem(LEGACY_VAULT_SESSION_KEY)) {
            sessionStorage.removeItem(LEGACY_VAULT_SESSION_KEY);
        }

        const rawB64 = sessionStorage.getItem(VAULT_SESSION_KEY);
        if (!rawB64) return;
        const keyBytes = fromBase64(rawB64);
        cachedKey = await crypto.subtle.importKey(
            'raw',
            keyBytes as BufferSource,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    } catch {
        cachedKey = null;
    }
}

/** Dérive et met en cache la clé de session (appelé après connexion réussie). */
export async function unlockVault(password: string): Promise<void> {
    if (!isBrowser()) return;
    try {
        // Nettoyage immédiat de tout vestige de mot de passe en clair
        sessionStorage.removeItem(LEGACY_VAULT_SESSION_KEY);

        cachedKey = await deriveKey(password);

        // Cache uniquement le tampon brut de la clé AES-256 (JAMAIS le mot de passe en clair !)
        // pour survivre aux rechargements au sein de l'onglet actif.
        const exportedRaw = await crypto.subtle.exportKey('raw', cachedKey);
        sessionStorage.setItem(VAULT_SESSION_KEY, toBase64(exportedRaw));
    } catch (e) {
        console.error('[Vault] Impossible de dériver la clé :', e);
        cachedKey = null;
    }
}

/** Efface la clé de session (déconnexion). */
export function lockVault(): void {
    cachedKey = null;
    if (isBrowser()) {
        try {
            sessionStorage.removeItem(VAULT_SESSION_KEY);
            sessionStorage.removeItem(LEGACY_VAULT_SESSION_KEY);
        } catch {
            /* ignore */
        }
    }
}

/** La clé est-elle disponible (mémoire ou sessionStorage) ? */
export async function isVaultUnlocked(): Promise<boolean> {
    if (cachedKey) return true;
    await restoreKeyFromSession();
    return cachedKey !== null;
}

/** Chiffre un objet JSON en `base64(iv).base64(ciphertext)`. */
async function encryptObject(value: unknown): Promise<string> {
    if (!cachedKey) throw new Error('Vault non déverrouillé');
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = enc.encode(JSON.stringify(value));
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        cachedKey,
        plaintext
    );
    return `${toBase64(iv)}.${toBase64(ciphertext)}`;
}

/** Déchiffre un payload `base64(iv).base64(ciphertext)` en objet JSON. */
async function decryptObject<T>(payload: string): Promise<T> {
    if (!cachedKey) throw new Error('Vault non déverrouillé');
    const [ivB64, dataB64] = payload.split('.');
    if (!ivB64 || !dataB64) throw new Error('Payload de coffre invalide');
    const iv = fromBase64(ivB64);
    const data = fromBase64(dataB64);
    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        cachedKey,
        data as BufferSource
    );
    return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}

/** Sépare les champs sensibles du reste des paramètres. */
export function splitSensitiveSettings(
    settings: AgencySettings
): { publicSettings: AgencySettings; secrets: Partial<AgencySettings> } {
    const secrets: Partial<AgencySettings> = {};
    const publicSettings: AgencySettings = { ...settings };
    for (const field of SENSITIVE_SETTINGS_FIELDS) {
        const value = settings[field];
        if (value !== undefined && value !== null && value !== '') {
            (secrets as Record<string, unknown>)[field] = value;
            delete (publicSettings as Partial<AgencySettings>)[field];
        }
    }
    return { publicSettings, secrets };
}

/** Persiste les secrets chiffrés dans le coffre local. */
export async function saveSecretsToVault(
    secrets: Partial<AgencySettings>
): Promise<void> {
    if (!isBrowser()) return;
    if (Object.keys(secrets).length === 0) {
        try {
            localStorage.removeItem(VAULT_KEY);
        } catch {
            /* ignore */
        }
        return;
    }
    if (!cachedKey) return; // pas de clé → on ne peut pas chiffrer (ne pas écraser)
    try {
        const payload = await encryptObject(secrets);
        localStorage.setItem(VAULT_KEY, payload);
    } catch (e) {
        console.error('[Vault] Échec du chiffrement des secrets :', e);
    }
}

/** Lit et déchiffre les secrets du coffre local. Retourne {} si absent/illisible. */
export async function loadSecretsFromVault(): Promise<Partial<AgencySettings>> {
    if (!isBrowser()) return {};
    await restoreKeyFromSession();
    if (!cachedKey) return {};
    try {
        const raw = localStorage.getItem(VAULT_KEY);
        if (!raw) return {};
        return await decryptObject<Partial<AgencySettings>>(raw);
    } catch (e) {
        console.warn('[Vault] Impossible de déchiffrer le coffre (clé changée ?) :', e);
        return {};
    }
}

/** Y a-t-il un coffre chiffré présent ? */
export function hasVault(): boolean {
    if (!isBrowser()) return false;
    try {
        return !!localStorage.getItem(VAULT_KEY);
    } catch {
        return false;
    }
}

/** Supprime définitivement le coffre chiffré (réinitialisation complète). */
export function clearVault(): void {
    if (!isBrowser()) return;
    try {
        localStorage.removeItem(VAULT_KEY);
    } catch {
        /* ignore */
    }
}
