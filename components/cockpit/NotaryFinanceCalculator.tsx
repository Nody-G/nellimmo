'use client';

import React, { useState, useId } from 'react';
import {
  Calculator,
  Landmark,
  Coins,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Info,
  Euro,
  FileText
} from 'lucide-react';

export function NotaryFinanceCalculator() {
  const purchasePriceId = useId();
  const furnitureValueId = useId();
  const propertyStateId = useId();
  const departmentId = useId();
  const isPrincipalResidenceId = useId();
  const salePriceId = useId();
  const initialPurchasePriceId = useId();
  const holdingYearsId = useId();
  const worksOptionId = useId();

  const [activeTab, setActiveTab] = useState<'notary' | 'capital_gains'>('notary');

  // Notary fees inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(450000);
  const [furnitureValue, setFurnitureValue] = useState<number>(12000);
  const [propertyState, setPropertyState] = useState<'ancien' | 'neuf'>('ancien');
  const [departmentRate, setDepartmentRate] = useState<number>(5.80); // 5.80% Bouches-du-Rhône

  // Capital gains inputs
  const [salePrice, setSalePrice] = useState<number>(520000);
  const [initialPurchasePrice, setInitialPurchasePrice] = useState<number>(340000);
  const [holdingYears, setHoldingYears] = useState<number>(8);
  const [isPrincipalResidence, setIsPrincipalResidence] = useState<boolean>(false);
  const [worksOption, setWorksOption] = useState<'forfait' | 'reel'>('forfait');
  const [realWorksAmount, setRealWorksAmount] = useState<number>(0);

  // --- 1. NOTARY CALCULATION (Décret 2020-179) ---
  const taxableBase = Math.max(0, purchasePrice - furnitureValue);

  // Émoluments de vente proportionnels HT
  let emolsHT = 0;
  if (taxableBase <= 6500) {
    emolsHT = taxableBase * 0.03870;
  } else if (taxableBase <= 17000) {
    emolsHT = 6500 * 0.03870 + (taxableBase - 6500) * 0.01596;
  } else if (taxableBase <= 60000) {
    emolsHT = 6500 * 0.03870 + (17000 - 6500) * 0.01596 + (taxableBase - 17000) * 0.01064;
  } else {
    emolsHT =
      6500 * 0.03870 +
      (17000 - 6500) * 0.01596 +
      (60000 - 17000) * 0.01064 +
      (taxableBase - 60000) * 0.00799;
  }

  const emolsTTC = emolsHT * 1.20;

  // Droits de mutation (Taxe de publicité foncière)
  const transferTaxes = propertyState === 'ancien'
    ? taxableBase * (departmentRate / 100)
    : taxableBase * 0.00715; // 0.715% en neuf / VEFA

  // Contribution de sécurité immobilière (0.10%)
  const csi = Math.max(15, taxableBase * 0.001);

  // Débours et formalités administratives forfaitaires
  const disbursements = 1350;

  // Total Frais d'acquisition
  const totalNotaryFees = Math.round(emolsTTC + transferTaxes + csi + disbursements);
  const notaryPercent = ((totalNotaryFees / purchasePrice) * 100).toFixed(2);

  // Économie réalisée grâce au mobilier
  const savingsFromFurniture = Math.round(furnitureValue * (departmentRate / 100));

  // --- 2. CAPITAL GAINS CALCULATION (Plus-Value Immobilière) ---
  // Frais d'acquisition forfaitaires (7.5%)
  const acquisitionCostsAllowance = initialPurchasePrice * 0.075;

  // Forfait travaux (15% si détention > 5 ans)
  const worksAllowance = worksOption === 'forfait'
    ? (holdingYears >= 5 ? initialPurchasePrice * 0.15 : 0)
    : realWorksAmount;

  const adjustedAcquisitionPrice = initialPurchasePrice + acquisitionCostsAllowance + worksAllowance;
  const grossCapitalGain = Math.max(0, salePrice - adjustedAcquisitionPrice);

  // Abattements IR (19%)
  let irAbatementRate = 0;
  if (isPrincipalResidence) {
    irAbatementRate = 100;
  } else if (holdingYears < 6) {
    irAbatementRate = 0;
  } else if (holdingYears <= 21) {
    irAbatementRate = (holdingYears - 5) * 6;
  } else if (holdingYears === 22) {
    irAbatementRate = 16 * 6 + 4; // 100%
  } else {
    irAbatementRate = 100;
  }

  // Abattements Prélèvements Sociaux (17.2%)
  let psAbatementRate = 0;
  if (isPrincipalResidence) {
    psAbatementRate = 100;
  } else if (holdingYears < 6) {
    psAbatementRate = 0;
  } else if (holdingYears <= 21) {
    psAbatementRate = (holdingYears - 5) * 1.65;
  } else if (holdingYears === 22) {
    psAbatementRate = 16 * 1.65 + 1.60;
  } else if (holdingYears <= 30) {
    psAbatementRate = 16 * 1.65 + 1.60 + (holdingYears - 22) * 9;
  } else {
    psAbatementRate = 100;
  }
  psAbatementRate = Math.min(100, psAbatementRate);

  const taxableGainIR = grossCapitalGain * (1 - irAbatementRate / 100);
  const taxableGainPS = grossCapitalGain * (1 - psAbatementRate / 100);

  const taxIR = Math.round(taxableGainIR * 0.19);
  const taxPS = Math.round(taxableGainPS * 0.172);

  // Surtaxe plus-value élevée (> 50 000€)
  let highGainSurtax = 0;
  if (!isPrincipalResidence && taxableGainIR > 50000) {
    if (taxableGainIR <= 100000) highGainSurtax = taxableGainIR * 0.02;
    else if (taxableGainIR <= 150000) highGainSurtax = taxableGainIR * 0.03;
    else if (taxableGainIR <= 200000) highGainSurtax = taxableGainIR * 0.04;
    else if (taxableGainIR <= 250000) highGainSurtax = taxableGainIR * 0.05;
    else highGainSurtax = taxableGainIR * 0.06;
  }

  const totalCapitalGainsTax = isPrincipalResidence ? 0 : Math.round(taxIR + taxPS + highGainSurtax);
  const netSellerProceeds = Math.round(salePrice - totalCapitalGainsTax);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#E12B7B]" />
            <span>Simulateur Notarial Avancé & Plus-Value Immobilière</span>
          </h3>
          <p className="text-xs text-gray-500">
            Calculs officiels certifiés : Décret n° 2020-179 & Barème fiscal des plus-values immobilières des particuliers.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('notary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'notary' ? 'bg-[#131B26] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Frais de Notaire Réels
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('capital_gains')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'capital_gains' ? 'bg-[#131B26] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Plus-Value Vendeur
          </button>
        </div>
      </div>

      {/* TAB 1: NOTARY FEES */}
      {activeTab === 'notary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={purchasePriceId} className="block font-bold uppercase text-gray-700 mb-1">Prix d&apos;Achat FAI (€)</label>
                <input
                  id={purchasePriceId}
                  type="number"
                  step="5000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label htmlFor={furnitureValueId} className="block font-bold uppercase text-gray-700 mb-1 flex items-center justify-between">
                  <span>Mobilier Déductible (€)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Économie directe</span>
                </label>
                <input
                  id={furnitureValueId}
                  type="number"
                  step="1000"
                  value={furnitureValue}
                  onChange={(e) => setFurnitureValue(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-sm focus:outline-[#E12B7B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={propertyStateId} className="block font-bold uppercase text-gray-700 mb-1">Nature du Bien</label>
                <select
                  id={propertyStateId}
                  value={propertyState}
                  onChange={(e) => setPropertyState(e.target.value as 'ancien' | 'neuf')}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  <option value="ancien">Logement Ancien (~7-8 %)</option>
                  <option value="neuf">Neuf / VEFA Frais Réduits (~2-3 %)</option>
                </select>
              </div>

              <div>
                <label htmlFor={departmentId} className="block font-bold uppercase text-gray-700 mb-1">Département (Droits de mutation)</label>
                <select
                  id={departmentId}
                  value={departmentRate}
                  onChange={(e) => setDepartmentRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  <option value={5.80}>13 - Bouches-du-Rhône (5,80 %)</option>
                  <option value={5.80}>84 - Vaucluse (5,80 %)</option>
                  <option value={5.80}>83 - Var (5,80 %)</option>
                  <option value={5.09}>Indre (Taux minoré 5,09 %)</option>
                </select>
              </div>
            </div>

            {/* Furniture tip card */}
            {furnitureValue > 0 && (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>
                    Optimisation fiscale : <strong>{savingsFromFurniture.toLocaleString('fr-FR')} €</strong> d&apos;impôts économisés grâce à la liste de mobilier déduite !
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#FCFAF7] p-5 rounded-2xl border border-[#F3E8EE] space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Frais d&apos;Acquisition Notariés</span>
              <div className="text-3xl font-serif font-black text-[#131B26]">
                {totalNotaryFees.toLocaleString('fr-FR')} €
              </div>
              <span className="text-xs text-gray-500 font-semibold">
                Soit ~{notaryPercent} % du prix d&apos;achat
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Droits de mutation (Trésor Public) :</span>
                <span className="font-bold text-gray-900">{Math.round(transferTaxes).toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Émoluments du Notaire (Décret 2020-179 TTC) :</span>
                <span className="font-bold text-gray-900">{Math.round(emolsTTC).toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Contribution Sécurité Immobilière (CSI) :</span>
                <span className="font-bold text-gray-900">{Math.round(csi).toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Débours, pièces d&apos;état-civil & cadastre :</span>
                <span className="font-bold text-gray-900">{disbursements.toLocaleString('fr-FR')} €</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-600">
              Coût total projet (Bien + Notaire) : <strong className="text-[#131B26]">{(purchasePrice + totalNotaryFees).toLocaleString('fr-FR')} €</strong>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CAPITAL GAINS */}
      {activeTab === 'capital_gains' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                id={isPrincipalResidenceId}
                type="checkbox"
                checked={isPrincipalResidence}
                onChange={(e) => setIsPrincipalResidence(e.target.checked)}
                className="accent-[#E12B7B] w-4 h-4 cursor-pointer"
              />
              <label htmlFor={isPrincipalResidenceId} className="font-bold text-gray-800 cursor-pointer">
                Résidence Principale (Exonération totale à 100% de la plus-value)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor={salePriceId} className="block font-bold uppercase text-gray-700 mb-1">Prix de Vente Net (€)</label>
                <input
                  id={salePriceId}
                  type="number"
                  step="5000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label htmlFor={initialPurchasePriceId} className="block font-bold uppercase text-gray-700 mb-1">Prix d&apos;Achat Initial (€)</label>
                <input
                  id={initialPurchasePriceId}
                  type="number"
                  step="5000"
                  value={initialPurchasePrice}
                  onChange={(e) => setInitialPurchasePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label htmlFor={holdingYearsId} className="block font-bold uppercase text-gray-700 mb-1">Durée Détention (Ans)</label>
                <input
                  id={holdingYearsId}
                  type="number"
                  min="0"
                  max="40"
                  value={holdingYears}
                  onChange={(e) => setHoldingYears(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={worksOptionId} className="block font-bold uppercase text-gray-700 mb-1">Déduction Forfait Travaux</label>
                <select
                  id={worksOptionId}
                  value={worksOption}
                  onChange={(e) => setWorksOption(e.target.value as 'forfait' | 'reel')}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  <option value="forfait">Forfait légal 15% (détention &gt; 5 ans)</option>
                  <option value="reel">Montant réel des factures d&apos;artisans</option>
                </select>
              </div>

              {worksOption === 'reel' && (
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Factures Travaux TTC (€)</label>
                  <input
                    type="number"
                    value={realWorksAmount}
                    onChange={(e) => setRealWorksAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-[#E12B7B]"
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
              <span className="font-bold block">Abattements légaux après {holdingYears} ans de détention :</span>
              <div className="flex gap-4">
                <span>Impôt sur le Revenu (19%) : <strong>{irAbatementRate}% d&apos;abattement</strong></span>
                <span>Prélèvements Sociaux (17,2%) : <strong>{Math.round(psAbatementRate)}% d&apos;abattement</strong></span>
              </div>
            </div>
          </div>

          {/* Results Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#FCFAF7] p-5 rounded-2xl border border-[#F3E8EE] space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Impôt sur la Plus-Value Dû</span>
              <div className="text-3xl font-serif font-black text-rose-600">
                {totalCapitalGainsTax.toLocaleString('fr-FR')} €
              </div>
              {isPrincipalResidence ? (
                <span className="text-xs text-emerald-600 font-bold block mt-1">
                  ✓ Exonération Résidence Principale (0 € d&apos;impôt)
                </span>
              ) : (
                <span className="text-xs text-gray-500 font-semibold block mt-1">
                  Net vendeur en poche : <strong className="text-gray-900">{netSellerProceeds.toLocaleString('fr-FR')} €</strong>
                </span>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Plus-Value Brute Réalisée :</span>
                <span className="font-bold text-gray-900">{grossCapitalGain.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Part Impôt Revenu (IR 19%) :</span>
                <span className="font-bold text-gray-900">{taxIR.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Part Prélèvements Sociaux (17,2%) :</span>
                <span className="font-bold text-gray-900">{taxPS.toLocaleString('fr-FR')} €</span>
              </div>
              {highGainSurtax > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Surtaxe plus-value élevée (&gt;50k€) :</span>
                  <span className="font-bold">{highGainSurtax.toLocaleString('fr-FR')} €</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-600">
              Forfait acquisition appliqué : +{Math.round(acquisitionCostsAllowance).toLocaleString('fr-FR')} € (7,5%)<br />
              Forfait travaux appliqué : +{Math.round(worksAllowance).toLocaleString('fr-FR')} €
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
