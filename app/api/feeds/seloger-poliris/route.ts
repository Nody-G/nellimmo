import { NextResponse } from 'next/server';
import { generatePolirisAnnoncesCsv, generatePolirisPhotosCfg, generatePolirisConfigTxt } from '@/lib/poliris';
import { getPolirisFeedToken, isValidFeedToken } from '@/lib/feed-tokens';
import { resolveFeedData } from '@/lib/feed-data';

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

  const agencyCode = source.settings.seloger_agency_code || 'NEL13';
  const csv = generatePolirisAnnoncesCsv(source.properties, agencyCode);
  const photos = generatePolirisPhotosCfg(source.properties);
  const config = generatePolirisConfigTxt(agencyCode);

  // Load archiver dynamically for route handler
  const archiverModule = await import('archiver');
  const mod = (archiverModule as unknown as { default?: unknown; ZipArchive?: new (opts?: unknown) => unknown }).default || archiverModule;
  const ZipArchiveClass = (archiverModule as unknown as { ZipArchive?: new (opts?: unknown) => unknown }).ZipArchive ||
    (mod as unknown as { ZipArchive?: new (opts?: unknown) => unknown }).ZipArchive;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const archive: any = ZipArchiveClass
    ? new ZipArchiveClass({ zlib: { level: 9 } })
    : typeof mod === 'function'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (mod as any)('zip', { zlib: { level: 9 } })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : new (mod as any).ZipArchive({ zlib: { level: 9 } });

  const chunks: Buffer[] = [];

  archive.on('data', (chunk: Buffer) => chunks.push(chunk));

  archive.append(csv, { name: 'annonces.csv' });
  archive.append(photos, { name: 'photos.cfg' });
  archive.append(config, { name: 'config.txt' });

  await archive.finalize();

  const zipBuffer = Buffer.concat(chunks);

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="import_nellimo_poliris.zip"',
    },
  });
}
