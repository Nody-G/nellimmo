'use client';

import React from 'react';
import { Home } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import type { LayoutFormat, PhotoArrangement } from '../flyer-types';

interface FlyerLayoutColumnProps {
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  flyerFormat: LayoutFormat;
  setFlyerFormat: (v: LayoutFormat) => void;
  photoArrangement: PhotoArrangement;
  setPhotoArrangement: (v: PhotoArrangement) => void;
}

const FORMAT_OPTIONS: { key: LayoutFormat; label: string; icon: string; iconClass: string }[] = [
  { key: 'A4_landscape', label: 'A4 Paysage', icon: 'LED', iconClass: 'w-5 h-3.5' },
  { key: 'A4_portrait', label: 'A4 Portrait', icon: 'A4', iconClass: 'w-3.5 h-5' },
  { key: 'A3_landscape', label: 'A3 Grand Vitrine', icon: 'A3', iconClass: 'w-6 h-4' },
  { key: 'social_square', label: 'Carré Post 1:1', icon: '1:1', iconClass: 'w-4 h-4' },
  { key: 'story_vertical', label: 'Story Insta 9:16', icon: '9:16', iconClass: 'w-3 h-5' }
];

const ARRANGEMENT_OPTIONS: { key: PhotoArrangement; label: string; colSpan?: string }[] = [
  { key: 'hero_only', label: '1 Solo Hero' },
  { key: 'split_2', label: '2 Photos Split' },
  { key: 'standard_3', label: '3 Photos Classique' },
  { key: 'grid_4', label: '4 Photos Grille' },
  { key: 'mosaic_5', label: '5 Photos Mosaïque Prestige', colSpan: 'col-span-2' }
];

export function FlyerLayoutColumn({
  properties,
  selectedPropertyId,
  onSelectProperty,
  flyerFormat,
  setFlyerFormat,
  photoArrangement,
  setPhotoArrangement
}: FlyerLayoutColumnProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
          <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
          Choisir le Bien ({properties.length} disponibles)
        </label>
        <select
          value={selectedPropertyId}
          onChange={(e) => onSelectProperty(e.target.value)}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {formatMandateRef(p.mandate_number)} - {p.title} ({p.city}) - {p.price_fai.toLocaleString('fr-FR')} €
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
          Format d’Affichage
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFlyerFormat(opt.key)}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                flyerFormat === opt.key
                  ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className={`${opt.iconClass} border border-current rounded-2xs flex items-center justify-center shrink-0`}>
                <span className="text-[6px]">{opt.icon}</span>
              </div>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
          Agencement Photos
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
          {ARRANGEMENT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setPhotoArrangement(opt.key)}
              className={`p-2 rounded-xl border text-center transition cursor-pointer ${opt.colSpan || ''} ${
                photoArrangement === opt.key
                  ? 'bg-[#131B26] text-white border-[#131B26]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
