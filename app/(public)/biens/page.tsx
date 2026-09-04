'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/public-store';
import { PropertyCard } from '@/components/public/PropertyCard';
import {
  CatalogHeader,
  CatalogFilterBar,
  CatalogEmptyState,
  SortOption,
} from '@/components/public/catalog';

function PropertiesCatalogueContent() {
  const searchParams = useSearchParams();
  const { properties } = useNellimoStore();

  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'tous');
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('ville') || 'tous');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('budget') || '');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterMustHaveGarden, setFilterMustHaveGarden] = useState(false);
  const [filterMustHavePool, setFilterMustHavePool] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (p.status !== 'actif' && p.status !== 'sous_compromis') return false;
      if (selectedType !== 'tous' && p.property_type !== selectedType) return false;
      if (selectedCity !== 'tous' && !p.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      if (maxPrice && p.price_fai > Number(maxPrice)) return false;
      if (minBedrooms > 0 && p.bedrooms_count < minBedrooms) return false;
      if (filterMustHaveGarden && (!p.land_area || p.land_area <= 0)) return false;
      if (filterMustHavePool && !p.features.some((f) => f.toLowerCase().includes('piscine'))) return false;
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
      <CatalogHeader sortBy={sortBy} onSortChange={setSortBy} />

      <CatalogFilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        maxPrice={maxPrice}
        onPriceChange={setMaxPrice}
        minBedrooms={minBedrooms}
        onBedroomsChange={setMinBedrooms}
        filterMustHaveGarden={filterMustHaveGarden}
        onGardenChange={setFilterMustHaveGarden}
        filterMustHavePool={filterMustHavePool}
        onPoolChange={setFilterMustHavePool}
        onReset={handleReset}
      />

      <div className="text-xs font-semibold text-gray-500">
        Affichage de <span className="text-[#E12B7B] font-bold">{filteredProperties.length}</span> bien(s) correspondant à vos critères
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <CatalogEmptyState onReset={handleReset} />
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
