'use client';

import React from 'react';
import { RefreshCw, Copy, Check, Download, MessageCircle, Share2 } from 'lucide-react';
import { getStyleLabel } from './redacteur-types';

interface StudioHeaderProps {
  selectedStyle: string;
  generationSource: 'deepseek' | 'local_template';
  isGenerating: boolean;
  copied: boolean;
  isPublishingSocial: boolean;
  isSocialStyle: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onWhatsApp: () => void;
  onPublishMeta: () => void;
}

export function StudioHeader({
  selectedStyle,
  generationSource,
  isGenerating,
  copied,
  isPublishingSocial,
  isSocialStyle,
  onRegenerate,
  onCopy,
  onDownload,
  onWhatsApp,
  onPublishMeta,
}: StudioHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
            Studio Actif
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              generationSource === 'deepseek'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {generationSource === 'deepseek' ? 'IA Active' : 'Moteur Local Certifié'}
          </span>
        </div>
        <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
          {getStyleLabel(selectedStyle)}
        </h3>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="px-3 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50"
          title="Régénérer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Génération...' : 'Régénérer'}</span>
        </button>

        <button
          onClick={onCopy}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          title="Copier"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'Copié !' : 'Copier'}</span>
        </button>

        <button
          onClick={onDownload}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          title="Télécharger fichier .txt"
        >
          <Download className="w-3.5 h-3.5" />
          <span>.TXT</span>
        </button>

        <button
          onClick={onWhatsApp}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          title="WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        {isSocialStyle && (
          <button
            type="button"
            onClick={onPublishMeta}
            disabled={isPublishingSocial}
            className="px-3 py-2 bg-gradient-to-r from-[#E12B7B] via-[#C71B62] to-[#833AB4] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50"
            title="Meta API"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isPublishingSocial ? 'Publication...' : 'Meta API'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
