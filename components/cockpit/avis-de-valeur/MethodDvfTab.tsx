'use client';

import { Sliders } from 'lucide-react';
import type { ValuationInputs, ValuationResults } from './avis-de-valeur-types';
import { formatFr, formatSignedPct } from './avis-de-valeur-types';

interface MethodDvfTabProps {
    inputs: ValuationInputs;
    results: ValuationResults;
    onChange: (patch: Partial<ValuationInputs>) => void;
}

interface SliderRowProps {
    label: string;
    hint: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

function SliderRow({ label, hint, value, min, max, onChange }: SliderRowProps) {
    return (
        <div>
            <div className="flex justify-between font-bold mb-1">
                <span>{label}</span>
                <span className="text-[#E12B7B]">{formatSignedPct(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-[#E12B7B]"
            />
            <span className="text-[10px] text-gray-400">{hint}</span>
        </div>
    );
}

/** Method 1: DVF Pondéré with fine weight sliders. */
export function MethodDvfTab({ inputs, results, onChange }: MethodDvfTabProps) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Prix Moyen DVF Notaires Bruts</span>
                    <span className="text-xl font-black text-gray-900">{formatFr(results.baseDvfM2)} €/m²</span>
                </div>
                <div className="p-4 bg-[#FDF2F8] rounded-2xl border border-[#F3E8EE] text-center">
                    <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">Pondération Qualité Globale</span>
                    <span className={`text-xl font-black ${results.totalAdjustmentPct >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {formatSignedPct(results.totalAdjustmentPct)}
                    </span>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#E9DFD3] text-center">
                    <span className="text-[10px] uppercase font-bold text-[#C59A45] block">Valeur Méthode DVF</span>
                    <span className="text-xl font-black text-[#131B26]">{formatFr(results.dvfEstimatedTotal)} €</span>
                    <span className="text-[10px] text-gray-500 block">~{formatFr(results.adjustedDvfM2)} €/m² pondéré</span>
                </div>
            </div>

            {/* Sliders Grid */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <span className="text-xs font-bold uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#E12B7B]" />
                    Ajustements Fins sur le Bien (+/- 20%)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <SliderRow
                        label="État général & Rénovation"
                        hint="Rénovation récente vs Travaux à prévoir"
                        value={inputs.stateAdjustment}
                        min={-15}
                        max={15}
                        onChange={(v) => onChange({ stateAdjustment: v })}
                    />
                    <SliderRow
                        label="Piscine & Aménagements"
                        hint="Piscine maçonnée, terrasse travertin..."
                        value={inputs.poolAdjustment}
                        min={-5}
                        max={12}
                        onChange={(v) => onChange({ poolAdjustment: v })}
                    />
                    <SliderRow
                        label="Calme & Environnement"
                        hint="Impasse résidentielle vs Axe passant"
                        value={inputs.quietAdjustment}
                        min={-12}
                        max={10}
                        onChange={(v) => onChange({ quietAdjustment: v })}
                    />
                    <SliderRow
                        label="Performance DPE"
                        hint="Pompe à chaleur DPE A/B vs Passoire F/G"
                        value={inputs.dpeAdjustment}
                        min={-10}
                        max={8}
                        onChange={(v) => onChange({ dpeAdjustment: v })}
                    />
                    <SliderRow
                        label="Vue & Exposition"
                        hint="Vue collines et plein Sud vs Vis-à-vis"
                        value={inputs.viewAdjustment}
                        min={-5}
                        max={10}
                        onChange={(v) => onChange({ viewAdjustment: v })}
                    />
                </div>
            </div>
        </div>
    );
}
