'use client';

import React from 'react';
import { HelpGuide, ReadyToUseScript } from '@/lib/help-content';
import { Sparkles, Copy, Check, ShieldAlert } from 'lucide-react';

interface HelpGuideDetailViewProps {
  activeGuide: HelpGuide;
  isRecommended: boolean;
  copiedScriptId: string | null;
  onCopyScript: (script: ReadyToUseScript) => void;
}

export function HelpGuideDetailView({
  activeGuide,
  isRecommended,
  copiedScriptId,
  onCopyScript,
}: HelpGuideDetailViewProps) {
  return (
    <div className="space-y-5">
      {/* Active Guide Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E12B7B] bg-pink-50 px-2 py-0.5 rounded">
            {activeGuide.categoryLabel}
          </span>
          {isRecommended && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Recommandé pour cette page
            </span>
          )}
        </div>
        <h4 className="text-base font-bold text-gray-900 leading-snug">
          {activeGuide.title}
        </h4>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          {activeGuide.summary}
        </p>
      </div>

      {/* Objective Box */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="leading-snug">{activeGuide.objective}</span>
      </div>

      {/* Step-by-Step Mini Checklist */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
          Étapes Clés :
        </span>
        <div className="space-y-2">
          {activeGuide.steps.map((step) => (
            <div
              key={step.number}
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1"
            >
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <span className="w-4 h-4 rounded-full bg-[#E12B7B] text-white flex items-center justify-center text-[10px]">
                  {step.number}
                </span>
                <span>{step.title}</span>
              </div>
              <p className="text-gray-600 pl-6 leading-relaxed">
                {step.description}
              </p>
              {step.tips && (
                <p className="text-amber-800 pl-6 italic text-[11px]">
                  💡 {step.tips}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Concrete Example Snippet */}
      <div className="p-3.5 rounded-2xl bg-gray-900 text-white text-xs space-y-2">
        <div className="flex items-center justify-between text-[#C59A45] font-bold text-[10px] uppercase">
          <span>Cas Réel : {activeGuide.concreteExample.title}</span>
          <span>{activeGuide.concreteExample.location}</span>
        </div>
        <p className="text-gray-300 text-[11px] leading-relaxed">
          {activeGuide.concreteExample.context}
        </p>
        <p className="text-emerald-300 text-[11px] font-semibold">
          ✓ Résultat : {activeGuide.concreteExample.outcome}
        </p>
      </div>

      {/* Scripts if present */}
      {activeGuide.scripts.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            Modèle de Message Rapide :
          </span>
          {activeGuide.scripts.slice(0, 1).map((script) => (
            <div
              key={script.id}
              className="p-3 rounded-xl bg-pink-50/60 border border-pink-200/80 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{script.title}</span>
                <button
                  type="button"
                  onClick={() => onCopyScript(script)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 text-[#E12B7B] font-bold text-[10px] border border-pink-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedScriptId === script.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                {script.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Legal Alert Snippet */}
      {activeGuide.legalAlerts.length > 0 && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-red-900">
              {activeGuide.legalAlerts[0].title}
            </strong>
            <p className="text-[11px] text-red-800 leading-relaxed mt-0.5">
              {activeGuide.legalAlerts[0].content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
