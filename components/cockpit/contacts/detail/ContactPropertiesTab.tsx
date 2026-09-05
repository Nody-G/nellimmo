'use client';

import React from 'react';
import Link from 'next/link';
import type { Property } from '@/lib/types';

interface ContactPropertiesTabProps {
  linkedProps: Property[];
}

export function ContactPropertiesTab({ linkedProps }: ContactPropertiesTabProps) {
  if (linkedProps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-xs">
        Aucun bien immobilier ou mandat rattaché pour l’instant.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {linkedProps.map((p) => (
        <div
          key={p.id}
          className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-100 flex items-center justify-between hover:border-gray-300 transition"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#E12B7B]/10 text-[#E12B7B] rounded-md font-black text-[9px] uppercase">
                Mandat #{p.mandate_number}
              </span>
              <span className="font-bold text-gray-900">{p.title}</span>
            </div>
            <div className="text-gray-500 mt-1">
              {p.city} — {p.price_fai.toLocaleString('fr-FR')} € FAI — Statut : {p.status}
            </div>
          </div>
          <Link
            href={`/cockpit/mandats/${p.id}`}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-700 transition"
          >
            Ouvrir le mandat
          </Link>
        </div>
      ))}
    </div>
  );
}
