'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface CatalogFilterBarProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  maxPrice: string;
  onPriceChange: (value: string) => void;
  minBedrooms: number;
  onBedroomsChange: (value: number) => void;
  filterMustHaveGarden: boolean;
  onGardenChange: (value: boolean) => void;
  filterMustHavePool: boolean;
  onPoolChange: (value: boolean) => void;
  onReset: () => void;
}

export function CatalogFilterBar({
  selectedType,
  onTypeChange,
  selectedCity,
  onCityChange,
  maxPrice,
  onPriceChange,
  minBedrooms,
  onBedroomsChange,
  filterMustHaveGarden,
  onGardenChange,
  filterMustHavePool,
  onPoolChange,
  onReset,
}: CatalogFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
          <SlidersHorizontal className="w-4 h-4 text-[#E12B7B]" />
          <span>Filtres de recherche instantanée</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-[#E12B7B] flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser les filtres</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Type */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
            Type de bien
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
          >
            <option value="tous">Tous les types</option>
            <option value="maison">Maison / Villa</option>
            <option value="appartement">Appartement</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        {/* Ville */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
            Commune
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
          >
            <option value="tous">Toutes les communes</option>
            <option value="Pelissanne">Pélissanne</option>
            <option value="Salon-de-Provence">Salon-de-Provence</option>
            <option value="Lambesc">Lambesc</option>
            <option value="Aurons">Aurons / La Barben</option>
            <option value="Grans">Grans / Lançon</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
            Budget Max
          </label>
          <input
            type="number"
            placeholder="Ex: 600000 €"
            value={maxPrice}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
          />
        </div>

        {/* Chambres */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
            Chambres min.
          </label>
          <select
            value={minBedrooms}
            onChange={(e) => onBedroomsChange(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
          >
            <option value={0}>Peu importe</option>
            <option value={2}>2 chambres et +</option>
            <option value={3}>3 chambres et +</option>
            <option value={4}>4 chambres et +</option>
            <option value={5}>5 chambres et +</option>
          </select>
        </div>
      </div>

      {/* Checkbox Options */}
      <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterMustHaveGarden}
            onChange={(e) => onGardenChange(e.target.checked)}
            className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
          />
          <span>Avec Jardin / Terrain</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterMustHavePool}
            onChange={(e) => onPoolChange(e.target.checked)}
            className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
          />
          <span>Avec Piscine</span>
        </label>
      </div>
    </div>
  );
}
