'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/public-store';
import { PropertyCard } from '@/components/public/PropertyCard';
import { Search, RotateCcw, Home, SlidersHorizontal } from 'lucide-react';

function PropertiesCatalogueContent() {
  const searchParams = useSearchParams();
  const { properties } = useNellimoStore();

  // URL Params or defaults
  const initialType = searchParams.get('type') || 'tous';
  const initialCity = searchParams.get('ville') || 'tous';
  const initialBudget = searchParams.get('budget') || '';

  // Local state
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [maxPrice, setMaxPrice] = useState<string>(initialBudget);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'surface_desc'>('newest');
  const [filterMustHaveGarden, setFilterMustHaveGarden] = useState(false);
  const [filterMustHavePool, setFilterMustHavePool] = useState(false);

  // Filtered list
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Status must be active or under contract
      if (p.status !== 'actif' && p.status !== 'sous_compromis') return false;

      // Property type
      if (selectedType !== 'tous' && p.property_type !== selectedType) return false;

      // City
      if (selectedCity !== 'tous' && !p.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;

      // Max Price
      if (maxPrice && p.price_fai > Number(maxPrice)) return false;

      // Min Bedrooms
      if (minBedrooms > 0 && p.bedrooms_count < minBedrooms) return false;

      // Garden
      if (filterMustHaveGarden && (!p.land_area || p.land_area <= 0)) return false;

      // Pool
      if (filterMustHavePool && !p.features.some(f => f.toLowerCase().includes('piscine'))) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_fai - b.price_fai;
      if (sortBy === 'price_desc') return b.price_fai - a.price_fai;
      if (sortBy === 'surface_desc') return b.living_area - a.living_area;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [properties, selectedType, selectedCity, maxPrice, minBedrooms, filterMustHaveGarden, filterMustHavePool, sortBy]);

  const handleReset = () => {
    setSelectedType('tous');
    setSelectedCity('tous');
    setMaxPrice('');
    setMinBedrooms(0);
    setFilterMustHaveGarden(false);
    setFilterMustHavePool(false);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
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
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc' | 'surface_desc')}
            className="p-2 bg-white border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
          >
            <option value="newest">Nouveautés d&apos;abord</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="surface_desc">Surface habitable</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            <SlidersHorizontal className="w-4 h-4 text-[#E12B7B]" />
            Filtres de recherche instantanée
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-[#E12B7B] flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser les filtres
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Type de bien</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
            <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Commune</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
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
            <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Budget Max</label>
            <input
              type="number"
              placeholder="Ex: 600000 €"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>

          {/* Chambres */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Chambres min.</label>
            <select
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(Number(e.target.value))}
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
              onChange={(e) => setFilterMustHaveGarden(e.target.checked)}
              className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
            />
            <span>Avec Jardin / Terrain</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterMustHavePool}
              onChange={(e) => setFilterMustHavePool(e.target.checked)}
              className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
            />
            <span>Avec Piscine</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs font-semibold text-gray-500">
        Affichage de <span className="text-[#E12B7B] font-bold">{filteredProperties.length}</span> bien(s) correspondant à vos critères
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#F3E8EE] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-gray-900">
            Aucun bien ne correspond à ces critères
          </h3>
          <p className="text-gray-500 text-xs max-w-md mx-auto">
            Modifiez vos filtres ou contactez Nelly directement pour enregistrer votre recherche personnalisée dans notre CRM Acquéreurs.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-[#131B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#E12B7B] transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

    </div>
  );
}

export default function PropertiesCataloguePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Chargement du catalogue...</div>}>
      <PropertiesCatalogueContent />
    </Suspense>
  );
}
