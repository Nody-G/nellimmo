'use client';

/**
 * Carte de confirmation d'action du copilote (Lot R19-B6).
 *
 * Affiche une action proposée par le copilote (création d'événement Google
 * Agenda, envoi d'email Gmail, création de tâche Google Tasks, création de
 * dossier Drive) et demande une validation explicite avant toute écriture.
 *
 * Principe « human-in-the-loop » : rien n'est exécuté sans clic sur
 * « Confirmer ». L'état (en attente / en cours / succès / échec) est piloté
 * par le parent via `status` et `result`.
 */

import { AlertTriangle, CalendarPlus, CheckCircle2, FolderPlus, ListPlus, Loader2, Mail, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getCopilotTool, type CopilotToolCall, type CopilotToolResult } from '@/lib/ai-copilot-tools';

export type CopilotActionStatus = 'pending' | 'executing' | 'done' | 'error' | 'cancelled';

export interface CopilotActionCardProps {
    call: CopilotToolCall;
    status: CopilotActionStatus;
    /** Résultat renvoyé après exécution (si `status` vaut `done` ou `error`). */
    result?: CopilotToolResult | null;
    onConfirm: (call: CopilotToolCall) => void;
    onCancel: (call: CopilotToolCall) => void;
}

/** Icône associée au service Google de l'outil. */
function ToolIcon({ tool }: { tool: CopilotToolCall['tool'] }) {
    const className = 'w-4 h-4 shrink-0';
    switch (tool) {
        case 'calendar.createEvent':
            return <CalendarPlus className={className} />;
        case 'gmail.sendEmail':
            return <Mail className={className} />;
        case 'tasks.createTask':
            return <ListPlus className={className} />;
        case 'drive.createMandateFolder':
            return <FolderPlus className={className} />;
        default:
            return <CalendarPlus className={className} />;
    }
}

/** Libellé lisible du service concerné. */
function serviceLabel(tool: CopilotToolCall['tool']): string {
    switch (tool) {
        case 'calendar.createEvent':
            return 'Google Agenda';
        case 'gmail.sendEmail':
            return 'Gmail';
        case 'tasks.createTask':
            return 'Google Tasks';
        case 'drive.createMandateFolder':
            return 'Google Drive';
        default:
            return 'Google Workspace';
    }
}

export function CopilotActionCard({
    call,
    status,
    result,
    onConfirm,
    onCancel,
}: CopilotActionCardProps) {
    const definition = getCopilotTool(call.tool);
    const label = definition?.label || call.tool;
    const isBusy = status === 'executing';
    const isSettled = status === 'done' || status === 'error' || status === 'cancelled';

    const borderClass =
        status === 'done'
            ? 'border-emerald-200 bg-emerald-50/60'
            : status === 'error'
                ? 'border-red-200 bg-red-50/60'
                : status === 'cancelled'
                    ? 'border-gray-200 bg-gray-50/60'
                    : 'border-[#F3E8EE] bg-[#FCFAF7]';

    return (
        <div className={`rounded-2xl border ${borderClass} p-3.5 space-y-3`}>
            <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-[#E12B7B]">
                    <ToolIcon tool={call.tool} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Action proposée · {serviceLabel(call.tool)}
                    </p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{label}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{call.summary}</p>
                </div>
            </div>

            {status === 'done' && result && (
                <div className="flex items-start gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                        {result.message}
                        {result.href && (
                            <>
                                {' '}
                                <a
                                    href={result.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold underline hover:no-underline"
                                >
                                    Ouvrir
                                </a>
                            </>
                        )}
                    </span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-start gap-2 text-xs text-red-700">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                        {result?.message || 'L’action a échoué. Vérifiez votre connexion Google.'}
                    </span>
                </div>
            )}

            {status === 'cancelled' && (
                <div className="flex items-start gap-2 text-xs text-gray-500">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Action annulée.</span>
                </div>
            )}

            {status === 'pending' && (
                <>
                    <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-2.5 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                            Rien ne sera écrit dans votre compte Google avant votre confirmation.
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => onConfirm(call)}
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                            Confirmer
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => onCancel(call)}
                            leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        >
                            Annuler
                        </Button>
                    </div>
                </>
            )}

            {isBusy && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exécution en cours…</span>
                </div>
            )}
        </div>
    );
}
