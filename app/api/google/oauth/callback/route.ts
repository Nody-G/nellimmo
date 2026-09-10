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
    RETURN_COOKIE,
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
    const debug = params.get('debug') === '1';

    // Page de retour : celle qui a initié le flux (cookie), sinon Paramètres.
    const returnTo = req.cookies.get(RETURN_COOKIE)?.value || '/cockpit/parametres';
    const settingsUrl = new URL(returnTo, req.nextUrl.origin);

    if (error) {
        settingsUrl.searchParams.set('google', 'denied');
        return NextResponse.redirect(settingsUrl);
    }

    const expectedState = req.cookies.get(STATE_COOKIE)?.value;
    const verifier = req.cookies.get(PKCE_COOKIE)?.value;
    const requestedScopes = req.cookies.get(SCOPES_COOKIE)?.value || '';

    if (!code || !state || !expectedState || state !== expectedState || !verifier) {
        if (debug) {
            return NextResponse.json({
                step: 'state_check',
                ok: false,
                hasCode: Boolean(code),
                hasState: Boolean(state),
                hasExpectedState: Boolean(expectedState),
                stateMatches: state === expectedState,
                hasVerifier: Boolean(verifier),
                cookiesSeen: req.cookies.getAll().map((c) => c.name),
            });
        }
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

        const persistent = isPersistentTokenStoreAvailable();
        const store = getRequestTokenStore(req);

        // En mode Supabase, on persiste en base. En mode cookie, `save` n'est
        // pas supporté : le cookie est posé ci-dessous.
        if (persistent) {
            await store.save(record);
        }

        if (debug) {
            return NextResponse.json({
                step: 'token_exchange',
                ok: true,
                email: profile.email,
                hasRefreshToken: Boolean(record.refreshToken),
                scope: record.scope,
                persistentStore: persistent,
                cookieMode: !persistent,
            });
        }

        settingsUrl.searchParams.set('google', 'connected');
        settingsUrl.searchParams.set('email', profile.email);

        const res = NextResponse.redirect(settingsUrl);
        clearOAuthFlowCookies(res);

        // Mode local (Supabase non configuré) : on pose le cookie chiffré.
        if (!persistent) {
            setTokenCookie(res, record);
        }
        return res;
    } catch (e) {
        const message = e instanceof GoogleOAuthError ? e.message : 'Échec de la connexion Google.';
        if (debug) {
            return NextResponse.json({
                step: 'token_exchange',
                ok: false,
                error: message,
                errorName: e instanceof Error ? e.name : 'Unknown',
            });
        }
        settingsUrl.searchParams.set('google', 'error');
        settingsUrl.searchParams.set('message', message.slice(0, 160));
        const res = NextResponse.redirect(settingsUrl);
        clearOAuthFlowCookies(res);
        return res;
    }
}
