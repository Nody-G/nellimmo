'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { computePigeDvfGap } from './pige-import';

interface PigeDvfBenchmarkBoxProps {
  dvfGap: ReturnType<typeof computePigeDvfGap> | null;
}

export const PigeDvfBenchmarkBox: React.FC<PigeDvfBenchmarkBoxProps> = ({ dvfGap }) => {
  if (!dvfGap) return null;

  return (
    <div
      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
        dvfGap.isOverpriced
          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
          : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
      }`}
    >
      <div className="flex items-center justify-between font-bold">
        <span className="flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
          <span>Prix demandé : {dvfGap.askingM2.toLocaleString('fr-FR')} €/m²</span>
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            dvfGap.isOverpriced
              ? 'bg-amber-200 text-amber-900'
              : 'bg-emerald-200 text-emerald-900'
          }`}
        >
          {dvfGap.gapPct > 0 ? `+${dvfGap.gapPct}%` : `${dvfGap.gapPct}%`} vs marché notarié
        </span>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-700">
        {dvfGap.argumentPitch}
      </p>
    </div>
  );
};
