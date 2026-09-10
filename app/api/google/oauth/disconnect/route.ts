import { NextRequest, NextResponse } from 'next/server';
import { revokeToken } from '@/lib/google/oauth-client';
import {
    getRequestTokenStore,
    resolveOwnerId,
    clearOAuthCookies,
} from '@/lib/google/server-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Déconnecte le compte Google : révoque le jeton chez Google (best-effort),
 * supprime la ligne en base et efface les cookies.
 */
export async function POST(req: NextRequest) {
    const ownerId = resolveOwnerId(req);
    const store = getRequestTokenStore(req);
    const record = await store.load(ownerId);

    if (record) {
        await revokeToken(record.refreshToken || record.accessToken);
        await store.clear(ownerId);
    }

    const res = NextResponse.json({ success: true, connected: false });
    clearOAuthCookies(res);
    return res;
}
