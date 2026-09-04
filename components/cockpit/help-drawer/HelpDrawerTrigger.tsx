'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpDrawerTriggerProps {
  onOpen: () => void;
}

export function HelpDrawerTrigger({ onOpen }: HelpDrawerTriggerProps) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-[#FDF2F8] hover:from-pink-100 hover:to-[#FCE7F3] text-[#E12B7B] border border-pink-200/80 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
      title="Ouvrir les tutoriels et l’aide sur cette fonctionnalité"
    >
      <HelpCircle className="w-3.5 h-3.5 text-[#E12B7B]" />
      <span className="hidden sm:inline">Guide &amp; Tutos</span>
    </button>
  );
}
