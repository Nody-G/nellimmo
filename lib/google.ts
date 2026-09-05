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
