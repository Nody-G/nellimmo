'use client';

import { TrendingUp, Sparkles } from 'lucide-react';

interface ValuationHeaderProps {
    onGenerate: () => void;
}

/** Page header with the "Générer le Dossier d'Expertise" action. */
export function ValuationHeader({ onGenerate }: ValuationHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <TrendingUp className="w-4 h-4" />
                    <span>Laboratoire d{"\u2019"}Estimation & Données Notaires</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Avis de Valeur & Triple Méthodologie d{"\u2019"}Expertise
                </h1>
                <p className="text-xs text-gray-500">
                    Méthode DVF pondérée, capitalisation locative et coût à neuf pour des estimations incontestables.
                </p>
            </div>

            <button
                onClick={onGenerate}
                className="px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
            >
                <Sparkles className="w-4 h-4 text-[#FBF6E9]" />
                <span>Générer le Dossier d{"\u2019"}Expertise Complet</span>
            </button>
        </div>
    );
}
