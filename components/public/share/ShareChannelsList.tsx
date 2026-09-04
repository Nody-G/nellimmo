'use client';

import React from 'react';
import { Copy, Check, MessageCircle, Mail, QrCode } from 'lucide-react';

interface ShareChannelsListProps {
  currentUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  onWhatsAppShare: () => void;
  onEmailShare: () => void;
  onShowQr: () => void;
}

export function ShareChannelsList({
  currentUrl,
  copied,
  onCopyLink,
  onWhatsAppShare,
  onEmailShare,
  onShowQr,
}: ShareChannelsListProps) {
  return (
    <div className="space-y-3">
      {/* WhatsApp */}
      <button
        type="button"
        onClick={onWhatsAppShare}
        className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold transition group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span>Partager sur WhatsApp</span>
        </div>
        <span className="text-[11px] text-emerald-600 group-hover:translate-x-0.5 transition-transform">Envoyer →</span>
      </button>

      {/* Email */}
      <button
        type="button"
        onClick={onEmailShare}
        className="w-full p-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl flex items-center justify-between text-xs font-bold transition group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <span>Envoyer par Email</span>
        </div>
        <span className="text-[11px] text-sky-600 group-hover:translate-x-0.5 transition-transform">Ouvrir →</span>
      </button>

      {/* QR Code Display button */}
      <button
        type="button"
        onClick={onShowQr}
        className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-2xl flex items-center justify-between text-xs font-bold transition group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#131B26] text-white flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <span>Afficher le QR Code</span>
        </div>
        <span className="text-[11px] text-gray-500 group-hover:translate-x-0.5 transition-transform">Scanner →</span>
      </button>

      {/* Copy Link field */}
      <div className="pt-2">
        <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">Lien direct</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={onCopyLink}
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
