'use client';

import React from 'react';
import {
  SocialFormat,
  SocialBadge,
  SocialTheme,
  SOCIAL_FORMATS,
  SOCIAL_BADGES,
  SOCIAL_THEMES,
} from './social-types';

interface SocialVisualControlsProps {
  selectedFormat: SocialFormat;
  selectedBadge: SocialBadge;
  selectedTheme: SocialTheme;
  onFormatChange: (fmt: SocialFormat) => void;
  onBadgeChange: (b: SocialBadge) => void;
  onThemeChange: (t: SocialTheme) => void;
}

export function SocialVisualControls({
  selectedFormat,
  selectedBadge,
  selectedTheme,
  onFormatChange,
  onBadgeChange,
  onThemeChange,
}: SocialVisualControlsProps) {
  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
          1. Format Réseau Social
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOCIAL_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => onFormatChange(fmt.id)}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'border-[#E12B7B] bg-rose-50/50 shadow-2xs'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-xs text-[#131B26]">{fmt.label}</div>
              <div className="text-[9px] text-gray-500 line-clamp-1">{fmt.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Badge & Theme Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            2. Badge d’Accroche
          </span>
          <select
            value={selectedBadge}
            onChange={(e) => onBadgeChange(e.target.value as SocialBadge)}
            className="w-full p-2.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
          >
            {SOCIAL_BADGES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            3. Ambiance & Style
          </span>
          <select
            value={selectedTheme}
            onChange={(e) => onThemeChange(e.target.value as SocialTheme)}
            className="w-full p-2.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
          >
            {SOCIAL_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
