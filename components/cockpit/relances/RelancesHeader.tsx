'use client';

import { BellRing, CheckCircle2 } from 'lucide-react';

interface RelancesHeaderProps {
    pendingCount: number;
    doneCount: number;
    onReset: () => void;
}

export function RelancesHeader({ pendingCount, doneCount, onReset }: RelancesHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <BellRing className="w-4 h-4" />
                    <span>Pilotage Relationnel de l&rsquo;Agence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
                    Centre de Relances Planifiées
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Rappels de visites, relances post-visite, alertes prêt / SRU / acte et échéances de mandat
                </p>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#131B26] border border-[#131B26] rounded-xl text-xs font-bold text-white shadow-2xs">
                    <BellRing className="w-3.5 h-3.5 text-[#E12B7B]" />
                    <span>{pendingCount} à traiter</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{doneCount} traitées</span>
                </div>
                <button
                    onClick={onReset}
                    className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                    title="Réinitialiser l'historique des relances traitées"
                >
                    Réinitialiser
                </button>
            </div>
        </div>
    );
}
