'use client';

import React from 'react';
import type { VisitAnalysisResult } from '@/lib/voice-visit-analysis';

interface VoiceAnalysisPreviewProps {
  analysisResult: VisitAnalysisResult;
}

export function VoiceAnalysisPreview({ analysisResult }: VoiceAnalysisPreviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
        <span className="text-gray-400 block text-[10px] uppercase font-bold">Sentiment Visiteur :</span>
        <span className="font-bold text-emerald-400 block mt-0.5 capitalize">
          {analysisResult.sentiment.replace('_', ' ')}
        </span>
      </div>

      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
        <span className="text-gray-400 block text-[10px] uppercase font-bold">Atouts Relevés :</span>
        <span className="font-semibold text-white block mt-0.5 truncate">
          {analysisResult.strengths.join(', ')}
        </span>
      </div>

      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
        <span className="text-gray-400 block text-[10px] uppercase font-bold">Avis sur le Prix :</span>
        <span className="font-semibold text-amber-300 block mt-0.5 truncate">
          {analysisResult.priceFeedback}
        </span>
      </div>
    </div>
  );
}
