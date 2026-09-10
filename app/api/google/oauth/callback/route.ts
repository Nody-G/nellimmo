import { NextRequest, NextResponse } from 'next/server';
import {
    exchangeCodeForTokens,
    fetchUserInfo,
    GoogleOAuthError,
} from '@/lib/google/oauth-client';
import {
    getRequestTokenStore,
    resolveOwnerId,
    setTokenCookie,
    clearOAuthFlowCookies,
    PKCE_COOKIE,
    STATE_COOKIE,
    SCOPES_COOKIE,
} from '@/lib/google/server-helpers';
import { isPersistentTokenStoreAvailable, type GoogleTokenRecord } from '@/lib/google/token-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Callback OAuth : vérifie le `state`, échange le `code` contre des jetons,
 * récupère le profil (`userinfo`) et persiste le jeton.
 *
 * Redirige ensuite vers le cockpit avec un indicateur de succès ou d'erreur.
 */
export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');

    const settingsUrl = new URL('/cockpit/parametres', req.nextUrl.origin);

    if (error) {
        settingsUrl.searchParams.set('google', 'denied');
        return NextResponse.redirect(settingsUrl);
    }

    const expectedState = req.cookies.get(STATE_COOKIE)?.value;
    const verifier = req.cookies.get(PKCE_COOKIE)?.value;
    const requestedScopes = req.cookies.get(SCOPES_COOKIE)?.value || '';

    if (!code || !state || !expectedState || state !== expectedState || !verifier) {
        settingsUrl.searchParams.set('google', 'invalid_state');
        const res = NextResponse.redirect(settingsUrl);
        clearOAuthFlowCookies(res);
        return res;
    }

    try {
        const tokens = await exchangeCodeForTokens({ code, codeVerifier: verifier });
        const profile = await fetchUserInfo(tokens.access_token);

        const ownerId = resolveOwnerId(req);
        const record: GoogleTokenRecord = {
            ownerId,
            email: profile.email,
            name: profile.name,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || '',
            expiry: Date.now() + tokens.expires_in * 1000,
            scope: tokens.scope || requestedScopes,
            tokenType: tokens.token_type || 'Bearer',
        };

        const store = getRequestTokenStore(req);
        await store.save(record);

        settingsUrl.searchParams.set('google', 'connected');
        settingsUrl.searchParams.set('email', profile.email);

        const res = NextResponse.redirect(settingsUrl);
        clearOAuthFlowCookies(res);

        // Mode local (Supabase non configuré) : on pose aussi le cookie chiffré.
        if (!isPersistentTokenStoreAvailable()) {
            setTokenCookie(res, record);
        }
        return res;
    } catch (e) {
        const message = e instanceof GoogleOAuthError ? e.message : 'Échec de la connexion Google.';
        settingsUrl.searchParams.set('google', 'error');
        settingsUrl.searchParams.set('message', message.slice(0, 160));
        const res = NextResponse.redirect(settingsUrl);
        clearOAuthFlowCookies(res);
        return res;
    }
}
