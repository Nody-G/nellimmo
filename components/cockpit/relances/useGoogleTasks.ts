'use client';

/**
 * Hook Google Tasks pour les relances (Lot 6).
 *
 * Pousse une relance Nellimmo vers Google Tasks (création ou mise à jour
 * idempotente via `google_task_id`) et permet de lister les tâches.
 *
 * Garde-fous : aucun polling, appels déclenchés par action utilisateur,
 * erreurs de connexion exposées via `needsConnection`.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { isConnectionError } from '@/lib/google/proxy-client';
import {
    listGoogleTasks,
    upsertGoogleTask,
    type GoogleTask,
} from '@/lib/google/services/tasks';
import type { RelanceAction } from '@/lib/relances';

export interface UseGoogleTasksResult {
    /** Une synchronisation est en cours. */
    isSyncing: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si l'erreur indique un compte Google non connecté. */
    needsConnection: boolean;
    /**
     * Synchronise une relance vers Google Tasks.
     * @returns l'identifiant de tâche Google à stocker, ou `null`.
     */
    syncRelance: (action: RelanceAction) => Promise<string | null>;
    /** Liste les tâches Google. */
    listTasks: (showCompleted?: boolean) => Promise<GoogleTask[]>;
}

export function useGoogleTasks(): UseGoogleTasksResult {
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
                    err instanceof Error ? err.message : 'Erreur de synchronisation des tâches.';
                setError(message);
                if (isConnectionError(err)) {
                    setNeedsConnection(true);
                    showToast('Connectez votre compte Google pour synchroniser les tâches.', 'error');
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

    const syncRelance = useCallback(
        async (action: RelanceAction): Promise<string | null> => {
            const result = await run(
                () => upsertGoogleTask(action),
                'Relance ajoutée à Google Tasks.'
            );
            return result?.taskId ?? null;
        },
        [run]
    );

    const listTasks = useCallback(
        async (showCompleted = false): Promise<GoogleTask[]> => {
            const result = await run(() => listGoogleTasks('@default', showCompleted));
            return result ?? [];
        },
        [run]
    );

    return { isSyncing, error, needsConnection, syncRelance, listTasks };
}
