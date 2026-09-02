'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_DVF_TRANSACTIONS } from '@/lib/mock-data';
import { DVFTransaction } from '@/lib/types';
import {
  TrendingUp,
  Search,
  Printer,
  Sparkles
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

  // Statistics calculation
  const averagePriceM2 = Math.round(
    transactions.reduce((sum, t) => sum + t.prix_m2, 0) / transactions.length
  );
  const estimatedTargetPrice = Math.round(surfaceInput * averagePriceM2);
  const priceAttack = Math.round(estimatedTargetPrice * 0.95);
  const priceHigh = Math.round(estimatedTargetPrice * 1.06);

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
            <span>Estimation & Données Notaires</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Avis de Valeur & Estimation
          </h1>
          <p className="text-xs text-gray-500">
            Analysez le marché et générez des dossiers d&apos;estimation complets.
          </p>
        </div>

        <button
          onClick={() => setIsDossierGenerated(true)}
          className="px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FBF6E9]" />
          Générer le Dossier
        </button>
      </div>

      {/* Search & Audit Parameters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
          <Search className="w-5 h-5 text-[#E12B7B]" />
          Informations du Bien
        </h3>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse ou Section Cadastrale</label>
            <input
              type="text"
              required
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom du Mandant / Vendeur</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type de bien</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            >
              <option value="Maison">Maison / Villa</option>
              <option value="Appartement">Appartement</option>
              <option value="Terrain">Terrain</option>
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
              className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Actualiser DVF
            </button>
          </div>
        </form>
      </div>

      {/* Strategic Value Ranges (3 Fourchettes) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Fourchettes de Valeur Stratégique DVF
            </h3>
            <p className="text-xs text-gray-500">
              Prix moyen constaté dans le micromarché de Pélissanne : <strong className="text-[#E12B7B]">{averagePriceM2.toLocaleString('fr-FR')} €/m²</strong>
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            DVF Notaires 2024-2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          {/* 1. Prix d'Attaque */}
          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
            <span className="text-[11px] uppercase font-bold text-gray-400 block">Prix d&apos;Attaque (Vente sous 30j)</span>
            <div className="text-2xl font-black text-gray-800">
              {priceAttack.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-gray-500 block">
              ~{Math.round(priceAttack / surfaceInput).toLocaleString('fr-FR')} €/m²
            </span>
          </div>

          {/* 2. Prix Cible d'Équilibre */}
          <div className="p-6 bg-[#FDF2F8] rounded-2xl border-2 border-[#E12B7B] space-y-2 shadow-md">
            <span className="text-[11px] uppercase font-bold text-[#E12B7B] block">★ Prix Cible Recommandé</span>
            <div className="text-3xl font-black text-[#E12B7B]">
              {estimatedTargetPrice.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] font-semibold text-gray-700 block">
              ~{averagePriceM2.toLocaleString('fr-FR')} €/m² (Moyenne réelle notariée)
            </span>
          </div>

          {/* 3. Prix Haut d'Exclusivité */}
          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
            <span className="text-[11px] uppercase font-bold text-gray-400 block">Prix Haut Exclusivité (Coup de cœur)</span>
            <div className="text-2xl font-black text-gray-800">
              {priceHigh.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-gray-500 block">
              ~{Math.round(priceHigh / surfaceInput).toLocaleString('fr-FR')} €/m²
            </span>
          </div>

        </div>
      </div>

      {/* Real Notary Sales Table (DVF) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Ventes Notariées Réelles Recensées ({transactions.length} transactions)
            </h3>
            <p className="text-xs text-gray-500">Actes authentiques enregistrés par les notaires (sans mobilier ni frais d&apos;agence)</p>
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
                <th className="pb-3">Prix Vente Réel</th>
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

      {/* 8-PAGE PRESTIGE DOSSIER PREVIEW & PRINT */}
      {isDossierGenerated && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#E12B7B] shadow-2xl space-y-8 animate-fade-in print-page">
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-[#E12B7B]">Dossier d&apos;Expertise & Avis de Valeur</span>
              <h2 className="text-2xl font-serif font-black text-[#131B26]">
                Étude Comparative de Marché DVF (8 Pages)
              </h2>
              <span className="text-xs text-gray-500">Préparé pour {ownerName} • {addressSearch}</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition"
            >
              <Printer className="w-4 h-4 text-[#C59A45]" />
              Imprimer le Livret Relié
            </button>
          </div>

          {/* Dossier Structure Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block">Page 1 & 2</span>
              <strong>Couverture & Présentation</strong>
              <p className="text-[11px] text-gray-500">Identité visuelle Nellimo, ancrage local et méthodologie DVF certifiée.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block">Page 3 & 4</span>
              <strong>Fiche Technique & Micromarché</strong>
              <p className="text-[11px] text-gray-500">Cartographie OpenStreetMap des ventes notariées du quartier dans les 500m.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block">Page 5 & 6</span>
              <strong>Fourchettes de Valeur</strong>
              <p className="text-[11px] text-gray-500">Prix cible d&apos;équilibre ({estimatedTargetPrice.toLocaleString('fr-FR')} €) et stratégie d&apos;exclusivité.</p>
            </div>
            <div className="p-4 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-1">
              <span className="font-bold text-[#E12B7B] block">Page 7 & 8</span>
              <strong>Plan de Diffusion & Mandat</strong>
              <p className="text-[11px] text-gray-500">Diffusion directe SeLoger/LeBonCoin/Bien&apos;ici et barème d&apos;honoraires.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ValuationDvfPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Chargement des données DVF...</div>}>
      <ValuationDvfContent />
    </Suspense>
  );
}
