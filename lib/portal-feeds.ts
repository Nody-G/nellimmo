import { Property, AgencySettings } from './types';
import { formatMandateRef } from './hoguet';

/**
 * Générateurs de flux pour les passerelles portails additionnelles.
 *
 * ⚠️ HONNÊTETÉ FONCTIONNELLE : ces générateurs produisent des fichiers
 * d'export réels et exploitables (CSV / XML) au format attendu par chaque
 * portail. Ils ne PRÉTENDENT PAS déposer les fichiers sur un serveur distant :
 * le dépôt SFTP/API reste à la charge de l'agence (ou d'un backend dédié).
 * L'objectif est de fournir à Nelly un export immédiat, sans dépendre de
 * Supabase ni d'un abonnement à une passerelle tierce (Ubiflow, Hektor, etc.).
 *
 * Tous les flux fonctionnent en mode « local-first » : les données proviennent
 * de la session navigateur et sont transmises par POST à la route de
 * téléchargement, qui génère le fichier à la volée.
 */

/** Échappe une valeur pour un champ CSV délimité par des points-virgules. */
function csvCell(value: string | number | undefined | null): string {
    if (value === undefined || value === null) return '';
    const str = String(value).replace(/;/g, ',').replace(/(\r\n|\n|\r)/gm, ' ').trim();
    return str;
}

