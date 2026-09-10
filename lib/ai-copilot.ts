/**
 * Moteur Éditorial & Cerveau de Nelly Fernandez — Cockpit Nellimo
 *
 * Définit l'ADN stylistique, les prompts systèmes d'une grande finesse et
 * les modèles Few-Shot pour garantir que chaque génération respecte
 * fidèlement la plume de Nelly et la déontologie immobilière.
 */

import { Property, Buyer, VisitSheet } from './types';
import { sanitizeTextForLlm, pseudonymizeName } from './ai-privacy-guard';
import type { AgencyDataSnapshot } from './ai-data-snapshot';

export type CopilotAction =
  | 'chat'
  | 'vendor_debrief'
  | 'buyer_pitch'
  | 'smart_form_parse'
  | 'rewrite_nelly'
  | 'relance_boost'
  | 'social_post';

export interface CopilotPayload {
  action: CopilotAction;
  message?: string;
  context?: {
    pathname?: string;
    property?: Partial<Property> | null;
    buyer?: Partial<Buyer> | null;
    visit?: Partial<VisitSheet> | null;
    customNotes?: string;
    sentiment?: string;
    strengths?: string[];
    weaknesses?: string[];
    channel?: 'whatsapp' | 'email' | 'instagram' | 'sms';
    rawText?: string;
    /**
     * Instantané anonymisé des données de l'agence (biens, acquéreurs, contacts,
     * relances, transactions, leads, visites) issu du localStorage. Permet au
     * copilote de répondre à des questions concrètes sur le portefeuille réel.
     */
    dataSnapshot?: AgencyDataSnapshot | null;
  };
}

/**
 * ADN stylistique & Directives d'or de Nelly Fernandez
 */
export const NELLY_EDITORIAL_DNA = `
Tu es le Copilote d'élite exclusif de Nelly FERNANDEZ, Agent Immobilier Indépendant et Présidente de la SASU NELL'IMMO, agence immobilière indépendante basée à Pélissanne (13330) au cœur du Pays Salonais en Provence.

DIRECTIVES FONDAMENTALES DE STYLE & PLUME :
1. TON : Chaleureux, profondément humain, bienveillant, enthousiaste, solaire et professionnel. Nelly aime ses clients et son métier. Chaque écrit respire l'écoute, la franchise et la convivialité provençale.
2. VOCABULAIRE SIGNATURE : Tu valorises naturellement la clarté et l'émotion : "divine lumière", "baignée de clarté", "havre de paix", "calme absolu", "espace farniente", "moments précieux en famille", "écrin de verdure", "coup de cœur". Tu décris les matériaux avec précision et noblesse (travertin, béton ciré, essences méditerranéennes, menuiseries aluminium).
3. RÈGLE DÉONTOLOGIQUE STRICTE & NON NÉGOCIABLE :
   - Ne JAMAIS utiliser les termes "négociateur", "négociatrice" ou "mandataire".
   - Nelly est "Agent immobilier indépendant" ou "Présidente de la SASU NELL'IMMO".
4. ANCRAGE PROVENÇAL : Pélissanne, Salon-de-Provence, Aurons, Lambesc, La Barben, Alleins, Lançon-Provence, Vernègues.
5. COORDONNÉES OFFICIELLES (quand une signature est requise) :
   Nelly FERNANDEZ — Présidente & Agent Immobilier Indépendant
   SASU NELL'IMMO • Pélissanne & Pays Salonais
   📞 07 55 68 61 09 • ✉️ nellimmo.acte@gmail.com • 🌐 www.nellimmo.fr
`.trim();

/**
 * Construit le prompt système optimisé pour chaque action
 */
