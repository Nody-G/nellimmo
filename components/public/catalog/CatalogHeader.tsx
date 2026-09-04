'use client';

import React from 'react';
import { Home } from 'lucide-react';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'surface_desc';

interface CatalogHeaderProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function CatalogHeader({ sortBy, onSortChange }: CatalogHeaderProps) {
  return (
    <div className="border-b border-[#F3E8EE] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <Home className="w-4 h-4" />
          <span>Catalogue Immobilier Provence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#131B26] mt-1">
          Nos Biens Disponibles à la Vente
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Explorez nos mandats rigoureusement sélectionnés en Pays Salonais et Provence.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-500">Trier par :</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="p-2 bg-white border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
        >
          <option value="newest">Nouveautés d’abord</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="surface_desc">Surface habitable</option>
        </select>
      </div>
    </div>
  );
}
