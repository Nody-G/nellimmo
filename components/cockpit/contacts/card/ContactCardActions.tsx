'use client';

import React from 'react';
import { Mail, MessageSquare, Phone, Download, ChevronRight } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { downloadVCard } from '@/lib/gmail';

interface ContactCardActionsProps {
  contact: ContactItem;
  waNumber: string;
  onOpenDetail: (contact: ContactItem) => void;
  onOpenEmailCompose: (contact: ContactItem) => void;
}

export function ContactCardActions({
  contact,
  waNumber,
  onOpenDetail,
  onOpenEmailCompose,
}: ContactCardActionsProps) {
  return (
    <div className="px-5 py-3 bg-[#FCFAF7] border-t border-[#F3E8EE] flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        {/* Gmail Web Quick Compose */}
        {contact.email && (
          <button
            type="button"
            onClick={() => onOpenEmailCompose(contact)}
            title="Envoyer un email via Gmail (avec modèles pros)"
            className="p-2 rounded-xl bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 shadow-2xs transition cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        )}

        {/* WhatsApp Web direct */}
        {contact.phone && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir WhatsApp Web"
            className="p-2 rounded-xl bg-white hover:bg-green-50 text-gray-600 hover:text-green-600 border border-gray-200 shadow-2xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Phone call */}
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            title="Appeler"
            className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 border border-gray-200 shadow-2xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}

        {/* vCard download */}
        <button
          type="button"
          onClick={() => downloadVCard(contact)}
          title="Télécharger la carte de visite (.vcf)"
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 shadow-2xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpenDetail(contact)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-800 hover:text-[#E12B7B] bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition shadow-2xs cursor-pointer"
      >
        <span>Dossier 360°</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
