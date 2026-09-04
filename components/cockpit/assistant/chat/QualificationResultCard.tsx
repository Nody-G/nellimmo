'use client';

import React, { useState } from 'react';
import { QualificationResult } from '@/lib/assistant';
import {
  Flame,
  Sun,
  Snowflake,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { ScoreGauge, InfoChip } from './ScoreGauge';

const LEVEL_META: Record<
  QualificationResult['level'],
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  chaud: { label: 'Lead chaud', icon: <Flame className="w-3.5 h-3.5" />, badgeClass: 'bg-red-100 text-red-700' },
  tiède: { label: 'Lead tiède', icon: <Sun className="w-3.5 h-3.5" />, badgeClass: 'bg-amber-100 text-amber-700' },
  froid: { label: 'Lead froid', icon: <Snowflake className="w-3.5 h-3.5" />, badgeClass: 'bg-blue-100 text-blue-700' },
};

interface QualificationResultCardProps {
  result: QualificationResult;
}

export const QualificationResultCard: React.FC<QualificationResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const levelMeta = LEVEL_META[result.level];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silencieux */
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Score & niveau */}
      <div className="flex items-center gap-4 p-3.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl">
        <ScoreGauge score={result.score} />
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${levelMeta.badgeClass}`}>
              {levelMeta.icon}
              {levelMeta.label}
            </span>
            <span className="text-xs font-bold text-gray-800">{result.intent}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            <InfoChip icon={<span className="text-[10px] font-bold">€</span>} label="Budget" value={result.budget} />
            <InfoChip icon={<span className="text-[10px] font-bold">⏱</span>} label="Délai" value={result.timeline} />
          </div>
        </div>
      </div>

      {/* Motivations & points d'attention */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-emerald-700 mb-2">
            <Lightbulb className="w-3.5 h-3.5" /> Motivations
          </div>
          {result.motivations.length > 0 ? (
            <ul className="space-y-1">
              {result.motivations.map((m, i) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">•</span> {m}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">Aucune motivation explicite détectée.</p>
          )}
        </div>
        <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-amber-700 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Points d’attention
          </div>
          {result.concerns.length > 0 ? (
            <ul className="space-y-1">
              {result.concerns.map((c, i) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span> {c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">Aucun point bloquant détecté.</p>
          )}
        </div>
      </div>

      {/* Prochaine action */}
      <div className="flex items-start gap-2 p-3 bg-[#131B26] text-white rounded-xl">
        <ArrowRight className="w-4 h-4 text-[#C59A45] shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59A45] block">Prochaine action</span>
          <span className="text-xs">{result.nextAction}</span>
        </div>
      </div>

      {/* Réponse suggérée */}
      <div className="p-3.5 bg-white border border-[#F3E8EE] rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase text-gray-500">Réponse suggérée (à votre plume)</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copié' : 'Copier'}
          </button>
        </div>
        <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{result.suggestedReply}</p>
      </div>
    </div>
  );
};
