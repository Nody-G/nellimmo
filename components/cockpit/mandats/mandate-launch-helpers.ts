import type { Property } from '@/lib/types';

export interface LaunchPackContent {
  alurPortalAd: string;
  neighborhoodFlyer: string;
  socialInstagram: string;
  socialLinkedIn: string;
  visitCheatSheet: string;
}

export function generateMandateLaunchPack(property: Property): LaunchPackContent {
  const priceFormatted = property.price_fai.toLocaleString('fr-FR');
  const feesAmount = property.agency_fees_amount.toLocaleString('fr-FR');
  const feesPayer = property.fees_paid_by === 'vendeur' ? 'charge vendeur' : 'charge acquéreur';
  const priceNet = (property.price_net_seller || (property.price_fai - property.agency_fees_amount)).toLocaleString('fr-FR');
  const livingArea = property.living_area || 0;
  const bedrooms = property.bedrooms_count || 0;
  const rooms = property.rooms_count || 0;
  const landArea = property.land_area ? `${property.land_area} m² arboré` : 'Extérieur soigné';

  const alurPortalAd = `🏡 EN EXCLUSIVITÉ NELL’IMMO — ${property.title.toUpperCase()} À ${property.city.toUpperCase()}

Découvrez cette opportunité située au calme absolu, à proximité immédiate des commodités de ${property.city}.

✨ CARACTÉRISTIQUES PRINCIPALES :
• Surface habitable : ${livingArea} m² (${rooms} pièces, ${bedrooms} chambres)
• Terrain : ${landArea}
• Pièce de vie lumineuse avec exposition privilégiée
• Prestations soignées, climat de Provence recherché

📊 INFORMATIONS JURIDIQUES & LOI ALUR :
• Prix : ${priceFormatted} € FAI (Honoraires d’agence inclus : ${feesAmount} € TTC, ${feesPayer})
• Prix net vendeur : ${priceNet} €
• DPE : Classe ${property.dpe_letter || 'C'} | GES : Classe ${property.ges_letter || 'A'}
• Estimation des dépenses annuelles d’énergie : entre 900 € et 1 300 € / an
• Risques disponibles sur Géorisques : www.georisques.gouv.fr

Contact direct et visites privées :
Nelly • Nell’Immo Pélissanne & Pays Salonais
📞 06 12 34 56 78 • Carte pro CPI 1310 2024`;

  const neighborhoodFlyer = `📬 CHERS VOISINS DE ${property.city.toUpperCase()}

Un proche ou une connaissance recherche une maison dans votre quartier ?

Nelly (Agence Nell’Immo Pélissanne) vient de se voir confier la vente de :
📍 ${property.title} (${livingArea} m² • ${bedrooms} ch)
🏷️ Proposé à ${priceFormatted} € FAI

Avant la diffusion sur les portails nationaux, les habitants du secteur bénéficient d’une priorité pour visiter.

Vous connaissez quelqu’un qui rêve de s’installer ici ?
Contactez Nelly en direct au 06 12 34 56 78.`;

  const socialInstagram = `✨ NOUVEAUTÉ EN AVANT-PREMIÈRE à ${property.city} 🌿

Coup de cœur pour ce nouveau bien confié à l’agence Nell’Immo !

🏡 ${property.title}
📐 ${livingArea} m² | 🛏️ ${bedrooms} chambres | 🌳 ${landArea}
🏷️ ${priceFormatted} € FAI

Une atmosphère provençale unique, du calme et de la lumière.

📩 Envoyez "VISITE" en DM pour recevoir la vidéo et la fiche avant diffusion portails !

#Pelissanne #ImmobilierProvence #NellImmo #MaisonProvence #SalonDeProvence #PaysSalonais`;

  const socialLinkedIn = `[Transaction Résidentielle] — Nouveau mandat confié à Nell’Immo

📍 Localisation : ${property.city} (${property.postal_code})
📐 Typologie : ${property.property_type.toUpperCase()} • ${livingArea} m² • ${rooms} pièces
💶 Valorisation : ${priceFormatted} € FAI

Accompagnement rigoureux de nos clients vendeurs : audit de valeur DVF, validation de la solvabilité des acquéreurs et conformité juridique Loi Hoguet & ALUR.

#Immobilier #Provence #Pélissanne #NellImmo #Investissement`;

  const visitCheatSheet = `📋 AIDE-MÉMOIRE VISITE — ${property.title}
• Adresse : ${property.address || property.city}
• Vendeur : ${property.seller_name} (${property.seller_phone})
• Prix FAI : ${priceFormatted} € | Prix Net Vendeur : ${priceNet} €
• Cadastre : Section ${property.cadastral_section || 'AC'} n°${property.cadastral_number || '1'}
• Points forts : Emplacement calme, luminosité, état général soigné.`;

  return {
    alurPortalAd,
    neighborhoodFlyer,
    socialInstagram,
    socialLinkedIn,
    visitCheatSheet,
  };
}
