import { Property, SocialChannel, SocialFormat, SocialBadge, SocialPost } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

export type { SocialChannel, SocialFormat, SocialBadge, SocialPost };

export type SocialTheme = 'dark_gold' | 'provence_sun' | 'minimal_white';

export const SOCIAL_FORMATS: { id: SocialFormat; label: string; ratio: string; sub: string }[] = [
  { id: 'square', label: 'Carré 1:1', ratio: 'aspect-square', sub: 'Instagram & Facebook Feed' },
  { id: 'story', label: 'Vertical 9:16', ratio: 'aspect-9/16', sub: 'Story, Reel & TikTok' },
  { id: 'landscape', label: 'Paysage 16:9', ratio: 'aspect-16/9', sub: 'LinkedIn & Bannière' },
  { id: 'carousel', label: 'Carrousel (5p)', ratio: 'aspect-square', sub: 'Post multi-photos glissable' },
];

export const SOCIAL_BADGES: { id: SocialBadge; label: string; color: string }[] = [
  { id: 'exclusivite', label: 'EXCLUSIVITÉ NELL’IMMO', color: 'bg-[#E12B7B] text-white' },
  { id: 'nouveau', label: 'NOUVEAU MANDAT', color: 'bg-emerald-600 text-white' },
  { id: 'baisse_prix', label: 'BAISSE DE PRIX', color: 'bg-amber-600 text-white' },
  { id: 'sous_compromis', label: 'SOUS COMPROMIS', color: 'bg-blue-600 text-white' },
  { id: 'vendu', label: 'VENDU PAR NELL’IMMO', color: 'bg-[#131B26] text-[#C59A45]' },
  { id: 'coup_de_coeur', label: 'COUP DE CŒUR', color: 'bg-purple-600 text-white' },
];

export const SOCIAL_THEMES: { id: SocialTheme; label: string; bgClass: string; textClass: string }[] = [
  { id: 'dark_gold', label: 'Nuit & Or Prestige', bgClass: 'bg-[#131B26]', textClass: 'text-white' },
  { id: 'provence_sun', label: 'Provençal Solaire', bgClass: 'bg-[#FFFDF9]', textClass: 'text-[#131B26]' },
  { id: 'minimal_white', label: 'Minimaliste Épuré', bgClass: 'bg-white', textClass: 'text-gray-900' },
];

export function getBadgeLabel(badge: SocialBadge): string {
  return SOCIAL_BADGES.find((b) => b.id === badge)?.label || 'EXCLUSIVITÉ';
}

/**
 * Générateur de texte de post calibré spécifiquement pour chaque réseau social.
 */
export function generateSocialCopy(
  property: Property,
  channel: SocialChannel,
  badge: SocialBadge
): string {
  const mandateRef = formatMandateRef(property.mandate_number);
  const badgeText = getBadgeLabel(badge);
  const priceFormatted = `${property.price_fai.toLocaleString('fr-FR')} € FAI`;
  const featuresText = property.features.slice(0, 4).join(' • ') || 'Prestations soignées';

  if (channel === 'instagram') {
    return `✨ [${badgeText}] — ${property.title} ✨

📍 ${property.city} (${property.postal_code})
🏡 ${property.living_area} m² • ${property.rooms_count} pièces • ${property.bedrooms_count} chambres
🌿 Atouts : ${featuresText}
💰 Prix : ${priceFormatted}

Un cadre de vie privilégié baigné de lumière provençale, proposé avec la signature Nell’Immo.

📩 Envie d’en savoir plus ou d’organiser une visite privée ?
Envoyez-nous un message privé ou cliquez sur le lien en bio !
Réf. mandat : #${mandateRef}

#immobilier #provence #${property.city.toLowerCase().replace(/[^a-z0-9]/g, '')} #nellimmo #agencenellimmo #exclusivite #maisonavendre #immobilierprovence #coupdecoeur`;
  }

  if (channel === 'facebook') {
    return `🏡 NOUVELLE OPPORTUNITÉ EN PROVENCE : ${property.title}

📍 Commune prisée de ${property.city} (${property.postal_code})
📐 Surface habitable : ${property.living_area} m²
🛏️ Chambres : ${property.bedrooms_count}
🌳 Prestations : ${featuresText}
💶 Prix de présentation : ${priceFormatted} (honoraires agence inclus)

${property.description.slice(0, 220)}...

👉 Retrouvez le dossier complet, l’ensemble des photos haute définition et les diagnostics sur notre site officiel :
https://www.nellimmo.fr/biens/${property.id}

📞 Nelly Fernandez — SASU Nell’Immo : 07 55 68 61 09
Réf. mandat : #${mandateRef}`;
  }

  if (channel === 'linkedin') {
    return `🏛️ Opportunité Immobilière & Patrimoine | ${property.city} (${property.postal_code})

SASU Nell’Immo présente à la commercialisation :
${property.title} (${priceFormatted})

Spécifications de l'actif :
• Surface habitable : ${property.living_area} m² (${property.rooms_count} pièces, ${property.bedrooms_count} chambres)
• Classe énergétique DPE : ${property.dpe_letter || 'En cours'}
• Prestations majeures : ${featuresText}
• Réf. Mandat : #${mandateRef}

Dans un marché immobilier où la qualité intrinsèque du bâti et l’emplacement priment, ce bien réunit les fondamentaux d’un investissement pérenne ou d’une résidence principale de grande valeur.

Dossier confidentiel et échanges directs disponibles auprès de Nelly Fernandez, directrice d'agence.
Contact : nellimmo.acte@gmail.com | 07 55 68 61 09`;
  }

  // TikTok / Reel script minuté
  return `🎬 SCRIPT VIDÉO REEL / TIKTOK (Format 35 secondes)

[00:00 - 00:03] HOOK ACCROCHE :
(Plan façade ou vue panoramique avec texte à l'écran)
« Stop ! Si vous cherchez la maison parfaite à ${property.city}, regardez ça... »

[00:04 - 00:12] PIÈCE DE VIE :
(Plan traveling fluide vers le salon baigné de soleil)
« Bienvenue dans ce superbe bien de ${property.living_area} m². Remarquez cette luminosité et ces volumes exceptionnels ! »

[00:13 - 00:22] ESPACE EXTÉRIEUR / SUITE :
(Plan sur la terrasse ou la piscine / cuisine)
« Côté prestations : ${featuresText}. Un véritable havre de paix au calme absolu. »

[00:23 - 00:35] PRIX & CALL TO ACTION :
(Plan Nelly ou vue extérieure crépuscule + badge prix)
« Proposé à ${priceFormatted} FAI par Nell’Immo. Pour la visiter avant tout le monde, commentez "VISITE" ou écrivez-nous en DM ! »`;
}
