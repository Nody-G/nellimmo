'use client';

import React from 'react';
import { Mail, Phone, MessageSquare, MapPin, Download } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { downloadVCard } from '@/lib/gmail';

interface ContactQuickActionsBarProps {
  contact: ContactItem;
  onOpenEmailCompose: (contact: ContactItem) => void;
}

export function ContactQuickActionsBar({
  contact,
  onOpenEmailCompose,
}: ContactQuickActionsBarProps) {
  const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;
  const fullAddress = [contact.address, contact.postal_code, contact.city]
    .filter(Boolean)
    .join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress || contact.city || ''
  )}`;

  return (
    <div className="px-6 py-3 bg-[#FCFAF7] border-b border-gray-100 flex flex-wrap items-center gap-2 text-xs">
      {contact.email && (
        <button
          type="button"
          onClick={() => onOpenEmailCompose(contact)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl font-bold transition cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-red-600" />
          <span>Composer dans Gmail</span>
        </button>
      )}

      {contact.phone && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl font-bold transition"
        >
          <MessageSquare className="w-3.5 h-3.5 text-green-600" />
          <span>WhatsApp Web</span>
        </a>
      )}

      {contact.phone && (
        <a
          href={`tel:${contact.phone}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl font-semibold transition"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>{contact.phone}</span>
        </a>
      )}

      {fullAddress && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl font-semibold transition"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Itinéraire Maps / Waze</span>
        </a>
      )}

      <button
        type="button"
        onClick={() => downloadVCard(contact)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl font-semibold transition cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-gray-500" />
        <span>vCard (.vcf)</span>
      </button>
    </div>
  );
}
