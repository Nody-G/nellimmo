'use client';

import { BarChart3 } from 'lucide-react';
import type { AnalyticsPeriod } from '@/lib/analytics';

interface AnalyticsHeaderProps {
    period: AnalyticsPeriod;
    onPeriodChange: (period: AnalyticsPeriod) => void;
}

const PERIOD_OPTIONS: { id: AnalyticsPeriod; label: string }[] = [
    { id: '12m', label: '12 derniers mois' },
    { id: 'ytd', label: 'Année en cours' },
    { id: 'all', label: 'Tout l\u2019historique' },
];

export function AnalyticsHeader({ period, onPeriodChange }: AnalyticsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analyse & Performance de l&rsquo;Agence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
                    Tableau de Bord Analytique
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Pipeline, honoraires, activité commerciale et performance des mandats
                </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-2xs w-fit">
                {PERIOD_OPTIONS.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onPeriodChange(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${period === opt.id
                                ? 'bg-[#131B26] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
