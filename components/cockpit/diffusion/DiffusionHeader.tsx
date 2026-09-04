'use client';

import React from 'react';
import { Radio, Download, RefreshCw } from 'lucide-react';

interface DiffusionHeaderProps {
  onRunSync: () => void;
  isSyncing: boolean;
}

export function DiffusionHeader({ onRunSync, isSyncing }: DiffusionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <Radio className="w-4 h-4" />
          <span>Multidiffusion Portails</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Diffusion SeLoger, LeBonCoin & Bien&apos;ici
        </h1>
        <p className="text-xs text-gray-500">
          Diffusion automatique de vos annonces vers vos portails partenaires.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/api/feeds/download?feed=poliris"
          download
          className="px-4 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
        >
          <Download className="w-4 h-4 text-gray-500" />
          Télécharger le ZIP
        </a>

        <button
          type="button"
          onClick={onRunSync}
          disabled={isSyncing}
          className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronisation...' : 'Synchroniser Maintenant'}
        </button>
      </div>
    </div>
  );
}
