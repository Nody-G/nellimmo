'use client';

import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { PaletteItem } from './command-types';

interface CommandResultsListProps {
  results: PaletteItem[];
  selectedIndex: number;
  onSelect: (href: string) => void;
  onMouseEnter: (index: number) => void;
}

export function CommandResultsList({
  results,
  selectedIndex,
  onSelect,
  onMouseEnter,
}: CommandResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 space-y-2">
        <Search className="w-8 h-8 mx-auto opacity-30 text-gray-400" />
        <p className="text-xs">Aucun résultat trouvé pour votre recherche.</p>
        <p className="text-[11px] text-gray-400">
          Essayez un nom de commune, un mandat, un nom de client ou un mot-clé de guide.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {results.map((item, index) => {
        const Icon = item.icon;
        const isSelected = index === selectedIndex;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.href)}
            onMouseEnter={() => onMouseEnter(index)}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition cursor-pointer ${
              isSelected ? 'bg-[#FCFAF7] border border-[#F3E8EE]' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#E12B7B] text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-[#E12B7B]/10 group-hover:text-[#E12B7B]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected ? 'text-[#131B26]' : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-50 text-[#E12B7B] uppercase tracking-wider shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:inline">
                {item.category}
              </span>
              <ArrowRight
                className={`w-3.5 h-3.5 text-[#E12B7B] transition-transform ${
                  isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
