'use client';

import React from 'react';
import { FeesPaidBy } from '@/lib/types';
import { Euro } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StepFinancialsProps {
  priceNetSeller: number;
  onPriceNetSellerChange: (val: number) => void;
  agencyFeesPercentage: number;
  onAgencyFeesPercentageChange: (val: number) => void;
  agencyFeesAmount: number;
  onAgencyFeesAmountChange: (val: number) => void;
  feesPaidBy: FeesPaidBy;
  onFeesPaidByChange: (val: FeesPaidBy) => void;
  financials: {
    priceFai: number;
    agencyFeesAmount: number;
    agencyFeesPercentage: number;
  };
}

export const StepFinancials: React.FC<StepFinancialsProps> = ({
  priceNetSeller,
  onPriceNetSellerChange,
  agencyFeesPercentage,
  onAgencyFeesPercentageChange,
  agencyFeesAmount,
  onAgencyFeesAmountChange,
  feesPaidBy,
  onFeesPaidByChange,
  financials
}) => {
  return (
    <Card id="step-financials">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-[#E12B7B]" />
          <span>3. Conditions Financières & Barème Loi ALUR</span>
        </CardTitle>
        <span className="text-[11px] font-bold text-gray-500">
          Transparence obligatoire des honoraires
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Prix Net Vendeur (€) *
            </label>
            <input
              type="number"
              min={10000}
              step={1000}
              required
              value={priceNetSeller}
              onChange={(e) => {
                const p = Number(e.target.value);
                onPriceNetSellerChange(p);
                const fees = Math.round(p * (agencyFeesPercentage / 100));
                onAgencyFeesAmountChange(fees);
              }}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Taux d&apos;honoraires TTC (%)
            </label>
            <input
              type="number"
              min={1}
              max={12}
              step={0.1}
              required
              value={agencyFeesPercentage}
              onChange={(e) => {
                const pct = Number(e.target.value);
                onAgencyFeesPercentageChange(pct);
                const fees = Math.round(priceNetSeller * (pct / 100));
                onAgencyFeesAmountChange(fees);
              }}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Montant Honoraires TTC (€)
            </label>
            <input
              type="number"
              min={1000}
              step={500}
              required
              value={agencyFeesAmount}
              onChange={(e) => {
                const amt = Number(e.target.value);
                onAgencyFeesAmountChange(amt);
                if (priceNetSeller > 0) {
                  onAgencyFeesPercentageChange(Number(((amt / priceNetSeller) * 100).toFixed(2)));
                }
              }}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        {/* Charge des honoraires */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-2">
            Imputation des honoraires (Loi ALUR) *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'vendeur',
                label: 'Charge Vendeur (Standard Nell\'Immo)',
                desc: 'Prix affiché = Prix FAI net vendeur + commission'
              },
              {
                id: 'acquereur',
                label: 'Charge Acquéreur',
                desc: 'Permet d\'optimiser les frais d\'acte notarié pour l\'acheteur'
              }
            ].map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => onFeesPaidByChange(f.id as FeesPaidBy)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${feesPaidBy === f.id
                    ? 'border-[#E12B7B] bg-[#FDF2F8]/60 ring-2 ring-[#E12B7B]/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
              >
                <span className="text-xs font-bold text-gray-900 block">{f.label}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result banner */}
        <div className="p-4 bg-[#FAF5F8] border border-[#F3E8EE] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500 block tracking-wider">
              Prix de Présentation Public (FAI)
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-[#131B26]">
              {financials.priceFai.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="font-semibold text-gray-700 block">
              Dont honoraires TTC : {financials.agencyFeesAmount.toLocaleString('fr-FR')} € ({financials.agencyFeesPercentage}%)
            </span>
            <span className="text-[11px] text-[#E12B7B] font-bold block">
              Honoraires à la charge du {feesPaidBy === 'vendeur' ? 'vendeur' : 'futur acquéreur'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
