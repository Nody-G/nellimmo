import { Property } from './types';
import { formatMandateRef } from './hoguet';

export type CopywritingStyle = 
  | 'signature_nelly'
  | 'prestige'
  | 'portails_standard'
  | 'pitch_whatsapp'
  | 'reseaux_sociaux';

export interface StyleTemplate {
  id: CopywritingStyle;
  label: string;
  badge: string;
  description: string;
}

export interface TrainingExample {
  id: string;
  title: string;
  sourceText: string;
  createdAt: string;
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: 'signature_nelly',
    label: 'Signature Nelly Fernandez',
    badge: 'Chaleureux & Émotionnel',
    description: 'Ton chaleureux, authentique, provençal avec valorisation de la lumière, du farniente et de la famille.',
  },
  {
    id: 'prestige',
    label: 'Prestige & Architecture',
    badge: 'Haut de Gamme',
    description: 'Vocabulaire raffiné axé sur la noblesse des matériaux, les volumes et la confidentialité.',
  },
  {
    id: 'portails_standard',
    label: 'Portails (SeLoger & LeBonCoin)',
    badge: 'SEO & ALUR',
    description: 'Format structuré, concis et optimisé pour le référencement et la conformité légale.',
  },
  {
    id: 'pitch_whatsapp',
    label: 'Pitch WhatsApp Acquéreur',
    badge: 'Alerte 1-Clic',
    description: 'Message court et direct avec accroche personnalisée prêt à être envoyé par WhatsApp / SMS.',
  },
  {
    id: 'reseaux_sociaux',
    label: 'Post Instagram & Facebook',
    badge: 'Social Media',
    description: 'Texte dynamique avec emojis élégants, mise en page aérée et hashtags locaux ciblés.',
  },
];

export const DEFAULT_TRAINING_EXAMPLES: TrainingExample[] = [
  {
    id: 'ex-1',
    title: 'Maison Contemporaine Salon-de-Provence (Mandat 244)',
    sourceText: `Découvrez ce bijou d'architecture, pensée pour votre famille grâce à ses aménagements fonctionnels, au calme absolu et baignée d'une divine lumière. Située au bout d'une paisible impasse, à 800m du centre ville, de ses écoles privées et publiques et de toutes commodités, elle bénéficie d'une vue dominante sur ses 2 étages. Sa parcelle est parfaitement optimisée avec un espace dédié à la détente et au farniente, à l'abri des regards dans son écrin de verdure, qui s'anime autour d'une jolie piscine traditionnelle. Dès l'entrée, une incroyable lumière vous enveloppe. Une maison familiale et moderne aux performances énergétiques exceptionnelles. Je me tiens à votre disposition pour échanger sur votre projet.`,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ex-2',
    title: 'Villa Traditionnelle Pélissanne',
    sourceText: `Coup de cœur assuré pour cette élégante villa provençale située dans un quartier résidentiel très prisé de Pélissanne. Offrant une vue dégagée sur les collines environnantes, cette propriété de charme vous séduira par ses volumes généreux, sa vaste pièce de vie chaleureuse et sa cuisine équipée ouvrant sur une terrasse ombragée. L'espace extérieur paysagé avec piscine et pool-house invite à la douceur de vivre provençale. Une opportunité rare sur le marché pélissannais. Contactez Nelly Fernandez pour organiser votre visite privée.`,
    createdAt: '2026-01-15T14:30:00Z',
  }
];

