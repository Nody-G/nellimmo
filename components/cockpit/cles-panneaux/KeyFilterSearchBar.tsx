'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface KeyFilterSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export const KeyFilterSearchBar: React.FC<KeyFilterSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher un trousseau, une adresse, un artisan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs font-bold text-gray-500">Statut :</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        >
          <option value="tous">Tous les trousseaux</option>
          <option value="disponible">En Agence (Disponible)</option>
          <option value="prete">Sorti / Prêté</option>
          <option value="double_proprietaire">Double Propriétaire</option>
        </select>
      </div>
    </div>
  );
};
