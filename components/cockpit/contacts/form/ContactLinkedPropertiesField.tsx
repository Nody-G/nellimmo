'use client';

import React from 'react';
import type { Property } from '@/lib/types';

interface ContactLinkedPropertiesFieldProps {
  properties: Property[];
  selectedPropertyIds: string[];
  onToggleProperty: (id: string) => void;
}

export function ContactLinkedPropertiesField({
  properties,
  selectedPropertyIds,
  onToggleProperty,
}: ContactLinkedPropertiesFieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
        Mandats &amp; Biens rattachés
      </label>
      <div className="max-h-28 overflow-y-auto p-2 bg-[#FCFAF7] border border-gray-200 rounded-xl space-y-1">
        {properties.map((p) => {
          const isSelected = selectedPropertyIds.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => onToggleProperty(p.id)}
              className={`p-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition text-xs ${
                isSelected
                  ? 'bg-[#E12B7B]/10 text-[#E12B7B] font-bold'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleProperty(p.id)}
                className="accent-[#E12B7B] cursor-pointer"
              />
              <span className="font-mono text-[10px]">#{p.mandate_number}</span>
              <span className="truncate">{p.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
