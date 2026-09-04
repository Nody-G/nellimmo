'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface ObjectiveCardProps {
  objective: string;
}

export function ObjectiveCard({ objective }: ObjectiveCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5F8] to-white border border-[#F3E8EE] flex items-start gap-3.5">
      <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E12B7B] block">
          Objectif Stratégique pour Nelly
        </span>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{objective}</p>
      </div>
    </div>
  );
}
