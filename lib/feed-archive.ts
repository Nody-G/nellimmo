import { Property, AgencySettings } from './types';
import {
    generatePolirisAnnoncesCsv,
    generatePolirisPhotosCfg,
    generatePolirisConfigTxt,
} from './poliris';

/**
 * Construction de l'archive ZIP Poliris (SeLoger / Logic-Immo).
 *
 * ⚠️ archiver@8 est ESM-only et n'expose QUE des exports nommés
 * (`Archiver`, `ZipArchive`, `TarArchive`, `JsonArchive`). Il n'y a ni export
 * par défaut ni fonction appelable — on instancie donc directement `ZipArchive`.
 *
 * ⚠️ On attend explicitement l'événement `end` du flux avant de concaténer les
 * chunks : `finalize()` ne garantit pas que toutes les données ont été émises,
 * et concaténer trop tôt produirait une archive tronquée/corrompue.
 */
export async function buildPolirisZipBuffer(
    properties: Property[],
    settings: AgencySettings
): Promise<Buffer> {
    const agencyCode = settings.seloger_agency_code || 'NEL13';

    const csv = generatePolirisAnnoncesCsv(properties, agencyCode);
    const photos = generatePolirisPhotosCfg(properties);
    const config = generatePolirisConfigTxt(agencyCode);

    const { ZipArchive } = await import('archiver');

    return new Promise<Buffer>((resolve, reject) => {
        const archive = new ZipArchive({ zlib: { level: 9 } });
        const chunks: Buffer[] = [];

        archive.on('data', (chunk: Buffer) => chunks.push(chunk));
        archive.on('warning', (err: Error) => {
            // Les avertissements non bloquants (ex. statut ENOENT) ne doivent pas
            // interrompre la génération.
            if ((err as NodeJS.ErrnoException).code !== 'ENOENT') reject(err);
        });
        archive.on('error', (err: Error) => reject(err));
        archive.on('end', () => resolve(Buffer.concat(chunks)));

        archive.append(csv, { name: 'annonces.csv' });
        archive.append(photos, { name: 'photos.cfg' });
        archive.append(config, { name: 'config.txt' });

        archive.finalize().catch(reject);
    });
}
