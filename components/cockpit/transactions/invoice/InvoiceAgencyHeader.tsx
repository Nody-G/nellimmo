'use client';

import React from 'react';
import type { AgencySettings, TransactionDeal } from '@/lib/types';

interface InvoiceAgencyHeaderProps {
  settings: AgencySettings;
  deal: TransactionDeal;
}

export function InvoiceAgencyHeader({ settings, deal }: InvoiceAgencyHeaderProps) {
  return (
    <div className="flex justify-between items-start border-b-2 border-[#131B26] pb-4">
      <div>
        <h1 className="text-xl font-serif font-black tracking-tight text-[#131B26]">
          {settings.agency_name || "SASU NELL’IMMO"}
        </h1>
        <p className="text-xs text-gray-600 mt-1">{settings.address || '26 avenue des Enjouvènes'}</p>
        <p className="text-xs text-gray-600">{settings.postal_code} {settings.city}</p>
        <p className="text-xs text-gray-600">Tél : {settings.phone} | {settings.email}</p>
        <p className="text-[10px] text-gray-500 mt-2">
          SIREN : {settings.siren || '853 807 006'} RCS {settings.rcs_city || 'Salon-de-Provence'} — Capital : {settings.capital_social || '2 000 €'}
        </p>
        <p className="text-[10px] text-gray-500">
          Carte Professionnelle CPI : {settings.card_t_number} ({settings.cci_card_t || 'CCI Marseille Provence'})
        </p>
        <p className="text-[10px] text-gray-500">
          Garantie Financière : {settings.guarantee_fund_name || 'GALIAN Assurances (120 000 €)'} — Sans maniement de fonds
        </p>
      </div>

      <div className="text-right">
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-right max-w-xs">
          <span className="text-[10px] font-bold uppercase text-gray-500 block">Étude Notariale Instrumentaire</span>
          <p className="text-xs font-bold text-gray-900 mt-0.5">{deal.seller_notary_name}</p>
          <p className="text-xs text-gray-700">{deal.seller_notary_office}</p>
          <p className="text-[11px] text-gray-500">{deal.seller_notary_email}</p>
        </div>
      </div>
    </div>
  );
}
