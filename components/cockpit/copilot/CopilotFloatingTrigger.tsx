'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface CopilotFloatingTriggerProps {
  onOpen: () => void;
  isOpen: boolean;
}

export function CopilotFloatingTrigger({ onOpen, isOpen }: CopilotFloatingTriggerProps) {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden animate-fade-in">
      <button
        type="button"
        onClick={onOpen}
        title="Ouvrir le Copilote IA Nell'Immo (Raccourci: Ctrl+J ou ⌘J)"
        className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-[#131B26] hover:bg-[#1C2836] text-white rounded-full shadow-2xl border border-[#C59A45]/40 hover:border-[#C59A45] transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        {/* Halo lumineux subtil */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E12B7B] to-[#C59A45] rounded-full blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />

        <div className="relative flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#E12B7B] to-[#C59A45] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>

          <span className="text-xs font-bold font-serif tracking-wide bg-gradient-to-r from-white via-rose-100 to-amber-100 bg-clip-text text-transparent">
            Copilote IA
          </span>

          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white/10 text-gray-300 rounded border border-white/15">
            Ctrl+J
          </span>
        </div>
      </button>
    </div>
  );
}
