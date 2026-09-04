'use client';

import React from 'react';
import { X, Sparkles, Phone } from 'lucide-react';

interface ConciergeHeaderProps {
  onClose: () => void;
}

export function ConciergeHeader({ onClose }: ConciergeHeaderProps) {
  return (
    <div className="p-4 bg-gradient-to-r from-[#131B26] to-[#1E293B] text-white flex items-center justify-between border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E12B7B] to-[#C59A45] p-0.5 flex items-center justify-center font-bold text-xs shadow-md">
            <span className="text-white font-serif tracking-wider font-bold">NF</span>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#131B26]" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold font-serif text-white tracking-wide">
              Nelly Fernandez
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
          </div>
          <p className="text-[10px] text-gray-300 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Conciergerie Digitale & Ancrage Local
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <a
          href="tel:+33755686109"
          className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition"
          title="Appeler Nelly directement"
        >
          <Phone className="w-4 h-4" />
        </a>
        <button
          onClick={onClose}
          className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          title="Fermer le concierge"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
