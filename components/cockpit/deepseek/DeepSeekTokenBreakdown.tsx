'use client';

import React from 'react';
import { Layers, Database, Sparkles, BrainCircuit } from 'lucide-react';
import { TelemetrySummary } from '@/lib/deepseek/telemetry';

interface DeepSeekTokenBreakdownProps {
  summary: TelemetrySummary;
}

export function DeepSeekTokenBreakdown({ summary }: DeepSeekTokenBreakdownProps) {
  const total = Math.max(1, summary.totalTokens);
  const cacheHitPct = ((summary.cacheHitTokens / total) * 100).toFixed(1);
  const cacheMissPct = ((summary.cacheMissTokens / total) * 100).toFixed(1);
  const completionPct = ((summary.completionTokens / total) * 100).toFixed(1);
  const reasoningPct = ((summary.reasoningTokens / total) * 100).toFixed(1);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E12B7B]" />
            Décomposition des Tokens Consommés
          </h3>
          <p className="text-xs text-gray-500">
            Total cumulé : {summary.totalTokens.toLocaleString('fr-FR')} tokens (Fenêtre 1M active)
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-pink-50 text-[#E12B7B] font-bold">
          Architecture DeepSeek
        </span>
      </div>

      {/* Barre segmentée visuelle */}
      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex">
        <div
          title={`Cache Hit : ${cacheHitPct}%`}
          style={{ width: `${cacheHitPct}%` }}
          className="bg-emerald-500 h-full transition-all"
        />
        <div
          title={`Cache Miss : ${cacheMissPct}%`}
          style={{ width: `${cacheMissPct}%` }}
          className="bg-blue-400 h-full transition-all"
        />
        <div
          title={`Sortie (Completion) : ${completionPct}%`}
          style={{ width: `${completionPct}%` }}
          className="bg-[#E12B7B] h-full transition-all"
        />
        <div
          title={`Raisonnement : ${reasoningPct}%`}
          style={{ width: `${reasoningPct}%` }}
          className="bg-purple-500 h-full transition-all"
        />
      </div>

      {/* Détails 4 colonnes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Cache Hit (Entrée)
          </div>
          <div className="text-base font-bold text-gray-900">
            {summary.cacheHitTokens.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">
            {cacheHitPct}% • Tarif ultra-réduit
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
          <div className="flex items-center gap-1.5 text-xs text-blue-800 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Cache Miss (Entrée)
          </div>
          <div className="text-base font-bold text-gray-900">
            {summary.cacheMissTokens.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-blue-700 font-medium">
            {cacheMissPct}% • Nouveaux prompts
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-pink-50/50 border border-pink-100">
          <div className="flex items-center gap-1.5 text-xs text-pink-800 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
            Génération (Sortie)
          </div>
          <div className="text-base font-bold text-gray-900">
            {summary.completionTokens.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-pink-700 font-medium">
            {completionPct}% • Réponses générées
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100">
          <div className="flex items-center gap-1.5 text-xs text-purple-800 font-semibold mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            Mode Thinking
          </div>
          <div className="text-base font-bold text-gray-900">
            {summary.reasoningTokens.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-purple-700 font-medium">
            {reasoningPct}% • Raisonnement logique
          </div>
        </div>
      </div>
    </div>
  );
}
