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
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
      title="Ouvrir les tutoriels et l’aide sur cette fonctionnalité"
    >
      <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
      <span className="hidden sm:inline">Guide &amp; Tutos</span>
    </button>
  );
}
