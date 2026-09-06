'use client';

import React from 'react';
import { Search, X, LayoutGrid, Table, ArrowUpDown, Filter } from 'lucide-react';
import { SOURCE_OPTIONS, STATUS_OPTIONS } from './pige-types';

export type PigeSortOption =
  | 'recent'
  | 'oldest'
  | 'dvf_opportunity'
  | 'dvf_gap_desc'
  | 'price_desc'
  | 'price_asc'
  | 'surface_desc'
  | 'surface_asc'
  | 'days_online'
  | 'seller_asc'
  | 'seller_desc'
  | 'source_asc'
  | 'source_desc';

interface PigeFilterBarProps {
  searchKeyword: string;
  selectedSourceFilter: string;
  selectedStatusFilter: string;
  onSearchChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  sortBy: PigeSortOption;
  onSortByChange: (sort: PigeSortOption) => void;
  totalCount?: number;
  filteredCount?: number;
}

const selectClass =
  'p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B] shadow-2xs';

/** Filter, sort & search bar for prospecting leads. */
export function PigeFilterBar({
  searchKeyword,
  selectedSourceFilter,
  selectedStatusFilter,
  onSearchChange,
  onSourceChange,
  onStatusChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
}: PigeFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F3E8EE] shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre, nom vendeur, ville, téléphone..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E12B7B] focus:bg-white text-gray-900 transition"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls: Sorting and View mode */}
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FCFAF7] px-3 py-1.5 rounded-xl border border-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#E12B7B] shrink-0" />
            <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">Tri :</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as PigeSortOption)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="recent">Date de détection (Plus récentes)</option>
              <option value="oldest">Date de détection (Plus anciennes)</option>
              <option value="dvf_opportunity">Écart DVF (Meilleures opportunités)</option>
              <option value="dvf_gap_desc">Écart DVF (Sur-cotées en premier)</option>
              <option value="price_desc">Prix demandé (Plus élevé)</option>
              <option value="price_asc">Prix demandé (Plus accessible)</option>
              <option value="surface_desc">Surface habitable (Plus grande)</option>
              <option value="surface_asc">Surface habitable (Plus compacte)</option>
              <option value="seller_asc">Vendeur / Contact (A → Z)</option>
              <option value="seller_desc">Vendeur / Contact (Z → A)</option>
              <option value="source_asc">Source (A → Z)</option>
              <option value="days_online">Ancienneté annonce (Plus de jours)</option>
            </select>
          </div>

          {/* View mode buttons */}
          <div className="flex items-center bg-[#FCFAF7] p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Affichage Grille Cartes Pro"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
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
              title="Affichage Tableau CRM"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
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

      {/* Filter selectors & Results counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filtres :</span>
          </div>

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

        {filteredCount !== undefined && totalCount !== undefined && (
          <div className="text-xs font-semibold text-gray-500">
            <span className="text-[#E12B7B] font-bold">{filteredCount}</span> annonce{filteredCount > 1 ? 's' : ''} sur {totalCount}
          </div>
        )}
      </div>
    </div>
  );
}
