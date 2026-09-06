'use client';

import React from 'react';

export interface CollectionMeta {
  key: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface DatabaseCollectionSelectorProps {
  collections: CollectionMeta[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function DatabaseCollectionSelector({
  collections,
  selectedKey,
  onSelect,
}: DatabaseCollectionSelectorProps) {
  return (
    <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {collections.map((col) => {
          const isSelected = selectedKey === col.key;
          const Icon = col.icon;

          return (
            <button
              key={col.key}
              onClick={() => onSelect(col.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E12B7B]' : 'text-gray-400'}`} />
              <span>{col.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {col.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
