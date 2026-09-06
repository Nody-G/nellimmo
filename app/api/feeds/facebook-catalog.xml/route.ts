import { NextResponse } from 'next/server';
import { generateMetaRealEstateCatalog } from '@/lib/meta-catalog';
import { getFacebookFeedToken, isValidFeedToken } from '@/lib/feed-tokens';
import { resolveFeedData } from '@/lib/feed-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence
  if (!isValidFeedToken(token, getFacebookFeedToken())) {
    return new NextResponse('Accès non autorisé au catalogue Meta', { status: 401 });
  }

  // INTÉGRITÉ DES DONNÉES : on ne sert JAMAIS les annonces de démonstration
  // comme si elles étaient réelles. On lit les données réelles depuis Supabase ;
  // si elles ne sont pas accessibles, le catalogue est refusé proprement.
  const source = await resolveFeedData();
  if (!source.live || !source.settings) {
    return new NextResponse(
      `Catalogue Meta indisponible : ${source.reason || 'aucune donnée réelle accessible.'}`,
      { status: 503 }
    );
  }

  const xmlContent = generateMetaRealEstateCatalog(source.properties, source.settings);

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
