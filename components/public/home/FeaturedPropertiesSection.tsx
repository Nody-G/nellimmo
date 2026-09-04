'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/public/PropertyCard';

interface FeaturedPropertiesSectionProps {
  properties: Property[];
}

export function FeaturedPropertiesSection({ properties }: FeaturedPropertiesSectionProps) {
  const activeProperties = properties.filter(
    (p) => p.status === 'actif' || p.status === 'sous_compromis'
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Sélection Rigoureuse
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#131B26] mt-1">
            Nos Nouveautés Immobilières en Provence
          </h2>
        </div>
        <Link
          href="/biens"
          className="text-xs font-bold uppercase text-[#E12B7B] hover:text-[#C71B62] flex items-center gap-1"
        >
          <span>Voir tous nos biens en vente</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Properties Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProperties.slice(0, 6).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
