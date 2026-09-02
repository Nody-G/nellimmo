'use client';

import React, { useState } from 'react';
import { Calculator, Percent, Clock, AlertCircle } from 'lucide-react';

interface LoanCalculatorProps {
  initialPrice?: number;
}

export function LoanCalculator({ initialPrice = 450000 }: LoanCalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(Math.round(initialPrice * 0.15));
  const [durationYears, setDurationYears] = useState(20);
  const [interestRate, setInterestRate] = useState(3.45);
  const insuranceRate = 0.34;

  // Estimations
  const notaryFees = Math.round(price * 0.075);
  const loanAmount = Math.max(0, price + notaryFees - downPayment);
  const numberOfMonths = durationYears * 12;
  const monthlyInterestRate = (interestRate / 100) / 12;

  let monthlyPayment = 0;
  if (loanAmount > 0 && monthlyInterestRate > 0) {
    monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths));
  }
  const monthlyInsurance = (loanAmount * (insuranceRate / 100)) / 12;
  const totalMonthly = Math.round(monthlyPayment + monthlyInsurance);
  const totalCost = Math.round((totalMonthly * numberOfMonths) - loanAmount);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-[#FAF5F8] pb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Simulateur de Financement Immobilier
          </h3>
          <p className="text-xs text-gray-500">
            Estimez instantanément vos mensualités pour ce bien d&apos;exception en Provence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders Input */}
        <div className="space-y-4">
          {/* Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Prix d&apos;acquisition</span>
              <span className="text-[#E12B7B] font-bold">{price.toLocaleString('fr-FR')} €</span>
            </div>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="5000"
              value={price}
              onChange={(e) => {
                const newPrice = Number(e.target.value);
                setPrice(newPrice);
                if (downPayment > newPrice) setDownPayment(Math.round(newPrice * 0.1));
              }}
              className="w-full accent-[#E12B7B] cursor-pointer"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Apport personnel</span>
              <span className="text-gray-900 font-bold">{downPayment.toLocaleString('fr-FR')} €</span>
            </div>
            <input
              type="range"
              min="0"
              max={price}
              step="5000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-[#E12B7B] cursor-pointer"
            />
          </div>

          {/* Duration & Rates */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Durée (années)
              </label>
              <select
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
              >
                <option value={15}>15 ans (180 mois)</option>
                <option value={20}>20 ans (240 mois)</option>
                <option value={25}>25 ans (300 mois)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-gray-400" />
                Taux d&apos;intérêt (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
              />
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-[#FCFAF7] rounded-xl p-6 border border-[#F3E8EE] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 block mb-1">
              Mensualité Estimée (Assurance incluse)
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#E12B7B]">
              {totalMonthly.toLocaleString('fr-FR')} € <span className="text-sm font-normal text-gray-500">/ mois</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 border-t border-[#F3E8EE] pt-3">
            <div className="flex justify-between">
              <span>Montant total emprunté :</span>
              <span className="font-bold text-gray-900">{loanAmount.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de notaire estimés (~7.5%) :</span>
              <span className="font-bold text-gray-900">{notaryFees.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between">
              <span>Coût total du crédit :</span>
              <span className="font-bold text-gray-900">{totalCost.toLocaleString('fr-FR')} €</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-white p-2.5 rounded-lg border border-gray-200">
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Simulation indicative hors frais de garantie et dossier. Consultez votre courtier ou banquier.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
