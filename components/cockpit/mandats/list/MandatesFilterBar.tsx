'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface MandatesFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export function MandatesFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
}: MandatesFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
      {/* Search input */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par réf., titre, ville ou vendeur..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
        />
      </div>

      {/* Filter selectors */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-[#E12B7B]"
        >
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actif en vente</option>
          <option value="sous_compromis">Sous compromis</option>
          <option value="vendu">Vendu</option>
          <option value="archive">Archivé</option>
          <option value="resilie">Résilié</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-[#E12B7B]"
        >
          <option value="tous">Tous les types de mandat</option>
          <option value="exclusif">Mandat Exclusif</option>
          <option value="simple">Mandat Simple</option>
          <option value="semi-exclusif">Mandat Semi-Exclusif</option>
        </select>
      </div>
    </div>
  );
}
