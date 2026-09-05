'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface GmailAiCopilotBarProps {
  aiPrompt: string;
  isGeneratingAi: boolean;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
}

export function GmailAiCopilotBar({
  aiPrompt,
  isGeneratingAi,
  onPromptChange,
  onGenerate,
}: GmailAiCopilotBarProps) {
  return (
    <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-2">
      <div className="flex items-center gap-1.5 text-[#E12B7B] font-bold text-[11px]">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Nell&apos;IA Email Copilot (Instructions libres)</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Ex: Demande de passage urgent pour devis toiture sous 48h..."
          className="flex-1 p-2 bg-white border border-purple-200 rounded-xl text-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onGenerate();
            }
          }}
        />
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGeneratingAi || !aiPrompt.trim()}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition cursor-pointer"
        >
          {isGeneratingAi ? 'Rédaction...' : 'Adapter'}
        </button>
      </div>
    </div>
  );
}
