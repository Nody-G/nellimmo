'use client';

import React from 'react';
import Image from 'next/image';
import { ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import type { Property } from '@/lib/types';

interface FlyerPhotoSlotColumnProps {
  availableImages: NonNullable<Property['images']>;
  activeSlot: number;
  setActiveSlot: (v: number) => void;
  isGalleryOpen: boolean;
  setIsGalleryOpen: (v: boolean) => void;
  getPhotoUrl: (slotIndex: number) => string;
}

export function FlyerPhotoSlotColumn({
  availableImages,
  activeSlot,
  setActiveSlot,
  isGalleryOpen,
  setIsGalleryOpen,
  getPhotoUrl
}: FlyerPhotoSlotColumnProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-[#E12B7B]" />
          Emplacements Photos (Actif: #{activeSlot + 1})
        </label>
        <button
          type="button"
          onClick={() => setIsGalleryOpen(!isGalleryOpen)}
          className="text-xs font-bold text-[#E12B7B] hover:text-[#C71B62] transition flex items-center gap-1 cursor-pointer"
        >
          {isGalleryOpen ? 'Replier' : `Dérouler (${availableImages.length})`}
          {isGalleryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {[0, 1, 2, 3, 4].map((slot) => {
          const url = getPhotoUrl(slot);
          const isActive = activeSlot === slot;

          return (
            <div
              key={slot}
              onClick={() => {
                setActiveSlot(slot);
                setIsGalleryOpen(true);
              }}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer group bg-gray-100 ${
                isActive ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image src={url} alt="" fill sizes="(max-width: 768px) 33vw, 120px" className="object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] font-bold py-0.5 text-center truncate">
                #{slot + 1}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
        Cliquez sur un emplacement ci-dessus puis sur une photo de la galerie pour l’affecter.
      </p>
    </div>
  );
}
