import { Property, AgencySettings } from './types';
import { formatMandateRef } from './hoguet';

/**
 * Mappe le type de bien en code numérique Poliris standard
 */
function getPolirisPropertyCode(type: string): number {
  switch (type) {
    case 'maison': return 1;
    case 'appartement': return 2;
    case 'terrain': return 3;
    case 'immeuble': return 4;
    case 'local_commercial': return 5;
    default: return 1;
  }
}

/**
 * Nettoie une chaîne de texte pour le format Poliris (supprime retours ligne et points d'exclamation)
 */
function sanitizePolirisText(text: string): string {
  if (!text) return '';
  return text
    .replace(/!/g, '/')
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .trim();
}

/**
 * Génère le contenu du fichier annonces.csv délimité par des points d'exclamation (!)
 */
export function generatePolirisAnnoncesCsv(properties: Property[], agencyCode: string = 'NEL13'): string {
  const lines = properties.map(p => {
    const mandateRef = formatMandateRef(p.mandate_number);
    const typeBienCode = getPolirisPropertyCode(p.property_type);
    const chargeHonoraires = p.fees_paid_by === 'acquereur' ? 'A' : 'V';
    const honorairesAcquereur = p.fees_paid_by === 'acquereur' ? Math.round(p.agency_fees_amount) : 0;
    const villeClean = p.city.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const titreClean = sanitizePolirisText(p.title);
    const descClean = sanitizePolirisText(p.description);

    const cols = [
      agencyCode,                                // 01: Identifiant Agence
      mandateRef,                                // 02: Référence Mandat
      'V',                                       // 03: Type de transaction (Vente)
      typeBienCode,                              // 04: Type de bien
      p.postal_code,                             // 05: Code Postal
      villeClean,                                // 06: Ville
      'FR',                                      // 07: Pays
      p.display_exact_address ? 'O' : 'N',       // 08: Adresse affichable
      Math.round(p.price_fai),                   // 09: Prix FAI
      Math.round(p.price_net_seller),            // 10: Prix Net Vendeur
      honorairesAcquereur,                       // 11: Honoraires acquéreur
      chargeHonoraires,                          // 12: Charge des honoraires
      p.living_area.toFixed(2),                  // 13: Surface habitable
      p.land_area ? p.land_area.toFixed(0) : '0',// 14: Surface terrain
      p.rooms_count,                             // 15: Nombre de pièces
      p.bedrooms_count,                          // 16: Nombre de chambres
      p.dpe_letter || 'Vierge',                  // 17: Classe DPE
      p.dpe_value ? Math.round(p.dpe_value) : 0, // 18: Valeur DPE
      p.ges_letter || 'Vierge',                  // 19: Classe GES
      p.ges_value ? Math.round(p.ges_value) : 0, // 20: Valeur GES
      titreClean,                                // 21: Titre de l'annonce
      descClean                                  // 22: Descriptif complet
    ];

    return cols.join('!');
  });

  return lines.join('\r\n');
}

/**
 * Génère le contenu du fichier photos.cfg
 */
export function generatePolirisPhotosCfg(properties: Property[]): string {
  const lines: string[] = [];

  properties.forEach(p => {
    const mandateRef = formatMandateRef(p.mandate_number);
    if (p.images && p.images.length > 0) {
      p.images.forEach((img, idx) => {
        const photoName = `${mandateRef}_${(idx + 1).toString().padStart(2, '0')}.jpg`;
        lines.push(`${mandateRef}!${photoName}!${idx + 1}`);
      });
    }
  });

  return lines.join('\r\n');
}

/**
 * Génère le fichier config.txt pour SeLoger / LeBonCoin
 */
export function generatePolirisConfigTxt(agencyCode: string = 'NEL13'): string {
  return `CLIENT=${agencyCode}\r\nVERSION=4.08\r\nDATE=${new Date().toISOString().slice(0, 10)}`;
}

/**
 * Génère le flux XML compatible Bien'ici
 */
export function generateBienIciXmlFeed(properties: Property[], settings: AgencySettings): string {
  const activeProperties = properties.filter(p => p.publish_bienici && (p.status === 'actif' || p.status === 'sous_compromis'));

  const items = activeProperties.map(p => {
    const mandateRef = formatMandateRef(p.mandate_number);
    const photosXml = (p.images || []).map((img, i) => `      <photo position="${i + 1}">${img.image_url}</photo>`).join('\n');
    
    return `  <annonce>
    <reference>${mandateRef}</reference>
    <type_transaction>vente</type_transaction>
    <type_bien>${p.property_type}</type_bien>
    <statut>${p.status}</statut>
    <titre><![CDATA[${p.title}]]></titre>
    <description><![CDATA[${p.description}]]></description>
    <prix_fai>${p.price_fai}</prix_fai>
    <prix_net_vendeur>${p.price_net_seller}</prix_net_vendeur>
    <honoraires_montant>${p.agency_fees_amount}</honoraires_montant>
    <honoraires_charge>${p.fees_paid_by}</honoraires_charge>
    <honoraires_pourcentage>${p.agency_fees_percentage}</honoraires_pourcentage>
    <surface_habitable>${p.living_area}</surface_habitable>
    <surface_terrain>${p.land_area || 0}</surface_terrain>
    <pieces>${p.rooms_count}</pieces>
    <chambres>${p.bedrooms_count}</chambres>
    <code_postal>${p.postal_code}</code_postal>
    <ville><![CDATA[${p.city}]]></ville>
    <dpe>
      <valeur>${p.dpe_value || ''}</valeur>
      <classe>${p.dpe_letter || ''}</classe>
    </dpe>
    <ges>
      <valeur>${p.ges_value || ''}</valeur>
      <classe>${p.ges_letter || ''}</classe>
    </ges>
    <photos>
${photosXml}
    </photos>
  </annonce>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<bienici_feed version="2.0">
  <agence>
    <nom>${settings.agency_name}</nom>
    <code_agence>${settings.seloger_agency_code}</code_agence>
    <carte_pro>${settings.card_t_number}</carte_pro>
    <telephone>${settings.phone}</telephone>
    <email>${settings.email}</email>
  </agence>
  <annonces>
${items}
  </annonces>
</bienici_feed>`;
}
