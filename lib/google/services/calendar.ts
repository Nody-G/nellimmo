/**
 * Service Google Calendar (Lot 2b).
 *
 * Traduit les `AgendaEvent` de Nellimmo vers l'API Google Calendar v3 et
 * inversement. Aucun appel direct à Google : tout passe par le proxy
 * `/api/google/proxy` (allow-list stricte).
 *
 * Module isomorphe : uniquement des types et des fonctions pures + appels
 * au proxy client. Aucun secret, aucun token.
 */

import { callGoogleProxy } from '../proxy-client';
import type { AgendaEvent, EventCategory } from '@/components/cockpit/agenda/agenda-types';

/** Fuseau horaire de l'agence (Pélissanne). */
export const AGENDA_TIMEZONE = 'Europe/Paris';

/** Clé d'extension privée portant la catégorie Nellimmo. */
export const NELLIMMO_CATEGORY_KEY = 'nellimmo_category';

/** Clé d'extension privée portant l'identifiant local de l'événement. */
export const NELLIMMO_EVENT_ID_KEY = 'nellimmo_event_id';

/** Sous-ensemble utile d'un événement Google Calendar. */
export interface GoogleCalendarEvent {
    id: string;
    status?: string;
    summary?: string;
    description?: string;
    location?: string;
    htmlLink?: string;
    start?: { dateTime?: string; date?: string; timeZone?: string };
    end?: { dateTime?: string; date?: string; timeZone?: string };
    extendedProperties?: { private?: Record<string, string> };
}

/** Réponse de `calendar:events.list`. */
export interface GoogleCalendarEventList {
    items?: GoogleCalendarEvent[];
    nextPageToken?: string;
    summary?: string;
    timeZone?: string;
}

/** Créneau occupé renvoyé par `calendar:freebusy.query`. */
export interface GoogleFreeBusySlot {
    start: string;
    end: string;
}

/** Réponse de `calendar:freebusy.query`. */
export interface GoogleFreeBusyResponse {
    calendars?: Record<string, { busy?: GoogleFreeBusySlot[]; errors?: unknown[] }>;
}

/** Corps d'insertion/mise à jour d'un événement Google. */
export interface GoogleCalendarEventInput {
    summary: string;
    description?: string;
    location?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    extendedProperties?: { private: Record<string, string> };
}

/**
 * Convertit une date `YYYY-MM-DD` + heure `HH:mm` en chaîne RFC3339 locale
 * (`YYYY-MM-DDTHH:mm:ss`). On n'ajoute PAS de suffixe `Z` : le fuseau est
 * porté séparément par le champ `timeZone`, ce qui évite les décalages.
 */
export function toRfc3339Local(date: string, time: string): string {
    const safeTime = /^\d{2}:\d{2}$/.test(time) ? time : '09:00';
    return `${date}T${safeTime}:00`;
}

