import { Property } from './types';
import { formatMandateRef } from './hoguet';

export type CopywritingStyle = 
  | 'signature_nelly'
  | 'prestige'
  | 'portails_standard'
  | 'pitch_whatsapp'
  | 'reseaux_sociaux'
  | 'script_video_reel'
  | 'investisseur_lmnp'
  | 'international_en'
  | 'relance_baisse_prix'
  | 'mode_libre';

export interface StyleTemplate {
  id: CopywritingStyle;
  label: string;
  badge: string;
  category: 'portails' | 'reseaux' | 'direct' | 'strategique';
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
    category: 'portails',
    description: 'Ton chaleureux, authentique, provençal avec valorisation de la lumière, du farniente et de la famille.',
  },
  {
    id: 'prestige',
    label: 'Prestige & Architecture',
    badge: 'Haut de Gamme',
    category: 'portails',
    description: 'Vocabulaire raffiné axé sur la noblesse des matériaux, les volumes et la confidentialité.',
  },
  {
    id: 'portails_standard',
    label: 'Portails (SeLoger & LeBonCoin)',
    badge: 'SEO & ALUR',
    category: 'portails',
    description: 'Format structuré, concis et optimisé pour le référencement et la conformité légale.',
  },
  {
    id: 'pitch_whatsapp',
    label: 'Pitch WhatsApp Acquéreur',
    badge: 'Alerte 1-Clic',
    category: 'direct',
    description: 'Message court et direct avec accroche personnalisée prêt à être envoyé par WhatsApp / SMS.',
  },
  {
    id: 'reseaux_sociaux',
    label: 'Post Instagram & Facebook',
    badge: 'Social Media',
    category: 'reseaux',
    description: 'Texte dynamique avec emojis élégants, mise en page aérée et hashtags locaux ciblés.',
  },
  {
    id: 'script_video_reel',
    label: 'Script Vidéo / Reel & TikTok',
    badge: 'Vidéo & Tournage',
    category: 'reseaux',
    description: 'Script chronométré 45s avec indications de cadrage caméra, b-rolls et hook initial percutant.',
  },
  {
    id: 'investisseur_lmnp',
    label: 'Pitch Investisseur & Rentabilité',
    badge: 'Chiffré & Fiscal',
    category: 'strategique',
    description: 'Analyse financière axée sur le rendement locatif brut/net, le potentiel LMNP ou division.',
  },
  {
    id: 'international_en',
    label: 'Prestige International (Anglais)',
    badge: 'Expat & International',
    category: 'portails',
    description: 'Rédaction en anglais haut de gamme pour les acquéreurs étrangers et expatriés en Provence.',
  },
  {
    id: 'relance_baisse_prix',
    label: 'Alerte Opportunité / Baisse de Prix',
    badge: 'Re-commercialisation',
    category: 'direct',
    description: 'Message de relance percutant pour réveiller les acquéreurs chauds qui hésitaient sur le prix.',
  },
  {
    id: 'mode_libre',
    label: 'Idéation Libre & Custom Prompt',
    badge: 'Sans Limites',
    category: 'strategique',
    description: 'Liberté totale : rédigez selon n\'importe quelle consigne ou idée originale sans restriction.',
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

// Helper to brainstorm 5 unexpected unique selling points
export function generateAnglesAndGems(property: Partial<Property>): string[] {
  const city = property.city || 'Pélissanne';
  const surface = property.living_area || 120;
  const land = property.land_area || 500;
  const bedrooms = property.bedrooms_count || 3;
  const dpe = property.dpe_letter || 'C';

  return [
    `🌿 L'Art de Vivre Provençal sans compromis : De beaux volumes (${surface} m² habitables) combinant le calme résidentiel de ${city} et la proximité immédiate à pied des écoles et commerces.`,
    `☀️ Économies d'Énergie & Sérénité : Excellentes performances thermiques (DPE ${dpe}) assurant des factures très maîtrisées été comme hiver.`,
    `👨‍👩‍👧‍👦 Évolution Familiale Parfaite : ${bedrooms} chambres bien distribuées avec possibilité d'aménager un espace bureau télétravail ou studio indépendant.`,
    `🏊 Oasis Extérieure Privative : Parcelle de ${land} m² intimiste sans aucun vis-à-vis gênant, parfaite pour les déjeuners sous la tonnelle et les baignades.`,
    `💎 Sécurité Patrimoniale : Bien valorisé dans un micromarché très dynamique et liquide du Pays Salonais, forte valeur de revente garantie.`,
  ];
}

// Helper to generate 8-10 catchy headlines
export function generateCatchyTitles(property: Partial<Property>): { title: string; category: string }[] {
  const city = property.city || 'Pélissanne';
  const type = property.property_type === 'maison' ? 'Villa' : 'Propriété';
  const surface = property.living_area || 120;
  const rooms = property.rooms_count || 4;

  return [
    { title: `Coup de Cœur à ${city} : ${type} Contemporaine baignée de lumière (${surface} m²)`, category: 'Émotionnel' },
    { title: `Havre de Paix en Provence : ${type} avec jardin et prestations soignées à ${city}`, category: 'Cadre de Vie' },
    { title: `Exclusivité Nell'Immo : ${type} ${rooms} pièces au calme absolu sur ${city}`, category: 'Exclusivité' },
    { title: `Opportunité Rare : Belle villa familiale ${surface} m² sans travaux à ${city}`, category: 'Prêt à Vivre' },
    { title: `Prestige & Douceur de Vivre : Superbe demeure avec extérieur d'exception à ${city}`, category: 'Haut de Gamme' },
    { title: `L'Adresse Idéale à ${city} : Proche de tout, au bout d'une impasse préservée`, category: 'Emplacement' },
    { title: `Investissement Pérenne : Maison familiale performante DPE ${property.dpe_letter || 'B'} à ${city}`, category: 'Éco-Énergie' },
    { title: `Un Bien Unique en Pays Salonais : À découvrir en avant-première avec Nell'Immo`, category: 'Rareté' },
  ];
}

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

    case 'script_video_reel': {
      return `🎬 SCRIPT VIDÉO VERTICALE (REEL / TIKTOK / SHORTS) — 45 SECONDES
Titre : Visite Privée Immersion • ${type.toUpperCase()} À ${city.toUpperCase()}

⏱️ [00:00 - 00:05] LE HOOK D'ACCROCHE
[Caméra : Travelling avant dynamique vers l'entrée ou la piscine au soleil]
Voix Nelly : « Si vous cherchez le calme absolu et la vraie douceur provençale sans aucun travaux... arrêtez de scroller, vous venez de la trouver ! »

⏱️ [00:05 - 00:18] LA PIÈCE DE VIE & LA LUMIÈRE
[Caméra : Plan large lumineux salon + cuisine ouverte avec îlot central]
Voix Nelly : « Bienvenue à ${city}. Ici, on a ${surface} m² baignés de lumière. Regardez cette ouverture sur la terrasse : la pièce à vivre est pensée pour les moments en famille et recevoir les amis en toute convivialité. »

⏱️ [00:18 - 00:30] L'ESPACE NUIT & CONFORT
[Caméra : Zoom doux sur la suite parentale et vue verdure]
Voix Nelly : « Côté nuit, ${bedrooms} belles chambres, une suite parentale cocooning et des finitions impeccables. Rien à refaire, on pose ses valises ! »

⏱️ [00:30 - 00:40] L'EXTÉRIEUR & LE FARNIENTE
[Caméra : Travelling au ras de l'eau vers la terrasse ombragée et le jardin ${land ? `de ${land}` : ''}]
Voix Nelly : « Et dehors... le silence, les cigales et ce jardin parfait pour vos soirées d'été. »

⏱️ [00:40 - 00:45] CALL TO ACTION & CONTACT
[Caméra : Face caméra Nelly souriante avec l'extérieur en arrière-plan]
Voix Nelly : « Proposée à ${price}. Les visites commencent cette semaine. Envoyez-moi un message en privé ou appelez-moi pour la découvrir avant tout le monde ! »
[Incrustation texte : Nelly Fernandez • 07 55 68 61 09 • Réf. ${mandateRef}]`;
    }

    case 'investisseur_lmnp': {
      const estimatedRent = Math.round(surface * 14.5);
      const annualRent = estimatedRent * 12;
      const grossYield = property.price_fai ? ((annualRent / property.price_fai) * 100).toFixed(2) : '5.20';

      return `📊 DOSSIER SYNTHÈSE INVESTISSEUR & STRATÉGIE PATRIMONIALE
Localisation : ${city} (${property.postal_code || '13330'}) • Micromarché Pays Salonais

1. FICHE SYNTHÉTIQUE DE L'ACTIF :
• Typologie : ${type} de ${surface} m² habitables (${rooms} pièces dont ${bedrooms} chambres)
• Foncier : ${land || 'Parcelle privative'}
• Prix d'acquisition FAI : ${price} (Réf. ${mandateRef})
• Performance énergétique : ${dpe || 'DPE classe B/C'} — Aucune restriction de location Loi Climat

2. ANALYSE FINANCIÈRE & LOCATIVE PRÉVISIONNELLE :
• Loyer mensuel estimé marché : ~${estimatedRent} € / mois
• Revenu locatif annuel brut : ~${annualRent.toLocaleString('fr-FR')} € / an
• Taux de Rentabilité Brute : ~${grossYield} %
• Stratégies recommandées :
  - Location Meublée Non Professionnelle (LMNP) : Amortissement comptable de l'actif, fiscalité quasi-nulle sur les revenus locatifs pendant 10 à 15 ans.
  - Option Colocation Haut de Gamme ou Cadres Aéronautiques (Salon / Istres / Cadarache) : Potentiel de sur-rentabilité de +25%.

3. ATTRACTION LOCATIVE DU SECTEUR :
Tension locative forte sur ${city}, vacance locative constatée < 3 semaines. Profils locataires solvables (familles, cadres, militaires et personnel hospitalier).

Contact dédié investisseurs :
Nelly FERNANDEZ — SASU NELL'IMMO (07 55 68 61 09)
Dossier financier et simulation détaillée disponibles sur demande.`;
    }

    case 'international_en': {
      return `EXCLUSIVE LISTING BY NELL'IMMO • CHARMING PROPERTY IN PROVENCE (${city.toUpperCase()})

Nestled in a peaceful and sought-after residential enclave in ${city}, this exquisite ${type} of ${surface} sq.m (${surface * 10.76 > 0 ? Math.round(surface * 10.76) : 1300} sq.ft) offers authentic Provençal elegance combined with modern comfort and exceptional natural light.

KEY HIGHLIGHTS:
• Living Area: ${surface} sq.m / ${rooms} main rooms including ${bedrooms} spacious bedrooms
• Outdoor: ${land ? `Private landscaped grounds of ${land}` : 'Private Mediterranean garden'}
• Features: ${featuresList || 'Swimming pool, scenic terrace, reversible air conditioning'}
• Condition: Turnkey property, meticulously maintained
• Energy Rating: ${property.dpe_letter ? `Class ${property.dpe_letter}` : 'Optimized energy performance'}

LOCATION & LIFESTYLE:
Ideally located in the heart of Provence, within easy reach of Aix-en-Provence (25 min), Avignon TGV Station (35 min), and Marseille Provence International Airport (30 min). Enjoy the world-famous Provençal markets, fine gastronomy, and sun-drenched lifestyle.

• Asking Price: ${price} (Agency fees included, payable by ${property.fees_paid_by === 'acquereur' ? 'buyer' : 'seller'})
• Reference: ${mandateRef}

Private virtual walkthrough and full English confidential dossier available upon request.

Personal Advisor:
Nelly FERNANDEZ — Founder & Managing Director, SASU NELL'IMMO
📞 +33 7 55 68 61 09 | ✉️ nellimmo.acte@gmail.com | 🌐 www.nellimmo.fr`;
    }

    case 'relance_baisse_prix': {
      return `Bonjour ! 🌟

C'est Nelly Fernandez de l'agence Nell'Immo.

Je reviens vers vous car vous aviez manifesté un vif intérêt pour la ${type} à ${city} (${surface} m², ${bedrooms} chambres).

Bonne nouvelle : une opportunité se présente ! Le prix vient d'être réajusté officiellement à **${price} FAI** (Réf. ${mandateRef}).

À ce tarif très attractif, le bien se repositionne nettement en-dessous des dernières ventes du quartier. Plusieurs visites ont été sollicitées pour les jours à venir.

Afin de vous donner la priorité, souhaitez-vous effectuer une contre-visite ou que je vous transmette la fiche actualisée ?

Je suis à votre écoute au 07 55 68 61 09. Belle journée !
Nelly Fernandez — Nell'Immo`;
    }

    case 'mode_libre': {
      return `ANNONCE PERSONNALISÉE SUR-MESURE • ${city.toUpperCase()}

Bien : ${type.toUpperCase()} de ${surface} m² habitables — ${bedrooms} chambres — Terrain : ${land || 'N/C'}
Prix FAI : ${price} (Réf. ${mandateRef})
Prestations clés : ${featuresList || 'Terrasse, calme, luminosité'}
${dpe}

${customNotes ? `Consignes & Angle de communication personnalisé :\n${customNotes}` : 'Rédigé sur-mesure pour mettre en valeur les atouts uniques de ce bien.'}

Description détaillée :
Située dans l'un des quartiers les plus agréables de ${city}, cette propriété se distingue par son agencement fonctionnel et son atmosphère chaleureuse. Les volumes de vie sont généreux et tournés vers le jardin arboré. 

Une opportunité exclusive à découvrir sans tarder auprès de l'agence Nell'Immo.

Contact & Visites :
Nelly FERNANDEZ — SASU NELL'IMMO (07 55 68 61 09)
26 avenue des Enjouvènes, 13330 Pélissanne`;
    }

    default:
      return '';
  }
}
