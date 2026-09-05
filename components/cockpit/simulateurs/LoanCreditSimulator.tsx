'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Copy, Check } from 'lucide-react';
import { computeLoanSimulation } from '@/components/cockpit/acquereurs/acquereurs-types';
import { LoanCreditKpis } from './loan/LoanCreditKpis';
import { LoanCreditAcquisitionInputs } from './loan/LoanCreditAcquisitionInputs';
import { LoanCreditTermsInputs } from './loan/LoanCreditTermsInputs';

export function LoanCreditSimulator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(450000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [durationYears, setDurationYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(3.4);
  const [insuranceRate, setInsuranceRate] = useState<number>(0.34);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return computeLoanSimulation({
      purchasePrice,
      downPayment,
      durationYears,
      interestRate,
      insuranceRate,
    });
  }, [purchasePrice, downPayment, durationYears, interestRate, insuranceRate]);

  const copyFinancingSummary = () => {
    const summary = `🏦 PLAN DE FINANCEMENT ACQUÉREUR & RÈGLE HCSF — NELL'IMMO
------------------------------------------------------
• Prix du bien visé : ${purchasePrice.toLocaleString('fr-FR')} €
• Apport personnel : ${downPayment.toLocaleString('fr-FR')} €
• Frais de notaire estimés (~7.5%) : ${result.notaryFees.toLocaleString('fr-FR')} €
• Coût total du projet : ${result.totalCost.toLocaleString('fr-FR')} €

📊 MODALITÉS DU CRÉDIT :
• Montant emprunté : ${result.loanAmount.toLocaleString('fr-FR')} €
• Durée du prêt : ${durationYears} ans (${durationYears * 12} mensualités)
• Taux nominal : ${interestRate} % | Assurance : ${insuranceRate} %

💳 MENSUALITÉS & VALIDATION HCSF :
• Mensualité hors assurance : ${result.baseMonthlyPayment.toLocaleString('fr-FR')} € / mois
• Assurance emprunteur : ${result.monthlyInsurance.toLocaleString('fr-FR')} € / mois
👉 Mensualité Globale : ${result.totalMonthlyPayment.toLocaleString('fr-FR')} € / mois
👉 Revenus Nets du Foyer Requis (Endettement max 35%) : ${result.minRequiredHouseholdIncome.toLocaleString('fr-FR')} € / mois

Simulateur certifié Nell'Immo — Salon-de-Provence & Pays Salonais.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Calculator className="w-4 h-4" />
            <span>Capacité d’Emprunt & Normes Bancaires 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
            Simulateur Crédit & Règle HCSF (Endettement max 35%)
          </h2>
          <p className="text-xs text-gray-500">
            Validez la solvabilité financière de vos acquéreurs selon les règles du Haut Conseil de Stabilité Financière avant toute offre.
          </p>
        </div>

        <button
          type="button"
          onClick={copyFinancingSummary}
          className="px-4 py-2.5 bg-gradient-to-r from-[#131B26] to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Synthèse copiée !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#C59A45]" />
              <span>Copier Fiche Financière WhatsApp</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Pillars KPI Cards */}
      <LoanCreditKpis result={result} />

      {/* Sliders and Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LoanCreditAcquisitionInputs
          purchasePrice={purchasePrice}
          setPurchasePrice={setPurchasePrice}
          downPayment={downPayment}
          setDownPayment={setDownPayment}
          notaryFees={result.notaryFees}
        />

        <LoanCreditTermsInputs
          durationYears={durationYears}
          setDurationYears={setDurationYears}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          insuranceRate={insuranceRate}
          setInsuranceRate={setInsuranceRate}
        />
      </div>
    </div>
  );
}
