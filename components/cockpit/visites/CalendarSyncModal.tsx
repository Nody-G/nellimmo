'use client';

import React, { useState } from 'react';
import { Calendar, Copy, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Le token doit correspondre à CALENDAR_FEED_TOKEN côté serveur.
  const feedToken = process.env.NEXT_PUBLIC_CALENDAR_FEED_TOKEN || 'nellimo_calendar_token';

  const feedUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/calendar/feed?token=${feedToken}`
      : '/api/calendar/feed';

  const handleCopy = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#E12B7B]" />
          <span>Synchronisation Agenda Smartphone (iCal)</span>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-gray-600 leading-relaxed">
          Abonnez votre iPhone (Apple Calendar) ou votre Google Agenda à vos visites et échéances notariées.
          Les événements se mettent à jour automatiquement en tâche de fond.
        </p>

        <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Lien d&apos;Abonnement Universel (RFC 5545)
          </span>
          <div className="flex items-center justify-between gap-2 font-mono text-xs bg-white p-2.5 rounded-xl border border-gray-200">
            <span className="truncate text-gray-700">{feedUrl}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 hover:text-[#E12B7B] cursor-pointer"
              title="Copier l'URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href={
              typeof window !== 'undefined'
                ? `webcal://${window.location.host}/api/calendar/feed?token=${feedToken}`
                : '#'
            }
            className="p-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition"
          >
            <span> Ajouter à Apple Calendar</span>
          </a>

          <a
            href={
              typeof window !== 'undefined'
                ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
                  `${window.location.origin}/api/calendar/feed?token=${feedToken}`
                )}`
                : '#'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition"
          >
            <span>G S&apos;abonner Google Agenda</span>
          </a>
        </div>

        <div className="pt-2 text-center">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
