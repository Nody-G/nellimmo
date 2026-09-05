'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { ContactItem } from '@/lib/types';

interface ContactProfileTabProps {
  contact: ContactItem;
}

export function ContactProfileTab({ contact }: ContactProfileTabProps) {
  const fullAddress = [contact.address, contact.postal_code, contact.city]
    .filter(Boolean)
    .join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress || contact.city || ''
  )}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-100 space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Identité &amp; Statut
          </span>
          <div className="font-semibold text-gray-900">
            {contact.first_name} {contact.last_name}
          </div>
          <div className="text-gray-600">
            Société : {contact.company || 'Particulier'}
          </div>
          <div className="text-gray-600">
            Spécialité : {contact.specialty || '—'}
          </div>
          {contact.siret && (
            <div className="text-gray-600 font-mono">
              SIRET : {contact.siret}
            </div>
          )}
        </div>

        <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-100 space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Coordonnées
          </span>
          <div>
            Tél mobile :{' '}
            <a
              href={`tel:${contact.phone}`}
              className="font-bold text-gray-900 hover:text-[#E12B7B]"
            >
              {contact.phone || '—'}
            </a>
          </div>
          {contact.secondary_phone && (
            <div>Tél fixe : {contact.secondary_phone}</div>
          )}
          <div>
            Email :{' '}
            <span className="font-medium text-gray-900">
              {contact.email || '—'}
            </span>
          </div>
          {contact.secondary_email && (
            <div>Email 2 : {contact.secondary_email}</div>
          )}
        </div>
      </div>

      {fullAddress && (
        <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Adresse postale
            </span>
            <div className="font-medium text-gray-900 mt-0.5">{fullAddress}</div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-bold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>
        </div>
      )}

      {contact.notes && (
        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            Notes internes &amp; Directives
          </span>
          <p className="text-gray-800 whitespace-pre-line mt-1">
            {contact.notes}
          </p>
        </div>
      )}

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Tags :
          </span>
          {contact.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold text-[10px]"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
