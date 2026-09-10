'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { SectionCard } from './SectionCard';
import { isPeakHour } from '@/lib/deepseek/pricing';
import { AiKeyInputCard } from './ai/AiKeyInputCard';
import type { AgencySettings } from '@/lib/types';

interface AiSectionProps {
  formData: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
  onOpenTelemetry?: () => void;
}

/**
 * Section 4 : Centre Unique de Gestion de la Clé API DeepSeek V4.1 Flash
 * Répercute la clé automatiquement et instantanément sur l'ensemble de l'application.
 */
export function AiSection({ formData, onChange, onOpenTelemetry }: AiSectionProps) {
  const isPeak = isPeakHour();
  const [serverKeyStatus, setServerKeyStatus] = useState<{ hasKey: boolean; maskedKey: string } | null>(null);

  useEffect(() => {
    async function checkServerKey() {
      try {
        const res = await fetch('/api/settings/ai-key');
        if (res.ok) {
          const data = await res.json();
          setServerKeyStatus({ hasKey: data.hasKey, maskedKey: data.maskedKey });
        }
      } catch {
        // Ignore
      }
    }
    checkServerKey();
  }, []);

  const isConnected = Boolean(serverKeyStatus?.hasKey || formData.deepseek_api_key);

  return (
    <SectionCard
      icon={<Sparkles className="w-5 h-5 text-[#E12B7B]" />}
      title="4. Intelligence Artificielle & Moteur Officiel DeepSeek V4.1 Flash"
    >
      <div className="space-y-4">
        {/* Statut Global & Indicateur de Tarification */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <span>Modèle IA Actif : DeepSeek V4.1 Flash</span>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Clé Opérationnelle Partout</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                    <span>Mode Local Hors-Ligne</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                1 seul endroit pour renseigner votre clé : elle pilote le Rédacteur, le Copilote, le Concierge Nell’IA et les Débriefings.
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-center ${isPeak ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
            {isPeak ? 'Heures Pleines' : 'Heures Creuses (-50%)'}
          </span>
        </div>

        {/* Composant de Saisie & Test de la Clé API */}
        <AiKeyInputCard
          formData={formData}
          onChange={onChange}
          serverKeyStatus={serverKeyStatus}
          onServerKeyStatusChange={setServerKeyStatus}
        />

        {/* Sécurité & Confidentialité */}
        <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            <strong>Sécurité & Confidentialité RGPD :</strong> Votre clé est stockée de manière chiffrée côté serveur. Elle n&apos;est jamais exposée publiquement. Vos requêtes bénéficient du <strong>Prompt Caching officiel DeepSeek (réduction de coût de 90% à 98%)</strong>.
          </span>
        </div>

        {/* Raccourci vers la Télémétrie */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Centre de Télémétrie & Coûts Réels
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Suivez en temps réel les jetons consommés, vos économies comparées à GPT-4o et ajustez votre budget mensuel.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenTelemetry}
            className="px-3 py-1.5 bg-[#131B26] hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0 justify-center cursor-pointer"
          >
            <span>Ouvrir la Télémétrie</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
