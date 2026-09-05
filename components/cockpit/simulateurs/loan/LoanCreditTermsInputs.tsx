'use client';

import React from 'react';
import { PiggyBank, ShieldCheck } from 'lucide-react';

interface LoanCreditTermsInputsProps {
  durationYears: number;
  setDurationYears: (val: number) => void;
  interestRate: number;
  setInterestRate: (val: number) => void;
  insuranceRate: number;
  setInsuranceRate: (val: number) => void;
}

export function LoanCreditTermsInputs({
  durationYears,
  setDurationYears,
  interestRate,
  setInterestRate,
  insuranceRate,
  setInsuranceRate,
}: LoanCreditTermsInputsProps) {
  return (
    <div className="space-y-5 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-2">
        <PiggyBank className="w-4 h-4 text-[#C59A45]" />
        <span>Conditions Bancaires du Prêt</span>
      </div>

      <div className="space-y-4 text-xs font-medium">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Durée du Prêt</label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 20, 25].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDurationYears(d)}
                className={`py-2 rounded-xl font-bold transition text-xs cursor-pointer ${
                  durationYears === d
                    ? 'bg-[#131B26] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {d} ans ({d * 12} mois)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Taux Nominal Annuel (%)</label>
            <input
              type="number"
              step="0.05"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Taux Assurance Emprunteur (%)</label>
            <input
              type="number"
              step="0.01"
              value={insuranceRate}
              onChange={(e) => setInsuranceRate(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs shadow-2xs"
            />
          </div>
        </div>

        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Rappel Recommandation HCSF Obligatoire</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Le taux d’effort maximal est plafonné à <strong>35%</strong> assurance comprise pour une durée maximale de <strong>25 ans</strong> (27 ans en VEFA ou ancien avec 25% de travaux).
          </p>
        </div>
      </div>
    </div>
  );
}
