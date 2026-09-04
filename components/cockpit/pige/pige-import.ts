import type { ProspectingLead, ProspectingSource, ProspectingStatus, PropertyType } from '@/lib/types';

/**
 * Pure logic for the Pige module: CSV import parsing and assisted manual entry.
 * Kept separate from components (god-component doctrine).
 */

/** A row parsed from CSV, ready to be reviewed before bulk creation. */
export interface ParsedPigeLead {
    title: string;
    sellerName: string;
    phone: string;
    price: number;
    surface: number;
    city: string;
    source: ProspectingSource;
    url: string;
    notes: string;
    /** True when the row is missing required fields and should be skipped. */
    invalid: boolean;
    /** Human-readable reason when invalid. */
    reason?: string;
}

/** Result of parsing a CSV import. */
export interface PigeCsvParseResult {
    leads: ParsedPigeLead[];
    totalRows: number;
    skippedRows: number;
    errors: string[];
}

/** Normalizes a header cell: lowercase, no accents, no spaces/punct. */
function normalizeHeader(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

/** Splits CSV text into rows, auto-detecting the delimiter and handling quotes. */
function splitCsvRows(text: string): { headers: string[]; rows: string[][] } {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };

    const firstLine = lines[0];
    const delimiters = [';', ',', '\t', '|'];
    let bestDelim = ';';
    let maxCount = 0;
    for (const d of delimiters) {
        const count = (firstLine.match(new RegExp(`\\${d}`, 'g')) || []).length;
        if (count > maxCount) {
            maxCount = count;
            bestDelim = d;
        }
    }

    const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === bestDelim && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const headers = parseLine(lines[0]).map(normalizeHeader);
    const rows = lines.slice(1).map(parseLine);
    return { headers, rows };
}

/** Maps a normalized header to a canonical field key. */
function mapHeaderToField(header: string): string | null {
    const map: Record<string, string> = {
        titre: 'title',
        title: 'title',
        annonce: 'title',
        nom: 'sellerName',
        vendeur: 'sellerName',
        sellername: 'sellerName',
        telephone: 'phone',
        tel: 'phone',
        phone: 'phone',
        prix: 'price',
        prixdemande: 'price',
        price: 'price',
        prixvendeur: 'price',
        surface: 'surface',
        surfacehabitable: 'surface',
        livingarea: 'surface',
        ville: 'city',
        commune: 'city',
        city: 'city',
        source: 'source',
        lien: 'url',
        url: 'url',
        lienweb: 'url',
        notes: 'notes',
        remarques: 'notes',
        contexte: 'notes',
    };
    return map[header] ?? null;
}

