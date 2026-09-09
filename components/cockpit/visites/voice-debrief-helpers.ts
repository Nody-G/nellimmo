import type { Property } from '@/lib/types';
import type { VisitorSentiment } from '@/components/cockpit/visites/visites-types';

export interface DebriefData {
  propertyId: string;
  buyerName: string;
  buyerPhone: string;
  sentiment: VisitorSentiment;
  strengths: string;
  objections: string;
  rawNotes: string;
}

/** Formate un SMS / WhatsApp rassurant et professionnel pour le propriétaire vendeur */
export function generateVendorDebriefWhatsApp(
  property: Property | undefined,
  data: DebriefData
): string {
  const vendorName = property?.seller_name || 'Madame, Monsieur';
  const sentimentMap: Record<VisitorSentiment, string> = {
    coup_de_coeur: 'Un véritable coup de cœur ! Le bien correspond en tout point à leurs attentes.',
    interesse: 'Très bon ressenti général. Le bien fait partie de leur shortlist prioritaire.',
    neutre: 'Visite attentive. Ils comparent avec un autre bien du secteur.',
    refus: 'Le bien ne correspond pas tout à fait à leurs critères spécifiques.',
  };

  const pointsFortsText = data.strengths.trim()
    ? `\n✨ Points particulièrement appréciés : ${data.strengths.trim()}`
    : '';

  const objectionsText = data.objections.trim()
    ? `\n💡 Remarques / points à étudier : ${data.objections.trim()}`
    : '';

  return (
    `Bonjour ${vendorName},\n\n` +
    `Je viens d’achever la visite de votre bien à ${property?.city || 'Pélissanne'} avec ${data.buyerName || 'un acquéreur qualifié'}.\n\n` +
    `📌 Impression générale : ${sentimentMap[data.sentiment]}` +
    pointsFortsText +
    objectionsText +
    `\n\nJe recontacte les acquéreurs sous 48h pour le débriefing financier et vous tiens immédiatement informé(e) de la suite.\n\n` +
    `Bien à vous,\nNelly • Nell’Immo`
  );
}

/** Génère un lien direct WhatsApp */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const intlPhone = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;
}