export function generateListingCopy(
  property: Partial<Property>,
  style: CopywritingStyle,
  customNotes?: string
): string {
  const city = property.city || 'Pélissanne';
  const type = property.property_type === 'maison' ? 'villa' : property.property_type || 'propriété';
  const surface = property.living_area || 0;
  const land = property.land_area ? `${property.land_area} m²` : '';
  const rooms = property.rooms_count || 0;
  const bedrooms = property.bedrooms_count || 0;
  const price = property.price_fai ? `${property.price_fai.toLocaleString('fr-FR')} €` : 'Prix sur demande';
  const mandateRef = property.mandate_number ? formatMandateRef(property.mandate_number) : 'Mandat Exclusif';
  const featuresList = property.features && property.features.length > 0 ? property.features.join(', ') : '';
  const dpe = property.dpe_letter ? `DPE : classe ${property.dpe_letter} (${property.dpe_value || '-'} kWh/m²/an)` : '';
  const isExclusive = property.mandate_type === 'exclusif';

  const notesIntro = customNotes ? `\n\nParticularités & Atouts spécifiques : ${customNotes}` : '';

  switch (style) {
    case 'signature_nelly': {
      return `✨ ${isExclusive ? "EXCLUSIVITÉ NELL'IMMO" : "NOUVEAUTÉ NELL'IMMO"} • ${city.toUpperCase()} ✨

Découvrez ce véritable bijou, pensé pour le confort et l'épanouissement de votre famille. Située au calme absolu, dans un environnement privilégié et recherché de ${city}, cette ${type} de ${surface} m² habitables est baignée d'une divine lumière tout au long de la journée.

Dès le pas de la porte franchi, une sensation d'harmonie et de bien-être vous enveloppe. La vaste pièce de vie lumineuse s'ouvre harmonieusement sur les extérieurs. La cuisine aménagée et équipée constitue le cœur battant de la maison, idéal pour partager des moments conviviaux en famille ou entre amis.

Côté nuit, vous profiterez de ${bedrooms} chambres aux volumes généreux, dont une suite parentale avec rangements sur-mesure, ainsi que d'une salle de bains soignée.

${land ? `À l'extérieur, la parcelle de ${land} constitue un véritable écrin de verdure dédié à la détente et au farniente, à l'abri des regards indiscrets.` : ''}
${featuresList ? `Prestations de grande qualité : ${featuresList}.` : ''}${notesIntro}

Une propriété rare alliant cachet, fonctionnalité et douceur de vivre en Provence.

📊 Informations réglementaires & Honoraires :
• Prix FAI : ${price} (Honoraires d'agence inclus à la charge du ${property.fees_paid_by === 'acquereur' ? 'vendeur / acquéreur selon mandat' : 'vendeur'})
• Réf. ${mandateRef}
• ${dpe || 'DPE en cours'}
• Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr

Je me tiens à votre entière disposition pour échanger avec bienveillance et enthousiasme sur votre projet de vie. À très bientôt !

Nelly FERNANDEZ • SASU NELL'IMMO
Agent Immobilier Indépendant • Pays Salonais & Pélissanne
📞 07 55 68 61 09 | ✉️ nellimmo.acte@gmail.com | 🌐 www.nellimmo.fr`;
    }

    case 'prestige': {
      return `PROPRIÉTÉ DE PRESTIGE & CHARME EN PROVENCE • ${city.toUpperCase()}

Nell'Immo a le privilège de vous présenter cette demeure d'exception de ${surface} m² habitables${land ? ` édifiée sur un parc paysager de ${land}` : ''}, située dans l'un des secteurs les plus prisés de ${city}.

Cette propriété séduit instantanément par la noblesse de ses volumes, la perfection de ses finitions et sa luminosité traversante. Les espaces de réception offrent de splendides perspectives sur le jardin arboré.

L'agencement contemporain comprend ${rooms} pièces principales, dont ${bedrooms} suites élégamment agencées pour préserver l'intimité de chacun.

Les prestations haut de gamme répondent aux exigences les plus strictes : ${featuresList || 'matériaux nobles, climatisation intégrée, finitions soignées'}.${notesIntro}

Dossier complet, visite virtuelle et plans d'architecte disponibles sur demande qualifiée.

• Prix de présentation : ${price}
• Réf. ${mandateRef} - ${isExclusive ? 'Mandat Exclusif' : 'Mandat'}
• ${dpe}

Contact privilégié :
Nelly FERNANDEZ — Présidente SASU NELL'IMMO
Carte T : CPI 1310 2019 000 042 974 (CCI Marseille Provence)
Téléphone : 07 55 68 61 09`;
    }

    case 'portails_standard': {
      return `À VENDRE à ${city} (${property.postal_code || '13330'}) : ${property.title || `${type.toUpperCase()} ${rooms} PIÈCES ${surface} M²`}

Idéalement située à proximité immédiate des commodités, écoles et accès, cette ${type} de ${surface} m² habitables sur ${land || 'terrain privatif'} comprend :

- Vaste séjour / salle à manger lumineux
- Cuisine aménagée et équipée
- ${bedrooms} chambres spacieuses avec rangements
- Salle de bains / salle d'eau
- ${featuresList || 'Terrasse, stationnement privatif'}
${notesIntro}

Points forts du bien :
✔ Emplacement privilégié au calme
✔ Excellente distribution des espaces
✔ ${property.dpe_letter ? `Performance énergétique optimale (DPE ${property.dpe_letter})` : 'Parfait état général'}

Informations Loi ALUR & Tarif :
Prix honoraires inclus : ${price}
Honoraires d'agence : ${property.agency_fees_percentage || 3.9}% TTC à la charge du ${property.fees_paid_by || 'vendeur'}.
Réf. annonce : ${mandateRef}
${dpe}
Montant estimé des dépenses annuelles d'énergie : entre ${property.energy_cost_min || 600} € et ${property.energy_cost_max || 950} € par an.
Les informations sur les risques sont consultables sur www.georisques.gouv.fr

Pour toute information complémentaire ou organiser une visite, contactez Nelly Fernandez au 07 55 68 61 09 (Agence Nell'Immo Pélissanne).`;
    }

    case 'pitch_whatsapp': {
      return `Bonjour ! 🌿 

Nelly de l'agence Nell'Immo. Je viens de rentrer un nouveau bien exclusif qui correspond tout à fait à vos critères de recherche :

📍 ${city}
🏡 ${property.property_type === 'maison' ? 'Belle villa' : 'Appartement'} de ${surface} m² • ${bedrooms} chambres ${land ? `• Terrain ${land}` : ''}
${featuresList ? `✨ Atouts : ${featuresList}` : ''}
💶 Prix FAI : ${price}

Le bien bénéficie d'une superbe luminosité et d'un environnement très calme.

Souhaitez-vous que je vous envoie la fiche complète avec photos avant diffusion officielle, ou caler un créneau de visite en avant-première ?

Bien à vous,
Nelly Fernandez (07 55 68 61 09)`;
    }

    case 'reseaux_sociaux': {
      return `🌿 NOUVEAUTÉ EN EXCLUSIVITÉ CHEZ NELL'IMMO 🌿

Coup de cœur assuré pour cette superbe ${type} située à ${city} ! ✨

Une maison chaleureuse, lumineuse et parfaitement pensée pour la vie de famille :
📐 ${surface} m² habitables
🛏️ ${bedrooms} chambres
🌳 ${land ? `Terrain de ${land}` : 'Extérieur soigné'}
${property.features?.includes('Piscine') ? '🏊 Piscine & espace farniente' : '☀️ Terrasses ensoleillées'}
📍 Secteur calme et très recherché

💶 Proposée à ${price} (Réf. ${mandateRef})

💬 Vous souhaitez organiser une visite privée ou recevoir le dossier complet ?
Laissez un commentaire ou contactez-moi directement :
📱 07 55 68 61 09
✉️ nellimmo.acte@gmail.com
🌐 www.nellimmo.fr

#Nellimmo #NellyFernandez #ImmobilierProvence #Pelissanne #SalonDeProvence #Lambesc #MaisonAVendre #VillaProvençale #ExclusiviteImmobiliere #AchatMaison #Provence`;
    }

    default:
      return '';
  }
}
