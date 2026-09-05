'use client';

import React from 'react';
import { Search, X, Star, LayoutGrid, Table, Filter } from 'lucide-react';
import type { RoleFilterOption } from './useContactsState';

interface ContactsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeRole: RoleFilterOption;
  onRoleChange: (r: RoleFilterOption) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (m: 'grid' | 'table') => void;
  roleCounts: Record<string, number>;
}

const FILTER_ROLES: { id: RoleFilterOption; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'notaire', label: 'Notaires' },
  { id: 'diagnostiqueur', label: 'Diagnostiqueurs' },
  { id: 'courtier', label: 'Courtiers & Banques' },
  { id: 'artisan', label: 'Artisans & BTP' },
  { id: 'vendeur', label: 'Vendeurs' },
  { id: 'acquereur', label: 'Acquéreurs' },
  { id: 'syndic', label: 'Syndics' },
  { id: 'confrere', label: 'Confrères' },
];

export function ContactsFilterBar({
  searchQuery,
  onSearchChange,
  activeRole,
  onRoleChange,
  onlyFavorites,
  onToggleFavorites,
  viewMode,
  onViewModeChange,
  roleCounts,
}: ContactsFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search and Layout row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#F3E8EE] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par nom, entreprise, ville, téléphone, rôle..."
            className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-[#FCFAF7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E12B7B] focus:bg-white text-gray-900 transition"
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

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Favorites filter toggle */}
          <button
            type="button"
            onClick={onToggleFavorites}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
            <span>Favoris ({roleCounts.favoris || 0})</span>
          </button>

          {/* View mode buttons */}
          <div className="flex items-center bg-[#FCFAF7] p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Affichage Grille Cartes Pro"
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#131B26] shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Affichage Tableau CRM"
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#131B26] shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Role filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
          <Filter className="w-3 h-3" />
          Rôles :
        </span>
        {FILTER_ROLES.map((fr) => {
          const count = roleCounts[fr.id] || 0;
          const isSelected = activeRole === fr.id;
          return (
            <button
              key={fr.id}
              type="button"
              onClick={() => onRoleChange(fr.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-[#131B26] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{fr.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
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
