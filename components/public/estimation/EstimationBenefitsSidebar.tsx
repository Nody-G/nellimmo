'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export function EstimationBenefitsSidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-[#131B26] text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#C59A45]">
          Pourquoi faire estimer avec Nell’Immo ?
        </h3>
        <ul className="space-y-3.5 text-xs text-gray-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
            <span>Expertise locale de plus de 15 ans à Pélissanne & Salon-de-Provence</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
            <span>Analyse précise des biens comparables vendus récemment (base DVF notariée)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
            <span>Prise en compte des atouts uniques (rénovations, vue, calme, terrain)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
            <span>Remise d’un dossier clair et complet sous 24 à 48h</span>
          </li>
        </ul>
      </div>

      <div className="bg-[#FCFAF7] rounded-3xl p-6 border border-[#F3E8EE] space-y-3 text-xs text-gray-700">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <ShieldCheck className="w-4 h-4 text-[#E12B7B]" />
          <span>100% Gratuit & Sans Engagement</span>
        </div>
        <p className="text-gray-500 leading-relaxed">
          Vos coordonnées restent strictement confidentielles et ne sont jamais cédées à des tiers.
        </p>
      </div>
    </div>
  );
}
