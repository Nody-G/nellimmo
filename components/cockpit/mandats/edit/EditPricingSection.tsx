'use client';

import React from 'react';
import { FeesPaidBy } from '@/lib/types';

interface FinancialsData {
  priceFai: number;
  agencyFeesAmount: number;
  agencyFeesPercentage: number;
}

interface EditPricingSectionProps {
  priceNetSeller: number;
  onPriceNetChange: (val: number) => void;
  agencyFeesPercentage: number;
  onFeesPercentChange: (val: number) => void;
  feesPaidBy: FeesPaidBy;
  onFeesPaidByChange: (val: FeesPaidBy) => void;
  financials: FinancialsData;
}

export function EditPricingSection({
  priceNetSeller,
  onPriceNetChange,
  agencyFeesPercentage,
  onFeesPercentChange,
  feesPaidBy,
  onFeesPaidByChange,
  financials,
}: EditPricingSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
      <h3 className="font-serif font-bold text-lg text-[#131B26]">Prix & Honoraires Loi ALUR</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Prix Net Vendeur (€)</label>
          <input
            type="number"
            required
            value={priceNetSeller}
            onChange={(e) => onPriceNetChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Honoraires (%)</label>
          <input
            type="number"
            step="0.1"
            required
            value={agencyFeesPercentage}
            onChange={(e) => onFeesPercentChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Charge des honoraires</label>
          <select
            value={feesPaidBy}
            onChange={(e) => onFeesPaidByChange(e.target.value as FeesPaidBy)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-[#E12B7B]"
          >
            <option value="vendeur">Charge Vendeur</option>
            <option value="acquereur">Charge Acquéreur</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-gray-500 block">Montant Honoraires TTC :</span>
          <span className="font-bold text-[#E12B7B] text-sm">
            {financials.agencyFeesAmount.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Prix FAI Affiché :</span>
          <span className="font-bold text-[#131B26] text-base">
            {financials.priceFai.toLocaleString('fr-FR')} €
          </span>
        </div>
      </div>
    </div>
  );
}
