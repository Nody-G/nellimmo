'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SellerDiscoveryDvfCardProps {
  city: string;
  estimatedValue: number;
  desiredPrice: number;
  onDesiredPriceChange: (price: number) => void;
  gap: number;
}

export function SellerDiscoveryDvfCard({
  city,
  estimatedValue,
  desiredPrice,
  onDesiredPriceChange,
  gap,
}: SellerDiscoveryDvfCardProps) {
  return (
    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5 text-xs text-amber-950">
      <div className="flex items-center justify-between">
        <span className="font-bold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-[#C59A45]" />
          Estimation DVF Marché ({city}) :
        </span>
        <span className="font-serif font-bold text-sm text-[#967026]">
          ~{estimatedValue.toLocaleString('fr-FR')} €
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-600">
        <span>Prix souhaité par le propriétaire (€) :</span>
        <input
          type="number"
          value={desiredPrice}
          onChange={(e) => onDesiredPriceChange(parseFloat(e.target.value) || 0)}
          className="w-32 p-1 bg-white border border-amber-200 rounded text-right font-bold text-gray-900"
        />
      </div>
      {gap !== 0 && (
        <div className="text-[10px] text-gray-500 text-right">
          Écart face au DVF : {gap > 0 ? `+${gap.toLocaleString('fr-FR')} € (Surestimé)` : `${gap.toLocaleString('fr-FR')} € (Attractif)`}
        </div>
      )}
    </div>
  );
}
