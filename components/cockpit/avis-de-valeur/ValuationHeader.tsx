'use client';

import { TrendingUp, Sparkles, Star, Loader2 } from 'lucide-react';

interface ValuationHeaderProps {
    onGenerate: () => void;
    onLoadGoogleReviews?: () => void;
    isLoadingReviews?: boolean;
}

/** Page header with the "Générer le Dossier d'Expertise" action. */
export function ValuationHeader({
    onGenerate,
    onLoadGoogleReviews,
    isLoadingReviews = false,
}: ValuationHeaderProps) {
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

            <div className="flex flex-wrap items-center gap-2">
                {onLoadGoogleReviews && (
                    <button
                        onClick={onLoadGoogleReviews}
                        disabled={isLoadingReviews}
                        className="px-3.5 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Charger les avis Google Business de l'agence"
                    >
                        {isLoadingReviews ? (
                            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                        ) : (
                            <Star className="w-4 h-4 text-amber-500" />
                        )}
                        <span>{isLoadingReviews ? 'Chargement…' : 'Avis Google'}</span>
                    </button>
                )}

                <button
                    onClick={onGenerate}
                    className="px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                    <Sparkles className="w-4 h-4 text-[#FBF6E9]" />
                    <span>Générer le Dossier d{"\u2019"}Expertise Complet</span>
                </button>
            </div>
        </div>
    );
}
