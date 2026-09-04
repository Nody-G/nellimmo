'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface CommandTriggerButtonProps {
  onOpen: () => void;
}

export function CommandTriggerButton({ onOpen }: CommandTriggerButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-3 py-2 bg-[#F3E8EE]/40 hover:bg-[#F3E8EE]/70 border border-[#F3E8EE] rounded-xl text-xs text-gray-500 hover:text-gray-900 transition cursor-pointer group"
      title="Recherche globale (Ctrl+K)"
    >
      <Search className="w-3.5 h-3.5 text-[#E12B7B] group-hover:scale-110 transition" />
      <span className="hidden sm:inline font-medium">Rechercher...</span>
      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 border border-gray-200 rounded shadow-xs">
        ⌘K
      </kbd>
    </button>
  );
}
