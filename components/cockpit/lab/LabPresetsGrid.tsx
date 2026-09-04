'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { LabPreset } from './lab-types';

interface LabPresetsGridProps {
  presets: LabPreset[];
  onApplyPreset: (preset: LabPreset) => void;
}

export function LabPresetsGrid({ presets, onApplyPreset }: LabPresetsGridProps) {
  if (presets.length === 0) return null;

  return (
    <div className="bg-[#FCFAF7] p-5 rounded-3xl border border-[#F3E8EE] space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
        <span>Scénarios d&apos;Inspiration Immédiate (1 Clic)</span>
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {presets.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onApplyPreset(p)}
            className="p-3 bg-white border border-gray-200 hover:border-[#E12B7B] rounded-2xl text-left transition flex items-center justify-between group shadow-2xs cursor-pointer"
          >
            <span className="text-xs font-bold text-gray-800 group-hover:text-[#E12B7B] transition truncate">
              {p.title}
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-[#E12B7B] shrink-0 ml-2">
              Charger →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
