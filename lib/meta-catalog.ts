import { Property, AgencySettings } from './types';
import { formatMandateRef } from './hoguet';

function mapPropertyTypeToMeta(type: string): string {
  switch (type) {
    case 'maison':
      return 'single_family_home';
    case 'appartement':
      return 'apartment';
    case 'terrain':
      return 'land';
    case 'immeuble':
      return 'multi_family';
    case 'local_commercial':
      return 'commercial';
    default:
      return 'other';
  }
}

/**
 * Génère le flux XML officiel Meta Product Catalog pour l'immobilier
 * (Facebook Marketplace, Instagram Shopping & Meta Dynamic Real Estate Ads).
 */
export function generateMetaRealEstateCatalog(
  properties: Property[],
  settings: AgencySettings,
  baseUrl: string = 'https://www.nellimmo.fr'
): string {
  const activeProperties = properties.filter(
    (p) =>
      (p.publish_facebook || p.publish_website) &&
      (p.status === 'actif' || p.status === 'sous_compromis')
  );

  const listings = activeProperties
    .map((p) => {
      const mandateRef = formatMandateRef(p.mandate_number);
      const metaType = mapPropertyTypeToMeta(p.property_type);
      const mainPhoto =
        p.images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
      const webUrl = p.url || `${baseUrl}/biens/${p.id}`;

      // Images secondaires Meta (jusqu'à 10)
      const secondaryImages = (p.images || [])
        .slice(1, 10)
        .map((img) => `      <image><url>${img.image_url}</url></image>`)
        .join('\n');

      return `  <listing>
    <home_listing_id>${mandateRef}</home_listing_id>
    <name><![CDATA[${p.title}]]></name>
    <description><![CDATA[${p.description}]]></description>
    <availability>for_sale</availability>
    <address format="simple">
      <component name="city"><![CDATA[${p.city}]]></component>
      <component name="postal_code">${p.postal_code}</component>
      <component name="country">France</component>
    </address>
    <price>${Math.round(p.price_fai)} EUR</price>
    <property_type>${metaType}</property_type>
    <num_beds>${p.bedrooms_count || 1}</num_beds>
    <num_baths>${p.bathrooms_count || 1}</num_baths>
    <num_units>${p.rooms_count || 1}</num_units>
    <surface_area>${p.living_area} SQ M</surface_area>
    <image>
      <url>${mainPhoto}</url>
    </image>
${secondaryImages}
    <url>${webUrl}</url>
    <agent_name><![CDATA[${settings.agent_name}]]></agent_name>
    <agent_phone>${settings.phone}</agent_phone>
    <agent_email>${settings.email}</agent_email>
  </listing>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <title><![CDATA[${settings.agency_name} - Catalogue Immobilier Meta Marketplace]]></title>
  <link>${baseUrl}</link>
${listings}
</listings>`;
}
