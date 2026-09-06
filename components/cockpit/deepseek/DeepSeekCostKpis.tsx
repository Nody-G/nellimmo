'use client';

import React from 'react';
import { Euro, TrendingDown, Zap, Clock } from 'lucide-react';
import { TelemetrySummary, BudgetConfig } from '@/lib/deepseek/telemetry';
import { isPeakHour } from '@/lib/deepseek/pricing';

interface DeepSeekCostKpisProps {
  summary: TelemetrySummary;
  budget: BudgetConfig;
  onOpenBudgetModal: () => void;
}

export function DeepSeekCostKpis({ summary, budget, onOpenBudgetModal }: DeepSeekCostKpisProps) {
  const isCurrentlyPeak = isPeakHour();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 : Coût réel dépensé */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Coût Réel Consommé
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Euro className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">
            {summary.totalCostEur.toFixed(4)} €
          </span>
          <span className="text-xs text-gray-400">
            (${summary.totalCostUsd.toFixed(4)})
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-gray-500">{summary.totalCalls} requêtes effectuées</span>
          <button
            onClick={onOpenBudgetModal}
            className="text-[#E12B7B] font-semibold hover:underline"
          >
            Ajuster budget
          </button>
        </div>
      </div>

      {/* KPI 2 : Économie vs OpenAI GPT-4o */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Économie vs GPT-4o
          </span>
          <div className="p-1.5 rounded-lg bg-pink-50 text-[#E12B7B]">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-emerald-600">
            +{summary.totalSavingsVsGpt4oEur.toFixed(3)} €
          </span>
          <span className="text-[11px] font-bold text-emerald-600">économisés</span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500">
          DeepSeek V4 Flash est ~18x plus abordable qu’OpenAI
        </p>
      </div>

      {/* KPI 3 : Économie Prompt Caching */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Gain Prompt Caching
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-600">
            {summary.cacheHitRate.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">
            (+{summary.totalCacheSavingsEur.toFixed(3)} €)
          </span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500">
          Remise de 90% à 98% appliquée sur les contextes répétés
        </p>
      </div>

      {/* KPI 4 : Statut Heures Creuses / Budget */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Tarif & Budget
            </span>
            <div className={`p-1.5 rounded-lg ${isCurrentlyPeak ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${isCurrentlyPeak ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {isCurrentlyPeak ? 'Heures Pleines' : 'Heures Creuses (-50%)'}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-medium mb-1">
            <span className="text-gray-500">
              Budget : {summary.totalCostEur.toFixed(2)} / {budget.monthlyLimitEur.toFixed(2)} €
            </span>
            <span className={summary.isBudgetNearLimit ? 'text-red-600 font-bold' : 'text-gray-600'}>
              {summary.budgetUsedPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                summary.isBudgetExceeded
                  ? 'bg-red-500'
                  : summary.isBudgetNearLimit
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, summary.budgetUsedPercent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
