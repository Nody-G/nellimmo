'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ReportPortalViewsSectionProps {
  viewsLeboncoin: number;
  onChangeViewsLeboncoin: (val: number) => void;
  viewsSeloger: number;
  onChangeViewsSeloger: (val: number) => void;
  viewsBienici: number;
  onChangeViewsBienici: (val: number) => void;
  viewsWebsite: number;
  onChangeViewsWebsite: (val: number) => void;
  totalViews: number;
}

export const ReportPortalViewsSection: React.FC<ReportPortalViewsSectionProps> = ({
  viewsLeboncoin,
  onChangeViewsLeboncoin,
  viewsSeloger,
  onChangeViewsSeloger,
  viewsBienici,
  onChangeViewsBienici,
  viewsWebsite,
  onChangeViewsWebsite,
  totalViews
}) => {
  return (
    <div className="space-y-4">
      <span className="text-xs font-bold uppercase text-gray-700 tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#E12B7B]" />
          Audiences des Portails Immobiliers (Cumul Période)
        </span>
        <span className="text-[#E12B7B] font-black">{totalViews.toLocaleString('fr-FR')} vues totales</span>
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-bold text-gray-600 mb-1">Vues LeBonCoin</label>
          <input
            type="number"
            value={viewsLeboncoin}
            onChange={(e) => onChangeViewsLeboncoin(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Vues SeLoger</label>
          <input
            type="number"
            value={viewsSeloger}
            onChange={(e) => onChangeViewsSeloger(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Vues Bien’Ici</label>
          <input
            type="number"
            value={viewsBienici}
            onChange={(e) => onChangeViewsBienici(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Vues Site Nell’Immo</label>
          <input
            type="number"
            value={viewsWebsite}
            onChange={(e) => onChangeViewsWebsite(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
          />
        </div>
      </div>
    </div>
  );
};
