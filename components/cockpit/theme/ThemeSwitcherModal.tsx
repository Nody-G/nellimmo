'use client';

import React, { useEffect } from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme, ThemeId } from '@/lib/theme';

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSwitcherModal({ isOpen, onClose }: ThemeSwitcherModalProps) {
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectTheme = (id: ThemeId) => {
    setTheme(id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-fade-in overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-gray-900 text-lg">
                  Thèmes &amp; Ambiance Visuelle
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900">
                  Haute Définition
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Personnalisez les couleurs et le style du Cockpit Nell&apos;Immo en 1 clic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-gray-400 font-medium">Échap</span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content: Themes Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {themes.map((item) => {
              const isSelected = theme === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectTheme(item.id)}
                  className={`p-4 rounded-2xl border-2 transition text-left cursor-pointer relative flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-[#E12B7B] bg-[#E12B7B]/5 shadow-md ring-2 ring-[#E12B7B]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#E12B7B] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-gray-600">
                      {item.tagline}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Swatches & Selection */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs block"
                        style={{ backgroundColor: item.primaryColor }}
                        title="Couleur Principale"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs block"
                        style={{ backgroundColor: item.accentColor }}
                        title="Accent Or / Secondaire"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs block"
                        style={{ backgroundColor: item.darkColor }}
                        title="Ardoise / Nuit"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs block"
                        style={{ backgroundColor: item.bgColor }}
                        title="Fond d'écran"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {isSelected ? (
                        <span className="px-2.5 py-1 rounded-xl bg-[#E12B7B] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" /> Actif
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-semibold transition">
                          Appliquer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Sparkles className="w-4 h-4 text-[#C59A45]" />
            Le thème est mémorisé automatiquement sur ce poste.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
