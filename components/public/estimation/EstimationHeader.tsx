'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

export function EstimationHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-3">
      <span className="px-3.5 py-1.5 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Estimation Immobilière Gratuite & Sans Engagement
      </span>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#131B26]">
        Connaître la Valeur Réelle de Votre Bien en Provence
      </h1>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        Vous envisagez une mise en vente de votre bien immobilier ? Nous réalisons votre estimation gratuitement, en adéquation avec la réalité du marché immobilier. Bénéficiez d’une étude personnalisée réalisée par Nelly Fernandez.
      </p>
    </div>
  );
}
