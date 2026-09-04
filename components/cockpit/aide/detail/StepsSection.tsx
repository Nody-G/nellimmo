'use client';

import React from 'react';
import { Layers, Check, Info, Sparkles } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

interface StepsSectionProps {
  guide: HelpGuide;
  completedSteps: Record<string, boolean>;
  onToggleStep: (stepNumber: number) => void;
}

export function StepsSection({ guide, completedSteps, onToggleStep }: StepsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#E12B7B]" />
          <span>Procédure Pas-à-Pas (À Cocher)</span>
        </h3>
        <span className="text-[11px] text-gray-400">
          Cochez les étapes au fur et à mesure de votre progression
        </span>
      </div>

      <div className="space-y-3">
        {guide.steps.map((step) => {
          const stepKey = `${guide.id}-step-${step.number}`;
          const isDone = !!completedSteps[stepKey];

          return (
            <div
              key={step.number}
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-white border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => onToggleStep(step.number)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
                  }`}
                  title={isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
                </button>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isDone ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isDone && (
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                        Validé ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {step.tips && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2 mt-2">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{step.tips}</span>
                    </div>
                  )}

                  {step.proTip && (
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-950 flex items-start gap-2 mt-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong>Conseil Pro :</strong> {step.proTip}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
