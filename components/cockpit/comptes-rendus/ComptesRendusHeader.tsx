'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck2, ExternalLink, Printer } from 'lucide-react';
import type { Property } from '@/lib/types';

interface ComptesRendusHeaderProps {
  currentProperty: Property | undefined;
}

export function ComptesRendusHeader({ currentProperty }: ComptesRendusHeaderProps) {
  const sellerToken = currentProperty?.seller_token || currentProperty?.id || 'prop-227';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4 print:hidden">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <FileCheck2 className="w-4 h-4" />
          <span>Transparence Totale & Fidélisation Vendeur</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Comptes-Rendus Vendeurs & Bilan d’Activité
        </h1>
        <p className="text-xs text-gray-500">
          Rapports de visibilité portails, synthèses des visites et transmission directe sur WhatsApp pour verrouiller l’exclusivité.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/espace-vendeur/${sellerToken}`}
          target="_blank"
          className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
        >
          <ExternalLink className="w-4 h-4 text-[#C59A45]" />
          <span>Ouvrir l’Espace Vendeur en Ligne</span>
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-2xs"
        >
          <Printer className="w-4 h-4 text-[#C59A45]" />
          <span>Imprimer le Bilan</span>
        </button>
      </div>
    </div>
  );
}
