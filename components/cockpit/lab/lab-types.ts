import type { Property } from '@/lib/types';

export type LabMode = 'ideation' | 'negotiation' | 'legal_clauses' | 'vip_events';

export interface LabPreset {
  mode: LabMode;
  title: string;
  prompt: string;
}

export const LAB_PRESETS: LabPreset[] = [
  {
    mode: 'ideation',
    title: '5 Idées Innovantes pour Réveiller un Mandat Endormi (>60j)',
    prompt: 'Propose 5 actions marketing percutantes et non conventionnelles pour relancer un mandat de maison provençale sans baisser le prix brutalement.',
  },
  {
    mode: 'ideation',
    title: 'Opération Chasseur Foncier : Détection de Parcelles Piscines & Divisions',
    prompt: 'Comment aborder les propriétaires de grandes parcelles de 1500m²+ à Pélissanne pour leur proposer une division parcellaire créatrice de valeur ?',
  },
  {
    mode: 'negotiation',
    title: 'Contre-Attaque Face à une Offre Agressive à -10%',
    prompt: 'Un acheteur formule une offre écrite à 430 000 € sur un bien affiché à 475 000 €. Rédige la réponse psychologique pour ramener l\'acheteur à 462 000 € sans froisser le vendeur.',
  },
  {
    mode: 'legal_clauses',
    title: 'Clause Suspensive de Division Parcellaire Sécurisée',
    prompt: 'Rédige une clause suspensive rédigée avec rigueur juridique notariale pour conditionner un compromis à l\'obtention d\'une déclaration préalable de division sans recours des tiers.',
  },
  {
    mode: 'vip_events',
    title: 'Organisation d\'une Soirée VIP Nocturne "Aperitivo & Visite"',
    prompt: 'Génère le déroulé opérationnel complet et le texte d\'invitation WhatsApp pour une visite nocturne exclusive avec dégustation de vin des Coteaux d\'Aix.',
  },
];

