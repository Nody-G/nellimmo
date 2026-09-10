import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken, googleErrorResponse } from '@/lib/google/server-helpers';
import { resolveProxyRoute, buildProxyUrl } from '@/lib/google/proxy-routes';
import type { GoogleServiceKey } from '@/lib/google/scopes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Corps attendu par le proxy. */
interface GoogleProxyRequest {
    service: GoogleServiceKey;
    action: string;
    payload?: unknown;
    query?: Record<string, string>;
    pathParams?: Record<string, string>;
}

const VALID_SERVICES: GoogleServiceKey[] = [
    'calendar',
    'gmail',
    'drive',
    'contacts',
    'tasks',
    'reviews',
];

/**
 * Proxy générique vers les API Google REST.
 *
 * Sécurité :
 * - allow-list stricte `service`/`action` → URL (aucune URL client) ;
 * - le token n'est jamais renvoyé au client ;
 * - journalisation minimale (service, action, statut, durée) sans jeton.
 */
export async function POST(req: NextRequest) {
    const startedAt = Date.now();
    let body: GoogleProxyRequest;

    try {
        body = (await req.json()) as GoogleProxyRequest;
    } catch {
        return NextResponse.json({ error: 'bad_request', message: 'Corps JSON invalide.' }, { status: 400 });
    }

    const { service, action, payload, query, pathParams } = body;

    if (!service || !VALID_SERVICES.includes(service)) {
        return NextResponse.json({ error: 'bad_request', message: 'Service inconnu.' }, { status: 400 });
    }
    if (!action || typeof action !== 'string') {
        return NextResponse.json({ error: 'bad_request', message: 'Action manquante.' }, { status: 400 });
    }

    const route = resolveProxyRoute(service, action);
    if (!route) {
        return NextResponse.json(
            { error: 'forbidden_action', message: `Action non autorisée : ${service}:${action}` },
            { status: 403 }
        );
    }

    try {
        const accessToken = await getValidAccessToken(req);
        const url = buildProxyUrl(route, pathParams ?? {}, query);

        const headers: Record<string, string> = {
            Authorization: `Bearer ${accessToken}`,
        };
        if (route.hasBody) headers['Content-Type'] = 'application/json';

        const res = await fetch(url, {
            method: route.method,
            headers,
            body: route.hasBody && payload !== undefined ? JSON.stringify(payload) : undefined,
            cache: 'no-store',
        });

        const text = await res.text();
        let data: unknown = null;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = { raw: text.slice(0, 2000) };
            }
        }

        // Journalisation minimale — jamais de jeton.
        console.info(
            `[google-proxy] ${service}:${action} → ${res.status} (${Date.now() - startedAt}ms)`
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: 'google_api_error', status: res.status, data },
                { status: res.status }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return googleErrorResponse(error);
    }
}
