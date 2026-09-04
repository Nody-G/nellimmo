'use client';

import { Landmark, FileSignature, Euro, Clock, Search, Plus } from 'lucide-react';
import type { Property } from '@/lib/types';
import type { UrgentAlert } from './transactions-types';

interface TransactionsHeaderProps {
    activeDealsCount: number;
    closedDealsCount: number;
    totalActiveVolume: number;
    totalActiveFees: number;
    totalEarnedFees: number;
    urgentAlert: UrgentAlert | null;
    properties: Property[];
    searchTerm: string;
    onSearchChange: (v: string) => void;
    onNewDeal: () => void;
}

export function TransactionsHeader({
    activeDealsCount,
    closedDealsCount,
    totalActiveVolume,
    totalActiveFees,
    totalEarnedFees,
    urgentAlert,
    properties,
    searchTerm,
    onSearchChange,
    onNewDeal
}: TransactionsHeaderProps) {
    return (
        <>
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                        <Landmark className="w-4 h-4" />
                        <span>Suivi Notarial & Pipeline Transactionnel</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                        Pipeline des Ventes & Dossiers Notaires
                    </h1>
                    <p className="text-xs text-gray-500">
                        Du compromis de vente à l&rsquo;acte authentique : suivez vos délais SRU, vos conditions suspensives de prêt et vos honoraires.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Rechercher un dossier..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B] w-48 sm:w-64"
                        />
                    </div>

                    <button
                        onClick={onNewDeal}
                        className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau Dossier
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
                            Ventes en cours ({activeDealsCount})
                        </span>
                        <span className="text-2xl font-serif font-black text-[#131B26] mt-1 block">
                            {totalActiveVolume.toLocaleString('fr-FR')} €
                        </span>
                        <span className="text-xs font-bold text-[#E12B7B] mt-0.5 block">
                            Honoraires prévisionnels : {totalActiveFees.toLocaleString('fr-FR')} € TTC
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold">
                        <FileSignature className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
                            Honoraires Encaissés ({closedDealsCount})
                        </span>
                        <span className="text-2xl font-serif font-black text-emerald-700 mt-1 block">
                            {totalEarnedFees.toLocaleString('fr-FR')} €
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                            100% encaissés chez notaire (Loi Hoguet)
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Euro className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
                            Échéances Clés & Alertes
                        </span>
                        {urgentAlert ? (
                            <>
                                <span className="text-sm font-bold text-gray-800 mt-1 block line-clamp-1">
                                    {properties.find(p => p.id === urgentAlert.deal.property_id)?.title || urgentAlert.deal.buyer_name}
                                </span>
                                <span className={`text-xs font-semibold mt-0.5 block ${urgentAlert.type === 'urgent' ? 'text-rose-600 font-bold' : 'text-amber-600'
                                    }`}>
                                    {urgentAlert.label}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-bold text-gray-800 mt-1 block">
                                    Aucune échéance critique
                                </span>
                                <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">
                                    Tous les délais sont sous contrôle
                                </span>
                            </>
                        )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${urgentAlert?.type === 'urgent' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </>
    );
}
