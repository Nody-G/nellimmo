'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  PiggyBank,
  CheckCircle2,
  Copy,
  Check,
  Building,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { computeLoanSimulation } from '@/components/cockpit/acquereurs/acquereurs-types';

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
            <span>Capacité d&apos;Emprunt & Normes Bancaires 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
            Simulateur Crédit & Règle HCSF (Endettement max 35%)
          </h2>
          <p className="text-xs text-gray-500">
            Validez la solvabilité financière de vos acquéreurs selon les règles du Haut Conseil de Stabilité Financière avant toute offre.
          </p>
        </div>

        <button
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

      {/* Sliders and Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-2">
            <Building className="w-4 h-4 text-[#C59A45]" />
            <span>Paramètres de l&apos;Acquisition</span>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Prix d&apos;Achat Visé (€)</label>
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
                {downPayment >= result.notaryFees ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> L&apos;apport couvre les frais de notaire (Dossier finançable standard).
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
                Le taux d&apos;effort maximal est plafonné à <strong>35%</strong> assurance comprise pour une durée maximale de <strong>25 ans</strong> (27 ans en VEFA ou ancien avec 25% de travaux).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
