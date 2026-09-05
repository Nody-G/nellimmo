'use client';

import React from 'react';
import { Building, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoanCreditAcquisitionInputsProps {
  purchasePrice: number;
  setPurchasePrice: (val: number) => void;
  downPayment: number;
  setDownPayment: (val: number) => void;
  notaryFees: number;
}

export function LoanCreditAcquisitionInputs({
  purchasePrice,
  setPurchasePrice,
  downPayment,
  setDownPayment,
  notaryFees,
}: LoanCreditAcquisitionInputsProps) {
  return (
    <div className="space-y-5 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-2">
        <Building className="w-4 h-4 text-[#C59A45]" />
        <span>Paramètres de l’Acquisition</span>
      </div>

      <div className="space-y-4 text-xs font-medium">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-gray-700">Prix d’Achat Visé (€)</label>
            <span className="font-bold text-gray-900">{purchasePrice.toLocaleString('fr-FR')} €</span>
          </div>
          <input
            type="range"
            min={100000}
            max={1500000}
            step={10000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-[#E12B7B] cursor-pointer"
          />
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full mt-1.5 p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs shadow-2xs"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-gray-700">Apport Personnel (€)</label>
            <span className="font-bold text-gray-900">{downPayment.toLocaleString('fr-FR')} €</span>
          </div>
          <input
            type="range"
            min={0}
            max={500000}
            step={5000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-[#C59A45] cursor-pointer"
          />
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full mt-1.5 p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs shadow-2xs"
          />
          <span className="text-[11px] text-gray-400 mt-1 block">
            {downPayment >= notaryFees ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> L’apport couvre les frais de notaire (Dossier finançable standard).
              </span>
            ) : (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Financement à 110% requis (Prêt notaire inclus, plus rare en 2026).
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