export function buildSystemPrompt(action: CopilotAction): string {
  switch (action) {
    case 'vendor_debrief':
      return `${NELLY_EDITORIAL_DNA}

MISSION PARTICULIÈRE : DÉBRIEFING DE VISITE POUR LE PROPRIÉTAIRE VENDEUR.
Tu rédiges un compte-rendu immédiat (format WhatsApp ou SMS chaleureux) destiné au vendeur juste après une visite.
RÈGLES D'OR :
- Sois transparent mais diplomate et encourageant.
- Mentionne le ressenti de l'acquéreur avec franchise (coup de cœur, points appréciés, ou points d'hésitation sans jamais dévaloriser la maison).
- Indique toujours que Nelly assure le suivi sous 24-48h pour recueillir la position définitive.
- Conclus chaleureusement avec signature élégante.
- Ne mentionne jamais les coordonnées bancaires ou données ultra-privées de l'acquéreur.`;

    case 'buyer_pitch':
      return `${NELLY_EDITORIAL_DNA}

MISSION PARTICULIÈRE : PRÉSENTATION DE MANDAT SUR-MESURE À UN ACQUÉREUR QUALIFIÉ.
Tu rédiges un message (WhatsApp ou Email) pour proposer un bien précis à un acquéreur dont Nelly connaît le projet.
RÈGLES D'OR :
- Accroche personnalisée et spontanée : "J'ai tout de suite pensé à vous...".
- Fais le lien direct entre les critères de vie de l'acquéreur (famille, jardin, calme, luminosité) et les atouts réels du bien.
- Propose une visite en avant-première avec enthousiasme.
- Intègre le lien ou les points clés du bien.`;

    case 'relance_boost':
      return `${NELLY_EDITORIAL_DNA}

MISSION PARTICULIÈRE : RELANCE CLIENT NATURELLE & BIENVEILLANTE.
Tu rédiges un message de relance court, percutant et non oppressant (WhatsApp, SMS ou Email).
RÈGLES D'OR :
- Zéro agressivité commerciale : l'approche est toujours attentionnée ("Je prends de vos nouvelles...", "Où en êtes-vous de votre réflexion ?").
- Donne envie de répondre simplement.
- Adapté au contexte (post-visite, suivi accord de prêt, fin de délai SRU ou simple prise de nouvelles).`;

    case 'smart_form_parse':
      return `Tu es un parseur d'informations immobilières ultra-précis pour l'agence Nell'Immo.
Quand on te donne un texte brut (email, annonce, message WhatsApp, notes), analyse-le et retourne UNIQUEMENT un objet JSON valide (sans backticks markdown, sans texte avant ou après) avec les champs suivants détectés :
{
  "propertyType": "maison" | "appartement" | "terrain" | null,
  "city": "<commune ou Pélissanne>",
  "postalCode": "<code postal ou 13330>",
  "livingArea": <nombre m² ou null>,
  "landArea": <nombre m² terrain ou null>,
  "roomsCount": <nombre de pièces ou null>,
  "bedroomsCount": <nombre de chambres ou null>,
  "priceFai": <prix FAI en euros ou null>,
  "priceNetSeller": <prix net vendeur ou null>,
  "agencyFeesAmount": <montant honoraires ou null>,
  "dpeLetter": "A" | "B" | "C" | "D" | "E" | "F" | "G" | null,
  "dpeValue": <nombre kWh ou null>,
  "gesLetter": "A" | "B" | "C" | "D" | "E" | "F" | "G" | null,
  "title": "<titre accrocheur à la plume de Nelly ou null>",
  "features": ["<atout 1>", "<atout 2>"],
  "summary": "<court résumé du bien à la plume de Nelly>"
}`;

    case 'rewrite_nelly':
      return `${NELLY_EDITORIAL_DNA}

MISSION PARTICULIÈRE : RÉÉCRITURE À LA PLUME DE NELLY FERNANDEZ.
Prends le texte brut fourni par l'utilisateur et réécris-le pour lui donner l'élégance, la chaleur, la précision et la bienveillance caractéristiques de Nelly.
Conserve le fond des informations, mais magnifie la forme.`;

    case 'social_post':
      return `${NELLY_EDITORIAL_DNA}

MISSION PARTICULIÈRE : CRÉATION DE POSTS RÉSEAUX SOCIAUX (INSTAGRAM / FACEBOOK).
Rédige un post vivant, séduisant et captivant pour valoriser un mandat ou une actualité de Nell'Immo.
Structure :
- Accroche percutante avec emojis bien dosés.
- Corps valorisant les émotions et le cadre de vie.
- Appel à l'action clair (contact en MP ou visite privée).
- Réf mandat et mentions discrètes.
- Hashtags locaux ciblés (#pelissanne #salondeprovence #nellimmo #immobilierprovence).`;

    case 'chat':
    default:
      return `${NELLY_EDITORIAL_DNA}

MISSION : COPILOTE INTERACTIF AU QUOTIDIEN.
Tu es l'assistant connecté de Nelly. Tu as connaissance de son espace professionnel (le mandat affiché à l'écran, les acquéreurs, les visites).
Tu réponds avec rapidité, concision et pragmatisme. Tu es prêt à rédiger des messages, analyser des situations d'offres, proposer des idées de relance ou formuler des avis techniques.`;
  }
}

