'use client';

import React from 'react';
import { getDpeLetterFromValue, getGesLetterFromValue } from '@/lib/hoguet';

interface EditDpeMediaSectionProps {
  dpeValue: number;
  onDpeValueChange: (val: number) => void;
  gesValue: number;
  onGesValueChange: (val: number) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  videoUrl: string;
  onVideoUrlChange: (val: string) => void;
  virtualTourUrl: string;
  onVirtualTourUrlChange: (val: string) => void;
}

export function EditDpeMediaSection({
  dpeValue,
  onDpeValueChange,
  gesValue,
  onGesValueChange,
  description,
  onDescriptionChange,
  videoUrl,
  onVideoUrlChange,
  virtualTourUrl,
  onVirtualTourUrlChange,
}: EditDpeMediaSectionProps) {
  const dpeLetter = getDpeLetterFromValue(dpeValue);
  const gesLetter = getGesLetterFromValue(gesValue);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
      <h3 className="font-serif font-bold text-lg text-[#131B26]">Diagnostics Énergétiques & Médias</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            DPE (Consommation : {dpeValue} kWh/m²/an — Classe {dpeLetter})
          </label>
          <input
            type="number"
            value={dpeValue}
            onChange={(e) => onDpeValueChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            GES (Émissions : {gesValue} kg CO2/m²/an — Classe {gesLetter})
          </label>
          <input
            type="number"
            value={gesValue}
            onChange={(e) => onGesValueChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Descriptif de l&apos;annonce</label>
        <textarea
          rows={6}
          required
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B] leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Lien Vidéo (YouTube / MP4)</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="https://..."
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Lien Visite Virtuelle (Matterport)</label>
          <input
            type="url"
            value={virtualTourUrl}
            onChange={(e) => onVirtualTourUrlChange(e.target.value)}
            placeholder="https://my.matterport.com/show/..."
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>
    </div>
  );
}
