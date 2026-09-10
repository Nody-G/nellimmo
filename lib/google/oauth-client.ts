/**
 * Client OAuth 2.0 Google — Authorization Code Flow + PKCE (S256).
 *
 * ⚠️ **Serveur uniquement** (`runtime = 'nodejs'`). Le `client_secret` est lu
 * depuis `process.env.GOOGLE_CLIENT_SECRET` et ne quitte jamais le serveur.
 *
 * Le `code_verifier` PKCE est généré côté serveur, stocké dans un cookie
 * httpOnly signé, et n'est jamais exposé au navigateur. Un code d'autorisation
 * intercepté est donc inutilisable sans ce verifier.
 *
 * Aucune dépendance externe : appels `fetch` directs vers les endpoints Google.
 */

import { createHash, randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { IDENTITY_SCOPES } from './scopes';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke';
const GOOGLE_USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';

export class GoogleOAuthError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'GoogleOAuthError';
    }
}

export class GoogleNotConnectedError extends Error {
    constructor() {
        super('Aucun compte Google connecté.');
        this.name = 'GoogleNotConnectedError';
    }
}

export class GoogleTokenRevokedError extends Error {
    constructor() {
        super('Le jeton Google a été révoqué ou a expiré. Reconnectez votre compte.');
        this.name = 'GoogleTokenRevokedError';
    }
}

/** Réponse de l'endpoint token Google. */
export interface GoogleTokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token?: string;
}

/** Profil utilisateur renvoyé par `userinfo`. */
export interface GoogleUserInfo {
    sub: string;
    email: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
}

/** Paire PKCE. */
export interface PkcePair {
    verifier: string;
    challenge: string;
}

/** Lit la configuration OAuth depuis l'environnement. */
export function getOAuthConfig(): {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
} {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new GoogleOAuthError(
            'Configuration OAuth incomplète. Définissez GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET et GOOGLE_REDIRECT_URI dans .env.local.'
        );
    }
    return { clientId, clientSecret, redirectUri };
}

/** Indique si la configuration OAuth serveur est complète (sans révéler les valeurs). */
export function isOAuthConfigured(): boolean {
    return Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_REDIRECT_URI
    );
}

/** Génère une paire PKCE (`S256`). */
export function generatePkcePair(): PkcePair {
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    return { verifier, challenge };
}

/** Génère un `state` aléatoire anti-CSRF. */
export function generateState(): string {
    return randomBytes(24).toString('base64url');
}

/**
 * Signe une valeur avec `GOOGLE_OAUTH_STATE_SECRET` (HMAC-SHA256).
 * Utilisé pour garantir l'intégrité des cookies d'état OAuth.
 */
export function signValue(value: string): string {
    const secret = process.env.GOOGLE_OAUTH_STATE_SECRET;
    if (!secret) {
        throw new GoogleOAuthError(
            'GOOGLE_OAUTH_STATE_SECRET manquant. Définissez-le dans .env.local.'
        );
    }
    return createHmac('sha256', secret).update(value).digest('base64url');
}

/** Vérifie une signature en temps constant. */
export function verifySignature(value: string, signature: string): boolean {
    try {
        const expected = signValue(value);
        const a = Buffer.from(expected);
        const b = Buffer.from(signature);
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

/**
 * Construit l'URL de consentement Google.
 * `access_type=offline` + `prompt=consent` garantissent l'obtention d'un
 * `refresh_token` à chaque connexion.
 */
export function buildAuthorizationUrl(params: {
    scopes: string[];
    state: string;
    codeChallenge: string;
    loginHint?: string;
}): string {
    const { clientId, redirectUri } = getOAuthConfig();
    const scopes = params.scopes.length > 0 ? params.scopes : [...IDENTITY_SCOPES];

    const url = new URL(GOOGLE_AUTH_ENDPOINT);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scopes.join(' '));
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('include_granted_scopes', 'true');
    url.searchParams.set('state', params.state);
    url.searchParams.set('code_challenge', params.codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');
    if (params.loginHint) url.searchParams.set('login_hint', params.loginHint);

    return url.toString();
}

/** Échange un code d'autorisation contre des jetons. */
export async function exchangeCodeForTokens(params: {
    code: string;
    codeVerifier: string;
}): Promise<GoogleTokenResponse> {
    const { clientId, clientSecret, redirectUri } = getOAuthConfig();

    const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code: params.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            code_verifier: params.codeVerifier,
        }),
        cache: 'no-store',
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new GoogleOAuthError(
            `Échec de l'échange du code d'autorisation (HTTP ${res.status}).`,
            detail.slice(0, 300)
        );
    }
    return (await res.json()) as GoogleTokenResponse;
}

/** Rafraîchit un access token à partir d'un refresh token. */
export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
    const { clientId, clientSecret } = getOAuthConfig();

    const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new GoogleTokenRevokedError();
    }
    return (await res.json()) as GoogleTokenResponse;
}

/** Révoque un jeton chez Google (best-effort). */
export async function revokeToken(token: string): Promise<void> {
    try {
        await fetch(GOOGLE_REVOKE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token }),
            cache: 'no-store',
        });
    } catch {
        // Best-effort : la suppression locale reste prioritaire.
    }
}

/** Récupère le profil du compte connecté (email, nom). */
export async function fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const res = await fetch(GOOGLE_USERINFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new GoogleOAuthError(`Impossible de récupérer le profil Google (HTTP ${res.status}).`);
    }
    return (await res.json()) as GoogleUserInfo;
}
