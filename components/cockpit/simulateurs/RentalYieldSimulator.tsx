'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Building,
  Euro,
  Percent,
  PiggyBank,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

export function RentalYieldSimulator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(180000);
  const [furnitureOrWorks, setFurnitureOrWorks] = useState<number>(15000);
  const [notaryFees, setNotaryFees] = useState<number>(13500); // ~7.5%
  const [monthlyRent, setMonthlyRent] = useState<number>(750);
  const [nonRecoverableCharges, setNonRecoverableCharges] = useState<number>(450); // annuel
  const [propertyTax, setPropertyTax] = useState<number>(850); // annuel
  const [pnoInsurance, setPnoInsurance] = useState<number>(180); // annuel

  // Financement optionnel pour calculer le cash-flow
  const [includeLoan, setIncludeLoan] = useState<boolean>(true);
  const [downPayment, setDownPayment] = useState<number>(25000);
  const [loanRate, setLoanRate] = useState<number>(3.4);
  const [loanDurationYears, setLoanDurationYears] = useState<number>(20);

  const [copied, setCopied] = useState<boolean>(false);

  // Auto-ajustement des frais de notaire si on clique sur le bouton auto
  const applyAutoNotary = () => {
    setNotaryFees(Math.round(purchasePrice * 0.075));
  };

  // Calculs
  const results = useMemo(() => {
    const totalAcquisitionCost = purchasePrice + notaryFees + furnitureOrWorks;
    const annualRent = monthlyRent * 12;

    // Rendement brut
    const grossYield = totalAcquisitionCost > 0 ? (annualRent / totalAcquisitionCost) * 100 : 0;

    // Dépenses annuelles
    const annualExpenses = nonRecoverableCharges + propertyTax + pnoInsurance;
    const netAnnualRent = Math.max(0, annualRent - annualExpenses);

    // Rendement net
    const netYield = totalAcquisitionCost > 0 ? (netAnnualRent / totalAcquisitionCost) * 100 : 0;

    // Mensualité de prêt
    const loanAmount = Math.max(0, totalAcquisitionCost - downPayment);
    let monthlyMortgage = 0;
    if (includeLoan && loanAmount > 0) {
      const monthlyRate = loanRate / 100 / 12;
      const totalMonths = loanDurationYears * 12;
      monthlyMortgage =
        monthlyRate > 0
          ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths))
          : loanAmount / totalMonths;
    }

    // Cash-flow
    const monthlyExpenses = annualExpenses / 12;
    const monthlyNetRentBeforeLoan = monthlyRent - monthlyExpenses;
    const monthlyCashFlow = includeLoan
      ? monthlyNetRentBeforeLoan - monthlyMortgage
      : monthlyNetRentBeforeLoan;

    return {
      totalAcquisitionCost,
      annualRent,
      annualExpenses,
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      monthlyMortgage: Math.round(monthlyMortgage),
      monthlyCashFlow: Math.round(monthlyCashFlow),
      monthlyNetRentBeforeLoan: Math.round(monthlyNetRentBeforeLoan),
      loanAmount: Math.round(loanAmount),
    };
  }, [
    purchasePrice,
    furnitureOrWorks,
    notaryFees,
    monthlyRent,
    nonRecoverableCharges,
    propertyTax,
    pnoInsurance,
    includeLoan,
    downPayment,
    loanRate,
    loanDurationYears,
  ]);

  const copyInvestorPitch = () => {
    const pitch = `📊 ANALYSE RENTABILITÉ INVESTISSEUR — NELL'IMMO
-----------------------------------------
• Prix FAI : ${purchasePrice.toLocaleString('fr-FR')} €
• Travaux / Mobilier : ${furnitureOrWorks.toLocaleString('fr-FR')} €
• Frais de notaire estimés : ${notaryFees.toLocaleString('fr-FR')} €
• Coût Total Projet : ${results.totalAcquisitionCost.toLocaleString('fr-FR')} €

📈 RENDEMENTS :
• Loyer estimé : ${monthlyRent} € / mois
• Rendement Brut : ${results.grossYield} %
• Rendement Net de charges : ${results.netYield} %
${
  includeLoan
    ? `\n🏦 SIMULATION FINANCEMENT (Apport : ${downPayment.toLocaleString(
        'fr-FR'
      )} €, Durée : ${loanDurationYears} ans @ ${loanRate}%) :
• Mensualité crédit : ~${results.monthlyMortgage} € / mois
• Cash-flow mensuel net estimé : ${results.monthlyCashFlow >= 0 ? '+' : ''}${
        results.monthlyCashFlow
      } € / mois`
    : ''
}

💡 CONSEIL NELL'IMMO : Régime LMNP au Réel recommandé pour amortir le bien et les travaux, permettant une fiscalité quasi-nulle sur les premières années d'exploitation.`;

    navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <TrendingUp className="w-4 h-4" />
            <span>Investissement Locatif & Ingénierie Patrimoniale</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
            Simulateur de Rendement Locatif & Cash-Flow
          </h2>
          <p className="text-xs text-gray-500">
            Calculez le rendement brut, le rendement net réel de charges et le cash-flow mensuel pour vos acquéreurs investisseurs.
          </p>
        </div>

        <button
          onClick={copyInvestorPitch}
          className="px-4 py-2.5 bg-gradient-to-r from-[#131B26] to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copié dans le presse-papier !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#C59A45]" />
              <span>Copier Pitch Investisseur WhatsApp</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Cards Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/70 to-white border border-pink-100 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E12B7B] block mb-1 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> Rendement Brut
          </span>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {results.grossYield} <span className="text-lg font-bold text-gray-400">%</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Loyer annuel / Coût global
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59A45] block mb-1 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> Rendement Net
          </span>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {results.netYield} <span className="text-lg font-bold text-gray-400">%</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Déduction charges & foncier
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1 flex items-center gap-1.5">
            <Euro className="w-3.5 h-3.5" /> Coût Global Projet
          </span>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {results.totalAcquisitionCost.toLocaleString('fr-FR')}{' '}
            <span className="text-base font-bold text-gray-400">€</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Prix + notaire + travaux
          </span>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-2xs ${
            results.monthlyCashFlow >= 0
              ? 'bg-gradient-to-br from-emerald-50/70 to-white border-emerald-200'
              : 'bg-gradient-to-br from-rose-50/70 to-white border-rose-200'
          }`}
        >
          <span
            className={`text-[11px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5 ${
              results.monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" /> Cash-Flow Mensuel
          </span>
          <div
            className={`text-3xl font-black tracking-tight ${
              results.monthlyCashFlow >= 0 ? 'text-emerald-800' : 'text-rose-800'
            }`}
          >
            {results.monthlyCashFlow >= 0 ? '+' : ''}
            {results.monthlyCashFlow}{' '}
            <span className="text-lg font-bold text-gray-400">€/mois</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {includeLoan ? 'Après mensualité crédit' : 'Sans crédit'}
          </span>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne 1 : Acquisition & Dépenses du bien */}
        <div className="space-y-5 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-2">
            <Building className="w-4 h-4 text-[#C59A45]" />
            <span>1. Investissement & Charges du Bien</span>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Prix d&apos;achat FAI (€)</label>
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
                    onClick={applyAutoNotary}
                    className="text-[10px] text-[#C59A45] hover:underline font-bold"
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

        {/* Colonne 2 : Financement Bancaire & Optimisation Fiscale */}
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
                  Montant emprunté : {results.loanAmount.toLocaleString('fr-FR')} €
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
                    {results.monthlyMortgage} € <span className="text-xs font-normal text-gray-500">/ mois</span>
                  </span>
                </div>
                <div className="text-right text-[11px] text-blue-800">
                  <span>Effort d&apos;épargne / Cash-flow :</span>
                  <div className="font-bold">
                    {results.monthlyCashFlow >= 0 ? '+' : ''}
                    {results.monthlyCashFlow} € / mois
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              Achat 100% comptant. Cochez la case ci-dessus pour intégrer un effet de levier bancaire.
            </div>
          )}

          {/* Conseils Fiscaux Provence */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-pink-50/50 rounded-2xl border border-amber-200/70 text-xs space-y-2">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C59A45]" />
              <span>Optimisation Fiscale Recommandée : Régime LMNP Réel</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              En meublé de tourisme ou bail d&apos;habitation meublé (Salon-de-Provence / Pélissanne), l&apos;amortissement comptable de l&apos;immeuble (sur 25 ans) et des travaux/meubles (sur 5 à 10 ans) efface généralement la totalité de l&apos;impôt sur les loyers perçus pendant 8 à 12 ans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
