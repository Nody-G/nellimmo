'use client';

import React from 'react';
import { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface ScoredPropertyItem {
  property: Property;
  match: { score: number };
}

interface BuyerMatchingPickerProps {
  scoredProperties: ScoredPropertyItem[];
  selectedPropertyIds: string[];
  onToggleProperty: (id: string) => void;
}

export function BuyerMatchingPicker({
  scoredProperties,
  selectedPropertyIds,
  onToggleProperty,
}: BuyerMatchingPickerProps) {
  return (
    <div className="lg:col-span-5 space-y-3">
      <span className="text-xs font-bold uppercase text-gray-400 block tracking-wider">
        Biens Compatibles ({scoredProperties.length})
      </span>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
        {scoredProperties.map(({ property: p, match }) => {
          const isSelected = selectedPropertyIds.includes(p.id);

          return (
            <div
              key={p.id}
              onClick={() => onToggleProperty(p.id)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                isSelected
                  ? 'bg-[#FDF2F8] border-[#E12B7B] shadow-2xs'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="mt-1 accent-[#E12B7B] cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    {formatMandateRef(p.mandate_number)}
                  </span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      match.score >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : match.score >= 60
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {match.score}% match
                  </span>
                </div>

                <h4 className="font-bold text-xs text-[#131B26] truncate">{p.title}</h4>
                <p className="text-[11px] text-gray-500 truncate">
                  {p.city} • {p.living_area} m² • {p.rooms_count}p
                </p>
                <div className="text-xs font-black text-[#E12B7B] mt-1">
                  {p.price_fai.toLocaleString('fr-FR')} € FAI
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
