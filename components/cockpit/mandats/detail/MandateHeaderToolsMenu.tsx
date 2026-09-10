'use client';

import React from 'react';
import Link from 'next/link';
import {
  Printer,
  TrendingDown,
  Share2,
  FileBarChart,
  Edit,
  ExternalLink,
} from 'lucide-react';
import type { Property } from '@/lib/types';

interface MandateHeaderToolsMenuProps {
  property: Property;
  onClose: () => void;
  onOpenContractModal: () => void;
  onOpenAvenantModal: () => void;
  onOpenShareModal: () => void;
  onOpenWeeklyDigestModal: () => void;
}

export function MandateHeaderToolsMenu({
  property,
  onClose,
  onOpenContractModal,
  onOpenAvenantModal,
  onOpenShareModal,
  onOpenWeeklyDigestModal,
}: MandateHeaderToolsMenuProps) {
  return (
    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 space-y-1 text-xs animate-fade-in">
      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenContractModal();
        }}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700 transition"
      >
        <Printer className="w-3.5 h-3.5 text-gray-400" />
        <span>Contrat A4 Imprimable</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenAvenantModal();
        }}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700 transition"
      >
        <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
        <span>Avenant Baisse de Prix</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenShareModal();
        }}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700 transition"
      >
        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Partager fiche WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenWeeklyDigestModal();
        }}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700 transition"
      >
        <FileBarChart className="w-3.5 h-3.5 text-[#C59A45]" />
        <span>Point Hebdo Vendeur</span>
      </button>

      <div className="border-t border-gray-100 my-1" />

      <Link
        href={`/cockpit/mandats/${property.id}/edit`}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700 transition"
      >
        <Edit className="w-3.5 h-3.5 text-gray-400" />
        <span>Modifier la fiche</span>
      </Link>

      <Link
        href={`/biens/${property.id}`}
        target="_blank"
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700 transition"
      >
        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        <span>Voir sur le site vitrine</span>
      </Link>
    </div>
  );
}
