'use client';

import { Search } from 'lucide-react';
import { HELP_CATEGORIES, HELP_GUIDES } from '@/lib/help-content';

interface AideSearchBarProps {
    searchQuery: string;
    selectedCategory: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (id: string) => void;
}

/** Search field + category pills filter bar. */
export function AideSearchBar({
    searchQuery,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
}: AideSearchBarProps) {
    return (
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#F3E8EE] space-y-4">
            {/* Search Field */}
            <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Rechercher par mot-clé (ex: SRU, DVF, mandat exclusif, pige, bon de visite, SHA-256, baisse de prix)..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20 focus:border-[#E12B7B] transition"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded bg-gray-200 cursor-pointer"
                    >
                        Effacer
                    </button>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                {HELP_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count =
                        cat.id === 'all'
                            ? HELP_GUIDES.length
                            : HELP_GUIDES.filter((g) => g.category === cat.id).length;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${isSelected
                                    ? 'bg-[#E12B7B] text-white shadow-xs font-bold'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            <span>{cat.label}</span>
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
