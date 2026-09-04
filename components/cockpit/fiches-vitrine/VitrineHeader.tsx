'use client';

import React from 'react';
import { Printer, Sliders } from 'lucide-react';
import { FORMAT_LABELS, LayoutFormat } from './flyer-types';

interface VitrineHeaderProps {
  showCustomizer: boolean;
  onToggleCustomizer: () => void;
  flyerFormat: LayoutFormat;
  onPrint: () => void;
}

export function VitrineHeader({
  showCustomizer,
  onToggleCustomizer,
  flyerFormat,
  onPrint,
}: VitrineHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4 print:hidden">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <Printer className="w-4 h-4" />
          <span>Marketing Vitrine & Atelier Graphique Illimité</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Studio Fiches Vitrine & Affiches LED
        </h1>
        <p className="text-xs text-gray-500">
          5 agencements photos, badges sans restriction, QR code multi-destinations et 6 thèmes haute couture.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onToggleCustomizer}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition cursor-pointer ${
            showCustomizer
              ? 'bg-[#131B26] text-white border-[#131B26]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#C59A45]" />
          <span>Personnaliser Titres & Badges</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#c42068] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer ({FORMAT_LABELS[flyerFormat]})</span>
        </button>
      </div>
    </div>
  );
}
