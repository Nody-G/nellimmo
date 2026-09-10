'use client';

import React from 'react';
import { Building2, Sparkles, Share2, ShieldCheck, Layers } from 'lucide-react';

export type SettingsTabId = 'identite' | 'ia' | 'integrations' | 'securite' | 'tous';

interface SettingsCategoryNavProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
  hasAiKey: boolean;
}

export function SettingsCategoryNav({
  activeTab,
  onTabChange,
  hasAiKey,
}: SettingsCategoryNavProps) {
  const tabs = [
    {
      id: 'identite' as const,
      label: 'Identité & Équipe',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'ia' as const,
      label: 'IA DeepSeek V4.1',
      icon: <Sparkles className="w-4 h-4" />,
      badge: hasAiKey ? 'Actif' : 'Clé requise',
      badgeColor: hasAiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
    },
    {
      id: 'integrations' as const,
      label: 'Passerelles & Réseaux',
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      id: 'securite' as const,
      label: 'Données & RGPD',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'tous' as const,
      label: 'Vue Complète',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-gray-200/80 overflow-x-auto no-scrollbar py-1">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-[#131B26] text-white font-bold shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium'
            }`}
          >
            <span className={isActive ? 'text-[#C59A45]' : 'text-gray-400'}>
              {t.icon}
            </span>
            <span>{t.label}</span>
            {t.badge && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${t.badgeColor}`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
