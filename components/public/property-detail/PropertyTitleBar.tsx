'use client';

import React from 'react';
import { Award, MapPin, Sparkles } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyTitleBarProps {
    property: Property;
}

/**
 * Bloc titre : badges (exclusivité, statut, type, certification) + titre du bien.
 */
export function PropertyTitleBar({ property }: PropertyTitleBarProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                {property.mandate_type === 'exclusif' && (
                    <span className="px-3.5 py-1 bg-[#E12B7B] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FBF6E9]" />
                        Exclusivité Nell’Immo
                    </span>
                )}
                {property.status === 'sous_compromis' && (
                    <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        Sous Compromis
                    </span>
                )}
                <span className="px-3 py-1 bg-[#131B26] text-white text-xs font-semibold uppercase tracking-wider rounded-full capitalize">
                    {property.property_type}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Certifié Nell’Immo
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold ml-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
                    {property.city} ({property.postal_code}) • Pays Salonais
                </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#131B26] leading-tight">
                {property.title}
            </h1>
        </div>
    );
}
