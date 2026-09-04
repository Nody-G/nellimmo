'use client';

import { ChevronRight, Clock, HelpCircle } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

interface GuideListProps {
    guides: HelpGuide[];
    activeGuideId: string;
    searchQuery: string;
    onSelectGuide: (id: string) => void;
    onResetFilters: () => void;
}

/** Left column: list of available help guides with active state. */
export function GuideList({
    guides,
    activeGuideId,
    searchQuery,
    onSelectGuide,
    onResetFilters,
}: GuideListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Guides Disponibles ({guides.length})
                </span>
                {searchQuery && (
                    <span className="text-[11px] text-gray-400">
                        Filtré par &ldquo;{searchQuery}&rdquo;
                    </span>
                )}
            </div>

            <div className="space-y-2 max-h-[800px] overflow-y-auto pr-1">
                {guides.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-500 space-y-2">
                        <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-xs font-semibold text-gray-700">
                            Aucun guide ne correspond à votre recherche
                        </p>
                        <button
                            onClick={onResetFilters}
                            className="text-xs text-[#E12B7B] hover:underline font-bold cursor-pointer"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    guides.map((guide) => {
                        const isActive = activeGuideId === guide.id;

                        return (
                            <div
                                key={guide.id}
                                onClick={() => onSelectGuide(guide.id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${isActive
                                        ? 'bg-white border-[#E12B7B] shadow-md ring-2 ring-[#E12B7B]/10'
                                        : 'bg-white hover:bg-gray-50/80 border-gray-200/80'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        {guide.categoryLabel}
                                    </span>
                                    {guide.badge && (
                                        <span
                                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${guide.badge === 'Légal & Vital'
                                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                                    : guide.badge === 'Conquête Terrain'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                        : 'bg-[#FDF2F8] text-[#E12B7B] border border-pink-100'
                                                }`}
                                        >
                                            {guide.badge}
                                        </span>
                                    )}
                                </div>

                                <h3
                                    className={`text-xs font-bold leading-snug ${isActive ? 'text-[#E12B7B]' : 'text-gray-900'
                                        }`}
                                >
                                    {guide.title}
                                </h3>

                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                    {guide.summary}
                                </p>

                                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {guide.readTimeMinutes} min de lecture
                                    </span>
                                    <span className="font-bold flex items-center gap-0.5 text-[#E12B7B]">
                                        Voir le guide <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
