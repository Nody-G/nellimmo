'use client';

import React from 'react';
import { Search, X, LayoutGrid, Table, ArrowUpDown, Filter } from 'lucide-react';

export type MandatesSortOption =
  | 'recent'
  | 'oldest'
  | 'price_desc'
  | 'price_asc'
  | 'area_desc'
  | 'area_asc'
  | 'sqm_desc'
  | 'sqm_asc'
  | 'city_asc'
  | 'ref_desc';

interface MandatesFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  sortBy: MandatesSortOption;
  onSortByChange: (sort: MandatesSortOption) => void;
  totalCount?: number;
  filteredCount?: number;
}

export function MandatesFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
}: MandatesFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Top Filter Bar: Search, Sort & View Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par réf., titre, ville ou vendeur..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#FCFAF7] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#E12B7B] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Sorting & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#FCFAF7] px-3 py-1.5 rounded-xl border border-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#E12B7B] shrink-0" />
            <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as MandatesSortOption)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="recent">Date de mandat (Plus récents)</option>
              <option value="oldest">Date de mandat (Plus anciens)</option>
              <option value="price_desc">Prix FAI (Plus élevé)</option>
              <option value="price_asc">Prix FAI (Plus accessible)</option>
              <option value="area_desc">Surface m² (Plus grande)</option>
              <option value="area_asc">Surface m² (Plus compacte)</option>
              <option value="sqm_desc">Prix au m² (€/m² le plus haut)</option>
              <option value="sqm_asc">Prix au m² (€/m² le plus attractif)</option>
              <option value="city_asc">Commune (A → Z)</option>
              <option value="ref_desc">N° Mandat (Décroissant)</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-[#FCFAF7] p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Affichage Grille Moderne"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#131B26] shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#E12B7B]" />
              <span className="hidden sm:inline">Grille</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Affichage Tableau ALUR"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#131B26] shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Tableau</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Row: Facet Selectors & Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filtres :</span>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-[#E12B7B] shadow-2xs"
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
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-[#E12B7B] shadow-2xs"
          >
            <option value="tous">Tous les types de mandat</option>
            <option value="exclusif">Mandat Exclusif</option>
            <option value="simple">Mandat Simple</option>
            <option value="semi-exclusif">Mandat Semi-Exclusif</option>
          </select>
        </div>

        {/* Counter Pill */}
        {filteredCount !== undefined && totalCount !== undefined && (
          <div className="text-xs font-semibold text-gray-500">
            <span className="text-[#E12B7B] font-bold">{filteredCount}</span> bien{filteredCount > 1 ? 's' : ''} affiché{filteredCount > 1 ? 's' : ''} sur {totalCount}
          </div>
        )}
      </div>
    </div>
  );
}
