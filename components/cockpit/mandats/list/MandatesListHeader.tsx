'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, PlusCircle, Download, FileSpreadsheet } from 'lucide-react';

interface MandatesListHeaderProps {
  onExportCsv: () => void;
}

export function MandatesListHeader({ onExportCsv }: MandatesListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <FileText className="w-4 h-4" />
          <span>Registre des Mandats</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Gestion des Mandats & Biens
        </h1>
        <p className="text-xs text-gray-500">
          Consultez et gérez l’ensemble de vos mandats en cours et archivés.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={onExportCsv}
          className="px-3.5 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          title="Exporter la sélection en CSV Excel"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export CSV</span>
        </button>
        <Link
          href="/cockpit/registre-dgccrf"
          className="px-3.5 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>DGCCRF</span>
        </Link>
        <Link
          href="/cockpit/mandats/nouveau"
          className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nouveau Mandat</span>
        </Link>
      </div>
    </div>
  );
}
