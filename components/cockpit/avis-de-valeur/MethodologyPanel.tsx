'use client';

import { Calculator } from 'lucide-react';
import type { ValuationInputs, ValuationResults, MethodTab } from './avis-de-valeur-types';
import { MethodDvfTab } from './MethodDvfTab';
import { MethodCapTab } from './MethodCapTab';
import { MethodCostTab } from './MethodCostTab';

interface MethodologyPanelProps {
    inputs: ValuationInputs;
    results: ValuationResults;
    activeMethodTab: MethodTab;
    onChange: (patch: Partial<ValuationInputs>) => void;
    onTabChange: (tab: MethodTab) => void;
}

const TABS: { id: MethodTab; label: string }[] = [
    { id: 'dvf', label: '1. DVF Pondéré' },
    { id: 'cap', label: '2. Rendement Locatif' },
    { id: 'cost', label: '3. Coût à Neuf' },
];

/** Section 2: Les 3 Méthodes d'Évaluation en Temps Réel with tab selector. */
export function MethodologyPanel({ inputs, results, activeMethodTab, onChange, onTabChange }: MethodologyPanelProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
                <div>
                    <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-[#C59A45]" />
                        2. Les 3 Méthodes d{"\u2019"}Évaluation en Temps Réel
                    </h3>
                    <p className="text-xs text-gray-500">
                        Ajustez les pondérations selon les spécificités uniques du bien.
                    </p>
                </div>

                {/* Tab selector */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeMethodTab === tab.id ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeMethodTab === 'dvf' && <MethodDvfTab inputs={inputs} results={results} onChange={onChange} />}
            {activeMethodTab === 'cap' && <MethodCapTab inputs={inputs} results={results} onChange={onChange} />}
            {activeMethodTab === 'cost' && <MethodCostTab inputs={inputs} results={results} onChange={onChange} />}
        </div>
    );
}
