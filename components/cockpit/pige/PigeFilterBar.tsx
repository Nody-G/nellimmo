'use client';

import { Search } from 'lucide-react';
import { SOURCE_OPTIONS, STATUS_OPTIONS } from './pige-types';

interface PigeFilterBarProps {
    searchKeyword: string;
    selectedSourceFilter: string;
    selectedStatusFilter: string;
    onSearchChange: (value: string) => void;
    onSourceChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

const selectClass =
    'p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

/** Filter & search bar for the prospecting leads. */
export function PigeFilterBar({
    searchKeyword,
    selectedSourceFilter,
    selectedStatusFilter,
    onSearchChange,
    onSourceChange,
    onStatusChange,
}: PigeFilterBarProps) {
    return (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F3E8EE] shadow-2xs flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Rechercher une annonce par titre, nom vendeur, ville, téléphone..."
                    value={searchKeyword}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <select
                    value={selectedSourceFilter}
                    onChange={(e) => onSourceChange(e.target.value)}
                    className={selectClass}
                >
                    <option value="all">Toutes les sources</option>
                    {SOURCE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedStatusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className={selectClass}
                >
                    <option value="all">Tous les statuts</option>
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
