'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, X, Send, Copy, Check, Landmark, Coins } from 'lucide-react';
import { computeLoanSimulation } from '@/components/cockpit/acquereurs/acquereurs-types';

interface QuickFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
  initialPropertyTitle?: string;
}

export function QuickFinanceModal({
  isOpen,
  onClose,
  initialPrice = 450000,
  initialPropertyTitle,
}: QuickFinanceModalProps) {
  const [prevInitialPrice, setPrevInitialPrice] = useState(initialPrice);
  const [price, setPrice] = useState<number>(initialPrice);
  const [downPayment, setDownPayment] = useState<number>(Math.round(initialPrice * 0.15));
  const [durationYears, setDurationYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(3.4);
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (initialPrice !== prevInitialPrice) {
    setPrevInitialPrice(initialPrice);
    setPrice(initialPrice);
    setDownPayment(Math.round(initialPrice * 0.15));
  }

  const sim = useMemo(() => computeLoanSimulation({
    purchasePrice: price, downPayment, durationYears, interestRate, insuranceRate: 0.34,
  }), [price, downPayment, durationYears, interestRate]);

  if (!isOpen) return null;

  const cleanPhone = buyerPhone.replace(/[^0-9+]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;

  const summaryText = `🏦 Simulation Financement & Notaire — Nell'Immo\n${initialPropertyTitle ? `Projet : ${initialPropertyTitle}\n` : ''}• Prix FAI : ${price.toLocaleString('fr-FR')} € | Apport : ${downPayment.toLocaleString('fr-FR')} €\n• Frais de notaire estimés (~7.5%) : ${sim.notaryFees.toLocaleString('fr-FR')} €\n• Coût total : ${sim.totalCost.toLocaleString('fr-FR')} €\n• Crédit : ${sim.loanAmount.toLocaleString('fr-FR')} € sur ${durationYears} ans (${interestRate}%)\n👉 Mensualité globale : ${sim.totalMonthlyPayment.toLocaleString('fr-FR')} € / mois\n👉 Revenus nets foyer requis (35%) : ${sim.minRequiredHouseholdIncome.toLocaleString('fr-FR')} € / mois\nNelly Fernandez — Nell'Immo Pélissanne (04 90 55 55 55)`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(summaryText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">Calculette Express Financement & Notaire</h3>
              <p className="text-[11px] text-gray-500">{initialPropertyTitle || 'Réponse immédiate en visite'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulaire Express */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Prix FAI (€) :</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setPrice(val);
                setDownPayment(Math.round(val * 0.15));
              }}
              className="w-full p-2.5 font-bold rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Apport (€) :</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 font-bold rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Durée :</label>
            <select
              value={durationYears}
              onChange={(e) => setDurationYears(parseInt(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
            >
              {[15, 20, 25].map((y) => (<option key={y} value={y}>{y} ans ({y * 12} mois)</option>))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Taux nominal (%):</label>
            <input
              type="number" step="0.05" value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 font-bold rounded-xl border border-gray-200"
            />
          </div>
        </div>

        {/* Résultat Synthétique */}
        <div className="p-4 rounded-2xl bg-[#131B26] text-white space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-blue-400" />
              Frais de Notaire (~7.5%) :
            </span>
            <span className="font-serif font-bold text-sm text-blue-300">~{sim.notaryFees.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#C59A45]" />
              Mensualité Crédit globale :
            </span>
            <span className="font-serif font-bold text-base text-emerald-400">
              {sim.totalMonthlyPayment.toLocaleString('fr-FR')} € / mois
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
            <span>Revenus nets foyer requis (35% max) :</span>
            <span className="font-bold text-white">{sim.minRequiredHouseholdIncome.toLocaleString('fr-FR')} € / mois</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 block">Envoyer par WhatsApp à l&apos;acquéreur :</label>
          <input
            type="tel"
            placeholder="06 12 34 56 78 (Numéro de l'acquéreur)"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {formattedPhone ? (
            <a
              href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Send className="w-4 h-4" /> Envoyer par WhatsApp
            </a>
          ) : (
            <button
              type="button" onClick={handleCopy}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#131B26] hover:bg-gray-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Simulation Copiée !' : 'Copier la Simulation'}
            </button>
          )}
          <button type="button" onClick={onClose} className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
