'use client';

import React from 'react';
import {
  FileText,
  FileCheck2,
  Users,
  Radio,
  Sparkles,
  Lock,
} from 'lucide-react';

export type MandateTabId =
  | 'details'
  | 'alur_ged'
  | 'signature'
  | 'crm'
  | 'copywriting'
  | 'poliris'
  | 'audit';

interface MandateDetailTabsProps {
  activeTab: MandateTabId;
  onTabChange: (tab: MandateTabId) => void;
  documentsCount?: number;
  buyersCount: number;
  logsCount: number;
}

export function MandateDetailTabs({
  activeTab,
  onTabChange,
  documentsCount,
  buyersCount,
  logsCount,
}: MandateDetailTabsProps) {
  const tabs = [
    { id: 'details', label: "Vue d'ensemble", icon: <FileText className="w-3.5 h-3.5" /> },
    {
      id: 'alur_ged',
      label: 'Dossier ALUR & GED',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
      count: documentsCount,
    },
    {
      id: 'crm',
      label: 'Acquéreurs',
      icon: <Users className="w-3.5 h-3.5" />,
      count: buyersCount,
    },
    { id: 'copywriting', label: 'Studio IA', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'poliris', label: 'Diffusion Portails', icon: <Radio className="w-3.5 h-3.5" /> },
    {
      id: 'audit',
      label: 'Registre DGCCRF',
      icon: <Lock className="w-3.5 h-3.5" />,
      count: logsCount,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-gray-200/70 overflow-x-auto no-scrollbar py-1">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onTabChange(t.id as MandateTabId)}
            className={`px-3 py-2 text-xs rounded-xl flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-[#131B26] text-white shadow-2xs font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-medium'
            }`}
          >
            <span className={isActive ? 'text-[#C59A45]' : 'text-gray-400'}>
              {t.icon}
            </span>
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-700'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
