'use client';

import type { ValuationInputs, ValuationResults } from './avis-de-valeur-types';
import { formatFr } from './avis-de-valeur-types';

interface MethodCostTabProps {
    inputs: ValuationInputs;
    results: ValuationResults;
    onChange: (patch: Partial<ValuationInputs>) => void;
}

const inputClass =
    'w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]';

/** Method 3: Coût de Remplacement / Reconstruction à Neuf. */
export function MethodCostTab({ inputs, results, onChange }: MethodCostTabProps) {
    return (
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Foncier Nu Terrain (€/m²)
                    </label>
                    <input
                        type="number"
                        value={inputs.landValueM2}
                        onChange={(e) => onChange({ landValueM2: Number(e.target.value) })}
                        className={inputClass}
                    />
                    <span className="text-[10px] text-gray-400">Terrain: {formatFr(results.rawLandValue)} €</span>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Coût Reconstruction Neuf (€/m²)
                    </label>
                    <input
                        type="number"
                        value={inputs.buildCostM2}
                        onChange={(e) => onChange({ buildCostM2: Number(e.target.value) })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Abattement Vétusté (%)
                    </label>
                    <input
                        type="number"
                        value={inputs.depreciationPct}
                        onChange={(e) => onChange({ depreciationPct: Number(e.target.value) })}
                        className={inputClass}
                    />
                    <span className="text-[10px] text-gray-400">Bâti net: {formatFr(Math.round(results.rawBuildValue))} €</span>
                </div>

                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E9DFD3] text-center flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase text-[#C59A45] block">Valeur de Remplacement</span>
                    <span className="text-xl font-black text-[#131B26]">{formatFr(results.replacementEstimatedTotal)} €</span>
                </div>
            </div>
        </div>
    );
}
