'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Copy, Check } from 'lucide-react';
import { RentalYieldKpis } from './rental/RentalYieldKpis';
import { RentalPropertyInputs } from './rental/RentalPropertyInputs';
import { RentalLoanInputs } from './rental/RentalLoanInputs';
import { RentalYieldTaxAdvice } from './rental/RentalYieldTaxAdvice';

export function RentalYieldSimulator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(180000);
  const [furnitureOrWorks, setFurnitureOrWorks] = useState<number>(15000);
  const [notaryFees, setNotaryFees] = useState<number>(13500); // ~7.5%
  const [monthlyRent, setMonthlyRent] = useState<number>(750);
  const [nonRecoverableCharges, setNonRecoverableCharges] = useState<number>(450);
  const [propertyTax, setPropertyTax] = useState<number>(850);
  const [pnoInsurance, setPnoInsurance] = useState<number>(180);

  const [includeLoan, setIncludeLoan] = useState<boolean>(true);
  const [downPayment, setDownPayment] = useState<number>(25000);
  const [loanRate, setLoanRate] = useState<number>(3.4);
  const [loanDurationYears, setLoanDurationYears] = useState<number>(20);

  const [copied, setCopied] = useState<boolean>(false);

  const applyAutoNotary = () => {
    setNotaryFees(Math.round(purchasePrice * 0.075));
  };

  const results = useMemo(() => {
    const totalAcquisitionCost = purchasePrice + notaryFees + furnitureOrWorks;
    const annualRent = monthlyRent * 12;

    const grossYield = totalAcquisitionCost > 0 ? (annualRent / totalAcquisitionCost) * 100 : 0;
    const annualExpenses = nonRecoverableCharges + propertyTax + pnoInsurance;
    const netAnnualRent = Math.max(0, annualRent - annualExpenses);
    const netYield = totalAcquisitionCost > 0 ? (netAnnualRent / totalAcquisitionCost) * 100 : 0;

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
          type="button"
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

      {/* KPI Highlights */}
      <RentalYieldKpis
        grossYield={results.grossYield}
        netYield={results.netYield}
        monthlyMortgage={results.monthlyMortgage}
        monthlyCashFlow={results.monthlyCashFlow}
        includeLoan={includeLoan}
      />

      {/* Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RentalPropertyInputs
          purchasePrice={purchasePrice}
          setPurchasePrice={setPurchasePrice}
          furnitureOrWorks={furnitureOrWorks}
          setFurnitureOrWorks={setFurnitureOrWorks}
          notaryFees={notaryFees}
          setNotaryFees={setNotaryFees}
          applyAutoNotary={applyAutoNotary}
          monthlyRent={monthlyRent}
          setMonthlyRent={setMonthlyRent}
          nonRecoverableCharges={nonRecoverableCharges}
          setNonRecoverableCharges={setNonRecoverableCharges}
          propertyTax={propertyTax}
          setPropertyTax={setPropertyTax}
          pnoInsurance={pnoInsurance}
          setPnoInsurance={setPnoInsurance}
        />

        <div className="space-y-6">
          <RentalLoanInputs
            includeLoan={includeLoan}
            setIncludeLoan={setIncludeLoan}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            loanRate={loanRate}
            setLoanRate={setLoanRate}
            loanDurationYears={loanDurationYears}
            setLoanDurationYears={setLoanDurationYears}
            loanAmount={results.loanAmount}
            monthlyMortgage={results.monthlyMortgage}
            monthlyCashFlow={results.monthlyCashFlow}
          />
          <RentalYieldTaxAdvice />
        </div>
      </div>
    </div>
  );
}