/** Échappe une valeur pour un contenu XML (CDATA non utilisé ici). */
function xmlEscape(value: string | number | undefined | null): string {
    if (value === undefined || value === null) return '';
    const amp = String.fromCharCode(38);
    const entities: Record<string, string> = {
        [amp]: amp + 'amp;',
        '<': amp + 'lt;',
        '>': amp + 'gt;',
        '"': amp + 'quot;',
        "'": amp + 'apos;',
    };
    return String(value).replace(/[&<>"']/g, (ch) => entities[ch] ?? ch);
}

/** Filtre les biens réellement diffusables sur un canal donné. */
function selectProperties(
    properties: Property[],
    predicate: (p: Property) => boolean | undefined
): Property[] {
    return properties.filter(
        (p) =>
            Boolean(predicate(p)) &&
            (p.status === 'actif' || p.status === 'sous_compromis')
    );
}

/** Construit la liste des URLs photos d'un bien (max `limit`). */
function photoUrls(property: Property, limit = 15): string[] {
    return (property.images || [])
        .slice(0, limit)
        .map((img) => img.image_url)
        .filter(Boolean);
}

// ---------------------------------------------------------------------------
// LeBonCoin (LBC Pro) — CSV d'import
// ---------------------------------------------------------------------------

/**
 * Génère un CSV d'import LeBonCoin Pro.
 *
 * Le format reprend les colonnes attendues par l'outil d'import LBC Pro
 * (référence, catégorie, type de bien, localisation, prix, surfaces, DPE/GES,
 * description, photos). Les colonnes sont séparées par des points-virgules et
 * encodées en UTF-8, conformément aux imports LBC.
 */
export function generateLeBonCoinCsv(
    properties: Property[],
    settings: AgencySettings
): string {
    const active = selectProperties(properties, (p) => p.publish_leboncoin);

    const headers = [
        'reference',
        'type_annonce',
        'categorie',
        'type_bien',
        'titre',
        'description',
        'adresse',
        'code_postal',
        'ville',
        'pays',
        'prix',
        'surface_habitable',
        'surface_terrain',
        'pieces',
        'chambres',
        'salles_de_bain',
        'dpe_classe',
        'dpe_valeur',
        'ges_classe',
        'ges_valeur',
        'honoraires_charge',
        'honoraires_montant',
        'telephone',
        'email',
        'photos',
    ];

    const rows = active.map((p) => {
        const ref = formatMandateRef(p.mandate_number);
        const photos = photoUrls(p).join('|');
        return [
            ref,
            'vente',
            'immobilier',
            p.property_type,
            p.title,
            p.description,
            p.display_exact_address ? p.address : p.city,
            p.postal_code,
            p.city,
            'France',
            Math.round(p.price_fai),
            p.living_area,
            p.land_area || 0,
            p.rooms_count,
            p.bedrooms_count,
            p.bathrooms_count || 0,
            p.dpe_letter || '',
            p.dpe_value || '',
            p.ges_letter || '',
            p.ges_value || '',
            p.fees_paid_by,
            Math.round(p.agency_fees_amount),
            settings.phone,
            settings.email,
            photos,
        ]
            .map(csvCell)
            .join(';');
    });

    return [headers.join(';'), ...rows].join('\r\n');
}

// ---------------------------------------------------------------------------
// Figaro Immo — XML
// ---------------------------------------------------------------------------

/**
 * Génère un flux XML pour Figaro Immo / Belles Demeures.
 *
 * Structure `<annonces>` avec un nœud `<annonce>` par bien. Le flux est
 * volontairement générique et lisible : il peut être déposé tel quel sur un
 * espace partenaire ou transmis à la rédaction Figaro Immo.
 */
export function generateFigaroXmlFeed(
    properties: Property[],
    settings: AgencySettings
): string {
    const active = selectProperties(properties, (p) => p.publish_figaro);

    const items = active
        .map((p) => {
            const ref = formatMandateRef(p.mandate_number);
            const photos = photoUrls(p)
                .map((url, i) => `      <photo position="${i + 1}">${xmlEscape(url)}</photo>`)
                .join('\n');

            return `  <annonce>
    <reference>${xmlEscape(ref)}</reference>
    <type_transaction>vente</type_transaction>
    <type_bien>${xmlEscape(p.property_type)}</type_bien>
    <titre>${xmlEscape(p.title)}</titre>
    <description>${xmlEscape(p.description)}</description>
    <adresse>${xmlEscape(p.display_exact_address ? p.address : p.city)}</adresse>
    <code_postal>${xmlEscape(p.postal_code)}</code_postal>
    <ville>${xmlEscape(p.city)}</ville>
    <pays>France</pays>
    <prix>${Math.round(p.price_fai)}</prix>
    <prix_net_vendeur>${Math.round(p.price_net_seller)}</prix_net_vendeur>
    <honoraires_montant>${Math.round(p.agency_fees_amount)}</honoraires_montant>
    <honoraires_charge>${xmlEscape(p.fees_paid_by)}</honoraires_charge>
    <surface_habitable>${p.living_area}</surface_habitable>
    <surface_terrain>${p.land_area || 0}</surface_terrain>
    <pieces>${p.rooms_count}</pieces>
    <chambres>${p.bedrooms_count}</chambres>
    <salles_de_bain>${p.bathrooms_count || 0}</salles_de_bain>
    <dpe classe="${xmlEscape(p.dpe_letter || '')}">${p.dpe_value || ''}</dpe>
    <ges classe="${xmlEscape(p.ges_letter || '')}">${p.ges_value || ''}</ges>
    <prestige>${p.price_fai >= 400000 ? 'oui' : 'non'}</prestige>
    <photos>
${photos}
    </photos>
  </annonce>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<figaro_immo_feed version="1.0">
  <agence>
    <nom>${xmlEscape(settings.agency_name)}</nom>
    <agent>${xmlEscape(settings.agent_name)}</agent>
    <carte_pro>${xmlEscape(settings.card_t_number)}</carte_pro>
    <telephone>${xmlEscape(settings.phone)}</telephone>
    <email>${xmlEscape(settings.email)}</email>
    <ville>${xmlEscape(settings.city)}</ville>
  </agence>
  <annonces>
${items}
  </annonces>
</figaro_immo_feed>`;
}

// ---------------------------------------------------------------------------
// Green-Acres — XML (clientèle internationale)
// ---------------------------------------------------------------------------

/**
 * Génère un flux XML pour Green-Acres (portail européen / clientèle
 * internationale). Les libellés sont en anglais pour correspondre à l'audience
 * du portail, avec les champs de localisation et de prix en EUR.
 */
export function generateGreenAcresXmlFeed(
    properties: Property[],
    settings: AgencySettings
): string {
    const active = selectProperties(properties, (p) => p.publish_greenacres);

    const items = active
        .map((p) => {
            const ref = formatMandateRef(p.mandate_number);
            const photos = photoUrls(p)
                .map((url, i) => `      <image position="${i + 1}">${xmlEscape(url)}</image>`)
                .join('\n');

            return `  <property>
    <reference>${xmlEscape(ref)}</reference>
    <transaction_type>sale</transaction_type>
    <property_type>${xmlEscape(p.property_type)}</property_type>
    <title>${xmlEscape(p.title)}</title>
    <description>${xmlEscape(p.description)}</description>
    <location>
      <address>${xmlEscape(p.display_exact_address ? p.address : p.city)}</address>
      <postal_code>${xmlEscape(p.postal_code)}</postal_code>
      <city>${xmlEscape(p.city)}</city>
      <country>France</country>
      <latitude>${p.latitude ?? ''}</latitude>
      <longitude>${p.longitude ?? ''}</longitude>
    </location>
    <price currency="EUR">${Math.round(p.price_fai)}</price>
    <living_area unit="m2">${p.living_area}</living_area>
    <land_area unit="m2">${p.land_area || 0}</land_area>
    <rooms>${p.rooms_count}</rooms>
    <bedrooms>${p.bedrooms_count}</bedrooms>
    <bathrooms>${p.bathrooms_count || 0}</bathrooms>
    <energy>
      <dpe class="${xmlEscape(p.dpe_letter || '')}">${p.dpe_value || ''}</dpe>
      <ges class="${xmlEscape(p.ges_letter || '')}">${p.ges_value || ''}</ges>
    </energy>
    <images>
${photos}
    </images>
    <agent>
      <name>${xmlEscape(settings.agent_name)}</name>
      <phone>${xmlEscape(settings.phone)}</phone>
      <email>${xmlEscape(settings.email)}</email>
    </agent>
  </property>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<green_acres_feed version="1.0">
  <agency>
    <name>${xmlEscape(settings.agency_name)}</name>
    <city>${xmlEscape(settings.city)}</city>
    <phone>${xmlEscape(settings.phone)}</phone>
    <email>${xmlEscape(settings.email)}</email>
  </agency>
  <properties>
${items}
  </properties>
</green_acres_feed>`;
}

// ---------------------------------------------------------------------------
// PAP (De Particulier à Particulier) — XML
// ---------------------------------------------------------------------------

/**
 * Génère un flux XML pour PAP. PAP est un portail grand public français très
 * consulté ; le flux reprend les champs essentiels attendus (référence, type,
 * localisation, prix, surfaces, DPE/GES, photos).
 */
export function generatePapXmlFeed(
    properties: Property[],
    settings: AgencySettings
): string {
    const active = selectProperties(properties, (p) => p.publish_pap);

    const items = active
        .map((p) => {
            const ref = formatMandateRef(p.mandate_number);
            const photos = photoUrls(p)
                .map((url, i) => `      <photo position="${i + 1}">${xmlEscape(url)}</photo>`)
                .join('\n');

            return `  <annonce>
    <reference>${xmlEscape(ref)}</reference>
    <type_transaction>vente</type_transaction>
    <type_bien>${xmlEscape(p.property_type)}</type_bien>
    <titre>${xmlEscape(p.title)}</titre>
    <description>${xmlEscape(p.description)}</description>
    <code_postal>${xmlEscape(p.postal_code)}</code_postal>
    <ville>${xmlEscape(p.city)}</ville>
    <adresse>${xmlEscape(p.display_exact_address ? p.address : p.city)}</adresse>
    <prix>${Math.round(p.price_fai)}</prix>
    <honoraires_montant>${Math.round(p.agency_fees_amount)}</honoraires_montant>
    <honoraires_charge>${xmlEscape(p.fees_paid_by)}</honoraires_charge>
    <surface_habitable>${p.living_area}</surface_habitable>
    <surface_terrain>${p.land_area || 0}</surface_terrain>
    <pieces>${p.rooms_count}</pieces>
    <chambres>${p.bedrooms_count}</chambres>
    <dpe classe="${xmlEscape(p.dpe_letter || '')}">${p.dpe_value || ''}</dpe>
    <ges classe="${xmlEscape(p.ges_letter || '')}">${p.ges_value || ''}</ges>
    <photos>
${photos}
    </photos>
    <contact>
      <agence>${xmlEscape(settings.agency_name)}</agence>
      <telephone>${xmlEscape(settings.phone)}</telephone>
      <email>${xmlEscape(settings.email)}</email>
    </contact>
  </annonce>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<pap_feed version="1.0">
  <agence>
    <nom>${xmlEscape(settings.agency_name)}</nom>
    <carte_pro>${xmlEscape(settings.card_t_number)}</carte_pro>
    <telephone>${xmlEscape(settings.phone)}</telephone>
    <email>${xmlEscape(settings.email)}</email>
  </agence>
  <annonces>
${items}
  </annonces>
</pap_feed>`;
}
