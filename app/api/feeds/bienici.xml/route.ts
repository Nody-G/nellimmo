import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS } from '@/lib/mock-data';
import { generateBienIciXmlFeed } from '@/lib/poliris';
import { getBieniciFeedToken, isValidFeedToken } from '@/lib/feed-tokens';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence : le token est OBLIGATOIRE (fail-closed en production).
  if (!isValidFeedToken(token, getBieniciFeedToken())) {
    return new NextResponse('Accès non autorisé', { status: 401 });
  }

  const xmlContent = generateBienIciXmlFeed(INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS);

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
