import { NextResponse } from 'next/server';
import { getPolirisFeedToken, isValidFeedToken } from '@/lib/feed-tokens';
import { resolveFeedData } from '@/lib/feed-data';
import { buildPolirisZipBuffer } from '@/lib/feed-archive';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence : le token est OBLIGATOIRE (fail-closed en production).
  if (!isValidFeedToken(token, getPolirisFeedToken())) {
    return new NextResponse('Accès non autorisé', { status: 401 });
  }

  // INTÉGRITÉ DES DONNÉES : on ne sert JAMAIS les annonces de démonstration
  // comme si elles étaient réelles. On lit les données réelles depuis Supabase ;
  // si elles ne sont pas accessibles, l'archive est refusée proprement.
  const source = await resolveFeedData();
  if (!source.live || !source.settings) {
    return new NextResponse(
      `Archive Poliris indisponible : ${source.reason || 'aucune donnée réelle accessible.'}`,
      { status: 503 }
    );
  }

  const zipBuffer = await buildPolirisZipBuffer(source.properties, source.settings);

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="import_nellimo_poliris.zip"',
    },
  });
}
