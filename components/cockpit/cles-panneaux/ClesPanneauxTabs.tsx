'use client';

import React from 'react';
import { KeyRound, Building, FileText } from 'lucide-react';

export type ClesPanneauxTab = 'armoire' | 'panneaux' | 'historique';

interface ClesPanneauxTabsProps {
  activeTab: ClesPanneauxTab;
  onTabChange: (tab: ClesPanneauxTab) => void;
  keysCount: number;
  signboardsCount: number;
}

export function ClesPanneauxTabs({
  activeTab,
  onTabChange,
  keysCount,
  signboardsCount,
}: ClesPanneauxTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200">
      <button
        onClick={() => onTabChange('armoire')}
        className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
          activeTab === 'armoire'
            ? 'border-[#E12B7B] text-[#E12B7B]'
            : 'border-transparent text-gray-500 hover:text-gray-900'
        }`}
      >
        <KeyRound className="w-4 h-4" />
        <span>Armoire à Clés Virtuelle ({keysCount})</span>
      </button>

      <button
        onClick={() => onTabChange('panneaux')}
        className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
          activeTab === 'panneaux'
            ? 'border-[#E12B7B] text-[#E12B7B]'
            : 'border-transparent text-gray-500 hover:text-gray-900'
        }`}
      >
        <Building className="w-4 h-4" />
        <span>Parc de Panneaux ({signboardsCount})</span>
      </button>

      <button
        onClick={() => onTabChange('historique')}
        className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
          activeTab === 'historique'
            ? 'border-[#E12B7B] text-[#E12B7B]'
            : 'border-transparent text-gray-500 hover:text-gray-900'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Registre & Décharges de Prêt</span>
      </button>
    </div>
  );
}
