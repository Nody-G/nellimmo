'use client';

import React from 'react';
import { Bath, BedDouble, Maximize } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyKeySpecsProps {
    property: Property;
    pricePerM2: number;
}

/**
 * Carte des caractéristiques clés (surface, pièces, terrain, salles de bains).
 */
export function PropertyKeySpecs({ property, pricePerM2 }: PropertyKeySpecsProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 border-r border-gray-100 last:border-0">
                <span className="text-[11px] uppercase font-bold text-gray-400">Surface Habitable</span>
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                    <Maximize className="w-4 h-4 text-[#E12B7B]" />
                    {property.living_area} m²
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">{pricePerM2.toLocaleString('fr-FR')} €/m²</span>
            </div>

            <div className="space-y-1 border-r border-gray-100 last:border-0">
                <span className="text-[11px] uppercase font-bold text-gray-400">Pièces / Chambres</span>
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-[#E12B7B]" />
                    {property.rooms_count}p / {property.bedrooms_count}ch
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">Idéal famille</span>
            </div>

            <div className="space-y-1 border-r border-gray-100 last:border-0">
                <span className="text-[11px] uppercase font-bold text-gray-400">Terrain / Parcelle</span>
                <div className="text-2xl font-bold text-gray-900">
                    {property.land_area ? `${property.land_area} m²` : '—'}
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">Jardin privatif</span>
            </div>

            <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold text-gray-400">Salles de Bains</span>
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                    <Bath className="w-4 h-4 text-[#E12B7B]" />
                    {property.bathrooms_count || 1}
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">Baignoire / Douche</span>
            </div>
        </div>
    );
}
