import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS } from '@/lib/mock-data';
import { generateMetaRealEstateCatalog } from '@/lib/meta-catalog';
import { getFacebookFeedToken, isValidFeedToken } from '@/lib/feed-tokens';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence
  if (!isValidFeedToken(token, getFacebookFeedToken())) {
    return new NextResponse('Accès non autorisé au catalogue Meta', { status: 401 });
  }

  const xmlContent = generateMetaRealEstateCatalog(
    INITIAL_PROPERTIES,
    DEFAULT_AGENCY_SETTINGS
  );

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
