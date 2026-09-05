'use client';

import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { ThemeSwitcherModal } from './ThemeSwitcherModal';

interface ThemeSwitcherButtonProps {
  compact?: boolean;
}

export function ThemeSwitcherButton({ compact = false }: ThemeSwitcherButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title={`Changer de thème (Actif: ${currentTheme.name})`}
        className={`rounded-lg transition flex items-center gap-1.5 cursor-pointer border ${
          compact
            ? 'p-2 bg-white/10 hover:bg-white/20 text-white border-white/10'
            : 'px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 text-xs font-bold'
        }`}
      >
        <Palette className="w-3.5 h-3.5 text-[#E12B7B]" />
        {!compact && (
          <span className="flex items-center gap-1.5">
            <span>Thème</span>
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
          </span>
        )}
      </button>

      <ThemeSwitcherModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
