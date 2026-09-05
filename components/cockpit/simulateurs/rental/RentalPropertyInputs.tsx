'use client';

import React from 'react';
import { Building } from 'lucide-react';

interface RentalPropertyInputsProps {
  purchasePrice: number;
  setPurchasePrice: (val: number) => void;
  furnitureOrWorks: number;
  setFurnitureOrWorks: (val: number) => void;
  notaryFees: number;
  setNotaryFees: (val: number) => void;
  applyAutoNotary: () => void;
  monthlyRent: number;
  setMonthlyRent: (val: number) => void;
  nonRecoverableCharges: number;
  setNonRecoverableCharges: (val: number) => void;
  propertyTax: number;
  setPropertyTax: (val: number) => void;
  pnoInsurance: number;
  setPnoInsurance: (val: number) => void;
}

export function RentalPropertyInputs({
  purchasePrice,
  setPurchasePrice,
  furnitureOrWorks,
  setFurnitureOrWorks,
  notaryFees,
  setNotaryFees,
  applyAutoNotary,
  monthlyRent,
  setMonthlyRent,
  nonRecoverableCharges,
  setNonRecoverableCharges,
  propertyTax,
  setPropertyTax,
  pnoInsurance,
  setPnoInsurance,
}: RentalPropertyInputsProps) {
  return (
    <div className="space-y-5 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-2">
        <Building className="w-4 h-4 text-[#C59A45]" />
        <span>1. Investissement & Charges du Bien</span>
      </div>

      <div className="space-y-4 text-xs font-medium">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-gray-700">Prix d’achat FAI (€)</label>
            <span className="font-bold text-gray-900">{purchasePrice.toLocaleString('fr-FR')} €</span>
          </div>
          <input
            type="range"
            min={50000}
            max={800000}
            step={5000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-[#E12B7B] cursor-pointer"
          />
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full mt-1.5 p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Travaux / Meubles (€)</label>
            </div>
            <input
              type="number"
              value={furnitureOrWorks}
              onChange={(e) => setFurnitureOrWorks(Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
              placeholder="0 €"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Frais de Notaire (€)</label>
              <button
                type="button"
                onClick={applyAutoNotary}
                className="text-[10px] text-[#C59A45] hover:underline font-bold cursor-pointer"
              >
                Auto (~7.5%)
              </button>
            </div>
            <input
              type="number"
              value={notaryFees}
              onChange={(e) => setNotaryFees(Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <label className="block font-bold text-gray-700 mb-1">Loyer Mensuel Hors Charges (€)</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-gray-600 text-[11px] mb-1">
              Charges Copro / an (€)
            </label>
            <input
              type="number"
              value={nonRecoverableCharges}
              onChange={(e) => setNonRecoverableCharges(Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-600 text-[11px] mb-1">
              Taxe Foncière / an (€)
            </label>
            <input
              type="number"
              value={propertyTax}
              onChange={(e) => setPropertyTax(Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-600 text-[11px] mb-1">
              Assurance PNO / an (€)
            </label>
            <input
              type="number"
              value={pnoInsurance}
              onChange={(e) => setPnoInsurance(Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
