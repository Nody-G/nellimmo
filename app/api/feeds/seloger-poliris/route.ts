import { NextResponse } from 'next/server';
import { INITIAL_PROPERTIES } from '@/lib/mock-data';
import { generatePolirisAnnoncesCsv, generatePolirisPhotosCfg, generatePolirisConfigTxt } from '@/lib/poliris';

export async function GET() {
  const csv = generatePolirisAnnoncesCsv(INITIAL_PROPERTIES, 'NEL13');
  const photos = generatePolirisPhotosCfg(INITIAL_PROPERTIES);
  const config = generatePolirisConfigTxt('NEL13');

  // Load archiver dynamically for route handler
  const archiverModule = await import('archiver');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const archiver = ((archiverModule as unknown as { default: any }).default || archiverModule) as any;

  const archive = archiver('zip', { zlib: { level: 9 } });
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
