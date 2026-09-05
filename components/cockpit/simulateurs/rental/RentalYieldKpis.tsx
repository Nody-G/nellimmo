'use client';

import React from 'react';
import { Percent, Building, Euro } from 'lucide-react';

interface RentalYieldKpisProps {
  grossYield: string;
  netYield: string;
  monthlyMortgage: number;
  monthlyCashFlow: number;
  includeLoan: boolean;
}

export function RentalYieldKpis({
  grossYield,
  netYield,
  monthlyMortgage,
  monthlyCashFlow,
  includeLoan,
}: RentalYieldKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/70 to-white border border-pink-100 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E12B7B] mb-1 flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5" /> Rendement Brut
        </span>
        <div className="text-3xl font-black text-gray-900 tracking-tight">
          {grossYield} <span className="text-lg font-bold text-gray-400">%</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          Loyer annuel / Coût global
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59A45] mb-1 flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5" /> Rendement Net
        </span>
        <div className="text-3xl font-black text-gray-900 tracking-tight">
          {netYield} <span className="text-lg font-bold text-gray-400">%</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          Net de charges et taxe foncière
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5" /> Mensualité Crédit
        </span>
        <div className="text-3xl font-black text-gray-900 tracking-tight">
          {includeLoan ? monthlyMortgage.toLocaleString('fr-FR') : '0'}{' '}
          <span className="text-lg font-bold text-gray-400">€/m</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          {includeLoan ? 'Crédit immobilier estimé' : 'Sans emprunt bancaire'}
        </span>
      </div>

      <div
        className={`p-5 rounded-2xl border shadow-2xs ${
          monthlyCashFlow >= 0
            ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-100'
            : 'bg-gradient-to-br from-rose-50/80 to-white border-rose-100'
        }`}
      >
        <span
          className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
            monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          <Euro className="w-3.5 h-3.5" /> Cash-Flow Mensuel
        </span>
        <div
          className={`text-3xl font-black tracking-tight ${
            monthlyCashFlow >= 0 ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {monthlyCashFlow >= 0 ? `+${monthlyCashFlow}` : monthlyCashFlow}{' '}
          <span className="text-lg font-bold opacity-60">€/m</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          {monthlyCashFlow >= 0 ? 'Excédent brut de trésorerie' : 'Effort d’épargne mensuel'}
        </span>
      </div>
    </div>
  );
}
