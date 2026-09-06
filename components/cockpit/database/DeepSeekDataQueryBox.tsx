'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Filter, X } from 'lucide-react';
import { DeepSeekCallLog } from '@/lib/deepseek/telemetry';

export interface QueryPlanResult {
  targetCollection: string;
  filters: Array<{ field: string; operator: string; value: unknown }>;
  summary: string;
  suggestedKeywords?: string;
}

interface DeepSeekDataQueryBoxProps {
  onApplyPlan: (plan: QueryPlanResult, log?: DeepSeekCallLog) => void;
  onResetPlan: () => void;
  activePlanSummary?: string | null;
}

const PRESET_QUERIES = [
  'Mandats exclusifs à Pélissanne avec DPE C ou mieux',
  'Acquéreurs financement comptant sans visite',
  'Pige avec écart DVF négatif sous le prix du marché',
  'Dossiers compromis notaires en attente de prêt',
];

export function DeepSeekDataQueryBox({
  onApplyPlan,
  onResetPlan,
  activePlanSummary,
}: DeepSeekDataQueryBoxProps) {
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (textToSearch?: string) => {
    const query = (textToSearch || queryText).trim();
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch('/api/deepseek/query-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.success && data.queryPlan) {
        onApplyPlan(data.queryPlan, data.log);
      } else {
        alert(data.message || 'Impossible d’interpréter cette requête.');
      }
    } catch {
      alert('Erreur réseau lors de l’interrogation DeepSeek.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#131B26] p-4 rounded-2xl text-white shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-300">
          <Sparkles className="w-4 h-4 text-[#E12B7B]" />
          Interrogation Intelligente en Langage Naturel (DeepSeek V4 Flash)
        </div>
        {activePlanSummary && (
          <button
            onClick={onResetPlan}
            className="text-[11px] text-gray-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg"
          >
            <X className="w-3 h-3" />
            Réinitialiser le filtre
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ex : Montre-moi les acquéreurs avec budget > 400k€ cherchant à Pélissanne ou Salon..."
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading || !queryText.trim()}
          className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#c22066] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Recherche V4...
            </>
          ) : (
            <>
              Interroger
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {activePlanSummary ? (
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-xs text-emerald-200 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Filtre IA actif :</strong> {activePlanSummary}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-gray-300 pt-0.5">
          <span className="text-gray-400 shrink-0">Suggestions :</span>
          {PRESET_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQueryText(q);
                handleSearch(q);
              }}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 transition shrink-0 truncate max-w-[280px]"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