export function generateLabFallbackOutput(mode: LabMode, property: Property | undefined): string {
  const city = property?.city || 'Pélissanne';
  const title = property?.title || 'Villa Provençale';
  const price = property?.price_fai ? property.price_fai.toLocaleString('fr-FR') + ' €' : '480 000 €';

  if (mode === 'ideation') {
    return `💡 PLAN D'ACTION STRATÉGIQUE & IDÉES DISRUPTIVES — NELL'IMMO
Bien ciblé : ${title} (${city})

1. Vente Privée en Nocturne "Lumières & Saveurs de Provence"
Organiser une visite sur invitation exclusive à l'heure dorée (19h-21h) avec mise en lumière du jardin, bougies au bord de la piscine et dégustation de produits du terroir salonais. L'ambiance olfactive et visuelle désinhibe la négociation.

2. Démarcheur "Voisins Ambassadeurs"
Envoyer un courrier haut de gamme et un flyer soigné aux 40 voisins les plus proches : « Vous aimez votre quartier ? Choisissez vous-même votre futur voisin ! ». 15% des acquéreurs proviennent de la recommandation de l'entourage immédiat.

3. Projection Architecturale 3D "Potentiel Révélé"
Si le bien nécessite un rafraîchissement, fournir un devis chiffré par un artisan local partenaire de confiance et 2 plans 3D avant/après. L'acheteur n'achète plus des doutes, mais un projet clés en main.

4. Vidéo Teaser "Immersion dans les Collines"
Tournage d'un Reel dynamique de 45 secondes axé sur le style de vie (bruit des cigales, marché du dimanche à Pélissanne à pied, apéritif sous la tonnelle) plutôt qu'un simple inventaire de pièces.

5. Campagne Ciblée Cadres TGV Aix / Marseille
Cibler les acquéreurs en télétravail quittant les métropoles saturées pour la quiétude provençale, avec mise en avant du temps de trajet Gare TGV d'Aix (30 min) et de la fibre optique installée.`;
  }

  if (mode === 'negotiation') {
    return `🛡️ PROTOCOLE DE NÉGOCIATION & CONTRE-OFFRE TACTIQUE
Bien : ${title} (${city}) — Prix affiché : ${price}

ANALYSE PSYCHOLOGIQUE :
L'acheteur teste la fermeté du vendeur. Accepter immédiatement dévalue le bien ; refuser sèchement brise le lien.

STRATÉGIE RETENUE : LA CONCESSION SYMBOLIQUE FERME (+ ARGUMENTAIRE DVF)

Argumentaire téléphonique pour l'acquéreur :
« Bonjour Monsieur l'acquéreur, j'ai présenté votre offre à mes mandants. Ils apprécient la qualité de votre profil mais ne peuvent donner une suite favorable en l'état : le prix a été calé rigoureusement sur les transactions réelles DVF enregistrées par les notaires dans le quartier.
Néanmoins, pour vous témoigner de leur bienveillance et concrétiser avec vous, ils sont prêts à faire un geste d'équité en vous accordant une remise technique de 2.5%, à la condition expresse que le compromis soit signé sous 8 jours avec validation définitive de votre plan de financement. »

Script de recadrage écrit pour le vendeur :
« Chers vendeurs, nous avons la main. Cette première offre prouve que le bien intéresse. En contre-proposant fermement, nous forçons l'acheteur à remonter sur le bon palier sans perdre notre exclusivité. »`;
  }

  if (mode === 'legal_clauses') {
    return `⚖️ CLAUSE CONTRACTUELLE SUR-MESURE (CODE CIVIL & HOGUET)

INTITULÉ : CONDITION SUSPENSIVE PARTICULIÈRE DE DIVISION PARCELLAIRE

« La présente convention est expressément soumise à la condition suspensive de l'obtention, par le BENEFICIAIRE ou par le PROMETTANT, d'une décision de non-opposition à Déclaration Préalable de division délivrée par la Mairie de ${city}, autorisant le détachement d'un lot à bâtir d'une superficie approximative de [Surface] m², conformément au plan de bornage dressé par géomètre-expert.

Cette décision devra être exempte de tout recours gracieux ou contentieux émanant de tiers ou de l'autorité préfectorale, le constat de non-recours étant attesté soit par certificat administratif, soit par huissier de justice après écoulement du délai de deux mois d'affichage continu sur le terrain.

En cas de refus définitif ou de recours non purgé à l'expiration du délai de [Nombre] mois à compter de ce jour, les présentes seront réputées nulles et non avenues, chaque partie reprenant sa pleine liberté sans indemnité de part ni d'autre. »`;
  }

  return `🎉 KIT DE LANCEMENT D'ÉVÉNEMENT IMMOBILIER VIP
Concept : Vente Privée en Avant-Première — Résidence & Charme

INVITATION WHATSAPP / SMS VENDEURS & ACQUÉREURS SÉLECTIONNÉS :
« Bonsoir [Prénom], vous faites partie de nos acquéreurs privilégiés.
Ce jeudi à 18h30, l'agence Nell'Immo vous ouvre les portes en exclusivité d'une propriété d'exception à ${city} avant toute diffusion publique sur les portails.
Au programme : visite libre au crépuscule, échange convivial autour d'une dégustation de vins du Domaine local, et découverte du dossier technique complet.
Nombre de places limité à 6 foyers. Merci de me confirmer votre présence par retour de message avant mardi soir. Nelly Fernandez (07 55 68 61 09). »

CHECKLIST DU JOUR J :
□ 17h00 : Arrivée sur place, aération, allumage des éclairages d'ambiance et piscine
□ 17h30 : Mise en place du buffet provençal (fougasses, tapenade, verres à pied)
□ 18h00 : Fiches vitrines HD et plans imprimés à disposition sur la table du salon
□ 18h30 : Accueil échelonné, remise du bon de visite et visite libre guidée
□ 20h00 : Débriefing à chaud et recueil des intentions d'offre d'achat.`;
}
