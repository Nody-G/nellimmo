'use client';

import React from 'react';
import { TrendingDown } from 'lucide-react';

interface ReportPriceAndVerbatimSectionProps {
  suggestedAdjustment: number;
  onChangeSuggestedAdjustment: (val: number) => void;
  verbatimInput: string;
  onChangeVerbatimInput: (val: string) => void;
}

export const ReportPriceAndVerbatimSection: React.FC<ReportPriceAndVerbatimSectionProps> = ({
  suggestedAdjustment,
  onChangeSuggestedAdjustment,
  verbatimInput,
  onChangeVerbatimInput
}) => {
  return (
    <>
      {/* Ajustement Prix Stratégique */}
      <div className="pt-2 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <label className="block font-bold uppercase text-gray-700 text-xs flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-[#E12B7B]" />
            Recommandation d’Ajustement de Prix (€)
          </label>
          <span className="text-[11px] text-gray-400">
            Laissez 0 pour maintenir le prix actuel, ou saisissez un montant négatif (ex: -10000)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step={1000}
            value={suggestedAdjustment}
            onChange={(e) => onChangeSuggestedAdjustment(Number(e.target.value))}
            placeholder="Ex: -5000"
            className="w-48 p-2 bg-white border border-gray-200 rounded-xl font-bold text-sm text-[#131B26] focus:outline-[#E12B7B]"
          />
          <span className="text-xs text-gray-500">
            {suggestedAdjustment < 0 ? (
              <span className="text-amber-700 font-semibold">
                Recommandation de baisse de {Math.abs(suggestedAdjustment).toLocaleString('fr-FR')} € intégrée dans la synthèse
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">
                Maintien du prix de commercialisation actuel validé
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Verbatim anonymisés des visiteurs */}
      <div className="pt-2 border-t border-gray-200">
        <label className="block font-bold uppercase text-gray-700 mb-1">
          Verbatim Anonymisés des Visiteurs (retours libres — un par ligne)
        </label>
        <textarea
          value={verbatimInput}
          onChange={(e) => onChangeVerbatimInput(e.target.value)}
          rows={3}
          placeholder={'Ex. : « Très belle luminosité, cuisine à rafraîchir »\n« Emplacement calme et recherché, coup de cœur sur le jardin »'}
          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs leading-relaxed focus:outline-[#E12B7B] resize-y"
        />
        <p className="text-[10px] text-gray-400 mt-1">
          Ces retours sont transmis au vendeur de façon strictement anonyme (aucune identité de visiteur).
        </p>
      </div>
    </>
  );
};
