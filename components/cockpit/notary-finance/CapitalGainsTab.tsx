'use client';

import type { CapitalGainsInputs, CapitalGainsResults, WorksOption } from './notary-finance-types';
import { formatEuro } from './notary-finance-types';

interface CapitalGainsTabProps {
    inputs: CapitalGainsInputs;
    results: CapitalGainsResults;
    ids: {
        isPrincipalResidence: string;
        salePrice: string;
        initialPurchasePrice: string;
        holdingYears: string;
        worksOption: string;
    };
    onChange: (patch: Partial<CapitalGainsInputs>) => void;
}

export function CapitalGainsTab({ inputs, results, ids, onChange }: CapitalGainsTabProps) {
    const {
        salePrice,
        initialPurchasePrice,
        holdingYears,
        isPrincipalResidence,
        worksOption,
        realWorksAmount,
    } = inputs;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                        id={ids.isPrincipalResidence}
                        type="checkbox"
                        checked={isPrincipalResidence}
                        onChange={(e) => onChange({ isPrincipalResidence: e.target.checked })}
                        className="accent-[#E12B7B] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={ids.isPrincipalResidence} className="font-bold text-gray-800 cursor-pointer">
                        Résidence Principale (Exonération totale à 100% de la plus-value)
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor={ids.salePrice} className="block font-bold uppercase text-gray-700 mb-1">
                            Prix de Vente Net (€)
                        </label>
                        <input
                            id={ids.salePrice}
                            type="number"
                            step="5000"
                            value={salePrice}
                            onChange={(e) => onChange({ salePrice: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                        />
                    </div>

                    <div>
                        <label htmlFor={ids.initialPurchasePrice} className="block font-bold uppercase text-gray-700 mb-1">
                            Prix d{"\u2019"}Achat Initial (€)
                        </label>
                        <input
                            id={ids.initialPurchasePrice}
                            type="number"
                            step="5000"
                            value={initialPurchasePrice}
                            onChange={(e) => onChange({ initialPurchasePrice: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                        />
                    </div>

                    <div>
                        <label htmlFor={ids.holdingYears} className="block font-bold uppercase text-gray-700 mb-1">
                            Durée Détention (Ans)
                        </label>
                        <input
                            id={ids.holdingYears}
                            type="number"
                            min="0"
                            max="40"
                            value={holdingYears}
                            onChange={(e) => onChange({ holdingYears: Number(e.target.value) })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={ids.worksOption} className="block font-bold uppercase text-gray-700 mb-1">
                            Déduction Forfait Travaux
                        </label>
                        <select
                            id={ids.worksOption}
                            value={worksOption}
                            onChange={(e) => onChange({ worksOption: e.target.value as WorksOption })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                        >
                            <option value="forfait">Forfait légal 15% (détention {'>'} 5 ans)</option>
                            <option value="reel">Montant réel des factures d{"\u2019"}artisans</option>
                        </select>
                    </div>

                    {worksOption === 'reel' && (
                        <div>
                            <label className="block font-bold uppercase text-gray-700 mb-1">Factures Travaux TTC (€)</label>
                            <input
                                type="number"
                                value={realWorksAmount}
                                onChange={(e) => onChange({ realWorksAmount: Number(e.target.value) })}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                            />
                        </div>
                    )}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                    <span className="font-bold block">Abattements légaux après {holdingYears} ans de détention :</span>
                    <div className="flex gap-4">
                        <span>
                            Impôt sur le Revenu (19%) : <strong>{results.irAbatementRate}% d{"\u2019"}abattement</strong>
                        </span>
                        <span>
                            Prélèvements Sociaux (17,2%) :{' '}
                            <strong>{Math.round(results.psAbatementRate)}% d{"\u2019"}abattement</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* Results Summary (5 cols) */}
            <div className="lg:col-span-5 bg-[#FCFAF7] p-5 rounded-2xl border border-[#F3E8EE] space-y-4">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Impôt sur la Plus-Value Dû</span>
                    <div className="text-3xl font-serif font-black text-rose-600">
                        {formatEuro(results.totalCapitalGainsTax)} €
                    </div>
                    {isPrincipalResidence ? (
                        <span className="text-xs text-emerald-600 font-bold block mt-1">
                            ✓ Exonération Résidence Principale (0 € d{"\u2019"}impôt)
                        </span>
                    ) : (
                        <span className="text-xs text-gray-500 font-semibold block mt-1">
                            Net vendeur en poche :{' '}
                            <strong className="text-gray-900">{formatEuro(results.netSellerProceeds)} €</strong>
                        </span>
                    )}
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
                    <div className="flex justify-between text-gray-600">
                        <span>Plus-Value Brute Réalisée :</span>
                        <span className="font-bold text-gray-900">{formatEuro(results.grossCapitalGain)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Part Impôt Revenu (IR 19%) :</span>
                        <span className="font-bold text-gray-900">{formatEuro(results.taxIR)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Part Prélèvements Sociaux (17,2%) :</span>
                        <span className="font-bold text-gray-900">{formatEuro(results.taxPS)} €</span>
                    </div>
                    {results.highGainSurtax > 0 && (
                        <div className="flex justify-between text-amber-700">
                            <span>Surtaxe plus-value élevée ({'>'}50k€) :</span>
                            <span className="font-bold">{formatEuro(results.highGainSurtax)} €</span>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-600">
                    Forfait acquisition appliqué : +{formatEuro(Math.round(results.acquisitionCostsAllowance))} € (7,5%)
                    <br />
                    Forfait travaux appliqué : +{formatEuro(Math.round(results.worksAllowance))} €
                </div>
            </div>
        </div>
    );
}