/** Ajoute `minutes` à une chaîne RFC3339 locale et renvoie le résultat. */
export function addMinutesToRfc3339(local: string, minutes: number): string {
    const [datePart, timePart = '00:00:00'] = local.split('T');
    const [h, m] = timePart.split(':').map((v) => parseInt(v, 10));
    const base = new Date(`${datePart}T00:00:00`);
    base.setHours(h || 0, m || 0, 0, 0);
    base.setMinutes(base.getMinutes() + minutes);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(
        base.getHours()
    )}:${pad(base.getMinutes())}:00`;
}

/**
 * Convertit un `AgendaEvent` Nellimmo en corps d'événement Google.
 *
 * Mapping (cf. plan §3) :
 * - `title` → `summary`
 * - `date` + `time` + `durationMinutes` → `start.dateTime` / `end.dateTime`
 * - `location` → `location`
 * - `notes` → `description`
 * - `category` → `extendedProperties.private.nellimmo_category`
 */
export function agendaEventToGoogleInput(event: AgendaEvent): GoogleCalendarEventInput {
    const startLocal = toRfc3339Local(event.date, event.time);
    const duration = Number.isFinite(event.durationMinutes) && event.durationMinutes > 0
        ? event.durationMinutes
        : 60;
    const endLocal = addMinutesToRfc3339(startLocal, duration);

    const descriptionParts: string[] = [];
    if (event.notes) descriptionParts.push(event.notes);
    if (event.contactName) {
        const contact = [event.contactName, event.contactPhone].filter(Boolean).join(' — ');
        descriptionParts.push(`Contact : ${contact}`);
    }
    if (event.mandateNumber) descriptionParts.push(`Mandat n°${event.mandateNumber}`);

    return {
        summary: event.title,
        description: descriptionParts.join('\n\n') || undefined,
        location: event.location || undefined,
        start: { dateTime: startLocal, timeZone: AGENDA_TIMEZONE },
        end: { dateTime: endLocal, timeZone: AGENDA_TIMEZONE },
        extendedProperties: {
            private: {
                [NELLIMMO_CATEGORY_KEY]: event.category,
                [NELLIMMO_EVENT_ID_KEY]: event.id,
            },
        },
    };
}

/** Extrait la catégorie Nellimmo d'un événement Google (fallback `autre`). */
export function googleEventCategory(event: GoogleCalendarEvent): EventCategory {
    const raw = event.extendedProperties?.private?.[NELLIMMO_CATEGORY_KEY];
    const allowed: EventCategory[] = ['visite', 'notaire', 'estimation', 'panneau_cle', 'autre'];
    return allowed.includes(raw as EventCategory) ? (raw as EventCategory) : 'autre';
}

/** Indique si un événement Google a été créé par Nellimmo. */
export function isNellimmoEvent(event: GoogleCalendarEvent): boolean {
    return Boolean(event.extendedProperties?.private?.[NELLIMMO_EVENT_ID_KEY]);
}

/**
 * Crée un événement dans l'agenda Google.
 * @returns l'événement Google créé (avec son `id`).
 */
export async function insertCalendarEvent(
    event: AgendaEvent,
    calendarId = 'primary'
): Promise<GoogleCalendarEvent> {
    return callGoogleProxy<GoogleCalendarEvent>({
        service: 'calendar',
        action: 'events.insert',
        pathParams: { calendarId },
        payload: agendaEventToGoogleInput(event),
    });
}

/**
 * Met à jour un événement Google existant.
 * @param googleEventId identifiant Google de l'événement.
 */
export async function updateCalendarEvent(
    googleEventId: string,
    event: AgendaEvent,
    calendarId = 'primary'
): Promise<GoogleCalendarEvent> {
    return callGoogleProxy<GoogleCalendarEvent>({
        service: 'calendar',
        action: 'events.update',
        pathParams: { calendarId, eventId: googleEventId },
        payload: agendaEventToGoogleInput(event),
    });
}

/** Supprime un événement Google. */
export async function deleteCalendarEvent(
    googleEventId: string,
    calendarId = 'primary'
): Promise<void> {
    await callGoogleProxy<unknown>({
        service: 'calendar',
        action: 'events.delete',
        pathParams: { calendarId, eventId: googleEventId },
    });
}

/**
 * Liste les événements Google sur une plage de dates.
 * @param timeMin début (RFC3339, ex. `2026-09-01T00:00:00Z`).
 * @param timeMax fin (RFC3339).
 */
export async function listCalendarEvents(
    timeMin: string,
    timeMax: string,
    calendarId = 'primary',
    maxResults = 250
): Promise<GoogleCalendarEvent[]> {
    const data = await callGoogleProxy<GoogleCalendarEventList>({
        service: 'calendar',
        action: 'events.list',
        pathParams: { calendarId },
        query: {
            timeMin,
            timeMax,
            singleEvents: 'true',
            orderBy: 'startTime',
            maxResults: String(maxResults),
        },
    });
    return data.items ?? [];
}

/**
 * Interroge les disponibilités (free/busy) sur une plage donnée.
 * @returns la liste des créneaux occupés du calendrier principal.
 */
export async function queryFreeBusy(
    timeMin: string,
    timeMax: string,
    calendarId = 'primary'
): Promise<GoogleFreeBusySlot[]> {
    const data = await callGoogleProxy<GoogleFreeBusyResponse>({
        service: 'calendar',
        action: 'freebusy.query',
        payload: {
            timeMin,
            timeMax,
            timeZone: AGENDA_TIMEZONE,
            items: [{ id: calendarId }],
        },
    });
    return data.calendars?.[calendarId]?.busy ?? [];
}

/** Convertit une `Date` en RFC3339 UTC (utilisé pour les bornes de plage). */
export function toRfc3339Utc(date: Date): string {
    return date.toISOString();
}
