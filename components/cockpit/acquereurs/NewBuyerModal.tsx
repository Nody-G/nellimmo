'use client';

import { X } from 'lucide-react';
import type { FinancingStatus } from '@/lib/types';
import { FINANCING_STATUS_OPTIONS } from './acquereurs-types';

interface NewBuyerFormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    budgetMax: number;
    minSurface: number;
    minRooms: number;
    minBedrooms: number;
    targetCities: string;
    mustHaveGarden: boolean;
    mustHaveGarage: boolean;
    financingStatus: FinancingStatus;
    notes: string;
}

interface NewBuyerModalProps {
    isOpen: boolean;
    form: NewBuyerFormState;
    onFieldChange: <K extends keyof NewBuyerFormState>(field: K, value: NewBuyerFormState[K]) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

/** Modal form to register a new qualified buyer in the portfolio. */
export function NewBuyerModal({
    isOpen,
    form,
    onFieldChange,
    onSubmit,
    onClose,
}: NewBuyerModalProps) {
    if (!isOpen) return null;

    const inputClass =
        'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]';

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#131B26]">
                        Enregistrer un Nouvel Acquéreur en Portefeuille
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Prénom</label>
                            <input
                                type="text"
                                required
                                value={form.firstName}
                                onChange={(e) => onFieldChange('firstName', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                required
                                value={form.lastName}
                                onChange={(e) => onFieldChange('lastName', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone Portable</label>
                            <input
                                type="tel"
                                required
                                value={form.phone}
                                onChange={(e) => onFieldChange('phone', e.target.value)}
                                placeholder="06..."
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => onFieldChange('email', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Budget Max FAI (€)</label>
                            <input
                                type="number"
                                required
                                value={form.budgetMax}
                                onChange={(e) => onFieldChange('budgetMax', Number(e.target.value))}
                                className={`${inputClass} font-bold`}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Surface Min (m²)</label>
                            <input
                                type="number"
                                value={form.minSurface}
                                onChange={(e) => onFieldChange('minSurface', Number(e.target.value))}
                                className={`${inputClass} font-bold`}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Chambres Min</label>
                            <input
                                type="number"
                                value={form.minBedrooms}
                                onChange={(e) => onFieldChange('minBedrooms', Number(e.target.value))}
                                className={`${inputClass} font-bold`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold uppercase text-gray-700 mb-1">Secteurs Ciblés (Séparés par virgules)</label>
                        <input
                            type="text"
                            value={form.targetCities}
                            onChange={(e) => onFieldChange('targetCities', e.target.value)}
                            placeholder="Pélissanne, Lambesc, Salon-de-Provence..."
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase text-gray-700 mb-1">Statut Financier</label>
                        <select
                            value={form.financingStatus}
                            onChange={(e) => onFieldChange('financingStatus', e.target.value as FinancingStatus)}
                            className={inputClass}
                        >
                            {FINANCING_STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold">
                            <input
                                type="checkbox"
                                checked={form.mustHaveGarden}
                                onChange={(e) => onFieldChange('mustHaveGarden', e.target.checked)}
                                className="accent-[#E12B7B]"
                            />
                            <span>Jardin / Extérieur obligatoire</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-semibold">
                            <input
                                type="checkbox"
                                checked={form.mustHaveGarage}
                                onChange={(e) => onFieldChange('mustHaveGarage', e.target.checked)}
                                className="accent-[#E12B7B]"
                            />
                            <span>Garage obligatoire</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
                    >
                        Créer l{"\u2019"}Acquéreur & Calculer le Matching
                    </button>
                </form>
            </div>
        </div>
    );
}
