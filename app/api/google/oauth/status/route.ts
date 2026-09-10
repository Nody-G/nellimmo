import { NextRequest, NextResponse } from 'next/server';
import { isOAuthConfigured } from '@/lib/google/oauth-client';
import { getRequestTokenStore, resolveOwnerId } from '@/lib/google/server-helpers';
import { isCryptoConfigured } from '@/lib/google/crypto';
import {
    GOOGLE_SERVICE_ORDER,
    GOOGLE_SCOPES,
    grantedScopesCoverService,
    type GoogleServiceKey,
} from '@/lib/google/scopes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Retourne l'état réel de la connexion Google.
 *
 * ⚠️ Ne renvoie **jamais** les jetons : uniquement des métadonnées
 * (email, nom, scopes accordés, expiration, services couverts).
 */
export async function GET(req: NextRequest) {
    if (!isOAuthConfigured()) {
        return NextResponse.json({
            configured: false,
            connected: false,
            email: null,
            name: null,
            scopes: [],
            expiresAt: null,
            services: {},
            encryptionReady: isCryptoConfigured(),
        });
    }

    const ownerId = resolveOwnerId(req);
    const store = getRequestTokenStore(req);
    const record = await store.load(ownerId);

    if (!record) {
        return NextResponse.json({
            configured: true,
            connected: false,
            email: null,
            name: null,
            scopes: [],
            expiresAt: null,
            services: {},
            encryptionReady: isCryptoConfigured(),
        });
    }

    const services: Record<string, boolean> = {};
    for (const key of GOOGLE_SERVICE_ORDER) {
        services[key] = grantedScopesCoverService(record.scope, key as GoogleServiceKey);
    }

    return NextResponse.json({
        configured: true,
        connected: true,
        email: record.email,
        name: record.name ?? null,
        scopes: record.scope.split(/\s+/).filter(Boolean),
        expiresAt: new Date(record.expiry).toISOString(),
        services,
        serviceCatalog: GOOGLE_SERVICE_ORDER.map((key) => ({
            key,
            label: GOOGLE_SCOPES[key].label,
            requiresApiApproval: GOOGLE_SCOPES[key].requiresApiApproval,
        })),
        encryptionReady: isCryptoConfigured(),
    });
}
