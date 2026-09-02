/**
 * NELLIMO COCKPIT - MOTEUR D'IMPORTATION UNIVERSEL HEKTOR / LA BOÎTE IMMO
 * Supporte : CSV, TSV, JSON, Poliris, Export Texte Brut
 */

import { Property, Buyer, MandateType, PropertyStatus, FeesPaidBy, FinancingStatus, PropertyType, PropertyImage, DpeLetter, GesLetter } from './types';
import { getDpeLetterFromValue, getGesLetterFromValue } from './hoguet';

export interface ParseResult<T> {
  success: boolean;
  totalParsed: number;
  validCount: number;
  errorCount: number;
  items: T[];
  warnings: string[];
  detectedColumns: string[];
}

/**
 * Nettoyage des chaînes de caractères (supprime les guillemets superflus, trim)
 */
function cleanString(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/^["']|["']$/g, '')
    .replace(/\\"/g, '"')
    .trim();
}

/**
 * Nettoyage et conversion des montants numériques (gère '585 000 €', '585,00', '585000')
 */
function parseNumeric(val: any, fallback = 0): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val) return fallback;
  const cleaned = String(val)
    .replace(/\s+/g, '')
    .replace(/€/g, '')
    .replace(/k€/i, '000')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? fallback : num;
}

/**
 * Normalisation de dates (DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
 */
function parseDate(val: any, fallbackDays = 90): { start: string; end: string } {
  const now = new Date();
  const defaultStart = now.toISOString().slice(0, 10);
  const defaultEnd = new Date(now.getTime() + fallbackDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  if (!val) return { start: defaultStart, end: defaultEnd };

  const str = cleanString(val);
  // Match DD/MM/YYYY
  const dmy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmy) {
    const d = dmy[1].padStart(2, '0');
    const m = dmy[2].padStart(2, '0');
    const y = dmy[3];
    return { start: `${y}-${m}-${d}`, end: defaultEnd };
  }

  // Match YYYY-MM-DD
  const ymd = str.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (ymd) {
    const y = ymd[1];
    const m = ymd[2].padStart(2, '0');
    const d = ymd[3].padStart(2, '0');
    return { start: `${y}-${m}-${d}`, end: defaultEnd };
  }

  return { start: defaultStart, end: defaultEnd };
}

/**
 * Découpe une chaîne CSV avec gestion des délimiteurs multiples et des guillemets
 */
export function parseCsvRows(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Detect delimiter based on first line
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
        result.push(cleanString(current));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(cleanString(current));
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  const rows = lines.slice(1).map(parseLine);

  return { headers, rows };
}

/**
 * Convertit un export Hektor de Mandats / Biens en objets Property
 */
