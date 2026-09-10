/**
 * Allow-list stricte des endpoints Google exposés par le proxy.
 *
 * ⚠️ Aucune URL arbitraire fournie par le client n'est acceptée : le couple
 * `service`/`action` est résolu vers une URL fermée. Cela évite le SSRF et
 * l'usage détourné du token.
 *
 * Module isomorphe (client + serveur) : uniquement des constantes.
 */

import type { GoogleServiceKey } from './scopes';

export type GoogleHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface GoogleProxyRoute {
    method: GoogleHttpMethod;
    /** Construit l'URL finale à partir des paramètres de chemin. */
    buildUrl: (params: Record<string, string>) => string;
    /** Indique si le corps JSON doit être transmis tel quel. */
    hasBody: boolean;
}

const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3';
const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1';
const DRIVE_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';
const PEOPLE_BASE = 'https://people.googleapis.com/v1';
const TASKS_BASE = 'https://tasks.googleapis.com/tasks/v1';
const BUSINESS_BASE = 'https://mybusiness.googleapis.com/v4';

/** Remplace `{clé}` dans un gabarit par les paramètres fournis. */
function fill(template: string, params: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => {
        const value = params[key];
        if (value === undefined) {
            throw new Error(`Paramètre de chemin manquant : ${key}`);
        }
        return encodeURIComponent(value);
    });
}

/**
 * Table fermée des routes autorisées.
 * Clé : `service:action`.
 */
export const GOOGLE_PROXY_ROUTES: Record<string, GoogleProxyRoute> = {
    // --- Calendar ---
    'calendar:events.insert': {
        method: 'POST',
        hasBody: true,
        buildUrl: (p) => `${CALENDAR_BASE}/calendars/${encodeURIComponent(p.calendarId || 'primary')}/events`,
    },
    'calendar:events.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: (p) => `${CALENDAR_BASE}/calendars/${encodeURIComponent(p.calendarId || 'primary')}/events`,
    },
    'calendar:events.update': {
        method: 'PATCH',
        hasBody: true,
        buildUrl: (p) => `${CALENDAR_BASE}/calendars/${encodeURIComponent(p.calendarId || 'primary')}/events/${encodeURIComponent(p.eventId)}`,
    },
    'calendar:events.delete': {
        method: 'DELETE',
        hasBody: false,
        buildUrl: (p) => `${CALENDAR_BASE}/calendars/${encodeURIComponent(p.calendarId || 'primary')}/events/${encodeURIComponent(p.eventId)}`,
    },
    'calendar:freebusy.query': {
        method: 'POST',
        hasBody: true,
        buildUrl: () => `${CALENDAR_BASE}/freeBusy`,
    },

    // --- Gmail ---
    'gmail:messages.send': {
        method: 'POST',
        hasBody: true,
        buildUrl: () => `${GMAIL_BASE}/users/me/messages/send`,
    },
    'gmail:messages.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: () => `${GMAIL_BASE}/users/me/messages`,
    },
    'gmail:messages.get': {
        method: 'GET',
        hasBody: false,
        buildUrl: (p) => `${GMAIL_BASE}/users/me/messages/${encodeURIComponent(p.messageId)}`,
    },

    // --- Drive ---
    'drive:files.create': {
        method: 'POST',
        hasBody: true,
        buildUrl: () => `${DRIVE_BASE}/files`,
    },
    'drive:files.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: () => `${DRIVE_BASE}/files`,
    },
    'drive:files.get': {
        method: 'GET',
        hasBody: false,
        buildUrl: (p) => `${DRIVE_BASE}/files/${encodeURIComponent(p.fileId)}`,
    },
    'drive:files.delete': {
        method: 'DELETE',
        hasBody: false,
        buildUrl: (p) => `${DRIVE_BASE}/files/${encodeURIComponent(p.fileId)}`,
    },
    'drive:files.upload': {
        method: 'POST',
        hasBody: true,
        buildUrl: () => `${DRIVE_UPLOAD_BASE}/files`,
    },

    // --- Contacts (People API) ---
    'contacts:people.createContact': {
        method: 'POST',
        hasBody: true,
        buildUrl: () => `${PEOPLE_BASE}/people:createContact`,
    },
    'contacts:people.updateContact': {
        method: 'PATCH',
        hasBody: true,
        buildUrl: (p) => `${PEOPLE_BASE}/${encodeURIComponent(p.resourceName)}:updateContact`,
    },
    'contacts:people.connections': {
        method: 'GET',
        hasBody: false,
        buildUrl: () => `${PEOPLE_BASE}/people/me/connections`,
    },

    // --- Tasks ---
    'tasks:tasks.insert': {
        method: 'POST',
        hasBody: true,
        buildUrl: (p) => `${TASKS_BASE}/lists/${encodeURIComponent(p.taskListId || '@default')}/tasks`,
    },
    'tasks:tasks.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: (p) => `${TASKS_BASE}/lists/${encodeURIComponent(p.taskListId || '@default')}/tasks`,
    },
    'tasks:tasks.patch': {
        method: 'PATCH',
        hasBody: true,
        buildUrl: (p) => `${TASKS_BASE}/lists/${encodeURIComponent(p.taskListId || '@default')}/tasks/${encodeURIComponent(p.taskId)}`,
    },

    // --- Reviews (Business Profile) ---
    'reviews:accounts.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: () => `${BUSINESS_BASE}/accounts`,
    },
    'reviews:locations.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: (p) => `${BUSINESS_BASE}/accounts/${encodeURIComponent(p.accountId)}/locations`,
    },
    'reviews:reviews.list': {
        method: 'GET',
        hasBody: false,
        buildUrl: (p) => `${BUSINESS_BASE}/accounts/${encodeURIComponent(p.accountId)}/locations/${encodeURIComponent(p.locationId)}/reviews`,
    },
};

/** Résout une route autorisée. Retourne `null` si non autorisée. */
export function resolveProxyRoute(
    service: GoogleServiceKey,
    action: string
): GoogleProxyRoute | null {
    return GOOGLE_PROXY_ROUTES[`${service}:${action}`] ?? null;
}

/** Construit l'URL finale d'une route autorisée. */
export function buildProxyUrl(
    route: GoogleProxyRoute,
    pathParams: Record<string, string>,
    query?: Record<string, string>
): string {
    const base = route.buildUrl(pathParams);
    if (!query || Object.keys(query).length === 0) return base;
    const url = new URL(base);
    for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value);
    }
    return url.toString();
}
