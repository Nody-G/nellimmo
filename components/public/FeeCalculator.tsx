'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';

export function FeeCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(420000);

  // Traditional agency average: 5.5% TTC
  const traditionalRate = 0.055;
  const traditionalFees = Math.round(propertyPrice * traditionalRate);

  // Nell'Immo scale: ~3.5% TTC (minimum 6 500 €)
  const nellimmoRate = 0.035;
  const calculatedNellimmoFees = Math.round(propertyPrice * nellimmoRate);
  const nellimmoFees = Math.max(6500, calculatedNellimmoFees);

  const netSavings = Math.max(0, traditionalFees - nellimmoFees);
  const netVendorGain = propertyPrice - nellimmoFees;

  return (
    <div className="bg-gradient-to-br from-white via-[#FCFAF7] to-pink-50/40 rounded-3xl p-8 sm:p-12 border border-[#F3E8EE] shadow-xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>Simulateur d’honoraires & transparence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
          Combien économisez-vous avec Nell’Immo ?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Découvrez la différence d’honoraires entre notre barème optimisé à 3,5 % et les commissions traditionnelles de 5 à 6 % sur le Pays Salonais.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-2xl border border-[#F3E8EE] shadow-xs">
        <div className="flex justify-between items-center">
          <label htmlFor="price-slider" className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Estimation du bien à vendre
          </label>
          <div className="text-xl sm:text-2xl font-black text-[#131B26] font-mono">
            {propertyPrice.toLocaleString('fr-FR')} €
          </div>
        </div>

        <input
          id="price-slider"
          type="range"
          min={100000}
          max={1500000}
          step={10000}
          value={propertyPrice}
          onChange={(e) => setPropertyPrice(Number(e.target.value))}
          className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E12B7B]"
        />

        <div className="flex justify-between text-[11px] text-gray-600 font-mono">
          <span>100 000 €</span>
          <span>500 000 €</span>
          <span>1 000 000 €</span>
          <span>1 500 000 €</span>
        </div>

        {/* Quick select chips */}
        <div className="flex flex-wrap gap-2 pt-2 justify-center">
          {[250000, 380000, 480000, 650000, 850000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPropertyPrice(preset)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                propertyPrice === preset
                  ? 'bg-[#131B26] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {preset.toLocaleString('fr-FR')} €
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Traditional Agency */}
        <div className="p-6 bg-white/80 rounded-2xl border border-gray-200 space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-gray-600">Agence Traditionnelle</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-semibold">
              Moy. 5,5 %
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-gray-500 font-mono">
              {traditionalFees.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-gray-600 block">Honoraires prélevés sur la vente</span>
          </div>
          <p className="text-xs text-gray-600 pt-2 border-t border-gray-100">
            Frais de structure élevés souvent répercutés directement sur votre net vendeur.
          </p>
        </div>

        {/* Nell'Immo Card */}
        <div className="p-6 bg-[#131B26] text-white rounded-2xl border-2 border-[#E12B7B] shadow-xl space-y-4 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="bg-[#E12B7B] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Barème Nell’Immo ~3,5 %
            </span>
          </div>
          <div className="space-y-1 pt-1">
            <span className="text-xs uppercase font-bold text-gray-300">Honoraires Nell’Immo</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {nellimmoFees.toLocaleString('fr-FR')} €
            </div>
            <span className="text-[11px] text-gray-300 block">TTC • Sans aucun frais caché</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between border border-white/10">
            <span className="text-xs text-gray-200 font-semibold flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              Votre économie nette :
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
              + {netSavings.toLocaleString('fr-FR')} €
            </span>
          </div>
        </div>
      </div>

      {/* Net Vendor Benefit Summary */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-900">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-xs leading-relaxed text-center sm:text-left">
            <strong className="block font-bold">Net vendeur estimé avec Nell’Immo : {netVendorGain.toLocaleString('fr-FR')} €</strong>
            Accompagnement 100 % complet inclus (DVF, reportage photo, visites qualifiées, espace vendeur).
          </div>
        </div>

        <Link
          href="/estimation"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition shrink-0"
        >
          <span>Estimer mon bien</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
