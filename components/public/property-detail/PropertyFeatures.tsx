'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyFeaturesProps {
    property: Property;
}

/**
 * Grille des équipements & prestations remarquables du bien.
 */
export function PropertyFeatures({ property }: PropertyFeaturesProps) {
    if (!property.features || property.features.length === 0) return null;

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#131B26]">
                Équipements & Prestations Remarquables
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3.5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] text-xs font-semibold text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
