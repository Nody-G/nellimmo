'use client';

/**
 * Hook de synchronisation Google Calendar (Lot 2b).
 *
 * Expose une API minimale et sûre pour pousser les événements Nellimmo vers
 * l'agenda Google de l'utilisateur, et pour lire les disponibilités.
 *
 * Garde-fous :
 * - aucun polling : les appels sont déclenchés par une action utilisateur ;
 * - aucune donnée n'est écrite si le compte Google n'est pas connecté ;
 * - les erreurs de connexion sont exposées via `needsConnection`.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { isConnectionError } from '@/lib/google/proxy-client';
import {
    deleteCalendarEvent,
    insertCalendarEvent,
    listCalendarEvents,
    queryFreeBusy,
    updateCalendarEvent,
    type GoogleCalendarEvent,
    type GoogleFreeBusySlot,
} from '@/lib/google/services/calendar';
import type { AgendaEvent } from './agenda-types';

export interface UseGoogleCalendarResult {
    /** Un appel est en cours. */
    isSyncing: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si l'erreur indique un compte Google non connecté. */
    needsConnection: boolean;
    /** Crée un événement Google à partir d'un événement Nellimmo. */
    createEvent: (event: AgendaEvent) => Promise<GoogleCalendarEvent | null>;
    /** Met à jour un événement Google existant. */
    updateEvent: (googleEventId: string, event: AgendaEvent) => Promise<GoogleCalendarEvent | null>;
    /** Supprime un événement Google. */
    deleteEvent: (googleEventId: string) => Promise<boolean>;
    /** Liste les événements Google sur une plage de dates. */
    listEvents: (from: Date, to: Date) => Promise<GoogleCalendarEvent[]>;
    /** Récupère les créneaux occupés (free/busy). */
    getFreeBusy: (from: Date, to: Date) => Promise<GoogleFreeBusySlot[]>;
}

export function useGoogleCalendar(): UseGoogleCalendarResult {
    const { showToast } = useToast();
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsConnection, setNeedsConnection] = useState(false);

    const run = useCallback(
        async <T,>(fn: () => Promise<T>, successMessage?: string): Promise<T | null> => {
            setIsSyncing(true);
            setError(null);
            setNeedsConnection(false);
            try {
                const result = await fn();
                if (successMessage) showToast(successMessage, 'success');
                return result;
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Erreur de synchronisation Google.';
                setError(message);
                if (isConnectionError(err)) {
                    setNeedsConnection(true);
                    showToast('Connectez votre compte Google pour synchroniser l’agenda.', 'error');
                } else {
                    showToast(message, 'error');
                }
                return null;
            } finally {
                setIsSyncing(false);
            }
        },
        [showToast]
    );

    const createEvent = useCallback(
        (event: AgendaEvent) =>
            run(() => insertCalendarEvent(event), 'Événement ajouté à Google Agenda.'),
        [run]
    );

    const updateEvent = useCallback(
        (googleEventId: string, event: AgendaEvent) =>
            run(() => updateCalendarEvent(googleEventId, event), 'Événement Google mis à jour.'),
        [run]
    );

    const deleteEvent = useCallback(
        async (googleEventId: string): Promise<boolean> => {
            const result = await run(
                () => deleteCalendarEvent(googleEventId),
                'Événement Google supprimé.'
            );
            return result !== null;
        },
        [run]
    );

    const listEvents = useCallback(
        async (from: Date, to: Date): Promise<GoogleCalendarEvent[]> => {
            const result = await run(() =>
                listCalendarEvents(from.toISOString(), to.toISOString())
            );
            return result ?? [];
        },
        [run]
    );

    const getFreeBusy = useCallback(
        async (from: Date, to: Date): Promise<GoogleFreeBusySlot[]> => {
            const result = await run(() => queryFreeBusy(from.toISOString(), to.toISOString()));
            return result ?? [];
        },
        [run]
    );

    return {
        isSyncing,
        error,
        needsConnection,
        createEvent,
        updateEvent,
        deleteEvent,
        listEvents,
        getFreeBusy,
    };
}
