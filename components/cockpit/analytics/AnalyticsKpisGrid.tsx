'use client';

import {
    FileText,
    Landmark,
    BadgeCheck,
    TrendingUp,
    Timer,
    ShoppingBag,
    Percent,
    Users,
} from 'lucide-react';
import type { AnalyticsKpis } from '@/lib/analytics';
import { formatEuro, formatCompactEuro } from '@/lib/analytics';

interface AnalyticsKpisGridProps {
    kpis: AnalyticsKpis;
}

export function AnalyticsKpisGrid({ kpis }: AnalyticsKpisGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stock actif */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Stock Actif</span>
                    <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-[#131B26]">{kpis.activeMandates}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        <span className="font-bold text-[#E12B7B]">{kpis.activeExclusive} exclusifs</span>
                        <span> • {formatCompactEuro(kpis.activeValueFai)} FAI</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                        Honoraires attendus : {formatEuro(kpis.activeFeesExpected)}
                    </div>
                </div>
            </div>

            {/* Pipeline en cours */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Pipeline en cours</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Landmark className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-blue-900">{kpis.pipelineDeals}</div>
                    <div className="text-xs text-blue-700 font-semibold mt-1">
                        dossiers en cours d{"\u2019"}acte
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                        Honoraires en jeu : {formatEuro(kpis.pipelineFees)}
                    </div>
                </div>
            </div>

            {/* Ventes clôturées */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Ventes Clôturées</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-emerald-700">{kpis.closedDeals}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        <span className="font-bold text-emerald-700">{formatEuro(kpis.closedFeesReceived)} encaissés</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                        Volume vendu : {formatCompactEuro(kpis.closedValue)}
                    </div>
                </div>
            </div>

            {/* Conversion */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Taux de Conversion</span>
                    <div className="w-8 h-8 rounded-lg bg-[#FBF6E9] text-[#C59A45] flex items-center justify-center">
                        <Percent className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-[#131B26]">
                        {kpis.conversionRate.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        mandats signés → ventes conclues
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                        {kpis.mandatesSigned} mandats signés sur la période
                    </div>
                </div>
            </div>

            {/* Délai moyen */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Délai Moyen de Vente</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Timer className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-[#131B26]">
                        {kpis.avgDaysToClose !== null ? `${kpis.avgDaysToClose} j` : '\u2014'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">du mandat à l{"\u2019"}acte</div>
                </div>
            </div>

            {/* Panier moyen */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Panier Moyen</span>
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-[#131B26]">
                        {kpis.avgSalePrice !== null ? formatCompactEuro(kpis.avgSalePrice) : '\u2014'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {kpis.avgFeesPerSale !== null ? `Honoraires moy. ${formatEuro(kpis.avgFeesPerSale)}` : 'par vente'}
                    </div>
                </div>
            </div>

            {/* Visites */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Visites Réalisées</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-[#131B26]">{kpis.visitsDone}</div>
                    <div className="text-xs text-gray-500 mt-1">bons émargés sur la période</div>
                </div>
            </div>

            {/* Acquéreurs actifs */}
            <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Acquéreurs Actifs</span>
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-black text-[#131B26]">{kpis.buyersActive}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {kpis.leadsIncoming} leads entrants sur la période
                    </div>
                </div>
            </div>
        </div>
    );
}
