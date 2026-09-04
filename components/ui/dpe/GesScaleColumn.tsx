'use client';

import React from 'react';
import { GesLetter } from '@/lib/types';
import { GES_COLORS, DPE_LETTERS } from './dpe-constants';

interface GesScaleColumnProps {
  currentLetter?: GesLetter;
  currentValue?: number;
}

export function GesScaleColumn({ currentLetter, currentValue }: GesScaleColumnProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Émissions de Gaz à Effet de Serre</span>
        <span className="text-xs text-gray-500 font-mono">kg CO₂/m²/an</span>
      </div>

      <div className="space-y-1">
        {DPE_LETTERS.map((letter, idx) => {
          const isCurrent = currentLetter === letter;
          const widthPercent = 38 + idx * 10;
          const colorInfo = GES_COLORS[letter as GesLetter];

          return (
            <div key={letter} className="flex items-center gap-2">
              <div
                className="h-6 rounded-r-md flex items-center justify-between px-2 text-xs font-bold transition-all relative"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: colorInfo.bg,
                  color: colorInfo.text,
                  boxShadow: isCurrent ? '0 0 0 2px #1C232B, 0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span>{letter}</span>
                <span className="text-[10px] opacity-90 font-normal">{colorInfo.label}</span>
              </div>

              {isCurrent && (
                <div className="flex items-center gap-1 font-bold text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                  <span>{currentValue || '-'}</span>
                  <span className="text-[10px] text-gray-500 font-normal">kg CO₂</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