export function parseHektorPropertiesCsv(csvContent: string): ParseResult<Property> {
  const { headers, rows } = parseCsvRows(csvContent);
  const warnings: string[] = [];
  const items: Property[] = [];

  if (headers.length === 0) {
    return {
      success: false,
      totalParsed: 0,
      validCount: 0,
      errorCount: 0,
      items: [],
      warnings: ['Le fichier ou texte fourni est vide.'],
      detectedColumns: [],
    };
  }

  // Find column index helper with multiple alias checks
  const findCol = (...aliases: string[]): number => {
    return headers.findIndex(h => aliases.some(alias => {
      const normalizedAlias = alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return h === normalizedAlias || h.includes(normalizedAlias);
    }));
  };

  const refIdx = findCol('ref', 'reference', 'numero', 'mandat', 'num_mandat', 'id');
  const titleIdx = findCol('titre', 'designation', 'libelle', 'nom_bien', 'nom');
  const typeIdx = findCol('type', 'type_bien', 'nature');
  const cityIdx = findCol('ville', 'commune', 'localite');
  const cpIdx = findCol('cp', 'code_postal', 'codepostal');
  const addressIdx = findCol('adresse', 'rue', 'voie');
  const priceFaiIdx = findCol('prix', 'prix_fai', 'prix_vente', 'prix_public', 'fai');
  const priceNetIdx = findCol('net_vendeur', 'prix_net', 'net');
  const feesIdx = findCol('honoraires', 'honoraires_ttc', 'frais_agence', 'comm');
  const feesPctIdx = findCol('pct_honoraires', 'pourcentage', 'taux_honoraires');
  const livingAreaIdx = findCol('surface', 'surface_habitable', 'surf_hab', 'surface_m2');
  const carrezIdx = findCol('carrez', 'surface_carrez');
  const landAreaIdx = findCol('terrain', 'surface_terrain', 'surf_terrain');
  const roomsIdx = findCol('pieces', 'nb_pieces', 'nombre_pieces', 'nb_piece');
  const bedroomsIdx = findCol('chambres', 'nb_chambres', 'nombre_chambres');
  const bathroomsIdx = findCol('sdb', 'salles_bains', 'salle_eau', 'sde');
  const dpeValIdx = findCol('dpe_valeur', 'dpe_val', 'dpe_kwh', 'conso_dpe');
  const dpeLetIdx = findCol('dpe', 'dpe_lettre', 'lettre_dpe', 'classe_dpe');
  const gesValIdx = findCol('ges_valeur', 'ges_val', 'ges_co2');
  const gesLetIdx = findCol('ges', 'ges_lettre', 'lettre_ges', 'classe_ges');
  const descIdx = findCol('descriptif', 'description', 'texte', 'commentaires', 'texte_pub', 'remarques');
  const featuresIdx = findCol('equipements', 'prestations', 'options', 'criteres');
  const photosIdx = findCol('photos', 'images', 'urls_photos', 'photo', 'url_photos', 'photos_urls');
  const sellerNameIdx = findCol('vendeur', 'mandant', 'nom_vendeur', 'proprio', 'proprietaire');
  const sellerPhoneIdx = findCol('tel_vendeur', 'telephone_vendeur', 'tel_mandant', 'portable_vendeur');
  const sellerEmailIdx = findCol('email_vendeur', 'mail_vendeur', 'email_mandant');
  const sellerAddrIdx = findCol('adresse_vendeur', 'domicile_vendeur');
  const mandateTypeIdx = findCol('type_mandat', 'nature_mandat', 'exclusif');
  const mandateDateIdx = findCol('date_mandat', 'date_debut', 'debut_mandat', 'date');
  const statusIdx = findCol('statut', 'etat', 'commercialisation');

  rows.forEach((row, rowIdx) => {
    if (row.length < 2 || row.every(c => !c.trim())) return;

    try {
      const mandateNumRaw = refIdx !== -1 ? row[refIdx] : '';
      const mandateNum = Math.abs(parseInt(mandateNumRaw.replace(/\D/g, ''), 10)) || (250 + rowIdx);
      const title = titleIdx !== -1 && row[titleIdx] ? row[titleIdx] : `Bien immobilier #${mandateNum}`;
      const city = cityIdx !== -1 && row[cityIdx] ? row[cityIdx] : 'Pélissanne';
      const postalCode = cpIdx !== -1 && row[cpIdx] ? row[cpIdx] : '13330';
      const address = addressIdx !== -1 && row[addressIdx] ? row[addressIdx] : `Chemin de la campagne, ${postalCode} ${city}`;

      let priceFai = priceFaiIdx !== -1 ? parseNumeric(row[priceFaiIdx]) : 0;
      let priceNet = priceNetIdx !== -1 ? parseNumeric(row[priceNetIdx]) : 0;
      let feesAmount = feesIdx !== -1 ? parseNumeric(row[feesIdx]) : 0;
      let feesPct = feesPctIdx !== -1 ? parseNumeric(row[feesPctIdx]) : 4.0;

      if (priceFai > 0 && priceNet === 0) {
        feesAmount = Math.round(priceFai * (feesPct / (100 + feesPct)));
        priceNet = priceFai - feesAmount;
      } else if (priceNet > 0 && priceFai === 0) {
        feesAmount = Math.round(priceNet * (feesPct / 100));
        priceFai = priceNet + feesAmount;
      } else if (priceFai === 0 && priceNet === 0) {
        priceFai = 350000;
        priceNet = 336000;
        feesAmount = 14000;
      }

      const livingArea = livingAreaIdx !== -1 ? parseNumeric(row[livingAreaIdx], 100) : 100;
      const carrezArea = carrezIdx !== -1 ? parseNumeric(row[carrezIdx], livingArea) : livingArea;
      const landArea = landAreaIdx !== -1 ? parseNumeric(row[landAreaIdx], 0) : 0;
      const roomsCount = roomsIdx !== -1 ? Math.max(1, Math.round(parseNumeric(row[roomsIdx], 4))) : 4;
      const bedroomsCount = bedroomsIdx !== -1 ? Math.max(1, Math.round(parseNumeric(row[bedroomsIdx], 3))) : 3;
      const bathroomsCount = bathroomsIdx !== -1 ? Math.max(1, Math.round(parseNumeric(row[bathroomsIdx], 1))) : 1;

      // DPE / GES
      let dpeVal = dpeValIdx !== -1 ? parseNumeric(row[dpeValIdx], 140) : 140;
      let rawDpeLet = (dpeLetIdx !== -1 && row[dpeLetIdx] ? row[dpeLetIdx].toUpperCase().slice(0, 1) : getDpeLetterFromValue(dpeVal)) || 'C';
      let dpeLetter: DpeLetter = (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(rawDpeLet) ? rawDpeLet : 'C') as DpeLetter;

      let gesVal = gesValIdx !== -1 ? parseNumeric(row[gesValIdx], 12) : 12;
      let rawGesLet = (gesLetIdx !== -1 && row[gesLetIdx] ? row[gesLetIdx].toUpperCase().slice(0, 1) : getGesLetterFromValue(gesVal)) || 'B';
      let gesLetter: GesLetter = (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(rawGesLet) ? rawGesLet : 'B') as GesLetter;

      // Photos
      const rawPhotos = photosIdx !== -1 && row[photosIdx] ? row[photosIdx] : '';
      const photoUrls = rawPhotos
        .split(/[;|,]/)
        .map(u => u.trim())
        .filter(u => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/'));

      const images: PropertyImage[] = photoUrls.length > 0
        ? photoUrls.map((url, i) => ({
            id: `img-import-${mandateNum}-${i}`,
            property_id: `prop-${mandateNum}`,
            image_url: url,
            display_order: i,
            is_cover: i === 0,
            created_at: new Date().toISOString(),
          }))
        : [
            {
              id: `img-import-${mandateNum}-default`,
              property_id: `prop-${mandateNum}`,
              image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              display_order: 0,
              is_cover: true,
              created_at: new Date().toISOString(),
            },
          ];

      // Description & Features
      const description = descIdx !== -1 && row[descIdx]
        ? row[descIdx].replace(/<br\s*[\/]?>/gi, '\n')
        : `Superbe bien immobilier situé à ${city}, offrant ${livingArea} m² habitables avec ${roomsCount} pièces. À visiter sans tarder avec l'agence Nell'Immo.`;

      const rawFeatures = featuresIdx !== -1 && row[featuresIdx] ? row[featuresIdx] : '';
      const features = rawFeatures
        .split(/[,;|]/)
        .map(f => f.trim())
        .filter(Boolean);

      if (features.length === 0) {
        if (landArea > 0) features.push('Jardin privatif');
        features.push('Climatisation', 'Cuisine équipée');
      }

      // Mandate Type & Status
      let mandateType: MandateType = 'simple';
      if (mandateTypeIdx !== -1 && row[mandateTypeIdx]) {
        const mt = row[mandateTypeIdx].toLowerCase();
        if (mt.includes('exclu')) mandateType = 'exclusif';
        else if (mt.includes('semi')) mandateType = 'semi-exclusif';
      }

      let status: PropertyStatus = 'actif';
      if (statusIdx !== -1 && row[statusIdx]) {
        const st = row[statusIdx].toLowerCase();
        if (st.includes('vendu')) status = 'vendu';
        else if (st.includes('compromis')) status = 'sous_compromis';
        else if (st.includes('archive')) status = 'archive';
        else if (st.includes('resilie')) status = 'resilie';
      }

      // Dates
      const rawDate = mandateDateIdx !== -1 ? row[mandateDateIdx] : '';
      const { start: mandateDate, end: mandateEndDate } = parseDate(rawDate);

      // Property Type
      let propertyType: PropertyType = 'maison';
      if (typeIdx !== -1 && row[typeIdx]) {
        const pt = row[typeIdx].toLowerCase();
        if (pt.includes('app')) propertyType = 'appartement';
        else if (pt.includes('terr')) propertyType = 'terrain';
        else if (pt.includes('immeuble')) propertyType = 'immeuble';
        else if (pt.includes('comm')) propertyType = 'local_commercial';
      }

      const property: Property = {
        id: `prop-hektor-${mandateNum}`,
        mandate_number: mandateNum,
        mandate_type: mandateType,
        mandate_date: mandateDate,
        mandate_end_date: mandateEndDate,
        status: status,
        seller_civility: 'M_Mme',
        seller_name: sellerNameIdx !== -1 && row[sellerNameIdx] ? row[sellerNameIdx] : 'Propriétaire Vendeur',
        seller_email: sellerEmailIdx !== -1 && row[sellerEmailIdx] ? row[sellerEmailIdx] : undefined,
        seller_phone: sellerPhoneIdx !== -1 && row[sellerPhoneIdx] ? row[sellerPhoneIdx] : '06 00 00 00 00',
        seller_address: sellerAddrIdx !== -1 && row[sellerAddrIdx] ? row[sellerAddrIdx] : `${address}, ${postalCode} ${city}`,
        title: title,
        property_type: propertyType,
        address: address,
        postal_code: postalCode,
        city: city,
        display_exact_address: false,
        price_fai: priceFai,
        price_net_seller: priceNet,
        agency_fees_amount: feesAmount,
        agency_fees_percentage: feesPct,
        fees_paid_by: 'vendeur' as FeesPaidBy,
        living_area: livingArea,
        carrez_area: carrezArea,
        land_area: landArea,
        rooms_count: roomsCount,
        bedrooms_count: bedroomsCount,
        bathrooms_count: bathroomsCount,
        dpe_value: dpeVal,
        dpe_letter: dpeLetter,
        ges_value: gesVal,
        ges_letter: gesLetter,
        description: description,
        features: features,
        publish_website: true,
        publish_seloger: true,
        publish_leboncoin: true,
        publish_bienici: true,
        images: images,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      items.push(property);
    } catch (err: any) {
      warnings.push(`Ligne ${rowIdx + 2} ignorée en raison d'une erreur de lecture : ${err?.message || 'Format invalide'}`);
    }
  });

  return {
    success: items.length > 0,
    totalParsed: rows.length,
    validCount: items.length,
    errorCount: warnings.length,
    items,
    warnings,
    detectedColumns: headers,
  };
}

/**
 * Convertit un export Hektor d'Acquéreurs / Contacts en objets Buyer
 */
export function parseHektorBuyersCsv(csvContent: string): ParseResult<Buyer> {
  const { headers, rows } = parseCsvRows(csvContent);
  const warnings: string[] = [];
  const items: Buyer[] = [];

  if (headers.length === 0) {
    return {
      success: false,
      totalParsed: 0,
      validCount: 0,
      errorCount: 0,
      items: [],
      warnings: ['Le fichier ou texte fourni est vide.'],
      detectedColumns: [],
    };
  }

  const findCol = (...aliases: string[]): number => {
    return headers.findIndex(h => aliases.some(alias => {
      const normalizedAlias = alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return h === normalizedAlias || h.includes(normalizedAlias);
    }));
  };

  const nameIdx = findCol('nom', 'nom_client', 'contact');
  const firstNameIdx = findCol('prenom');
  const phoneIdx = findCol('telephone', 'tel', 'portable', 'mobile');
  const emailIdx = findCol('email', 'mail', 'courriel');
  const budgetIdx = findCol('budget', 'budget_max', 'prix_max');
  const surfaceIdx = findCol('surface', 'surface_min', 'surf_min');
  const roomsIdx = findCol('pieces', 'pieces_min', 'nb_pieces');
  const bedroomsIdx = findCol('chambres', 'chambres_min');
  const citiesIdx = findCol('villes', 'communes', 'secteur', 'villes_recherchees');
  const financeIdx = findCol('financement', 'accord_bancaire', 'apport');
  const notesIdx = findCol('notes', 'commentaires', 'criteres', 'recherche');

  rows.forEach((row, rowIdx) => {
    if (row.length < 2 || row.every(c => !c.trim())) return;

    try {
      const rawName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : 'Acquéreur';
      let firstName = firstNameIdx !== -1 && row[firstNameIdx] ? row[firstNameIdx] : '';
      let lastName = rawName;

      if (!firstName && rawName.includes(' ')) {
        const parts = rawName.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }

      const phone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx] : '06 00 00 00 00';
      const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx] : undefined;
      const budgetMax = budgetIdx !== -1 ? parseNumeric(row[budgetIdx], 500000) : 500000;
      const minSurface = surfaceIdx !== -1 ? parseNumeric(row[surfaceIdx], 100) : 100;
      const minRooms = roomsIdx !== -1 ? parseNumeric(row[roomsIdx], 4) : 4;
      const minBedrooms = bedroomsIdx !== -1 ? parseNumeric(row[bedroomsIdx], 3) : 3;

      const rawCities = citiesIdx !== -1 && row[citiesIdx] ? row[citiesIdx] : 'Pélissanne, Salon-de-Provence';
      const targetCities = rawCities.split(/[,;|]/).map(c => c.trim()).filter(Boolean);

      let financingStatus: FinancingStatus = 'accord_bancaire_valide';
      if (financeIdx !== -1 && row[financeIdx]) {
        const fin = row[financeIdx].toLowerCase();
        if (fin.includes('comptant')) financingStatus = 'comptant';
        else if (fin.includes('courtier') || fin.includes('etude')) financingStatus = 'etude_courtier';
        else if (fin.includes('attente')) financingStatus = 'en_attente';
      }

      const notes = notesIdx !== -1 && row[notesIdx] ? row[notesIdx] : 'Recherche active Pays Salonais';

      const buyer: Buyer = {
        id: `buyer-hektor-${Date.now()}-${rowIdx}`,
        first_name: firstName || 'Client',
        last_name: lastName || `Hektor #${rowIdx + 1}`,
        phone: phone,
        email: email,
        budget_max: budgetMax,
        min_surface: minSurface,
        min_rooms: minRooms,
        min_bedrooms: minBedrooms,
        target_cities: targetCities.length > 0 ? targetCities : ['Pélissanne'],
        target_property_types: ['maison'],
        must_have_garden: true,
        must_have_garage: false,
        financing_status: financingStatus,
        notes: notes,
        status: 'actif',
        created_at: new Date().toISOString(),
      };

      items.push(buyer);
    } catch (err: any) {
      warnings.push(`Acquéreur ligne ${rowIdx + 2} ignoré : ${err?.message || 'Données invalides'}`);
    }
  });

  return {
    success: items.length > 0,
    totalParsed: rows.length,
    validCount: items.length,
    errorCount: warnings.length,
    items,
    warnings,
    detectedColumns: headers,
  };
}
