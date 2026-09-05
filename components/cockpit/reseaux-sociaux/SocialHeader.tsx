'use client';

import { Sparkles, Calendar, Grid3X3, Layers } from 'lucide-react';

export type SocialViewMode = 'studio' | 'planner' | 'grid';

interface SocialHeaderProps {
  activeTab: SocialViewMode;
  onTabChange: (tab: SocialViewMode) => void;
  scheduledCount: number;
  activePropertiesCount: number;
}

export function SocialHeader({
  activeTab,
  onTabChange,
  scheduledCount,
  activePropertiesCount,
}: SocialHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
            Marketing & Notoriété
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Studio Réseaux Sociaux Pro</span>
          </span>
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#131B26] mt-1">
          Community Management & Studio Visuel
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Générez des visuels HD 1:1 / 9:16 / 16:9, publiez en 1 clic et planifiez vos posts sur tous vos réseaux.
        </p>
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl">
        <button
          onClick={() => onTabChange('studio')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'studio'
              ? 'bg-[#131B26] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#E12B7B]" />
          <span>Générateur Visuel HD</span>
        </button>

        <button
          onClick={() => onTabChange('planner')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-[#131B26] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Social Planner ({scheduledCount})</span>
        </button>

        <button
          onClick={() => onTabChange('grid')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'grid'
              ? 'bg-[#131B26] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5 text-purple-400" />
          <span>Feed 3x3 ({activePropertiesCount})</span>
        </button>
      </div>
    </div>
  );
}
