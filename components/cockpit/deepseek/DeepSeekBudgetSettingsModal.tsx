'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';
import { BudgetConfig } from '@/lib/deepseek/telemetry';

interface DeepSeekBudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  onSave: (updated: Partial<BudgetConfig>) => void;
}

export function DeepSeekBudgetSettingsModal({
  isOpen,
  onClose,
  config,
  onSave,
}: DeepSeekBudgetSettingsModalProps) {
  const [monthlyLimit, setMonthlyLimit] = useState(config.monthlyLimitEur);
  const [alertThreshold, setAlertThreshold] = useState(config.alertThresholdPercent);
  const [economyMode, setEconomyMode] = useState(config.economyModeEnabled);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      monthlyLimitEur: Number(monthlyLimit) || 15,
      alertThresholdPercent: Number(alertThreshold) || 80,
      economyModeEnabled: economyMode,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-bold text-gray-900 text-sm">
              Paramètres du Budget DeepSeek V4
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Plafond Budgétaire Mensuel (€)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              step="1"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#E12B7B]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Recommandation : 15,00 € / mois couvre ~30 000 rédactions en DeepSeek V4 Flash.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Seuil d’Alerte Précoce ({alertThreshold}%)
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full accent-[#E12B7B]"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>50%</span>
              <span>80% (Défaut)</span>
              <span>95%</span>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={economyMode}
                onChange={(e) => setEconomyMode(e.target.checked)}
                className="mt-0.5 rounded text-[#E12B7B] focus:ring-[#E12B7B]"
              />
              <div>
                <span className="font-semibold text-gray-800">
                  Mode Économie Protecteur
                </span>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Bascule automatiquement sur le moteur local certifié si le plafond mensuel est atteint.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#E12B7B] text-white font-semibold rounded-lg hover:bg-[#c22066] flex items-center gap-1.5"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : null}
              {saved ? 'Enregistré' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
