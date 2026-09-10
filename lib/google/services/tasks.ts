/**
 * Service Google Tasks (Lot 6).
 *
 * Pousse les relances Nellimmo vers Google Tasks afin qu'elles apparaissent
 * dans l'agenda/rappels de l'utilisateur. La correspondance repose sur
 * `google_task_id` (stocké sur la `RelanceAction`) pour l'idempotence.
 *
 * Aucun appel direct : tout passe par le proxy `/api/google/proxy`.
 */

import { callGoogleProxy } from '../proxy-client';
import type { RelanceAction } from '@/lib/relances';

/** Liste de tâches Google. */
export const DEFAULT_TASK_LIST = '@default';

/** Tâche Google (sous-ensemble utile). */
export interface GoogleTask {
    id: string;
    title?: string;
    notes?: string;
    status?: 'needsAction' | 'completed';
    due?: string;
    completed?: string;
    updated?: string;
    webViewLink?: string;
}

/** Réponse de `tasks:tasks.list`. */
export interface GoogleTaskList {
    items?: GoogleTask[];
    nextPageToken?: string;
}

/**
 * Convertit une date `YYYY-MM-DD` en RFC3339 UTC à minuit (format attendu
 * par Google Tasks pour le champ `due`).
 */
export function toTaskDue(dateKey: string): string {
    const safe = /^\d{4}-\d{2}-\d{2}$/.test(dateKey)
        ? dateKey
        : new Date().toISOString().slice(0, 10);
    return `${safe}T00:00:00.000Z`;
}

/** Construit le corps d'une tâche Google à partir d'une relance. */
export function relanceToGoogleTask(action: RelanceAction): Record<string, unknown> {
    const notes = [
        action.message,
        action.contactPhone ? `Tél. : ${action.contactPhone}` : '',
        action.sourceLabel ? `Source : ${action.sourceLabel}` : '',
        `Relance Nellimmo : ${action.id}`,
    ]
        .filter(Boolean)
        .join('\n');

    return {
        title: action.title,
        notes,
        status: action.status === 'faite' ? 'completed' : 'needsAction',
    };
}

/** Crée une tâche Google. */
export async function createGoogleTask(
    action: RelanceAction,
    taskListId = DEFAULT_TASK_LIST
): Promise<GoogleTask> {
    return callGoogleProxy<GoogleTask>({
        service: 'tasks',
        action: 'tasks.insert',
        pathParams: { taskListId },
        payload: relanceToGoogleTask(action),
    });
}

/** Met à jour une tâche Google existante. */
export async function updateGoogleTask(
    taskId: string,
    action: RelanceAction,
    taskListId = DEFAULT_TASK_LIST
): Promise<GoogleTask> {
    return callGoogleProxy<GoogleTask>({
        service: 'tasks',
        action: 'tasks.patch',
        pathParams: { taskListId, taskId },
        payload: relanceToGoogleTask(action),
    });
}

/** Liste les tâches Google. */
export async function listGoogleTasks(
    taskListId = DEFAULT_TASK_LIST,
    showCompleted = false
): Promise<GoogleTask[]> {
    const data = await callGoogleProxy<GoogleTaskList>({
        service: 'tasks',
        action: 'tasks.list',
        pathParams: { taskListId },
        query: { showCompleted: String(showCompleted), maxResults: '100' },
    });
    return data.items ?? [];
}

/**
 * Crée ou met à jour la tâche Google d'une relance.
 * @returns la tâche Google et son identifiant.
 */
export async function upsertGoogleTask(
    action: RelanceAction,
    taskListId = DEFAULT_TASK_LIST
): Promise<{ task: GoogleTask; taskId: string }> {
    if (action.google_task_id) {
        const task = await updateGoogleTask(action.google_task_id, action, taskListId);
        return { task, taskId: task.id || action.google_task_id };
    }
    const task = await createGoogleTask(action, taskListId);
    return { task, taskId: task.id };
}
