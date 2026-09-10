'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Settings2, Sparkles, RefreshCw } from 'lucide-react';
import {
  getStoredCallLogs,
  getBudgetConfig,
  saveBudgetConfig,
  clearCallLogs,
  saveCallLog,
  computeTelemetrySummary,
  DeepSeekCallLog,
  BudgetConfig,
} from '@/lib/deepseek/telemetry';
import { DeepSeekCostKpis } from './DeepSeekCostKpis';
import { DeepSeekTokenBreakdown } from './DeepSeekTokenBreakdown';
import { DeepSeekUsageByFeatureCard } from './DeepSeekUsageByFeatureCard';
import { DeepSeekLogsTable } from './DeepSeekLogsTable';
import { DeepSeekBudgetSettingsModal } from './DeepSeekBudgetSettingsModal';
import { DeepSeekLiveDiagnosticModal } from './DeepSeekLiveDiagnosticModal';

export function DeepSeekTelemetryDashboard() {
  const [logs, setLogs] = useState<DeepSeekCallLog[]>(() => getStoredCallLogs());
  const [budget, setBudget] = useState<BudgetConfig>(() => getBudgetConfig());
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  const refreshData = useCallback(() => {
    setLogs(getStoredCallLogs());
    setBudget(getBudgetConfig());
  }, []);

  useEffect(() => {
    const handleStorage = () => refreshData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshData]);

  const summary = computeTelemetrySummary(logs, budget);

  const handleClearLogs = () => {
    if (window.confirm('Voulez-vous réinitialiser l’historique des appels DeepSeek ?')) {
      clearCallLogs();
      refreshData();
    }
  };

  const handleLogGenerated = (newLog: DeepSeekCallLog) => {
    saveCallLog(newLog);
    refreshData();
  };

  const handleSaveBudget = (updated: Partial<BudgetConfig>) => {
    const saved = saveBudgetConfig(updated);
    setBudget(saved);
  };

  return (
    <div className="space-y-6">
      {/* En-tête du Panneau */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-[#E12B7B]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">
              Centre de Télémétrie & Consommation DeepSeek
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Modèles <code className="font-mono text-gray-800">deepseek-chat</code> & <code className="font-mono text-gray-800">deepseek-reasoner</code> • Estimation locale des coûts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            title="Rafraîchir les métriques"
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDiagnosticModalOpen(true)}
            className="px-3 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 flex items-center gap-1.5 text-xs transition border border-emerald-200"
          >
            <Activity className="w-4 h-4" />
            Ping Test Direct
          </button>
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 flex items-center gap-1.5 text-xs transition"
          >
            <Settings2 className="w-4 h-4" />
            Régler Budget
          </button>
        </div>
      </div>

      {/* Cartes KPI Coûts et Économies */}
      <DeepSeekCostKpis
        summary={summary}
        budget={budget}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
      />

      {/* Décomposition Tokens & Répartition Fonctionnalités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeepSeekTokenBreakdown summary={summary} />
        </div>
        <div>
          <DeepSeekUsageByFeatureCard summary={summary} />
        </div>
      </div>

      {/* Tableau détaillé des logs */}
      <DeepSeekLogsTable logs={logs} onClearLogs={handleClearLogs} />

      {/* Modales de réglage et de diagnostic */}
      <DeepSeekBudgetSettingsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        config={budget}
        onSave={handleSaveBudget}
      />

      <DeepSeekLiveDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onLogGenerated={handleLogGenerated}
      />
    </div>
  );
}
