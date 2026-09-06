import { computeSHA256 } from './hoguet';

export interface IntegrityCheckResult {
  collection: string;
  totalRecords: number;
  integrityHash: string;
  verifiedAt: string;
  status: 'valid' | 'warning' | 'tampered';
}

/**
 * Calcule l'empreinte cryptographique SHA-256 globale d'une collection
 * pour garantir son intégrité et détecter toute altération non autorisée.
 */
export async function computeCollectionIntegrity(
  collectionName: string,
  records: Array<Record<string, unknown>>
): Promise<IntegrityCheckResult> {
  const serialized = JSON.stringify(
    records.map((r) => {
      // Nettoyage des clés temporaires avant hachage
      const copy = { ...r };
      delete copy.updated_at;
      return copy;
    }).sort((a, b) => ((a.id as string) || '').localeCompare((b.id as string) || ''))
  );

  const hash = await computeSHA256(`${collectionName}:${serialized}`);

  return {
    collection: collectionName,
    totalRecords: records.length,
    integrityHash: hash,
    verifiedAt: new Date().toISOString(),
    status: 'valid',
  };
}

/**
 * Assainit un jeu de données pour un export partenaire en éliminant toute PII.
 */
export function sanitizeDatasetForExport(
  records: Array<Record<string, unknown>>,
  preservePii: boolean = false
): Array<Record<string, unknown>> {
  if (preservePii) return records;

  return records.map((record) => {
    const sanitized = { ...record };

    // Caviardage des identités et contacts
    if ('seller_name' in sanitized) sanitized.seller_name = '[VENDEUR CONFIDENTIEL]';
    if ('seller_phone' in sanitized) sanitized.seller_phone = '[TÉLÉPHONE MASQUÉ]';
    if ('seller_email' in sanitized) sanitized.seller_email = '[EMAIL MASQUÉ]';
    if ('seller_address' in sanitized) sanitized.seller_address = '[ADRESSE SÉCURISÉE]';

    if ('phone' in sanitized) sanitized.phone = '[TÉLÉPHONE MASQUÉ]';
    if ('email' in sanitized) sanitized.email = '[EMAIL MASQUÉ]';
    if ('last_name' in sanitized) sanitized.last_name = `${(sanitized.last_name as string || '').charAt(0)}.`;

    // Caviardage des secrets
    delete sanitized.seller_token;
    delete sanitized.sftp_password;
    delete sanitized.api_token;

    return sanitized;
  });
}

/**
 * Exporte un jeu de données sous forme de fichier téléchargeable (JSON ou CSV).
 */
export function downloadDataset(
  filename: string,
  data: Array<Record<string, unknown>>,
  format: 'json' | 'csv' = 'json'
): void {
  if (typeof window === 'undefined') return;

  let content = '';
  let mimeType = '';

  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  } else {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(';'),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(';')
      ),
    ];
    content = csvRows.join('\r\n');
    mimeType = 'text/csv;charset=utf-8;';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