/** Parses a numeric value, stripping currency symbols and thousand separators. */
function toNumber(value: string): number {
    const cleaned = value.replace(/[€\s]/g, '').replace(/\u00a0/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
}

/** Maps a source label to a ProspectingSource, defaulting to leboncoin. */
function toSource(value: string): ProspectingSource {
    const v = value.toLowerCase();
    if (v.includes('pap')) return 'pap';
    if (v.includes('paruvendu')) return 'paruvendu';
    if (v.includes('boitage') || v.includes('terrain') || v.includes('porte')) return 'boitage';
    if (v.includes('recommand') || v.includes('bouche')) return 'recommandation';
    return 'leboncoin';
}

/** Maps a commune to its postal code (known sector). */
export function inferPostalCode(city: string): string {
    const c = city.trim().toLowerCase();
    if (c.includes('pelissanne')) return '13330';
    if (c.includes('salon')) return '13300';
    if (c.includes('lambesc')) return '13410';
    if (c.includes('lancon')) return '13680';
    if (c.includes('aix')) return '13100';
    return '13330';
}

/**
 * Parses CSV content into reviewable leads.
 * Accepts flexible French/English headers (title, seller, phone, price, surface, city, source, url, notes).
 */
export function parsePigeCsv(text: string): PigeCsvParseResult {
    const { headers, rows } = splitCsvRows(text);
    const errors: string[] = [];
    if (headers.length === 0) {
        return { leads: [], totalRows: 0, skippedRows: 0, errors: ['Fichier vide ou illisible.'] };
    }

    // Map each header index to a canonical field.
    const fieldByIndex: (string | null)[] = headers.map((h) => mapHeaderToField(h));
    const hasTitle = fieldByIndex.includes('title');
    if (!hasTitle) {
        errors.push('Aucune colonne "Titre" détectée. Colonnes reconnues : titre, vendeur, téléphone, prix, surface, ville, source, lien, notes.');
    }

    const leads: ParsedPigeLead[] = [];
    let skippedRows = 0;

    rows.forEach((row, idx) => {
        const get = (field: string): string => {
            const col = fieldByIndex.indexOf(field);
            return col >= 0 && col < row.length ? row[col] : '';
        };

        const title = get('title');
        const sellerName = get('sellerName');
        const phone = get('phone');
        const price = toNumber(get('price'));
        const surface = toNumber(get('surface'));
        const city = get('city') || 'Pélissanne';
        const source = toSource(get('source'));
        const url = get('url');
        const notes = get('notes');

        const invalid = !title || !phone || price <= 0 || surface <= 0;
        const reason = invalid
            ? !title
                ? 'Titre manquant'
                : !phone
                    ? 'Téléphone manquant'
                    : price <= 0
                        ? 'Prix invalide'
                        : 'Surface invalide'
            : undefined;

        if (invalid) {
            skippedRows++;
            errors.push(`Ligne ${idx + 2} ignorée : ${reason}.`);
            return;
        }

        leads.push({
            title,
            sellerName: sellerName || 'Vendeur particulier',
            phone,
            price,
            surface,
            city,
            source,
            url,
            notes,
            invalid: false,
        });
    });

    return { leads, totalRows: rows.length, skippedRows, errors };
}

/** Converts a reviewed parsed lead into the store payload shape. */
export function parsedLeadToProspectingLead(parsed: ParsedPigeLead): Omit<ProspectingLead, 'id' | 'created_at'> {
    const propertyType: PropertyType = 'maison';
    const status: ProspectingStatus = 'nouveau';
    return {
        source: parsed.source,
        source_url: parsed.url || undefined,
        title: parsed.title,
        property_type: propertyType,
        city: parsed.city,
        postal_code: inferPostalCode(parsed.city),
        price_asked: parsed.price,
        price_drops_count: 0,
        living_area: parsed.surface,
        rooms_count: 5,
        description: parsed.notes || parsed.title,
        photos_urls: [],
        seller_name: parsed.sellerName,
        seller_phone: parsed.phone,
        status,
        call_attempts_count: 0,
        notes: parsed.notes,
        days_online: 1,
    };
}

/** Extracts a phone number from arbitrary text (French format). */
function extractPhone(text: string): string {
    const match = text.match(/(?:\+33|0)[1-9](?:[\s.\-]?\d{2}){4}/);
    return match ? match[0].replace(/[\s.\-]/g, '') : '';
}

/** Extracts a price in euros from arbitrary text. */
function extractPrice(text: string): number {
    // Format "450k" / "450 k€" / "450keur"
    const kMatch = text.match(/(\d{2,4})\s*k(?:\s*€|eur)?\b/i);
    if (kMatch) {
        const num = Number(kMatch[1]);
        if (Number.isFinite(num)) return num * 1000;
    }

    // Format "450 000 €" / "450.000 €" / "450 000 FAI"
    const match = text.match(/(\d{1,3}(?:[\s\u00a0.]\d{3})+|\d+)\s*(?:€|euros?|eur|fai)/i);
    if (match) {
        const num = Number(match[1].replace(/[\s\u00a0.]/g, ''));
        if (Number.isFinite(num) && num > 5000) return num;
    }
    const plain = text.match(/(\d{5,7})\s*(?:€|euros?|eur)?/i);
    if (plain) {
        const num = Number(plain[1]);
        if (Number.isFinite(num) && num > 10000) return num;
    }
    return 0;
}

/** Extracts a living surface in m² from arbitrary text. */
function extractSurface(text: string): number {
    const match = text.match(/(\d{2,4}(?:[.,]\d{1,2})?)\s*(?:m²|m2|m\s*carr)/i);
    if (match) {
        const cleaned = match[1].replace(',', '.');
        const num = Number(cleaned);
        if (Number.isFinite(num) && num > 10) return Math.round(num);
    }
    return 0;
}

/** Extracts a commune name from arbitrary text (postal codes & known sector). */
function extractCity(text: string): string {
    const pcMatch = text.match(/\b(13330|13300|13410|13680|13121|13980|13116|13560|13100)\b/);
    if (pcMatch) {
        const pc = pcMatch[1];
        if (pc === '13330') return 'Pélissanne';
        if (pc === '13300') return 'Salon-de-Provence';
        if (pc === '13410') return 'Lambesc';
        if (pc === '13680') return 'Lançon-Provence';
        if (pc === '13121') return 'Aurons';
        if (pc === '13980') return 'Alleins';
        if (pc === '13116') return 'Vernègues';
        if (pc === '13560') return 'Sénas';
        if (pc === '13100') return 'Aix-en-Provence';
    }

    const known = [
        'Pélissanne',
        'Salon-de-Provence',
        'Salon de Provence',
        'Lambesc',
        'Lançon-Provence',
        'Lançon de Provence',
        'Aurons',
        'Alleins',
        'Vernègues',
        'Sénas',
        'Aix-en-Provence',
    ];
    for (const city of known) {
        if (text.toLowerCase().includes(city.toLowerCase())) {
            if (city.toLowerCase().includes('salon')) return 'Salon-de-Provence';
            if (city.toLowerCase().includes('lançon')) return 'Lançon-Provence';
            return city;
        }
    }
    return 'Pélissanne';
}

/** Extracts a seller name from arbitrary text (e.g. "M. Bernard"). */
function extractSellerName(text: string): string {
    const match = text.match(/\b(M(?:me|\.)?|Mme|Monsieur|Madame)\s+([A-Za-zÀ-ÿ' -]{2,})/);
    if (match) return `${match[1]} ${match[2]}`.trim();
    return '';
}

/** Detects the source portal from a URL or text. */
function detectSource(text: string): ProspectingSource {
    const t = text.toLowerCase();
    if (t.includes('pap.fr') || t.includes('pap')) return 'pap';
    if (t.includes('paruvendu')) return 'paruvendu';
    if (t.includes('leboncoin')) return 'leboncoin';
    if (t.includes('boitage') || t.includes('terrain')) return 'boitage';
    if (t.includes('recommandation') || t.includes('bouche')) return 'recommandation';
    return 'leboncoin';
}

/** Prix médians notariés DVF indicatifs par commune (base DGFiP Pays Salonais). */
export const DVF_SECTOR_MEDIANS: Record<string, number> = {
    '13330': 3450, // Pélissanne
    '13300': 2950, // Salon-de-Provence
    '13410': 3600, // Lambesc
    '13680': 3300, // Lançon-Provence
    '13121': 3550, // Aurons
    '13980': 3100, // Alleins
    '13116': 3250, // Vernègues
    '13560': 2750, // Sénas
    '13100': 4900, // Aix-en-Provence
};

/** Calcule l'écart DVF d'une annonce de pige par rapport aux ventes réelles du secteur. */
export function computePigeDvfGap(price: number, surface: number, cityOrPostal: string): {
    askingM2: number;
    medianM2: number;
    gapPct: number;
    isOverpriced: boolean;
    argumentPitch: string;
} | null {
    if (price <= 0 || surface <= 0) return null;
    const postal = inferPostalCode(cityOrPostal);
    const medianM2 = DVF_SECTOR_MEDIANS[postal] || 3200;
    const askingM2 = Math.round(price / surface);
    const gapPct = Math.round(((askingM2 - medianM2) / medianM2) * 100);
    const isOverpriced = gapPct > 5;

    const argumentPitch = isOverpriced
        ? `À ${askingM2.toLocaleString('fr-FR')} €/m², ce bien est affiché +${gapPct}% au-dessus du prix médian notarié DVF constaté sur ${cityOrPostal} (${medianM2.toLocaleString('fr-FR')} €/m²). Argument d'appel : risque de surévaluation et d'usure de l'annonce.`
        : `À ${askingM2.toLocaleString('fr-FR')} €/m², le prix est aligné sur le marché réel DVF (${medianM2.toLocaleString('fr-FR')} €/m²). Argument d'appel : sécuriser un mandat exclusif dès maintenant avec le vivier d'acquéreurs qualifiés de l'agence.`;

    return { askingM2, medianM2, gapPct, isOverpriced, argumentPitch };
}

/**
 * Assisted manual entry: parses a pasted listing (text or URL) and returns
 * a partial form patch to pre-fill the "new lead" form.
 */
export function parseListingText(text: string): Partial<{
    title: string;
    sellerName: string;
    phone: string;
    price: number;
    surface: number;
    city: string;
    source: ProspectingSource;
    url: string;
    notes: string;
}> {
    const trimmed = text.trim();
    // If it's a bare URL, keep it as the source link.
    const isUrl = /^https?:\/\//i.test(trimmed);

    // Title: first meaningful line or first sentence.
    const firstLine = trimmed.split(/\r?\n/)[0]?.trim() || '';
    const title = isUrl
        ? ''
        : firstLine.length > 8
            ? firstLine.slice(0, 120)
            : trimmed.slice(0, 120);

    return {
        title,
        sellerName: extractSellerName(trimmed),
        phone: extractPhone(trimmed),
        price: extractPrice(trimmed),
        surface: extractSurface(trimmed),
        city: extractCity(trimmed),
        source: detectSource(trimmed),
        url: isUrl ? trimmed : '',
        notes: isUrl ? '' : trimmed.slice(0, 500),
    };
}
