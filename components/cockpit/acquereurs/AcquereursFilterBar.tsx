'use client';

import React from 'react';
import { Filter, Search, X, LayoutGrid, Table, ArrowUpDown } from 'lucide-react';
import { FINANCING_STATUS_OPTIONS } from './acquereurs-types';

export type AcquereursSortOption =
  | 'matching_desc'
  | 'matching_asc'
  | 'budget_desc'
  | 'budget_asc'
  | 'surface_desc'
  | 'surface_asc'
  | 'recent'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'financing';

interface AcquereursFilterBarProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  sortBy: AcquereursSortOption;
  onSortByChange: (sort: AcquereursSortOption) => void;
  totalCount?: number;
  filteredCount?: number;
}

/** Search, sort and financing-status filter bar. */
export function AcquereursFilterBar({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
}: AcquereursFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F3E8EE] shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, commune (ex: Lambesc, Salon)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E12B7B] focus:bg-white text-gray-900 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls: Sort, Filter, and Grid/Table Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FCFAF7] px-3 py-1.5 rounded-xl border border-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#E12B7B] shrink-0" />
            <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">Tri :</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as AcquereursSortOption)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="matching_desc">Meilleur matching (Mandats correspondants)</option>
              <option value="matching_asc">Matching (Moins de mandats)</option>
              <option value="budget_desc">Budget max (Plus élevé)</option>
              <option value="budget_asc">Budget max (Plus accessible)</option>
              <option value="surface_desc">Surface min (Plus grande)</option>
              <option value="surface_asc">Surface min (Plus compacte)</option>
              <option value="recent">Inscription (Plus récents)</option>
              <option value="oldest">Inscription (Plus anciens)</option>
              <option value="name_asc">Nom (A → Z)</option>
              <option value="name_desc">Nom (Z → A)</option>
              <option value="financing">Financement validé en priorité</option>
            </select>
          </div>

          {/* View mode toggle */}
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

      {/* Financing Filter Pills & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs font-semibold text-gray-500">Profil financier :</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="p-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="all">Tous les profils financiers</option>
            {FINANCING_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {filteredCount !== undefined && totalCount !== undefined && (
          <div className="text-xs font-semibold text-gray-500">
            <span className="text-[#E12B7B] font-bold">{filteredCount}</span> acquéreur{filteredCount > 1 ? 's' : ''} sur {totalCount}
          </div>
        )}
      </div>
    </div>
  );
}
