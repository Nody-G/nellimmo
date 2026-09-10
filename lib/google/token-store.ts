/**
 * Stockage des jetons OAuth Google — approche hybride à deux niveaux.
 *
 * 1. **Mode Supabase configuré (cible)** : table `google_oauth_tokens` avec
 *    `owner_id`, RLS stricte, jetons **chiffrés en colonne** (AES-256-GCM).
 *    Le `refresh_token` n'est jamais renvoyé au client.
 * 2. **Mode local (Supabase non configuré)** : cookie httpOnly chiffré
 *    contenant `{ refreshToken, expiry, scope, email }`.
 *
 * ⚠️ **Serveur uniquement** (`runtime = 'nodejs'`).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { encryptSecret, decryptSecret, isCryptoConfigured } from './crypto';

/** Enregistrement de jeton OAuth (en clair, en mémoire serveur uniquement). */
export interface GoogleTokenRecord {
    ownerId: string;
    email: string;
    name?: string;
    accessToken: string;
    refreshToken: string;
    /** Epoch millisecondes. */
    expiry: number;
    scope: string;
    tokenType: string;
}

/** Interface unique, indépendante du backend de stockage. */
export interface GoogleTokenStore {
    save(record: GoogleTokenRecord): Promise<void>;
    load(ownerId: string): Promise<GoogleTokenRecord | null>;
    clear(ownerId: string): Promise<void>;
}

/** Nom du cookie de repli (mode local sans Supabase). */
export const GOOGLE_TOKEN_COOKIE = 'nellimmo_google_token';

/** Identifiant d'agence stable utilisé tant que l'auth locale est active. */
export const DEFAULT_OWNER_ID = 'default';

function isSupabaseServerConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return Boolean(url && key && url.startsWith('https://') && !url.includes('votre-projet'));
}

let serverClient: SupabaseClient | null = null;

function getServerSupabase(): SupabaseClient | null {
    if (!isSupabaseServerConfigured()) return null;
    if (!serverClient) {
        serverClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL as string,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
    }
    return serverClient;
}

/** Ligne de la table `google_oauth_tokens`. */
interface GoogleTokenRow {
    owner_id: string;
    google_email: string;
    google_name: string | null;
    access_token_enc: string;
    refresh_token_enc: string;
    token_iv: string;
    token_auth_tag: string;
    expiry: string;
    scope: string;
    token_type: string;
}

/**
 * Implémentation Supabase : jetons chiffrés en colonne.
 * Le format `iv:authTag:ciphertext` est éclaté dans les colonnes dédiées.
 */
class SupabaseTokenStore implements GoogleTokenStore {
    constructor(private readonly client: SupabaseClient) { }

    async save(record: GoogleTokenRecord): Promise<void> {
        const accessEnc = encryptSecret(record.accessToken);
        const refreshEnc = encryptSecret(record.refreshToken);
        const [iv, authTag] = accessEnc.split(':');

        const row: GoogleTokenRow = {
            owner_id: record.ownerId,
            google_email: record.email,
            google_name: record.name ?? null,
            access_token_enc: accessEnc,
            refresh_token_enc: refreshEnc,
            token_iv: iv,
            token_auth_tag: authTag,
            expiry: new Date(record.expiry).toISOString(),
            scope: record.scope,
            token_type: record.tokenType,
        };

        const { error } = await this.client
            .from('google_oauth_tokens')
            .upsert(row, { onConflict: 'owner_id,google_email' });
        if (error) throw new Error(`Échec de sauvegarde du jeton Google : ${error.message}`);
    }

    async load(ownerId: string): Promise<GoogleTokenRecord | null> {
        const { data, error } = await this.client
            .from('google_oauth_tokens')
            .select('*')
            .eq('owner_id', ownerId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error || !data) return null;
        const row = data as GoogleTokenRow;

        try {
            return {
                ownerId: row.owner_id,
                email: row.google_email,
                name: row.google_name ?? undefined,
                accessToken: decryptSecret(row.access_token_enc),
                refreshToken: decryptSecret(row.refresh_token_enc),
                expiry: new Date(row.expiry).getTime(),
                scope: row.scope,
                tokenType: row.token_type,
            };
        } catch {
            // Jetons illisibles (clé changée) → on considère le compte déconnecté.
            return null;
        }
    }

    async clear(ownerId: string): Promise<void> {
        await this.client.from('google_oauth_tokens').delete().eq('owner_id', ownerId);
    }
}

/**
 * Implémentation cookie : charge utile chiffrée, destinée au mode local-first.
 * Le cookie est posé/effacé par les routes API (httpOnly, Secure, SameSite=Lax).
 */
class CookieTokenStore implements GoogleTokenStore {
    constructor(private readonly readCookie: () => string | undefined) { }

    async save(): Promise<void> {
        // Le cookie est écrit par la route API (accès à NextResponse).
        throw new Error(
            'CookieTokenStore.save doit être appelé via les helpers de cookie de la route API.'
        );
    }

    async load(ownerId: string): Promise<GoogleTokenRecord | null> {
        const raw = this.readCookie();
        if (!raw) return null;
        try {
            const parsed = JSON.parse(decryptSecret(raw)) as Omit<GoogleTokenRecord, 'ownerId'>;
            return { ...parsed, ownerId };
        } catch {
            return null;
        }
    }

    async clear(): Promise<void> {
        // Effacement géré par la route API.
    }
}

/**
 * Sérialise un enregistrement pour le cookie chiffré (mode local).
 * Utilisé par les routes API pour poser le cookie.
 */
export function serializeTokenForCookie(record: GoogleTokenRecord): string {
    const { ownerId: _ownerId, ...rest } = record;
    void _ownerId;
    return encryptSecret(JSON.stringify(rest));
}

/**
 * Retourne le store approprié selon la configuration serveur.
 * @param readCookie Lecteur de cookie (requis en mode local).
 */
export function getTokenStore(readCookie?: () => string | undefined): GoogleTokenStore {
    const supabase = getServerSupabase();
    if (supabase && isCryptoConfigured()) {
        return new SupabaseTokenStore(supabase);
    }
    return new CookieTokenStore(readCookie ?? (() => undefined));
}

/** Indique si le stockage persistant (Supabase) est disponible. */
export function isPersistentTokenStoreAvailable(): boolean {
    return isSupabaseServerConfigured() && isCryptoConfigured();
}