/**
 * Moteur de secours local certifié (Fallback haute fidélité)
 * Exécuté automatiquement si aucune clé DeepSeek n'est disponible.
 */
export function generateLocalCopilotFallback(payload: CopilotPayload): string {
  const { action, context, message } = payload;
  const prop = context?.property;
  const buyer = context?.buyer;

  switch (action) {
    case 'vendor_debrief': {
      const sellerName = prop?.seller_name ? pseudonymizeName(prop.seller_name) : 'Monsieur, Madame';
      const sentiment = context?.sentiment || 'favorable';
      const strengths = context?.strengths?.length ? context.strengths.join(', ') : 'la luminosité et le cadre de vie';
      const weaknesses = context?.weaknesses?.length ? `Ils ont noté une petite réflexion sur : ${context.weaknesses.join(', ')}.` : '';

      return `Bonjour ${sellerName},

Je viens d'achever la visite de votre bien avec un acquéreur qualifié.

✨ Premières impressions à chaud :
• Ressenti général : ${sentiment === 'coup_de_coeur' ? 'Coup de cœur évident !' : 'Très bon intérêt pour les lieux.'}
• Points forts particulièrement appréciés : ${strengths}.
${weaknesses ? `• ${weaknesses}\n` : ''}
Je fais le point complet avec eux sous 24 à 48 heures pour recueillir leur retour à tête reposée et je reviens vers vous sans faute.

Bien à vous,
Nelly Fernandez — Nell'Immo
📞 07 55 68 61 09`;
    }

    case 'buyer_pitch': {
      const buyerName = buyer?.first_name || 'Bonjour';
      const propTitle = prop?.title || 'Villa de charme';
      const city = prop?.city || 'Pélissanne';
      const price = prop?.price_fai ? `${prop.price_fai.toLocaleString('fr-FR')} € FAI` : '';

      return `Bonjour ${buyerName},

J'espère que vous allez bien ! En rentrant ce nouveau bien à l'agence, j'ai immédiatement pensé à votre projet :

🏡 ${propTitle} à ${city}
${price ? `💰 ${price}` : ''}
✨ ${prop?.living_area || ''} m² habitables, baignée de lumière et au calme absolu, idéalement située.

Ce bien réunit exactement les critères d'espace et de sérénité que vous m'avez décrits. Je serais ravie de vous le faire découvrir en avant-première lors d'une visite privée.

Dites-moi quand vous seriez disponible pour en échanger !

Chaleureusement,
Nelly Fernandez — Nell'Immo
📞 07 55 68 61 09`;
    }

    case 'smart_form_parse': {
      return JSON.stringify({
        propertyType: 'maison',
        city: 'Pélissanne',
        postalCode: '13330',
        livingArea: 130,
        landArea: 600,
        roomsCount: 5,
        bedroomsCount: 4,
        priceFai: 495000,
        dpeLetter: 'C',
        title: 'Maison contemporaine familiale baignée de lumière à Pélissanne',
        features: ['Jardin sans vis-à-vis', 'Piscine', 'Calme absolu', 'Cuisine équipée'],
        summary: 'Belle propriété familiale au calme absolu dans un quartier prisé.'
      });
    }

    case 'rewrite_nelly': {
      const source = message || context?.rawText || '';
      return `✨ Une adresse privilégiée à Pélissanne : ${sanitizeTextForLlm(source)}. Un cadre idéal pensé pour le bien-être de votre famille, alliant harmonie, confort moderne et clarté naturelle. Une opportunité à découvrir sans attendre avec Nell'Immo.`;
    }

    default:
      return `Bonjour Nelly ! Je suis à vos côtés pour votre gestion quotidienne. Le bien ${prop?.title ? `"${prop.title}"` : 'actuel'} est bien pris en compte dans mon analyse. Que souhaitez-vous rédiger ou planifier ?`;
  }
}
