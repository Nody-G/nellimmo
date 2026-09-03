import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES } from '@/lib/mock-data';
import { generatePolirisAnnoncesCsv, generatePolirisPhotosCfg, generatePolirisConfigTxt } from '@/lib/poliris';
import { getPolirisFeedToken, isValidFeedToken } from '@/lib/feed-tokens';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Sécurité token agence : le token est OBLIGATOIRE (fail-closed en production).
  if (!isValidFeedToken(token, getPolirisFeedToken())) {
    return new NextResponse('Accès non autorisé', { status: 401 });
  }

  const csv = generatePolirisAnnoncesCsv(INITIAL_PROPERTIES, 'NEL13');
  const photos = generatePolirisPhotosCfg(INITIAL_PROPERTIES);
  const config = generatePolirisConfigTxt('NEL13');

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
