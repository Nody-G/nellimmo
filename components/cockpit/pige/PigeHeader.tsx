'use client';

import { Radar, PlusCircle, FileUp, ScanText } from 'lucide-react';

interface PigeHeaderProps {
  onNewLead: () => void;
  onImport: () => void;
  onScanner?: () => void;
}

/** Page header with the "Scanner Express", "Ajouter une Annonce Pige" and "Importer CSV" actions. */
export function PigeHeader({ onNewLead, onImport, onScanner = () => {} }: PigeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <Radar className="w-4 h-4" />
          <span>Radar PAP & Prospection Terrain</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Pige Immobilière & Détection Vendeurs
        </h1>
        <p className="text-xs text-gray-500">
          Veille Leboncoin/PAP, repère €/m² indicatif, sparring-partner d{"\u2019"}objections et conversion en mandat en 1 clic.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onScanner}
          className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs transition cursor-pointer"
        >
          <ScanText className="w-4 h-4 text-amber-600" />
          <span>Scanner Express DVF</span>
        </button>

        <button
          type="button"
          onClick={onImport}
          className="px-4 py-2.5 bg-white hover:bg-gray-50 text-[#131B26] border border-[#F3E8EE] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs transition cursor-pointer"
        >
          <FileUp className="w-4 h-4 text-gray-500" />
          <span>Importer CSV</span>
        </button>

        <button
          type="button"
          onClick={onNewLead}
          className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  );
}
