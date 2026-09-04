'use client';

import React from 'react';
import { HelpGuide } from '@/lib/help-content';

interface HelpSearchResultsListProps {
  searchResults: HelpGuide[];
  onSelect: (guideId: string) => void;
}

export function HelpSearchResultsList({
  searchResults,
  onSelect,
}: HelpSearchResultsListProps) {
  if (searchResults.length === 0) return null;

  return (
    <div className="mt-2 p-1 bg-white border border-gray-200 rounded-xl shadow-md space-y-1 max-h-48 overflow-y-auto">
      {searchResults.map((g) => (
        <button
          key={g.id}
          type="button"
          onClick={() => onSelect(g.id)}
          className="w-full text-left p-2 rounded-lg hover:bg-pink-50 text-xs flex items-center justify-between cursor-pointer"
        >
          <span className="font-bold text-gray-800 truncate">{g.title}</span>
          <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">
            {g.category}
          </span>
        </button>
      ))}
    </div>
  );
}
