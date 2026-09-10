import { NextRequest, NextResponse } from 'next/server';
import { isOAuthConfigured, getOAuthConfig } from '@/lib/google/oauth-client';
import { isCryptoConfigured } from '@/lib/google/crypto';
import { getRequestTokenStore, resolveOwnerId } from '@/lib/google/server-helpers';
import {
    isPersistentTokenStoreAvailable,
    GOOGLE_TOKEN_COOKIE,
} from '@/lib/google/token-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Endpoint de diagnostic OAuth (lecture seule, sans secret).
 *
 * ⚠️ N'expose **jamais** les jetons ni les secrets : uniquement des booléens,
 * des noms de cookies et des métadonnées non sensibles. Utile pour comprendre
 * pourquoi une connexion ne persiste pas (mode local sans Supabase).
 *
 * Usage : `GET /api/google/oauth/diagnose`
 */
export async function GET(req: NextRequest) {
    const oauthConfigured = isOAuthConfigured();
    const cryptoReady = isCryptoConfigured();
    const persistent = isPersistentTokenStoreAvailable();

    // Détail de la config (sans révéler les valeurs).
    let redirectUri: string | null = null;
    let clientIdSuffix: string | null = null;
    if (oauthConfigured) {
        try {
            const cfg = getOAuthConfig();
            redirectUri = cfg.redirectUri;
            clientIdSuffix = cfg.clientId.slice(-24);
        } catch {
            /* config partielle : on laisse null */
        }
    }

    const ownerId = resolveOwnerId(req);
    const store = getRequestTokenStore(req);
    const record = await store.load(ownerId);

    const tokenCookieRaw = req.cookies.get(GOOGLE_TOKEN_COOKIE)?.value;

    return NextResponse.json({
        // Configuration serveur
        oauthConfigured,
        cryptoReady,
        persistentStoreAvailable: persistent,
        storageMode: persistent ? 'supabase' : 'cookie',
        redirectUri,
        clientIdSuffix,
        // Cookies reçus par le serveur
        cookiesReceived: req.cookies.getAll().map((c) => c.name),
        tokenCookiePresent: Boolean(tokenCookieRaw),
        tokenCookieLength: tokenCookieRaw?.length ?? 0,
        // État du jeton
        connected: Boolean(record),
        email: record?.email ?? null,
        hasRefreshToken: Boolean(record?.refreshToken),
        scope: record?.scope ?? null,
        expiry: record ? new Date(record.expiry).toISOString() : null,
        // Environnement
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV ?? null,
        // Rappel de la limite navigateur
        note:
            'Un cookie > ~4096 octets est silencieusement ignoré par le navigateur. ' +
            'En mode cookie, seul le refreshToken est persisté (payload compact).',
    });
}
