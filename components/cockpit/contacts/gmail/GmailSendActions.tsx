'use client';

import React from 'react';
import { Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { createMailtoUrl } from '@/lib/gmail';

interface GmailSendActionsProps {
  copied: boolean;
  recipientEmail: string;
  subject: string;
  body: string;
  onCopy: () => void;
  onClose: () => void;
  onOpenGmail: () => void;
}

export function GmailSendActions({
  copied,
  recipientEmail,
  subject,
  body,
  onCopy,
  onClose,
  onOpenGmail,
}: GmailSendActionsProps) {
  return (
    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copié !' : 'Copier'}</span>
        </button>
        <a
          href={createMailtoUrl({ to: recipientEmail, subject, body })}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Client par défaut</span>
        </a>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition cursor-pointer"
        >
          Fermer
        </button>
        <button
          type="button"
          onClick={onOpenGmail}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Ouvrir dans Gmail</span>
        </button>
      </div>
    </div>
  );
}
