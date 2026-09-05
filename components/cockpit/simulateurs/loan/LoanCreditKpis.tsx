'use client';

import React from 'react';
import { LoanSimulationResult } from '@/components/cockpit/acquereurs/acquereurs-types';

interface LoanCreditKpisProps {
  result: LoanSimulationResult;
}

export function LoanCreditKpis({ result }: LoanCreditKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/70 to-white border-2 border-[#E12B7B]/20 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E12B7B] block mb-1">
          Mensualité Totale
        </span>
        <div className="text-3xl font-black text-[#E12B7B] tracking-tight">
          {result.totalMonthlyPayment.toLocaleString('fr-FR')}{' '}
          <span className="text-base font-bold">€/mois</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          Assurance comprise ({result.monthlyInsurance} €)
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
          Revenus Nets Exigés
        </span>
        <div className="text-3xl font-black text-emerald-700 tracking-tight">
          {result.minRequiredHouseholdIncome.toLocaleString('fr-FR')}{' '}
          <span className="text-base font-bold">€/mois</span>
        </div>
        <span className="text-[11px] text-emerald-800/80 mt-1 block">
          Seuil strict HCSF 35%
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59A45] block mb-1">
          Montant Prêté
        </span>
        <div className="text-2xl font-black text-gray-900 tracking-tight">
          {result.loanAmount.toLocaleString('fr-FR')}{' '}
          <span className="text-base font-bold text-gray-400">€</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          Coût crédit : {result.totalLoanCost.toLocaleString('fr-FR')} €
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-gray-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
          Coût Total Projet
        </span>
        <div className="text-2xl font-black text-gray-900 tracking-tight">
          {result.totalCost.toLocaleString('fr-FR')}{' '}
          <span className="text-base font-bold text-gray-400">€</span>
        </div>
        <span className="text-[11px] text-gray-400 mt-1 block">
          Dont notaire ~{result.notaryFees.toLocaleString('fr-FR')} €
        </span>
      </div>
    </div>
  );
}
