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
    { id: 'details', label: "Vue d'ensemble", icon: <FileText className="w-4 h-4" /> },
    {
      id: 'alur_ged',
      label: 'Documents ALUR & GED',
      icon: <FileCheck2 className="w-4 h-4" />,
      count: documentsCount,
    },
    {
      id: 'crm',
      label: 'Matching Acquéreurs',
      icon: <Users className="w-4 h-4" />,
      count: buyersCount,
    },
    { id: 'copywriting', label: 'Studio IA Copywriting', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'poliris', label: 'Multidiffusion & Portails', icon: <Radio className="w-4 h-4" /> },
    {
      id: 'audit',
      label: 'Registre DGCCRF SHA-256',
      icon: <Lock className="w-4 h-4" />,
      count: logsCount,
    },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-px">
      {tabs.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => onTabChange(t.id as MandateTabId)}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === t.id
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          {t.icon}
          <span>{t.label}</span>
          {t.count !== undefined && (
            <span className="px-1.5 py-0.2 bg-gray-100 rounded-full text-[10px] text-gray-700">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
