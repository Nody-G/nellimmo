'use client';

import type { ValuationInputs, ValuationResults } from './avis-de-valeur-types';
import { formatFr } from './avis-de-valeur-types';

interface MethodCapTabProps {
    inputs: ValuationInputs;
    results: ValuationResults;
    onChange: (patch: Partial<ValuationInputs>) => void;
}

const inputClass =
    'w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]';

/** Method 2: Capitalisation / Rendement Locatif. */
export function MethodCapTab({ inputs, results, onChange }: MethodCapTabProps) {
    return (
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Loyer Mensuel Marché Estimé (€)
                    </label>
                    <input
                        type="number"
                        value={inputs.estimatedMonthlyRent}
                        onChange={(e) => onChange({ estimatedMonthlyRent: Number(e.target.value) })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Taux de Capitalisation Brut Attendu (%)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={inputs.targetCapRate}
                        onChange={(e) => onChange({ targetCapRate: Number(e.target.value) })}
                        className={inputClass}
                    />
                </div>

                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E9DFD3] text-center flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase text-[#C59A45] block">Valeur par Capitalisation</span>
                    <span className="text-xl font-black text-[#131B26]">{formatFr(results.capitalizationEstimatedTotal)} €</span>
                    <span className="text-[10px] text-gray-500 block">{formatFr(results.annualRent)} € / an de loyers bruts</span>
                </div>
            </div>
            <p className="text-[11px] text-gray-500">
                Idéal pour valoriser l{"\u2019"}actif auprès d{"\u2019"}investisseurs patrimoniaux et d{"\u2019"}acquéreurs LMNP dans le Pays Salonais.
            </p>
        </div>
    );
}
