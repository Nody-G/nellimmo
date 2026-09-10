import { NextRequest, NextResponse } from 'next/server';
import {
    exchangeCodeForTokens,
    fetchUserInfo,
    decodeState,
    GoogleOAuthError,
} from '@/lib/google/oauth-client';
import {
    getRequestTokenStore,
    resolveOwnerId,
    setTokenCookie,
} from '@/lib/google/server-helpers';
import { isPersistentTokenStoreAvailable, type GoogleTokenRecord } from '@/lib/google/token-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Callback OAuth : vérifie le `state` **autonome** (chiffré + signé), échange
 * le `code` contre des jetons, récupère le profil (`userinfo`) et persiste le
 * jeton.
 *
 * Le `state` embarque le `code_verifier` PKCE, les scopes et la page de retour :
 * aucune dépendance à un cookie devant survivre à la redirection cross-site de
 * Google (cause fréquente d'échec `invalid_state` en production).
 *
 * Redirige ensuite vers la page d'origine avec un indicateur de succès/erreur.
 */
export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');
    const debug = params.get('debug') === '1';

    if (error) {
        const deniedUrl = new URL('/cockpit/parametres', req.nextUrl.origin);
        deniedUrl.searchParams.set('google', 'denied');
        return NextResponse.redirect(deniedUrl);
    }

    const payload = state ? decodeState(state) : null;

    if (!code || !payload) {
        if (debug) {
            return NextResponse.json({
                step: 'state_check',
                ok: false,
                hasCode: Boolean(code),
                hasState: Boolean(state),
                stateDecoded: Boolean(payload),
                reason: !state
                    ? 'state_absent'
                    : !payload
                        ? 'state_invalide_ou_expire'
                        : 'code_absent',
            });
        }
        const invalidUrl = new URL('/cockpit/parametres', req.nextUrl.origin);
        invalidUrl.searchParams.set('google', 'invalid_state');
        return NextResponse.redirect(invalidUrl);
    }

    const verifier = payload.verifier;
    const requestedScopes = payload.scopes;
    const settingsUrl = new URL(payload.returnTo || '/cockpit/parametres', req.nextUrl.origin);

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
        return NextResponse.redirect(settingsUrl);
    }
}
