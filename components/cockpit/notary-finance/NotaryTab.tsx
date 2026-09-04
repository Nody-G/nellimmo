'use client';

import { TrendingDown } from 'lucide-react';
import type { NotaryInputs, NotaryResults, PropertyState } from './notary-finance-types';
import { formatEuro } from './notary-finance-types';

interface NotaryTabProps {
    inputs: NotaryInputs;
    results: NotaryResults;
    ids: {
        purchasePrice: string;
        furnitureValue: string;
        propertyState: string;
        department: string;
    };
    onChange: (patch: Partial<NotaryInputs>) => void;
}

export function NotaryTab({ inputs, results, ids, onChange }: NotaryTabProps) {
    const { purchasePrice, furnitureValue, propertyState, departmentRate } = inputs;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={ids.purchasePrice} className="block font-bold uppercase text-gray-700 mb-1">
                            Prix d{"\u2019"}Achat FAI (€)
                        </label>
                        <input
                            id={ids.purchasePrice}
                            type="number"
                            step="5000"
                            value={purchasePrice}
                            onChange={(e) => onChange({ purchasePrice: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor={ids.furnitureValue}
                            className="block font-bold uppercase text-gray-700 mb-1 flex items-center justify-between"
                        >
                            <span>Mobilier Déductible (€)</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">Économie directe</span>
                        </label>
                        <input
                            id={ids.furnitureValue}
                            type="number"
                            step="1000"
                            value={furnitureValue}
                            onChange={(e) => onChange({ furnitureValue: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-[#E12B7B]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={ids.propertyState} className="block font-bold uppercase text-gray-700 mb-1">
                            Nature du Bien
                        </label>
                        <select
                            id={ids.propertyState}
                            value={propertyState}
                            onChange={(e) => onChange({ propertyState: e.target.value as PropertyState })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                        >
                            <option value="ancien">Logement Ancien (~7-8 %)</option>
                            <option value="neuf">Neuf / VEFA Frais Réduits (~2-3 %)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor={ids.department} className="block font-bold uppercase text-gray-700 mb-1">
                            Département (Droits de mutation)
                        </label>
                        <select
                            id={ids.department}
                            value={departmentRate}
                            onChange={(e) => onChange({ departmentRate: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                        >
                            <option value={5.8}>13 - Bouches-du-Rhône (5,80 %)</option>
                            <option value={5.8}>84 - Vaucluse (5,80 %)</option>
                            <option value={5.8}>83 - Var (5,80 %)</option>
                            <option value={5.09}>Indre (Taux minoré 5,09 %)</option>
                        </select>
                    </div>
                </div>

                {/* Furniture tip card */}
                {furnitureValue > 0 && (
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-emerald-900">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-emerald-600" />
                            <span>
                                Optimisation fiscale : <strong>{formatEuro(results.savingsFromFurniture)} €</strong> d{"\u2019"}impôts
                                économisés grâce à la liste de mobilier déduite !
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Summary (5 cols) */}
            <div className="lg:col-span-5 bg-[#FCFAF7] p-5 rounded-2xl border border-[#F3E8EE] space-y-4">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        Total Frais d{"\u2019"}Acquisition Notariés
                    </span>
                    <div className="text-3xl font-serif font-black text-[#131B26]">
                        {formatEuro(results.totalNotaryFees)} €
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">
                        Soit ~{results.notaryPercent} % du prix d{"\u2019"}achat
                    </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
                    <div className="flex justify-between text-gray-600">
                        <span>Droits de mutation (Trésor Public) :</span>
                        <span className="font-bold text-gray-900">{formatEuro(Math.round(results.transferTaxes))} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Émoluments du Notaire (Décret 2020-179 TTC) :</span>
                        <span className="font-bold text-gray-900">{formatEuro(Math.round(results.emolsTTC))} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Contribution Sécurité Immobilière (CSI) :</span>
                        <span className="font-bold text-gray-900">{formatEuro(Math.round(results.csi))} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Débours, pièces d{"\u2019"}état-civil & cadastre :</span>
                        <span className="font-bold text-gray-900">{formatEuro(results.disbursements)} €</span>
                    </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-600">
                    Coût total projet (Bien + Notaire) :{' '}
                    <strong className="text-[#131B26]">
                        {formatEuro(purchasePrice + results.totalNotaryFees)} €
                    </strong>
                </div>
            </div>
        </div>
    );
}
