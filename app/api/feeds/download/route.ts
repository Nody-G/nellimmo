import { NextRequest, NextResponse } from 'next/server';
import { getBieniciFeedToken, getPolirisFeedToken } from '@/lib/feed-tokens';

/**
 * Passerelle de téléchargement sécurisée des flux portails.
 *
 * ⚠️ SÉCURITÉ : les jetons d'accès des flux (BIENICI_FEED_TOKEN / POLIRIS_FEED_TOKEN)
 * sont des secrets côté serveur. Ils ne doivent JAMAIS être exposés au navigateur
 * ni apparaître dans une URL. Cette route sert de proxy : le client appelle
 * `/api/feeds/download?feed=poliris` SANS jeton, et la route récupère le flux
 * côté serveur en injectant le jeton réel, puis renvoie le contenu au client.
 *
 * Usage (côté client) :
 *   - `/api/feeds/download?feed=poliris`  → archive ZIP Poliris (SeLoger)
 *   - `/api/feeds/download?feed=bienici`  → flux XML Bien'ici
 */
export async function GET(request: NextRequest) {
    const feed = request.nextUrl.searchParams.get('feed');

    if (feed === 'poliris') {
        const token = getPolirisFeedToken();
        const upstream = new URL('/api/feeds/seloger-poliris', request.nextUrl.origin);
        upstream.searchParams.set('token', token);
        const res = await fetch(upstream.toString());
        if (!res.ok) {
            return new NextResponse('Échec de la génération du flux Poliris', { status: res.status });
        }
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="import_nellimo_poliris.zip"',
            },
        });
    }

    if (feed === 'bienici') {
        const token = getBieniciFeedToken();
        const upstream = new URL('/api/feeds/bienici.xml', request.nextUrl.origin);
        upstream.searchParams.set('token', token);
        const res = await fetch(upstream.toString());
        if (!res.ok) {
            return new NextResponse('Échec de la génération du flux Bien’ici', { status: res.status });
        }
        const text = await res.text();
        return new NextResponse(text, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    }

    return new NextResponse('Paramètre `feed` invalide (attendu : poliris | bienici)', { status: 400 });
}
