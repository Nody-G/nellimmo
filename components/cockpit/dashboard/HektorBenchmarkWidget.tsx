'use client';

import React, { useState } from 'react';
import {
  Zap,
  PiggyBank,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Lock
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const HektorBenchmarkWidget: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Breakdown of annual savings vs Hektor ecosystem
  const monthlyHektorCrm = 210; // Licence CRM Hektor de base
  const monthlyUbiflow = 99; // Passerelle portails Ubiflow (SeLoger, LBC, Bien'Ici)
  const monthlySignatures = 25; // ImmoSign / Yousign packs
  const monthlyPige = 80; // Option pige PAP / LBC
  const totalMonthlyCostHektor = monthlyHektorCrm + monthlyUbiflow + monthlySignatures + monthlyPige;
  const totalAnnualSavings = totalMonthlyCostHektor * 12; // 4 968 € / an

  return (
    <Card className="p-6 bg-gradient-to-br from-[#131B26] via-[#1A2332] to-[#131B26] text-white border-gray-800 shadow-xl relative overflow-hidden space-y-5">
      {/* Background ambient decoration */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#E12B7B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#C59A45]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C59A45]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Indépendance Technologique & Souveraineté</span>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-0.5">
            Audit Comparatif : Cockpit Nell&apos;Immo vs Hektor (La Boîte Immo)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Statut : 100% Autonome (0 €/mois)
          </span>

          <a
            href="/simulateur-economies-hektor.html"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition border border-white/10 cursor-pointer"
          >
            <span>Simulateur</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {/* Pillar 1 : Économies Réelles */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Économie Annuelle Nette
            </span>
            <PiggyBank className="w-4 h-4 text-[#C59A45]" />
          </div>
          <div className="text-2xl font-serif font-black text-[#C59A45]">
            +{totalAnnualSavings.toLocaleString('fr-FR')} € / an
          </div>
          <p className="text-[11px] text-gray-300">
            Élimination intégrale des abonnements Hektor, Ubiflow & ImmoSign.
          </p>
        </div>

        {/* Pillar 2 : Vitesse & Réactivité */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Vitesse de Navigation
            </span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-serif font-black text-emerald-400">
            &lt; 0.08 s
          </div>
          <p className="text-[11px] text-gray-300">
            vs 2.40s sur Hektor. Zéro temps de latence, zéro formulaire à tiroir.
          </p>
        </div>

        {/* Pillar 3 : Intelligence Artificielle */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Assistance IA Native
            </span>
            <Sparkles className="w-4 h-4 text-[#E12B7B]" />
          </div>
          <div className="text-2xl font-serif font-black text-[#E12B7B]">
            DeepSeek / Nell&apos;IA
          </div>
          <p className="text-[11px] text-gray-300">
            Dictaphone vocal, collage express de mandats & rédaction Nelly.
          </p>
        </div>

        {/* Pillar 4 : Sécurité Juridique */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Conformité Loi Hoguet
            </span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-serif font-black text-blue-400">
            SHA-256 Inviolable
          </div>
          <p className="text-[11px] text-gray-300">
            Registre scellé cryptographiquement + DVF Notaires temps réel.
          </p>
        </div>
      </div>

      {/* Accordion / Details Toggle */}
      <div className="relative z-10 pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="text-gray-400 hover:text-white font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <span>{isDetailsOpen ? 'Masquer la décomposition des coûts' : 'Voir la décomposition détaillée des économies'}</span>
          <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${isDetailsOpen ? 'rotate-90' : ''}`} />
        </button>

        <span className="text-[11px] text-gray-400 font-mono">
          Données 100% souveraines • SASU Nell&apos;Immo
        </span>
      </div>

      {/* Expanded Breakdown Table */}
      {isDetailsOpen && (
        <div className="pt-2 relative z-10 animate-fade-in">
          <div className="bg-black/40 rounded-2xl p-4 border border-gray-800 text-xs space-y-2 font-mono">
            <div className="flex justify-between text-gray-300 border-b border-gray-800 pb-1.5 font-bold">
              <span>Poste de coût Hektor (Fournisseurs Tiers)</span>
              <span>Coût Mensuel</span>
              <span>Cockpit Nell&apos;Immo</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Licence Logicielle Hektor (La Boîte Immo)</span>
              <span className="text-rose-400 font-bold">210,00 € / mois</span>
              <span className="text-emerald-400 font-bold">0,00 € (Inclus)</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Passerelle Multidiffusion Ubiflow (SeLoger / LBC / Bien&apos;Ici)</span>
              <span className="text-rose-400 font-bold">99,00 € / mois</span>
              <span className="text-emerald-400 font-bold">0,00 € (Poliris Natif)</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Signature Électronique Certifiée (ImmoSign / Yousign)</span>
              <span className="text-rose-400 font-bold">25,00 € / mois</span>
              <span className="text-emerald-400 font-bold">0,00 € (eIDAS Intégré)</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Module Pige PAP & LeBonCoin</span>
              <span className="text-rose-400 font-bold">80,00 € / mois</span>
              <span className="text-emerald-400 font-bold">0,00 € (Inclus)</span>
            </div>
            <div className="flex justify-between text-white border-t border-gray-700 pt-2 font-black text-sm">
              <span className="text-[#C59A45]">TOTAL ÉCONOMISÉ PAR L&apos;AGENCE :</span>
              <span className="text-rose-400 line-through">414,00 € / mois</span>
              <span className="text-[#C59A45]">+{totalAnnualSavings.toLocaleString('fr-FR')} € / AN NET</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
