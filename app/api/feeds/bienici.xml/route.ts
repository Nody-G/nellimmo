import { NextResponse } from 'next/server';
import { generateBienIciXmlFeed } from '@/lib/poliris';
import { getBieniciFeedToken, isValidFeedToken } from '@/lib/feed-tokens';
import { resolveFeedData } from '@/lib/feed-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence : le token est OBLIGATOIRE (fail-closed en production).
  if (!isValidFeedToken(token, getBieniciFeedToken())) {
    return new NextResponse('Accès non autorisé', { status: 401 });
  }

  // INTÉGRITÉ DES DONNÉES : on ne sert JAMAIS les annonces de démonstration
  // comme si elles étaient réelles. On lit les données réelles depuis Supabase ;
  // si elles ne sont pas accessibles, le flux est refusé proprement.
  const source = await resolveFeedData();
  if (!source.live || !source.settings) {
    return new NextResponse(
      `Flux Bien'ici indisponible : ${source.reason || 'aucune donnée réelle accessible.'}`,
      { status: 503 }
    );
  }

  const xmlContent = generateBienIciXmlFeed(source.properties, source.settings);

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
