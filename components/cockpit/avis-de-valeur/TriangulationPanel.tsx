'use client';

import type { ValuationInputs, ValuationResults } from './avis-de-valeur-types';
import { formatFr } from './avis-de-valeur-types';

interface TriangulationPanelProps {
    inputs: ValuationInputs;
    results: ValuationResults;
}

/** Section 3: Triangulation des Résultats & Scénarios Stratégiques (3 fourchettes). */
export function TriangulationPanel({ inputs, results }: TriangulationPanelProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-3">
                <div>
                    <h3 className="font-serif font-bold text-lg text-[#131B26]">
                        3. Triangulation des Résultats & Scénarios Stratégiques
                    </h3>
                    <p className="text-xs text-gray-500">
                        Synthèse croisée : DVF pondéré (55%) + Rendement (25%) + Coût de remplacement (20%).
                    </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    DVF Notaires 2024-2026 Certifié
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {/* 1. Prix d'Attaque */}
                <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2 hover:shadow-xs transition">
                    <span className="text-[11px] uppercase font-bold text-gray-400 block">Scénario Vente Éclair {"(< 30 jours)"}</span>
                    <div className="text-2xl font-black text-gray-800">
                        {formatFr(results.priceAttack)} €
                    </div>
                    <span className="text-[11px] text-gray-500 block">
                        ~{formatFr(Math.round(results.priceAttack / inputs.surfaceInput))} €/m²
                    </span>
                    <p className="text-[10px] text-gray-400">Positionnement agressif pour déclencher des offres immédiates sans négociation.</p>
                </div>

                {/* 2. Prix Cible d'Équilibre */}
                <div className="p-6 bg-[#FDF2F8] rounded-2xl border-2 border-[#E12B7B] space-y-2 shadow-md">
                    <span className="text-[11px] uppercase font-bold text-[#E12B7B] block">★ Prix Cible Recommandé Nell{"\u2019"}Immo</span>
                    <div className="text-3xl font-black text-[#E12B7B]">
                        {formatFr(results.priceTarget)} €
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700 block">
                        ~{formatFr(Math.round(results.priceTarget / inputs.surfaceInput))} €/m² (Équilibre parfait)
                    </span>
                    <p className="text-[10px] text-gray-600">Valeur d{"\u2019"}expertise équilibrée pour signer sous 45 à 60 jours en mandat exclusif.</p>
                </div>

                {/* 3. Prix Haut d'Exclusivité */}
                <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2 hover:shadow-xs transition">
                    <span className="text-[11px] uppercase font-bold text-gray-400 block">Test Exclusivité Haute (Coup de Cœur)</span>
                    <div className="text-2xl font-black text-gray-800">
                        {formatFr(results.priceHigh)} €
                    </div>
                    <span className="text-[11px] text-gray-500 block">
                        ~{formatFr(Math.round(results.priceHigh / inputs.surfaceInput))} €/m²
                    </span>
                    <p className="text-[10px] text-gray-400">Plafond haut pour tester le marché durant les 3 premières semaines.</p>
                </div>
            </div>
        </div>
    );
}
