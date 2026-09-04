'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

interface ConcreteExampleCardProps {
  example: HelpGuide['concreteExample'];
}

export function ConcreteExampleCard({ example }: ConcreteExampleCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-[#0E141D] text-white border border-gray-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#C59A45] text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-[#E12B7B]" />
          <span>Cas Concret Vécu en Pays Salonais</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
          {example.location}
        </span>
      </div>

      <h4 className="text-base font-serif font-bold text-white">{example.title}</h4>

      <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
        <div>
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
            Le Contexte :
          </span>
          <p>{example.context}</p>
        </div>

        <div>
          <span className="text-[#C59A45] font-bold uppercase tracking-wider text-[10px] block mb-1">
            L’Action de Nelly avec le Cockpit :
          </span>
          <p>{example.solution}</p>
        </div>

        <div>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
            Le Résultat Obtenu :
          </span>
          <p className="text-emerald-200 font-semibold">{example.outcome}</p>
        </div>
      </div>

      {example.keyFigures && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-800">
          {example.keyFigures.map((fig, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center"
            >
              <span className="text-[10px] text-gray-400 block truncate">
                {fig.label}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F44293] block mt-0.5">
                {fig.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
