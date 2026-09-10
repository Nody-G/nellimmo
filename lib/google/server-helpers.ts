/**
 * Helpers serveur partagés par les routes API Google.
 *
 * ⚠️ **Serveur uniquement** (`runtime = 'nodejs'`).
 *
 * Centralise :
 * - la résolution de l'`ownerId` (identifiant d'agence stable tant que l'auth
 *   locale est active) ;
 * - la lecture/écriture des cookies OAuth (PKCE, state, jeton de repli) ;
 * - le rafraîchissement paresseux du token (`getValidAccessToken`).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    getTokenStore,
    serializeTokenForCookie,
    GOOGLE_TOKEN_COOKIE,
    DEFAULT_OWNER_ID,
    type GoogleTokenRecord,
} from './token-store';
import { refreshAccessToken, GoogleTokenRevokedError } from './oauth-client';

/** Cookie contenant le `code_verifier` PKCE (httpOnly, courte durée). */
export const PKCE_COOKIE = 'nellimmo_google_pkce';
/** Cookie contenant le `state` OAuth signé (httpOnly, courte durée). */
export const STATE_COOKIE = 'nellimmo_google_state';
/** Cookie contenant les scopes demandés (pour l'affichage du statut). */
export const SCOPES_COOKIE = 'nellimmo_google_scopes';

const SHORT_MAX_AGE = 600; // 10 minutes

/**
 * Résout l'identifiant propriétaire.
 * Tant que l'auth locale est active, `auth.uid()` est `null` : on utilise un
 * identifiant d'agence stable. La migration vers Supabase Auth remplacera ce
 * repli sans changer l'interface du store.
 */
export function resolveOwnerId(_req: NextRequest): string {
    return DEFAULT_OWNER_ID;
}

/** Options communes des cookies OAuth. */
function cookieOptions(maxAge: number) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge,
    };
}

/** Pose les cookies PKCE / state / scopes. */
export function setOAuthFlowCookies(
    res: NextResponse,
    params: { verifier: string; state: string; scopes: string[] }
): void {
    res.cookies.set(PKCE_COOKIE, params.verifier, cookieOptions(SHORT_MAX_AGE));
    res.cookies.set(STATE_COOKIE, params.state, cookieOptions(SHORT_MAX_AGE));
    res.cookies.set(SCOPES_COOKIE, params.scopes.join(' '), cookieOptions(SHORT_MAX_AGE));
}

/** Efface les cookies du flux OAuth. */
export function clearOAuthFlowCookies(res: NextResponse): void {
    for (const name of [PKCE_COOKIE, STATE_COOKIE, SCOPES_COOKIE]) {
        res.cookies.set(name, '', cookieOptions(0));
    }
}

/** Efface le cookie de jeton (mode local). */
export function clearOAuthCookies(res: NextResponse): void {
    clearOAuthFlowCookies(res);
    res.cookies.set(GOOGLE_TOKEN_COOKIE, '', cookieOptions(0));
}

/** Pose le cookie de jeton chiffré (mode local sans Supabase). */
export function setTokenCookie(res: NextResponse, record: GoogleTokenRecord): void {
    const payload = serializeTokenForCookie(record);
    // Le refresh_token Google n'expire pas : on borne le cookie à 30 jours.
    res.cookies.set(GOOGLE_TOKEN_COOKIE, payload, cookieOptions(60 * 60 * 24 * 30));
}

/** Construit le store en mode requête (avec accès aux cookies). */
export function getRequestTokenStore(req: NextRequest) {
    return getTokenStore(() => req.cookies.get(GOOGLE_TOKEN_COOKIE)?.value);
}

/**
 * Retourne un access token valide, en rafraîchissant paresseusement si besoin.
 * Marge de sécurité de 60 s avant expiration.
 *
 * @throws GoogleNotConnectedError si aucun jeton n'existe.
 * @throws GoogleTokenRevokedError si le refresh échoue.
 */
export async function getValidAccessToken(req: NextRequest): Promise<string> {
    const ownerId = resolveOwnerId(req);
    const store = getRequestTokenStore(req);
    const record = await store.load(ownerId);

    if (!record) {
        const { GoogleNotConnectedError } = await import('./oauth-client');
        throw new GoogleNotConnectedError();
    }

    if (record.expiry - Date.now() > 60_000) {
        return record.accessToken;
    }

    const refreshed = await refreshAccessToken(record.refreshToken);
    const updated: GoogleTokenRecord = {
        ...record,
        accessToken: refreshed.access_token,
        expiry: Date.now() + refreshed.expires_in * 1000,
        scope: refreshed.scope ?? record.scope,
    };
    await store.save(updated);
    return updated.accessToken;
}

/** Réponse JSON d'erreur normalisée pour les routes Google. */
export function googleErrorResponse(error: unknown): NextResponse {
    const name = error instanceof Error ? error.name : 'UnknownError';
    const message = error instanceof Error ? error.message : 'Erreur inconnue.';

    if (name === 'GoogleNotConnectedError') {
        return NextResponse.json({ error: 'not_connected', message }, { status: 401 });
    }
    if (name === 'GoogleTokenRevokedError') {
        return NextResponse.json({ error: 'token_revoked', message }, { status: 401 });
    }
    if (name === 'GoogleOAuthError' || name === 'GoogleCryptoError') {
        return NextResponse.json({ error: 'google_error', message }, { status: 502 });
    }
    return NextResponse.json({ error: 'server_error', message }, { status: 500 });
}

export { GoogleTokenRevokedError };
