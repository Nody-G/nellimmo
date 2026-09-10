import { NextRequest, NextResponse } from 'next/server';
import { getBieniciFeedToken, getPolirisFeedToken, getFacebookFeedToken } from '@/lib/feed-tokens';
import { buildPolirisZipBuffer } from '@/lib/feed-archive';
import { generateBienIciXmlFeed } from '@/lib/poliris';
import { generateMetaRealEstateCatalog } from '@/lib/meta-catalog';
import {
    generateLeBonCoinCsv,
    generateFigaroXmlFeed,
    generateGreenAcresXmlFeed,
    generatePapXmlFeed,
} from '@/lib/portal-feeds';
import type { Property, AgencySettings } from '@/lib/types';

/**
 * Passerelle de téléchargement des flux portails.
 *
 * Deux modes :
 *
 * 1. POST (recommandé, utilisé par le cockpit) — le client envoie les données
 *    réelles de sa session (`{ feed, properties, settings }`). L'archive est
 *    générée à la volée. Ce mode fonctionne même quand Supabase n'est pas
 *    configuré, car les données proviennent de la session locale de l'utilisateur.
 *
 * 2. GET (fallback portails) — le client appelle `/api/feeds/download?feed=poliris`
 *    SANS jeton ; la route récupère le flux côté serveur en injectant le jeton
 *    réel depuis les données Supabase. ⚠️ SÉCURITÉ : les jetons ne doivent
 *    JAMAIS être exposés au navigateur ni apparaître dans une URL.
 */

interface DownloadPayload {
    feed?: string;
    properties?: Property[];
    settings?: AgencySettings;
}

function isPayloadValid(payload: DownloadPayload): payload is Required<Pick<DownloadPayload, 'properties' | 'settings'>> {
    return (
        Array.isArray(payload.properties) &&
        payload.properties.length > 0 &&
        Boolean(payload.settings)
    );
}

export async function POST(request: NextRequest) {
    const feed = request.nextUrl.searchParams.get('feed') || 'poliris';

    let payload: DownloadPayload;
    try {
        payload = (await request.json()) as DownloadPayload;
    } catch {
        return NextResponse.json(
            { error: 'Corps de requête JSON invalide.' },
            { status: 400 }
        );
    }

    if (!isPayloadValid(payload)) {
        return NextResponse.json(
            {
                error:
                    'Aucune donnée à exporter : aucun bien actif ou paramètres agence manquants.',
            },
            { status: 400 }
        );
    }

    const { properties, settings } = payload;

    try {
        if (feed === 'poliris') {
            const zipBuffer = await buildPolirisZipBuffer(properties, settings);
            return new NextResponse(new Uint8Array(zipBuffer), {
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': 'attachment; filename="import_nellimo_poliris.zip"',
                },
            });
        }

        if (feed === 'bienici') {
            const xml = generateBienIciXmlFeed(properties, settings);
            return new NextResponse(xml, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="flux_bienici_nellimo.xml"',
                },
            });
        }

        if (feed === 'facebook') {
            const xml = generateMetaRealEstateCatalog(properties, settings);
            return new NextResponse(xml, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="meta_catalog_nellimo.xml"',
                },
            });
        }

        if (feed === 'leboncoin') {
            const csv = generateLeBonCoinCsv(properties, settings);
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="import_leboncoin_nellimo.csv"',
                },
            });
        }

        if (feed === 'figaro') {
            const xml = generateFigaroXmlFeed(properties, settings);
            return new NextResponse(xml, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="flux_figaro_nellimo.xml"',
                },
            });
        }

        if (feed === 'greenacres') {
            const xml = generateGreenAcresXmlFeed(properties, settings);
            return new NextResponse(xml, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="flux_greenacres_nellimo.xml"',
                },
            });
        }

        if (feed === 'pap') {
            const xml = generatePapXmlFeed(properties, settings);
            return new NextResponse(xml, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="flux_pap_nellimo.xml"',
                },
            });
        }

        return NextResponse.json(
            {
                error:
                    'Paramètre `feed` invalide (attendu : poliris | bienici | facebook | leboncoin | figaro | greenacres | pap).',
            },
            { status: 400 }
        );
    } catch (err) {
        console.error('[feeds/download] Échec de génération du flux :', err);
        return NextResponse.json(
            {
                error:
                    err instanceof Error
                        ? `Échec de la génération : ${err.message}`
                        : 'Échec de la génération du flux.',
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const feed = request.nextUrl.searchParams.get('feed');

    if (feed === 'poliris') {
        const token = getPolirisFeedToken();
        const upstream = new URL('/api/feeds/seloger-poliris', request.nextUrl.origin);
        upstream.searchParams.set('token', token);
        const res = await fetch(upstream.toString());
        if (!res.ok) {
            const detail = await res.text().catch(() => '');
            return NextResponse.json(
                { error: detail || 'Échec de la génération du flux Poliris.' },
                { status: res.status }
            );
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
            const detail = await res.text().catch(() => '');
            return NextResponse.json(
                { error: detail || 'Échec de la génération du flux Bien’ici.' },
                { status: res.status }
            );
        }
        const text = await res.text();
        return new NextResponse(text, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    }

    if (feed === 'facebook') {
        const token = getFacebookFeedToken();
        const upstream = new URL('/api/feeds/facebook-catalog.xml', request.nextUrl.origin);
        upstream.searchParams.set('token', token);
        const res = await fetch(upstream.toString());
        if (!res.ok) {
            const detail = await res.text().catch(() => '');
            return NextResponse.json(
                { error: detail || 'Échec de la génération du flux Facebook Marketplace.' },
                { status: res.status }
            );
        }
        const text = await res.text();
        return new NextResponse(text, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Content-Disposition': 'attachment; filename="meta_catalog_nellimo.xml"',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    }

    return NextResponse.json(
        { error: 'Paramètre `feed` invalide (attendu : poliris | bienici | facebook).' },
        { status: 400 }
    );
}
