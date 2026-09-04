'use client';

import React from 'react';
import { TransactionDeal } from '@/lib/types';

interface DealFinancialOverviewProps {
  deal: TransactionDeal;
}

export const DealFinancialOverview: React.FC<DealFinancialOverviewProps> = ({ deal }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF5F8] rounded-2xl border border-[#F3E8EE]">
      <div>
        <span className="text-[10px] uppercase font-bold text-gray-500 block">Prix Offre FAI</span>
        <span className="text-base font-bold text-gray-900 font-serif">
          {deal.offer_price_fai?.toLocaleString('fr-FR')} €
        </span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold text-gray-500 block">Net Vendeur</span>
        <span className="text-base font-bold text-gray-900 font-serif">
          {deal.offer_price_net?.toLocaleString('fr-FR')} €
        </span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">Honoraires Nell’Immo</span>
        <span className="text-base font-bold text-[#E12B7B] font-serif">
          {deal.agency_fees_amount?.toLocaleString('fr-FR')} € TTC
        </span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold text-gray-500 block">Séquestre Notaire</span>
        <span className="text-base font-bold text-gray-900 font-serif">
          {deal.deposit_amount?.toLocaleString('fr-FR')} €
        </span>
      </div>
    </div>
  );
};
