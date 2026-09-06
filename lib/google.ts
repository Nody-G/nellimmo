/**
 * Google Ecosystem Integration Library — Nell'Immo Cockpit
 * 
 * Provides typed, zero-friction helpers to seamlessly connect Nelly's daily
 * workflow with Google Maps, Google Calendar, Gmail, Google Street View,
 * Google Drive, and Google My Business reviews.
 */

import { createGmailComposeUrl, EmailComposeOptions } from './gmail';

// ----------------------------------------------------
// 1. GOOGLE MAPS & NAVIGATION GPS
// ----------------------------------------------------

/**
 * Construit l'URL officielle de recherche d'adresse sur Google Maps.
 */
export function getGoogleMapsSearchUrl(address: string, city: string = 'Pélissanne'): string {
  const query = [address, city, 'France'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Construit l'URL de guidage GPS direct vers un bien (Waze / Google Maps Navigation).
 * Idéal pour déclencher la navigation en 1 tap depuis le smartphone ou CarPlay.
 */
export function createGoogleMapsNavUrl(destinationAddress: string, city: string = 'Pélissanne'): string {
  const dest = [destinationAddress, city, 'France'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

/**
 * Calcule et génère l'itinéraire de tournée multi-arrêts sur Google Maps.
 * Exemple: Agence Pélissanne -> Visite 1 -> Visite 2 -> Visite 3 -> Agence Pélissanne.
 */
export function createGoogleMapsTourUrl(stops: string[], departureCity: string = 'Pélissanne'): string {
  if (stops.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Agence Immobilière ${departureCity}`)}`;
  }

  // Point de départ / retour par défaut de Nelly (Siège Nell'Immo à Pélissanne)
  const defaultBase = `26 avenue des Enjouvènes, 13330 ${departureCity}`;
  
  // Format Google Maps Directions multi-arrêts : https://www.google.com/maps/dir/base/stop1/stop2/.../base
  const cleanStops = stops.map((s) => encodeURIComponent(s.trim()));
  const allWaypoints = [encodeURIComponent(defaultBase), ...cleanStops];
  
  if (stops.length > 1) {
    allWaypoints.push(encodeURIComponent(defaultBase)); // Boucle de retour agence
  }

  return `https://www.google.com/maps/dir/${allWaypoints.join('/')}`;
}

/**
 * Génère le lien d'immersion visuelle directe Google Street View.
 * Permet d'explorer l'environnement de la rue et les abords d'un bien en 1 clic.
 */
export function createGoogleStreetViewUrl(address: string, city: string = 'Pélissanne', lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  }
  const query = [address, city, 'France'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&layer=c`;
}

/**
 * Génère le lien Google Maps Satellite HD axé sur la parcelle du bien.
 * Idéal pour inspecter le jardin, les abords, la végétation et l'ensoleillement (Sud/Nord/Est/Ouest).
 */
export function getGoogleMapsSatelliteUrl(address: string, city: string = 'Pélissanne', lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/@${lat},${lng},19z/data=!3m1!1e3`;
  }
  const query = [address, city, 'France'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&t=k`;
}

export type PoiCategory = 'ecoles' | 'transports' | 'commerces' | 'sante';

/**
 * Génère une recherche de commodités et points d'intérêt Google Maps autour de l'adresse du bien.
 * Indispensable pour répondre en direct aux acquéreurs sur les écoles, transports, commerces et médecins.
 */
export function getGoogleMapsPoiUrl(address: string, city: string = 'Pélissanne', poiType: PoiCategory): string {
  const poiLabels: Record<PoiCategory, string> = {
    ecoles: 'Écoles crèches collèges',
    transports: 'Gare arrêts de bus transports',
    commerces: 'Commerces supermarchés boulangerie marché',
    sante: 'Pharmacie médecin pôle de santé hôpital',
  };
  const label = poiLabels[poiType] || 'Commodités';
  const query = `${label} près de ${address}, ${city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Calcule l'itinéraire Google Maps de trajet quotidien (Commute time domicile-travail).
 */
export function getGoogleMapsCommuteUrl(
  originAddress: string,
  originCity: string = 'Pélissanne',
  destination: string = 'Aix-en-Provence'
): string {
  const origin = [originAddress, originCity, 'France'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

export interface CommutePreset {
  id: string;
  name: string;
  destination: string;
  badge: string;
  typicalDuration: string;
}

/**
 * Pôles économiques et d'emplois majeurs en Provence autour de Pélissanne / Salon / Pays d'Aix.
 */
export const PROVENCE_COMMUTE_PRESETS: CommutePreset[] = [
  {
    id: 'aix-duranne',
    name: 'Aix-en-Provence (La Duranne / Pôle d\'Activités)',
    destination: 'Zone d\'Activités de la Duranne, 13100 Aix-en-Provence',
    badge: 'Pôle Éco',
    typicalDuration: '~25-30 min',
  },
  {
    id: 'aix-centre',
    name: 'Aix-en-Provence Centre (Rotonde)',
    destination: 'Place du Général de Gaulle, 13100 Aix-en-Provence',
    badge: 'Centre-Ville',
    typicalDuration: '~30-35 min',
  },
  {
    id: 'salon-centre',
    name: 'Salon-de-Provence Centre / Hôpital',
    destination: 'Place Morgan, 13300 Salon-de-Provence',
    badge: 'Proximité',
    typicalDuration: '~10-12 min',
  },
  {
    id: 'salon-ba701',
    name: 'Base Aérienne 701 (École de l\'Air)',
    destination: 'Base Aérienne 701, 13300 Salon-de-Provence',
    badge: 'Défense',
    typicalDuration: '~12-15 min',
  },
  {
    id: 'aeroport-marignane',
    name: 'Aéroport Marseille-Provence (Marignane)',
    destination: 'Aéroport Marseille Provence, 13700 Marignane',
    badge: 'Aéroport',
    typicalDuration: '~28-32 min',
  },
  {
    id: 'marseille-centre',
    name: 'Marseille (Gare Saint-Charles / Vieux-Port)',
    destination: 'Gare Saint-Charles, 13001 Marseille',
    badge: 'Métropole',
    typicalDuration: '~45-50 min',
  },
  {
    id: 'cadarache-iter',
    name: 'Cadarache / ITER (St-Paul-lès-Durance)',
    destination: 'Centre CEA Cadarache, 13115 Saint-Paul-lès-Durance',
    badge: 'Recherche',
    typicalDuration: '~45 min',
  },
  {
    id: 'aix-tgv',
    name: 'Gare d\'Aix-en-Provence TGV (Arbois)',
    destination: 'Gare Aix TGV, 13592 Aix-en-Provence',
    badge: 'TGV',
    typicalDuration: '~25 min',
  },
];

// ----------------------------------------------------
// 2. GOOGLE CALENDAR (AGENDA EN 1-CLIC)
// ----------------------------------------------------

export interface GoogleCalendarEventOptions {
  title: string;
  description?: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string;
  allDay?: boolean;
}

/**
 * Formate une date en chaîne ISO compacte sans ponctuation pour l'API Google Calendar (YYYYMMDDTHHmmssZ).
 */
function formatGoogleCalendarDate(d: Date, allDay: boolean = false): string {
  if (allDay) {
    return d.toISOString().slice(0, 10).replace(/-/g, '');
  }
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Construit le lien direct pour ajouter un événement pré-rempli dans Google Agenda.
 * Ouvre Google Calendar Web avec le titre, l'adresse exacte, la durée et les notes.
 */
export function createGoogleCalendarUrl(options: GoogleCalendarEventOptions): string {
  const start = typeof options.startDate === 'string' ? new Date(options.startDate) : options.startDate;
  
  // Si pas de date de fin, durée de visite standard de 45 minutes
  let end: Date;
  if (options.endDate) {
    end = typeof options.endDate === 'string' ? new Date(options.endDate) : options.endDate;
  } else {
    end = new Date(start.getTime() + 45 * 60 * 1000);
  }

  const startFormatted = formatGoogleCalendarDate(start, options.allDay);
  const endFormatted = formatGoogleCalendarDate(end, options.allDay);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: options.title,
    dates: `${startFormatted}/${endFormatted}`,
  });

  if (options.description) {
    params.set('details', options.description);
  }

  if (options.location) {
    params.set('location', options.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Génère le lien direct pour lancer une nouvelle visioconférence Google Meet.
 * Pratique pour les rendez-vous d'avis de valeur ou débriefs vendeurs à distance.
 */
export function createGoogleMeetUrl(): string {
  return 'https://meet.google.com/new';
}

// ----------------------------------------------------
// 3. GMAIL PRO IMMOBILIER
// ----------------------------------------------------

export { createGmailComposeUrl };
export type { EmailComposeOptions };

/**
 * Ouvre Gmail Web dans un nouvel onglet avec l'objet et le corps formatés.
 */
export function openGmailCompose(options: EmailComposeOptions): void {
  const url = createGmailComposeUrl(options);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// ----------------------------------------------------
// 4. GOOGLE DRIVE (DOSSIERS PHOTOS HD & ALUR)
// ----------------------------------------------------

/**
 * Nomenclature officielle des 6 sous-dossiers ALUR pour un mandat Nell'Immo sur Google Drive.
 */
export const MANDATE_ALUR_FOLDERS = [
  '01_Mandat_Signe_Hoguet',
  '02_Titre_Propriete_Cadastre',
  '03_Diagnostics_DDT_DPE_Audit',
  '04_Copropriete_PV_AG_PreEtatDate',
  '05_Photos_HD_Visite_Virtuelle',
  '06_Offres_Achat_Compromis_Notaire',
] as const;

/**
 * Génère le texte d'arborescence Google Drive à copier pour organiser les dossiers du mandat.
 */
export function generateMandateDriveTreeText(mandateRef: string, propertyTitle: string): string {
  return `📁 Nell'Immo — Mandat ${mandateRef} (${propertyTitle})
├── 📁 01_Mandat_Signe_Hoguet
├── 📁 02_Titre_Propriete_Cadastre
├── 📁 03_Diagnostics_DDT_DPE_Audit
├── 📁 04_Copropriete_PV_AG_PreEtatDate
├── 📁 05_Photos_HD_Visite_Virtuelle
└── 📁 06_Offres_Achat_Compromis_Notaire`;
}

/**
 * Génère le lien vers le dossier Google Drive du mandat ou la recherche par référence.
 */
export function getGoogleDriveUrl(customFolderUrl?: string, mandateRef?: string): string {
  if (customFolderUrl && customFolderUrl.trim().startsWith('http')) {
    return customFolderUrl.trim();
  }
  const query = mandateRef ? `Nell'Immo Mandat ${mandateRef}` : "Nell'Immo Mandats";
  return `https://drive.google.com/drive/search?q=${encodeURIComponent(query)}`;
}

// ----------------------------------------------------
// 5. GOOGLE AVIS & MY BUSINESS
// ----------------------------------------------------

export interface GoogleReviewShareOptions {
  clientName: string;
  role: 'vendeur' | 'acquereur';
  propertyTitle?: string;
  city?: string;
  reviewUrl?: string;
}

/**
 * Génère un texte de sollicitation d'avis Google chaleureux et provençal,
 * prêt à être envoyé par SMS, WhatsApp ou Gmail après signature chez le notaire.
 */
export function createGoogleReviewMessage({
  clientName,
  role,
  propertyTitle,
  city = 'Pélissanne',
  reviewUrl = 'https://g.page/r/nellimmo/review',
}: GoogleReviewShareOptions): string {
  const firstName = clientName.split(' ')[0] || 'Chers clients';
  const roleContext =
    role === 'vendeur'
      ? `la concrétisation de la vente de votre bien à ${city}`
      : `l'acquisition de votre nouveau chez-vous à ${city}`;

  return `Bonjour ${firstName} ! 🌟

C'est Nelly Fernandez de l'agence Nell'Immo.
Félicitations encore pour la signature officielle chez le notaire pour ${roleContext}${propertyTitle ? ` (${propertyTitle})` : ''} !

Ce fut un immense bonheur de vous accompagner avec bienveillance et rigueur dans cette étape de vie en Provence.

Si vous avez apprécié mon écoute et mon suivi, pourriez-vous m'accorder 30 secondes pour déposer votre avis 5 étoiles sur ma fiche Google ? 
Pour une agence indépendante locale, votre recommandation est précieuse :
👉 ${reviewUrl}

Je vous souhaite une merveilleuse installation et reste toujours disponible pour vous.
Avec toute mon amitié,
Nelly Fernandez — Nell'Immo (07 55 68 61 09)`;
}

// ----------------------------------------------------
// 6. SERVICES GOOGLE WORKSPACE DISPONIBLES
// ----------------------------------------------------

export interface GoogleServiceMeta {
  key: 'calendar' | 'gmail' | 'drive' | 'meet' | 'maps' | 'contacts' | 'reviews';
  name: string;
  category: string;
  description: string;
  webUrl: string;
  badge: string;
}

export const GOOGLE_WORKSPACE_SERVICES: GoogleServiceMeta[] = [
  {
    key: 'calendar',
    name: 'Google Agenda',
    category: 'Planning & Mobilité',
    description: 'Synchronisation des rendez-vous visites, signatures d\'actes notaires et alertes de départ.',
    webUrl: 'https://calendar.google.com',
    badge: 'Agenda Pro',
  },
  {
    key: 'gmail',
    name: 'Gmail Pro Immobilier',
    category: 'Messagerie & Actes',
    description: 'Envoi 1-clic de dossiers ALUR aux notaires, relances prêts et comptes-rendus vendeurs.',
    webUrl: 'https://mail.google.com',
    badge: 'Email Pro',
  },
  {
    key: 'drive',
    name: 'Google Drive Cloud',
    category: 'GED & Stockage HD',
    description: 'Classement des diagnostics lourds (DDT 50 Mo), photos haute résolution et PV d\'assemblées.',
    webUrl: 'https://drive.google.com',
    badge: 'Cloud ALUR',
  },
  {
    key: 'meet',
    name: 'Google Meet',
    category: 'Visioconférence',
    description: 'Liaisons vidéo instantanées pour la présentation d\'estimations ou débriefs vendeurs à distance.',
    webUrl: 'https://meet.google.com',
    badge: 'Visio 1-Clic',
  },
  {
    key: 'maps',
    name: 'Google Maps & Terrain',
    category: 'Guidage & Environnement',
    description: 'Tournées multi-arrêts, temps de trajet travail, radar commodités et immersion Street View.',
    webUrl: 'https://maps.google.com',
    badge: 'GPS & Radar',
  },
  {
    key: 'contacts',
    name: 'Google Contacts (People)',
    category: 'Répertoire Mobile',
    description: 'Carnet d\'adresses synchronisé automatiquement entre le Cockpit, iPhone et Android.',
    webUrl: 'https://contacts.google.com',
    badge: 'Annuaire Pro',
  },
  {
    key: 'reviews',
    name: 'Fiche Google Établissement',
    category: 'Réputation & Notoriété',
    description: 'Collecte d\'avis 5 étoiles post-signature chez le notaire pour booster le référencement local.',
    webUrl: 'https://business.google.com',
    badge: 'Avis 5 Étoiles',
  },
];
