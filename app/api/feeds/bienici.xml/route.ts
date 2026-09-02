import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS } from '@/lib/mock-data';
import { generateBienIciXmlFeed } from '@/lib/poliris';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence
  if (token && token !== DEFAULT_AGENCY_SETTINGS.bienici_feed_token) {
    return new NextResponse('Accès non autorisé', { status: 403 });
  }

  const xmlContent = generateBienIciXmlFeed(INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS);

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
