'use client';

import React from 'react';
import { Palette, Check } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { useTheme } from '@/lib/theme';

export function ThemeSettingsSection() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <SectionCard
      icon={<Palette className="w-5 h-5 text-[#E12B7B]" />}
      title="Ambiance Visuelle & Thème du Cockpit"
      badge="Personnalisable"
    >
      <p className="text-xs text-gray-500 mb-4">
        Choisissez l&apos;atmosphère graphique du Cockpit. Le style est appliqué instantanément et mémorisé sur ce navigateur.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {themes.map((t) => {
          const isSelected = theme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3.5 rounded-2xl border-2 transition text-left cursor-pointer flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'border-[#E12B7B] bg-[#E12B7B]/5 shadow-sm ring-2 ring-[#E12B7B]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">{t.name}</span>
                  {t.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">{t.tagline}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.primaryColor }}
                    title="Principale"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.accentColor }}
                    title="Accent"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.darkColor }}
                    title="Ardoise"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.bgColor }}
                    title="Fond"
                  />
                </div>

                {isSelected ? (
                  <span className="text-[10px] font-bold text-[#E12B7B] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Actif
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-gray-400 hover:text-gray-700">
                    Sélectionner
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
