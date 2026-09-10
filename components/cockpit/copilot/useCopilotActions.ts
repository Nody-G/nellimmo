'use client';

/**
 * Hook d'exécution des actions agentiques du copilote (Lot R19-B5).
 *
 * Le copilote ne fait JAMAIS d'écriture directement : il propose une action
 * (`CopilotToolCall`) que l'utilisateur doit confirmer explicitement. Ce hook
 * est le seul point d'entrée qui transforme une action confirmée en appel réel
 * vers Google Workspace (Calendar / Gmail / Tasks / Drive).
 *
 * Garde-fous :
 * - aucune exécution sans confirmation utilisateur (le hook n'est appelé
 *   qu'après validation dans `CopilotActionCard`) ;
 * - chaque exécution renvoie un `CopilotToolResult` exploitable par le
 *   copilote pour formuler sa réponse finale ;
 * - les erreurs de connexion Google sont remontées proprement.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useGoogleCalendar } from '@/components/cockpit/agenda/useGoogleCalendar';
import { useGmailSender } from '@/components/cockpit/contacts/useGmailSender';
import { useGoogleTasks } from '@/components/cockpit/relances/useGoogleTasks';
import { useGoogleDrive } from '@/components/cockpit/mandats/useGoogleDrive';
import type { AgendaEvent } from '@/components/cockpit/agenda/agenda-types';
import type { RelanceAction } from '@/lib/relances';
import {
    getCopilotTool,
    summarizeToolCall,
    type CopilotToolCall,
    type CopilotToolResult,
} from '@/lib/ai-copilot-tools';

export interface UseCopilotActionsResult {
    /** Une action est en cours d'exécution. */
    isExecuting: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si l'erreur indique un compte Google non connecté. */
    needsConnection: boolean;
    /** Exécute une action confirmée et renvoie son résultat. */
    executeAction: (call: CopilotToolCall) => Promise<CopilotToolResult>;
}

/** Convertit une date ISO (`YYYY-MM-DD`) + heure (`HH:mm`) en `AgendaEvent`. */
function buildAgendaEvent(args: Record<string, unknown>): AgendaEvent {
    const date = String(args.date || '').slice(0, 10);
    const time = String(args.time || '09:00').slice(0, 5);
    const durationMinutes = Number(args.durationMinutes) || 60;
    const title = String(args.title || 'Rendez-vous').trim();

    return {
        id: `copilot-${Date.now()}`,
        title,
        category: 'visite',
        date,
        time,
        durationMinutes,
        location: args.location ? String(args.location) : '',
        contactName: args.contactName ? String(args.contactName) : '',
        contactPhone: args.contactPhone ? String(args.contactPhone) : '',
        notes: args.description ? String(args.description) : undefined,
    };
}

/** Convertit les arguments d'une tâche en `RelanceAction` compatible Google Tasks. */
function buildRelanceAction(args: Record<string, unknown>): RelanceAction {
    const dueDate = String(args.due || '').slice(0, 10);
    const title = String(args.title || 'Tâche').trim();

    return {
        id: `copilot-task-${Date.now()}`,
        category: 'mandat_echeance',
        title,
        contactName: args.contactName ? String(args.contactName) : '',
        contactPhone: args.contactPhone ? String(args.contactPhone) : '',
        message: args.notes ? String(args.notes) : title,
        dueLabel: dueDate,
        sourceId: `copilot-${Date.now()}`,
        sourceLabel: 'Copilote',
        status: 'a_faire',
    };
}

export function useCopilotActions(): UseCopilotActionsResult {
    const { showToast } = useToast();
    const calendar = useGoogleCalendar();
    const gmail = useGmailSender();
    const tasks = useGoogleTasks();
    const drive = useGoogleDrive();

    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsConnection, setNeedsConnection] = useState(false);

    const executeAction = useCallback(
        async (call: CopilotToolCall): Promise<CopilotToolResult> => {
            const tool = getCopilotTool(call.tool);

            if (!tool) {
                const message = `Action inconnue : ${call.tool}`;
                setError(message);
                showToast(message, 'error');
                return { id: call.id, tool: call.tool, success: false, message };
            }

            const summary = call.summary || summarizeToolCall(call.tool, call.args);
            void summary;

            setIsExecuting(true);
            setError(null);
            setNeedsConnection(false);

            try {
                switch (call.tool) {
                    case 'calendar.createEvent': {
                        const event = buildAgendaEvent(call.args);
                        const created = await calendar.createEvent(event);
                        if (!created) {
                            const message = 'La création de l’événement Google Agenda a échoué.';
                            setError(message);
                            setNeedsConnection(calendar.needsConnection);
                            return { id: call.id, tool: call.tool, success: false, message };
                        }
                        return {
                            id: call.id,
                            tool: call.tool,
                            success: true,
                            message: `Événement « ${event.title} » ajouté à Google Agenda (${event.date} à ${event.time}).`,
                            href: created.htmlLink,
                        };
                    }

                    case 'gmail.sendEmail': {
                        const sent = await gmail.send({
                            to: String(call.args.to || ''),
                            cc: call.args.cc ? String(call.args.cc) : undefined,
                            subject: String(call.args.subject || ''),
                            body: String(call.args.body || ''),
                        });
                        if (!sent) {
                            const message = 'L’envoi de l’email a échoué.';
                            setError(message);
                            setNeedsConnection(gmail.needsConnection);
                            return { id: call.id, tool: call.tool, success: false, message };
                        }
                        return {
                            id: call.id,
                            tool: call.tool,
                            success: true,
                            message: `Email « ${String(call.args.subject || '')} » envoyé à ${String(call.args.to || '')}.`,
                        };
                    }

                    case 'tasks.createTask': {
                        const action = buildRelanceAction(call.args);
                        const taskId = await tasks.syncRelance(action);
                        if (!taskId) {
                            const message = 'La création de la tâche Google a échoué.';
                            setError(message);
                            setNeedsConnection(tasks.needsConnection);
                            return { id: call.id, tool: call.tool, success: false, message };
                        }
                        return {
                            id: call.id,
                            tool: call.tool,
                            success: true,
                            message: `Tâche « ${action.title} » créée dans Google Tasks${action.dueLabel ? ` (échéance ${action.dueLabel})` : ''}.`,
                        };
                    }

                    case 'drive.createMandateFolder': {
                        const mandateRef = String(call.args.mandateRef || '').trim();
                        const propertyTitle = String(call.args.propertyTitle || '').trim();
                        const folder = await drive.createMandateTree(mandateRef, propertyTitle);
                        if (!folder) {
                            const message = 'La création du dossier Drive a échoué.';
                            setError(message);
                            setNeedsConnection(drive.needsConnection);
                            return { id: call.id, tool: call.tool, success: false, message };
                        }
                        return {
                            id: call.id,
                            tool: call.tool,
                            success: true,
                            message: `Dossier Drive « ${folder.name} » créé avec son arborescence.`,
                            href: folder.webViewLink,
                        };
                    }

                    default: {
                        const message = `Action non prise en charge : ${call.tool}`;
                        setError(message);
                        showToast(message, 'error');
                        return { id: call.id, tool: call.tool, success: false, message };
                    }
                }
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Erreur lors de l’exécution de l’action.';
                setError(message);
                showToast(message, 'error');
                return { id: call.id, tool: call.tool, success: false, message };
            } finally {
                setIsExecuting(false);
            }
        },
        [calendar, gmail, tasks, drive, showToast]
    );

    return { isExecuting, error, needsConnection, executeAction };
}
