'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import {
  useCommandPalette,
  CommandTriggerButton,
  CommandResultsList,
} from './command-palette';

export function CommandPalette() {
  const {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    selectedIndex,
    setSelectedIndex,
    inputRef,
    results,
    handleSelect,
    handleKeyDownInList,
  } = useCommandPalette();

  if (!isOpen) {
    return <CommandTriggerButton onOpen={() => setIsOpen(true)} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-3xl border border-[#F3E8EE] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInList}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-[#E12B7B] shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher un mandat, acquéreur, lead, outil ou guide (ex: Pélissanne, DVF, Honoraires)..."
            className="w-full bg-transparent border-none text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 text-[11px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
          >
            Échap
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
          <CommandResultsList
            results={results}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            onMouseEnter={setSelectedIndex}
          />
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#FCFAF7] border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 px-5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-xs font-sans">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-xs font-sans">
                ↓
              </kbd>
              Naviguer
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-xs font-sans">
                Entrée
              </kbd>
              Ouvrir
            </span>
          </div>
          <span className="text-gray-400">
            {results.length} résultat{results.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
