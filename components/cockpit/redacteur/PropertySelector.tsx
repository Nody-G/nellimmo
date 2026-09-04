'use client';

import { FileText, Sliders } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface PropertySelectorProps {
    properties: Property[];
    selectedPropertyId: string;
    currentProperty: Property | undefined;
    customNotes: string;
    onPropertyChange: (id: string) => void;
    onNotesChange: (value: string) => void;
}

/** Left column card: source mandate selection + custom notes. */
export function PropertySelector({
    properties,
    selectedPropertyId,
    currentProperty,
    customNotes,
    onPropertyChange,
    onNotesChange,
}: PropertySelectorProps) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E12B7B]" />
                1. Mandat Source du Portefeuille
            </h3>

            <div>
                <select
                    value={selectedPropertyId}
                    onChange={(e) => onPropertyChange(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
                >
                    {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                            {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                        </option>
                    ))}
                </select>
            </div>

            {currentProperty && (
                <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-[#F3E8EE] text-xs space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Localisation :</span>
                        <span className="font-bold text-gray-900">
                            {currentProperty.city} ({currentProperty.postal_code})
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Surface & Pièces :</span>
                        <span className="font-bold text-gray-900">
                            {currentProperty.living_area} m² • {currentProperty.rooms_count}p /{' '}
                            {currentProperty.bedrooms_count}ch
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Terrain :</span>
                        <span className="font-bold text-gray-900">
                            {currentProperty.land_area
                                ? `${currentProperty.land_area} m²`
                                : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Prix FAI :</span>
                        <span className="font-bold text-[#E12B7B]">
                            {currentProperty.price_fai.toLocaleString('fr-FR')} €
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Performance DPE :</span>
                        <span className="font-bold text-gray-900">
                            {currentProperty.dpe_letter
                                ? `Classe ${currentProperty.dpe_letter}`
                                : 'Vierge'}
                        </span>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-[#E12B7B]" />
                        Consignes & Idées Spécifiques
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">Optionnel</span>
                </label>
                <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Ex: Belle exposition Sud, aucun vis-à-vis, cuisine équipée avec îlot central, quartier calme..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-[#E12B7B]"
                />
            </div>
        </div>
    );
}
