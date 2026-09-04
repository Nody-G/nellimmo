'use client';

import { BellOff } from 'lucide-react';
import type { RelanceAction } from '@/lib/relances';
import { RelanceCard } from './RelanceCard';

interface RelancesListProps {
    actions: RelanceAction[];
    onWhatsApp: (action: RelanceAction) => void;
    onMarkDone: (action: RelanceAction) => void;
    onIgnore: (action: RelanceAction) => void;
}

export function RelancesList({ actions, onWhatsApp, onMarkDone, onIgnore }: RelancesListProps) {
    if (actions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <div className="p-4 mb-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-emerald-500">
                    <BellOff className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800 tracking-tight">Aucune relance à traiter</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Toutes les relances du jour sont traitées. Le moteur recalculera automatiquement les
                    rappels J-1 / J+1, les alertes prêt / SRU / acte et les échéances de mandat.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {actions.map((action) => (
                <RelanceCard
                    key={action.id}
                    action={action}
                    onWhatsApp={onWhatsApp}
                    onMarkDone={onMarkDone}
                    onIgnore={onIgnore}
                />
            ))}
        </div>
    );
}
