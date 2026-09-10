import { NextRequest, NextResponse } from 'next/server';
import {
    buildAuthorizationUrl,
    generatePkcePair,
    generateState,
    isOAuthConfigured,
} from '@/lib/google/oauth-client';
import { buildScopesForServices, defaultServiceSelection, type GoogleServiceKey } from '@/lib/google/scopes';
import { setOAuthFlowCookies } from '@/lib/google/server-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Démarre le flux OAuth 2.0 (Authorization Code + PKCE).
 *
 * Génère `state` + `code_verifier`, les stocke dans des cookies httpOnly,
 * puis redirige vers l'écran de consentement Google.
 *
 * Query params optionnels :
 * - `services` : liste séparée par des virgules (ex. `calendar,gmail,drive`).
 * - `login_hint` : pré-remplit l'adresse du compte.
 */
export async function GET(req: NextRequest) {
    if (!isOAuthConfigured()) {
        return NextResponse.json(
            {
                error: 'not_configured',
                message:
                    'Configuration OAuth incomplète. Définissez GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET et GOOGLE_REDIRECT_URI dans .env.local.',
            },
            { status: 503 }
        );
    }

    const servicesParam = req.nextUrl.searchParams.get('services');
    const loginHint = req.nextUrl.searchParams.get('login_hint') || undefined;

    let selection: Partial<Record<GoogleServiceKey, boolean>>;
    if (servicesParam) {
        const requested = servicesParam.split(',').map((s) => s.trim()) as GoogleServiceKey[];
        selection = {};
        for (const key of requested) selection[key] = true;
    } else {
        selection = defaultServiceSelection();
    }

    const scopes = buildScopesForServices(selection);
    const { verifier, challenge } = generatePkcePair();
    const state = generateState();

    const authUrl = buildAuthorizationUrl({
        scopes,
        state,
        codeChallenge: challenge,
        loginHint,
    });

    const res = NextResponse.redirect(authUrl);
    setOAuthFlowCookies(res, { verifier, state, scopes });
    return res;
}
