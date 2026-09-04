'use client';

import { Search } from 'lucide-react';
import type { ValuationInputs } from './avis-de-valeur-types';

interface PropertyFormProps {
    inputs: ValuationInputs;
    onChange: (patch: Partial<ValuationInputs>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

/** Section 1: Fiche Descriptive du Bien à Estimer. */
export function PropertyForm({ inputs, onChange, onSubmit }: PropertyFormProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
            <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#E12B7B]" />
                1. Fiche Descriptive du Bien à Estimer
            </h3>

            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse ou Lieu-dit</label>
                    <input
                        type="text"
                        required
                        value={inputs.addressSearch}
                        onChange={(e) => onChange({ addressSearch: e.target.value })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom du Propriétaire Mandant</label>
                    <input
                        type="text"
                        required
                        value={inputs.ownerName}
                        onChange={(e) => onChange({ ownerName: e.target.value })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Typologie</label>
                    <select
                        value={inputs.propertyType}
                        onChange={(e) => onChange({ propertyType: e.target.value })}
                        className={inputClass}
                    >
                        <option value="Maison">Maison / Villa</option>
                        <option value="Appartement">Appartement</option>
                        <option value="Terrain">Terrain à bâtir</option>
                        <option value="Propriété de charme">Mas / Propriété de charme</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Habitable (m²)</label>
                    <input
                        type="number"
                        value={inputs.surfaceInput}
                        onChange={(e) => onChange({ surfaceInput: Number(e.target.value) })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Terrain (m²)</label>
                    <input
                        type="number"
                        value={inputs.landInput}
                        onChange={(e) => onChange({ landInput: Number(e.target.value) })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nombre de pièces</label>
                    <input
                        type="number"
                        value={inputs.roomsInput}
                        onChange={(e) => onChange({ roomsInput: Number(e.target.value) })}
                        className={inputClass}
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <Search className="w-3.5 h-3.5" />
                        Actualiser Données
                    </button>
                </div>
            </form>
        </div>
    );
}
