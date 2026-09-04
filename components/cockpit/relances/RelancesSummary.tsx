'use client';

import { CalendarClock, Handshake, Landmark, FileClock, ScrollText, Hourglass } from 'lucide-react';
import type { RelanceCategory } from '@/lib/relances';

export interface RelanceSummaryItem {
    category: RelanceCategory;
    label: string;
    count: number;
}

interface RelancesSummaryProps {
    items: RelanceSummaryItem[];
    activeCategory: RelanceCategory | '';
    onSelectCategory: (category: RelanceCategory | '') => void;
}

const CATEGORY_ICONS: Record<RelanceCategory, React.ReactNode> = {
    visite_rappel: <CalendarClock className="w-4 h-4" />,
    visite_relance: <Handshake className="w-4 h-4" />,
    transaction_pret: <Landmark className="w-4 h-4" />,
    transaction_sru: <Hourglass className="w-4 h-4" />,
    transaction_acte: <ScrollText className="w-4 h-4" />,
    mandat_echeance: <FileClock className="w-4 h-4" />,
};

export function RelancesSummary({ items, activeCategory, onSelectCategory }: RelancesSummaryProps) {
    const total = items.reduce((sum, it) => sum + it.count, 0);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <button
                onClick={() => onSelectCategory('')}
                className={`text-left rounded-2xl border p-4 transition cursor-pointer ${activeCategory === ''
                        ? 'bg-[#131B26] text-white border-[#131B26] shadow-md'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
            >
                <div className="text-2xl font-serif font-bold">{total}</div>
                <div className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${activeCategory === '' ? 'text-white/70' : 'text-gray-500'}`}>
                    À traiter
                </div>
            </button>

            {items.map((it) => {
                const isActive = activeCategory === it.category;
                return (
                    <button
                        key={it.category}
                        onClick={() => onSelectCategory(isActive ? '' : it.category)}
                        className={`text-left rounded-2xl border p-4 transition cursor-pointer ${isActive
                                ? 'bg-[#E12B7B] text-white border-[#E12B7B] shadow-md'
                                : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                            }`}
                    >
                        <div className={`flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-[#E12B7B]'}`}>
                            {CATEGORY_ICONS[it.category]}
                            <span className="text-2xl font-serif font-bold leading-none">{it.count}</span>
                        </div>
                        <div className={`text-[11px] font-bold uppercase tracking-wider mt-1.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {it.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
