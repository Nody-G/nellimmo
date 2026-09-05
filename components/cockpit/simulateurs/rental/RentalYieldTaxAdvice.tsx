'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function RentalYieldTaxAdvice() {
  return (
    <div className="p-4 bg-gradient-to-r from-amber-50 to-pink-50/50 rounded-2xl border border-amber-200/70 text-xs space-y-2">
      <div className="font-bold text-gray-900 flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-[#C59A45]" />
        <span>Optimisation Fiscale Recommandée : Régime LMNP Réel</span>
      </div>
      <p className="text-[11px] text-gray-600 leading-relaxed">
        En meublé de tourisme ou bail d’habitation meublé (Salon-de-Provence / Pélissanne), l’amortissement comptable de l’immeuble (sur 25 ans) et des travaux/meubles (sur 5 à 10 ans) efface généralement la totalité de l’impôt sur les loyers perçus pendant 8 à 12 ans.
      </p>
    </div>
  );
}
