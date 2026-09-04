'use client';

import React from 'react';
import type { Property } from '@/lib/types';

interface PropertyDescriptionProps {
    property: Property;
}

/**
 * Descriptif du bien + mention des diagnostics énergétiques (DPE / GES).
 */
export function PropertyDescription({ property }: PropertyDescriptionProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-[#131B26]">
                Descriptif du Bien & Art de Vivre
            </h2>
            <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                {property.description}
                {property.dpe_letter && !property.description.includes('DPE') && (
                    `\n\nDiagnostics énergétiques : DPE Classe ${property.dpe_letter} (${property.dpe_value || '-'} kWh/m²/an)${property.ges_letter ? ` • GES Classe ${property.ges_letter} (${property.ges_value || '-'} kg CO₂/m²/an)` : ''}.`
                )}
            </div>
        </div>
    );
}
