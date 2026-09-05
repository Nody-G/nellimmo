'use client';

import React from 'react';
import { PiggyBank } from 'lucide-react';

interface RentalLoanInputsProps {
  includeLoan: boolean;
  setIncludeLoan: (val: boolean) => void;
  downPayment: number;
  setDownPayment: (val: number) => void;
  loanRate: number;
  setLoanRate: (val: number) => void;
  loanDurationYears: number;
  setLoanDurationYears: (val: number) => void;
  loanAmount: number;
  monthlyMortgage: number;
  monthlyCashFlow: number;
}

export function RentalLoanInputs({
  includeLoan,
  setIncludeLoan,
  downPayment,
  setDownPayment,
  loanRate,
  setLoanRate,
  loanDurationYears,
  setLoanDurationYears,
  loanAmount,
  monthlyMortgage,
  monthlyCashFlow,
}: RentalLoanInputsProps) {
  return (
    <div className="space-y-5 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800">
          <PiggyBank className="w-4 h-4 text-[#C59A45]" />
          <span>2. Financement & Effet de Levier</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
          <input
            type="checkbox"
            checked={includeLoan}
            onChange={(e) => setIncludeLoan(e.target.checked)}
            className="w-4 h-4 accent-[#E12B7B] rounded"
          />
          <span>Intégrer un emprunt</span>
        </label>
      </div>

      {includeLoan ? (
        <div className="space-y-4 text-xs font-medium">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Apport Personnel (€)</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Montant emprunté : {loanAmount.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Taux Nominal Annuel (%)</label>
              <input
                type="number"
                step="0.05"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Durée (Années)</label>
              <select
                value={loanDurationYears}
                onChange={(e) => setLoanDurationYears(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
              >
                <option value={15}>15 ans</option>
                <option value={20}>20 ans</option>
                <option value={25}>25 ans</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Mensualité estimée du crédit
              </span>
              <span className="text-base font-black text-gray-900">
                {monthlyMortgage} € <span className="text-xs font-normal text-gray-500">/ mois</span>
              </span>
            </div>
            <div className="text-right text-[11px] text-blue-800">
              <span>Effort d’épargne / Cash-flow :</span>
              <div className="font-bold">
                {monthlyCashFlow >= 0 ? '+' : ''}
                {monthlyCashFlow} € / mois
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
          Achat 100% comptant. Cochez la case ci-dessus pour intégrer un effet de levier bancaire.
        </div>
      )}
    </div>
  );
}
