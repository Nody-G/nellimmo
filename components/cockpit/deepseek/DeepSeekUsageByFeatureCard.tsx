'use client';

import React from 'react';
import { Sparkles, MessageSquare, Database, UserCheck, ShieldCheck, HelpCircle } from 'lucide-react';
import { TelemetrySummary, DeepSeekFeature } from '@/lib/deepseek/telemetry';

interface DeepSeekUsageByFeatureCardProps {
  summary: TelemetrySummary;
}

const FEATURE_META: Record<DeepSeekFeature, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  redacteur: { label: 'Studio Rédaction & Annonces', icon: Sparkles },
  copilot: { label: 'Copilote Métier & Relances', icon: MessageSquare },
  database_query: { label: 'Requêtes Base de Données', icon: Database },
  assistant: { label: 'Assistant Conversationnel Leads', icon: UserCheck },
  pige_sparring: { label: 'Stratégie Pige & Objections', icon: ShieldCheck },
  diagnostic: { label: 'Tests de Connectivité & Diagnostics', icon: HelpCircle },
};

export function DeepSeekUsageByFeatureCard({ summary }: DeepSeekUsageByFeatureCardProps) {
  const features = Object.keys(FEATURE_META) as DeepSeekFeature[];

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">
          Répartition par Fonctionnalité Métier
        </h3>
        <span className="text-xs text-gray-400">
          Ventilation temps réel
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {features.map((feat) => {
          const meta = FEATURE_META[feat];
          const stats = summary.featureBreakdown[feat] || { count: 0, costEur: 0, tokens: 0 };
          const Icon = meta.icon;
          const costSharePct = summary.totalCostEur > 0
            ? ((stats.costEur / summary.totalCostEur) * 100).toFixed(0)
            : '0';

          return (
            <div key={feat} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 shrink-0">
                  <Icon className="w-4 h-4 text-[#E12B7B]" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {meta.label}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {stats.count} appel{stats.count > 1 ? 's' : ''} • {stats.tokens.toLocaleString('fr-FR')} tokens
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-gray-900">
                  {stats.costEur.toFixed(4)} €
                </div>
                <div className="text-[10px] text-gray-400">
                  {costSharePct}% du budget
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
