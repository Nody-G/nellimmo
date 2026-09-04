'use client';

import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { WeekDay } from './agenda-types';

export type AgendaViewMode = 'week' | 'day' | 'list';

interface AgendaControlBarProps {
    viewMode: AgendaViewMode;
    onViewModeChange: (mode: AgendaViewMode) => void;
    categoryFilter: string;
    onCategoryFilterChange: (value: string) => void;
    weekDays: WeekDay[];
    allEventsCount: number;
    filteredEventsCount: number;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
}

export function AgendaControlBar({
    viewMode,
    onViewModeChange,
    categoryFilter,
    onCategoryFilterChange,
    weekDays,
    allEventsCount,
    filteredEventsCount,
    onPrevWeek,
    onNextWeek,
    onToday,
}: AgendaControlBarProps) {
    const viewButton = (mode: AgendaViewMode, label: string) => (
        <button
            onClick={() => onViewModeChange(mode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${viewMode === mode ? 'bg-white text-[#131B26] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F3E8EE] shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Date Navigator */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                <button
                    onClick={onPrevWeek}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition cursor-pointer"
                    title="Semaine précédente"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                    onClick={onToday}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-800 transition cursor-pointer"
                >
                    Aujourd&rsquo;hui
                </button>

                <button
                    onClick={onNextWeek}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition cursor-pointer"
                    title="Semaine suivante"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                <span className="font-serif font-bold text-sm text-[#131B26] ml-2">
                    Semaine du {weekDays[0]?.dayNum} au {weekDays[6]?.dayNum}{' '}
                    {weekDays[6]?.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-full md:w-auto justify-center">
                {viewButton('week', 'Vue Semaine')}
                {viewButton('day', 'Vue Jour')}
                {viewButton('list', `Chronologie (${filteredEventsCount})`)}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryFilterChange(e.target.value)}
                    className="w-full md:w-auto p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                >
                    <option value="all">Tous les flux ({allEventsCount})</option>
                    <option value="visite">Visites Acquéreurs</option>
                    <option value="notaire">Signatures & Notaires</option>
                    <option value="estimation">Estimations Vendeurs</option>
                    <option value="panneau_cle">Clés & Panneaux</option>
                </select>
            </div>
        </div>
    );
}
