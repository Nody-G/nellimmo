'use client';

import React from 'react';
import { Radio, Download, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';

interface DiffusionHeaderProps {
  onRunSync: () => void;
  isSyncing: boolean;
  onDownloadZip: () => void;
  isDownloading: boolean;
  downloadError?: string | null;
}

export function DiffusionHeader({
  onRunSync,
  isSyncing,
  onDownloadZip,
  isDownloading,
  downloadError,
}: DiffusionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <Radio className="w-4 h-4" />
          <span>Multidiffusion Portails</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Diffusion SeLoger, LeBonCoin & Bien’ici
        </h1>
        <p className="text-xs text-gray-500">
          Préparez et exportez vos annonces vers vos portails partenaires (SeLoger, LeBonCoin, Bien’ici).
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="px-4 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
            {isDownloading ? 'Génération...' : 'Télécharger le ZIP'}
          </button>

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

        {downloadError && (
          <div className="flex items-start gap-1.5 max-w-xs text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{downloadError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
