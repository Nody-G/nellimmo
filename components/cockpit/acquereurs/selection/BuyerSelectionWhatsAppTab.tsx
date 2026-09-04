'use client';

import React from 'react';
import { Check, Copy, Mail, Send } from 'lucide-react';

interface BuyerSelectionWhatsAppTabProps {
  whatsappMessage: string;
  copiedText: boolean;
  onCopy: () => void;
  onSendEmail: () => void;
  onSendWhatsApp: () => void;
}

export function BuyerSelectionWhatsAppTab({
  whatsappMessage,
  copiedText,
  onCopy,
  onSendEmail,
  onSendWhatsApp,
}: BuyerSelectionWhatsAppTabProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-3">
      <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-gray-300 font-sans text-xs text-gray-900 leading-relaxed whitespace-pre-line shadow-inner max-h-[380px] overflow-y-auto">
        <div className="bg-white p-3.5 rounded-xl shadow-xs max-w-md border-l-4 border-emerald-500">
          {whatsappMessage}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
        <button
          onClick={onCopy}
          className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copiedText ? 'Copié !' : 'Copier'}</span>
        </button>

        <button
          onClick={onSendEmail}
          className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Mail className="w-4 h-4" />
          <span>Email VIP</span>
        </button>

        <button
          onClick={onSendWhatsApp}
          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
