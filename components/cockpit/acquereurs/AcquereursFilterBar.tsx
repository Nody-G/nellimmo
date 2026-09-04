'use client';

import { Filter, Search } from 'lucide-react';
import { FINANCING_STATUS_OPTIONS } from './acquereurs-types';

interface AcquereursFilterBarProps {
    searchQuery: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
}

/** Search and financing-status filter bar. */
export function AcquereursFilterBar({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
}: AcquereursFilterBarProps) {
    return (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F3E8EE] shadow-2xs flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Rechercher par nom, téléphone, commune recherchée (ex: Lambesc, Salon)..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B] w-full sm:w-auto"
                >
                    <option value="all">Tous les profils financiers</option>
                    {FINANCING_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
