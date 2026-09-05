'use client';

import React from 'react';
import { Copy, Check, Share2, CalendarPlus } from 'lucide-react';

interface SocialShareButtonsProps {
  copied: boolean;
  addedToPlanner: boolean;
  onCopy: () => void;
  onNativeShare: () => void;
  onFacebookShare: () => void;
  onLinkedInShare: () => void;
  onTwitterShare: () => void;
  onWhatsAppShare: () => void;
  onSchedulePost: () => void;
}

export function SocialShareButtons({
  copied,
  addedToPlanner,
  onCopy,
  onNativeShare,
  onFacebookShare,
  onLinkedInShare,
  onTwitterShare,
  onWhatsAppShare,
  onSchedulePost,
}: SocialShareButtonsProps) {
  return (
    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onCopy}
          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copié !' : 'Copier texte'}</span>
        </button>

        <button
          type="button"
          onClick={onNativeShare}
          className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          title="Partager via le menu natif de votre appareil"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partage Direct</span>
        </button>

        <button
          type="button"
          onClick={onFacebookShare}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          title="Partager sur Facebook"
        >
          <span>Facebook</span>
        </button>

        <button
          type="button"
          onClick={onLinkedInShare}
          className="px-3 py-2 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          title="Partager sur LinkedIn"
        >
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={onTwitterShare}
          className="px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          title="Partager sur X / Twitter"
        >
          <span>X</span>
        </button>

        <button
          type="button"
          onClick={onWhatsAppShare}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          title="Partager sur WhatsApp"
        >
          <span>WhatsApp</span>
        </button>
      </div>

      {/* Add to Social Planner CTA */}
      <button
        type="button"
        onClick={onSchedulePost}
        className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm cursor-pointer"
      >
        {addedToPlanner ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Post planifié !</span>
          </>
        ) : (
          <>
            <CalendarPlus className="w-4 h-4 text-[#C59A45]" />
            <span>Planifier dans le Social Planner</span>
          </>
        )}
      </button>
    </div>
  );
}
