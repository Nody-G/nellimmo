import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken, googleErrorResponse } from '@/lib/google/server-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Rafraîchissement explicite du jeton (fallback si le refresh automatique
 * paresseux a échoué). Ne renvoie jamais le token : juste un accusé.
 */
export async function POST(req: NextRequest) {
    try {
        await getValidAccessToken(req);
        return NextResponse.json({ success: true, refreshed: true });
    } catch (error) {
        return googleErrorResponse(error);
    }
}
