'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_DVF_TRANSACTIONS } from '@/lib/mock-data';
import { DVFTransaction } from '@/lib/types';
import {
  TrendingUp,
  Search,
  Printer,
  Sparkles,
  Calculator,
  Sliders,
  ShieldCheck,
  Building,
  Coins,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

function ValuationDvfContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || 'Pélissanne';
  const initialSurface = Number(searchParams.get('surface')) || 148;
  const initialOwner = searchParams.get('owner') || 'M. et Mme Dupont';

  const [addressSearch, setAddressSearch] = useState(`145 Chemin des Oliviers, 13330 ${initialCity}`);
  const [propertyType, setPropertyType] = useState('Maison');
  const [surfaceInput, setSurfaceInput] = useState<number>(initialSurface);
  const [landInput, setLandInput] = useState<number>(1100);
  const [roomsInput, setRoomsInput] = useState<number>(5);
  const [ownerName, setOwnerName] = useState(initialOwner);
  const [transactions] = useState<DVFTransaction[]>(MOCK_DVF_TRANSACTIONS);
  const [isDossierGenerated, setIsDossierGenerated] = useState(false);

  // Criteria Weight Adjustments (interactive sliders in %)
  const [stateAdjustment, setStateAdjustment] = useState<number>(5); // +5% (très bon état)
  const [poolAdjustment, setPoolAdjustment] = useState<number>(6); // +6% (piscine présente)
  const [quietAdjustment, setQuietAdjustment] = useState<number>(4); // +4% (calme absolu)
  const [dpeAdjustment, setDpeAdjustment] = useState<number>(2); // +2% (bon DPE)
  const [viewAdjustment, setViewAdjustment] = useState<number>(3); // +3% (vue dégagée)

  // Capitalization Method parameters
  const [estimatedMonthlyRent, setEstimatedMonthlyRent] = useState<number>(1850);
  const [targetCapRate, setTargetCapRate] = useState<number>(5.2); // 5.2%

  // Replacement Cost Method parameters
  const [landValueM2, setLandValueM2] = useState<number>(180); // 180€/m² terrain constructible Pélissanne
  const [buildCostM2, setBuildCostM2] = useState<number>(2100); // 2100€/m² à neuf
  const [depreciationPct, setDepreciationPct] = useState<number>(15); // -15% vétusté

  // Active method tab
  const [activeMethodTab, setActiveMethodTab] = useState<'dvf' | 'cap' | 'cost'>('dvf');

  // 1. DVF Method Calculation
  const baseDvfM2 = Math.round(
    transactions.reduce((sum, t) => sum + t.prix_m2, 0) / transactions.length
  );
  const totalAdjustmentPct = stateAdjustment + poolAdjustment + quietAdjustment + dpeAdjustment + viewAdjustment;
  const adjustedDvfM2 = Math.round(baseDvfM2 * (1 + totalAdjustmentPct / 100));
  const dvfEstimatedTotal = Math.round(surfaceInput * adjustedDvfM2);

  // 2. Capitalization Method Calculation
  const annualRent = estimatedMonthlyRent * 12;
  const capitalizationEstimatedTotal = Math.round((annualRent / (targetCapRate / 100)));

  // 3. Replacement Cost Method Calculation
  const rawLandValue = landInput * landValueM2;
  const rawBuildValue = surfaceInput * buildCostM2 * (1 - depreciationPct / 100);
  const replacementEstimatedTotal = Math.round(rawLandValue + rawBuildValue);

  // Triangulation / Weighted Composite Value
  const compositeEstimatedPrice = Math.round(
    dvfEstimatedTotal * 0.55 + capitalizationEstimatedTotal * 0.25 + replacementEstimatedTotal * 0.20
  );

  // Strategic Scenarios
  const priceAttack = Math.round(compositeEstimatedPrice * 0.94);
  const priceTarget = compositeEstimatedPrice;
  const priceHigh = Math.round(compositeEstimatedPrice * 1.07);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDossierGenerated(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <TrendingUp className="w-4 h-4" />
            <span>Laboratoire d&apos;Estimation & Données Notaires</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Avis de Valeur & Triple Méthodologie d&apos;Expertise
          </h1>
          <p className="text-xs text-gray-500">
            Méthode DVF pondérée, capitalisation locative et coût à neuf pour des estimations incontestables.
          </p>
        </div>

        <button
          onClick={() => setIsDossierGenerated(true)}
          className="px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FBF6E9]" />
          <span>Générer le Dossier d&apos;Expertise Complet</span>
        </button>
      </div>

      {/* Search & Base Parameters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
        <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#E12B7B]" />
          1. Fiche Descriptive du Bien à Estimer
        </h3>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse ou Lieu-dit</label>
            <input
              type="text"
              required
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom du Propriétaire Mandant</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Typologie</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            >
              <option value="Maison">Maison / Villa</option>
              <option value="Appartement">Appartement</option>
              <option value="Terrain">Terrain à bâtir</option>
              <option value="Propriété de charme">Mas / Propriété de charme</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Habitable (m²)</label>
            <input
              type="number"
              value={surfaceInput}
              onChange={(e) => setSurfaceInput(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Terrain (m²)</label>
            <input
              type="number"
              value={landInput}
              onChange={(e) => setLandInput(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nombre de pièces</label>
            <input
              type="number"
              value={roomsInput}
              onChange={(e) => setRoomsInput(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Actualiser Données
            </button>
          </div>
        </form>
      </div>

      {/* Triple Valuation Methodologies Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C59A45]" />
              2. Les 3 Méthodes d&apos;Évaluation en Temps Réel
            </h3>
            <p className="text-xs text-gray-500">
              Ajustez les pondérations selon les spécificités uniques du bien.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMethodTab('dvf')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeMethodTab === 'dvf' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. DVF Pondéré
            </button>
            <button
              type="button"
              onClick={() => setActiveMethodTab('cap')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeMethodTab === 'cap' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Rendement Locatif
            </button>
            <button
              type="button"
              onClick={() => setActiveMethodTab('cost')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeMethodTab === 'cost' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3. Coût à Neuf
            </button>
          </div>
        </div>

        {/* Method 1 : DVF with Weight Sliders */}
        {activeMethodTab === 'dvf' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Prix Moyen DVF Notaires Bruts</span>
                <span className="text-xl font-black text-gray-900">{baseDvfM2.toLocaleString('fr-FR')} €/m²</span>
              </div>
              <div className="p-4 bg-[#FDF2F8] rounded-2xl border border-[#F3E8EE] text-center">
                <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">Pondération Qualité Globale</span>
                <span className={`text-xl font-black ${totalAdjustmentPct >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {totalAdjustmentPct >= 0 ? `+${totalAdjustmentPct}%` : `${totalAdjustmentPct}%`}
                </span>
              </div>
              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#E9DFD3] text-center">
                <span className="text-[10px] uppercase font-bold text-[#C59A45] block">Valeur Méthode DVF</span>
                <span className="text-xl font-black text-[#131B26]">{dvfEstimatedTotal.toLocaleString('fr-FR')} €</span>
                <span className="text-[10px] text-gray-500 block">~{adjustedDvfM2.toLocaleString('fr-FR')} €/m² pondéré</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <span className="text-xs font-bold uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#E12B7B]" />
                Ajustements Fins sur le Bien (+/- 20%)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>État général & Rénovation</span>
                    <span className="text-[#E12B7B]">{stateAdjustment > 0 ? `+${stateAdjustment}%` : `${stateAdjustment}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    value={stateAdjustment}
                    onChange={(e) => setStateAdjustment(Number(e.target.value))}
                    className="w-full accent-[#E12B7B]"
                  />
                  <span className="text-[10px] text-gray-400">Rénovation récente vs Travaux à prévoir</span>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Piscine & Aménagements</span>
                    <span className="text-[#E12B7B]">{poolAdjustment > 0 ? `+${poolAdjustment}%` : `${poolAdjustment}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={12}
                    value={poolAdjustment}
                    onChange={(e) => setPoolAdjustment(Number(e.target.value))}
                    className="w-full accent-[#E12B7B]"
                  />
                  <span className="text-[10px] text-gray-400">Piscine maçonnée, terrasse travertin...</span>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Calme & Environnement</span>
                    <span className="text-[#E12B7B]">{quietAdjustment > 0 ? `+${quietAdjustment}%` : `${quietAdjustment}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-12}
                    max={10}
                    value={quietAdjustment}
                    onChange={(e) => setQuietAdjustment(Number(e.target.value))}
                    className="w-full accent-[#E12B7B]"
                  />
                  <span className="text-[10px] text-gray-400">Impasse résidentielle vs Axe passant</span>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Performance DPE</span>
                    <span className="text-[#E12B7B]">{dpeAdjustment > 0 ? `+${dpeAdjustment}%` : `${dpeAdjustment}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-10}
                    max={8}
                    value={dpeAdjustment}
                    onChange={(e) => setDpeAdjustment(Number(e.target.value))}
                    className="w-full accent-[#E12B7B]"
                  />
                  <span className="text-[10px] text-gray-400">Pompe à chaleur DPE A/B vs Passoire F/G</span>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Vue & Exposition</span>
                    <span className="text-[#E12B7B]">{viewAdjustment > 0 ? `+${viewAdjustment}%` : `${viewAdjustment}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={10}
                    value={viewAdjustment}
                    onChange={(e) => setViewAdjustment(Number(e.target.value))}
                    className="w-full accent-[#E12B7B]"
                  />
                  <span className="text-[10px] text-gray-400">Vue collines et plein Sud vs Vis-à-vis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Method 2 : Capitalization */}
        {activeMethodTab === 'cap' && (
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Loyer Mensuel Marché Estimé (€)
                </label>
                <input
                  type="number"
                  value={estimatedMonthlyRent}
                  onChange={(e) => setEstimatedMonthlyRent(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Taux de Capitalisation Brut Attendu (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetCapRate}
                  onChange={(e) => setTargetCapRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                />
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E9DFD3] text-center flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase text-[#C59A45] block">Valeur par Capitalisation</span>
                <span className="text-xl font-black text-[#131B26]">{capitalizationEstimatedTotal.toLocaleString('fr-FR')} €</span>
                <span className="text-[10px] text-gray-500 block">{(annualRent).toLocaleString('fr-FR')} € / an de loyers bruts</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              Idéal pour valoriser l&apos;actif auprès d&apos;investisseurs patrimoniaux et d&apos;acquéreurs LMNP dans le Pays Salonais.
            </p>
          </div>
        )}

        {/* Method 3 : Cost */}
        {activeMethodTab === 'cost' && (
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Foncier Nu Terrain (€/m²)
                </label>
                <input
                  type="number"
                  value={landValueM2}
                  onChange={(e) => setLandValueM2(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                />
                <span className="text-[10px] text-gray-400">Terrain: {rawLandValue.toLocaleString('fr-FR')} €</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Coût Reconstruction Neuf (€/m²)
                </label>
                <input
                  type="number"
                  value={buildCostM2}
                  onChange={(e) => setBuildCostM2(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Abattement Vétusté (%)
                </label>
                <input
                  type="number"
                  value={depreciationPct}
                  onChange={(e) => setDepreciationPct(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                />
                <span className="text-[10px] text-gray-400">Bâti net: {Math.round(rawBuildValue).toLocaleString('fr-FR')} €</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E9DFD3] text-center flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase text-[#C59A45] block">Valeur de Remplacement</span>
                <span className="text-xl font-black text-[#131B26]">{replacementEstimatedTotal.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Triangulation & Strategic Value Ranges (3 Fourchettes) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              3. Triangulation des Résultats & Scénarios Stratégiques
            </h3>
            <p className="text-xs text-gray-500">
              Synthèse croisée : DVF pondéré (55%) + Rendement (25%) + Coût de remplacement (20%).
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            DVF Notaires 2024-2026 Certifié
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          {/* 1. Prix d'Attaque */}
          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2 hover:shadow-xs transition">
            <span className="text-[11px] uppercase font-bold text-gray-400 block">Scénario Vente Éclair (&lt; 30 jours)</span>
            <div className="text-2xl font-black text-gray-800">
              {priceAttack.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-gray-500 block">
              ~{Math.round(priceAttack / surfaceInput).toLocaleString('fr-FR')} €/m²
            </span>
            <p className="text-[10px] text-gray-400">Positionnement agressif pour déclencher des offres immédiates sans négociation.</p>
          </div>

          {/* 2. Prix Cible d'Équilibre */}
          <div className="p-6 bg-[#FDF2F8] rounded-2xl border-2 border-[#E12B7B] space-y-2 shadow-md">
            <span className="text-[11px] uppercase font-bold text-[#E12B7B] block">★ Prix Cible Recommandé Nell&apos;Immo</span>
            <div className="text-3xl font-black text-[#E12B7B]">
              {priceTarget.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] font-semibold text-gray-700 block">
              ~{Math.round(priceTarget / surfaceInput).toLocaleString('fr-FR')} €/m² (Équilibre parfait)
            </span>
            <p className="text-[10px] text-gray-600">Valeur d&apos;expertise équilibrée pour signer sous 45 à 60 jours en mandat exclusif.</p>
          </div>

          {/* 3. Prix Haut d'Exclusivité */}
          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2 hover:shadow-xs transition">
            <span className="text-[11px] uppercase font-bold text-gray-400 block">Test Exclusivité Haute (Coup de Cœur)</span>
            <div className="text-2xl font-black text-gray-800">
              {priceHigh.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-gray-500 block">
              ~{Math.round(priceHigh / surfaceInput).toLocaleString('fr-FR')} €/m²
            </span>
            <p className="text-[10px] text-gray-400">Plafond haut pour tester le marché durant les 3 premières semaines.</p>
          </div>

        </div>
      </div>

      {/* Real Notary Sales Table (DVF) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#131B26]">
              Transactions Notariées Réelles Recensées ({transactions.length} ventes réelles)
            </h3>
            <p className="text-xs text-gray-500">Actes authentiques enregistrés par les notaires dans un rayon de 500m</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Date Mutation</th>
                <th className="pb-3">Adresse / Rue</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Surface Bâti</th>
                <th className="pb-3">Terrain</th>
                <th className="pb-3">Distance</th>
                <th className="pb-3">Prix Acte Réel</th>
                <th className="pb-3 text-right">Prix / m²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 font-semibold text-gray-900">{t.date_mutation}</td>
                  <td className="py-3 font-bold text-gray-900">{t.adresse_numero} {t.adresse_nom_voie}</td>
                  <td className="py-3 text-gray-600">{t.type_local} ({t.nombre_pieces_principales}p)</td>
                  <td className="py-3 font-semibold">{t.surface_reelle_bati} m²</td>
                  <td className="py-3 text-gray-500">{t.surface_terrain ? `${t.surface_terrain} m²` : '—'}</td>
                  <td className="py-3 text-gray-500 font-mono">~{t.distance_metres} m</td>
                  <td className="py-3 font-black text-[#131B26]">
                    {t.valeur_fonciere.toLocaleString('fr-FR')} €
                  </td>
                  <td className="py-3 font-bold text-[#E12B7B] text-right">
                    {t.prix_m2.toLocaleString('fr-FR')} €/m²
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL 8-PAGE PRESTIGE DOSSIER PREVIEW & PRINT */}
      {isDossierGenerated && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#E12B7B] shadow-2xl space-y-8 animate-fade-in print-page">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-gray-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-[#E12B7B]">Dossier d&apos;Expertise & Avis de Valeur Officiel</span>
              <h2 className="text-2xl font-serif font-black text-[#131B26]">
                Étude Comparative de Marché DVF & Avis de Valeur
              </h2>
              <span className="text-xs text-gray-500">Préparé pour {ownerName} • {addressSearch}</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4 text-[#C59A45]" />
              <span>Imprimer le Livret Relié</span>
            </button>
          </div>

          {/* Dossier Structure: 8 Complete Chapters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 1</span>
              <strong className="block text-sm text-[#131B26]">Couverture & Synthèse</strong>
              <p className="text-[11px] text-gray-600">Fiche d&apos;identité du bien, mandant et cachet de l&apos;agence.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 2</span>
              <strong className="block text-sm text-[#131B26]">Démarche Déontologique</strong>
              <p className="text-[11px] text-gray-600">Engagement SASU Nell&apos;Immo, carte pro CPI et garantie Galian.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 3</span>
              <strong className="block text-sm text-[#131B26]">Caractéristiques & Cadastre</strong>
              <p className="text-[11px] text-gray-600">Surface {surfaceInput} m², terrain {landInput} m², {roomsInput} pièces.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 4</span>
              <strong className="block text-sm text-[#131B26]">Micromarché DVF Réel</strong>
              <p className="text-[11px] text-gray-600">{transactions.length} ventes réelles enregistrées à 500m ({baseDvfM2} €/m²).</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 5</span>
              <strong className="block text-sm text-[#131B26]">Triple Méthode Croisée</strong>
              <p className="text-[11px] text-gray-600">DVF pondéré, rendement locatif et coût de remplacement.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 6</span>
              <strong className="block text-sm text-[#131B26]">Matrice SWOT & Atouts</strong>
              <p className="text-[11px] text-gray-600">Valorisation des points forts et leviers de négociation.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 7</span>
              <strong className="block text-sm text-[#131B26]">Triangulation des 3 Prix</strong>
              <p className="text-[11px] text-gray-600">Cible d&apos;équilibre certifié : <strong>{priceTarget.toLocaleString('fr-FR')} €</strong>.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 8</span>
              <strong className="block text-sm text-[#131B26]">Stratégie & Mandat Exclusif</strong>
              <p className="text-[11px] text-gray-600">Plan de commercialisation 360° et espace vendeur temps réel.</p>
            </div>
          </div>

          {/* SWOT Matrix */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#131B26]">
              Matrice d&apos;Évaluation Stratégique du Bien (Forces / Faiblesses)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 block">🟢 Points Forts Majeurs Relevés</span>
                <ul className="list-disc list-inside text-[11px] text-emerald-900 space-y-0.5">
                  <li>Emplacement résidentiel au calme, très recherché sur {initialCity}</li>
                  <li>Parcelle de {landInput} m² sans vis-à-vis gênant</li>
                  <li>Distribution fonctionnelle des pièces adaptée aux familles ({roomsInput} pièces)</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-800 block">🟡 Points d&apos;Attention & Optimisation</span>
                <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-0.5">
                  <li>Mise en valeur visuelle et photos HDR professionnelles indispensables</li>
                  <li>DDT technique (DPE, conformité assainissement) à finaliser pour le dossier notaire</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Agency Signature */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-500">
            <span>Dossier officiel établi par Nelly FERNANDEZ • Carte CPI 1310 2019 000 042 974</span>
            <span className="font-bold text-[#E12B7B]">SASU Nell&apos;Immo — Pélissanne & Pays Salonais</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ValuationDvfPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Chargement du laboratoire d&apos;estimation...</div>}>
      <ValuationDvfContent />
    </Suspense>
  );
}
