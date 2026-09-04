'use client';

import React from 'react';
import { Handshake, PlusCircle } from 'lucide-react';

interface InterAgencesHeaderProps {
  onOpenNewDelegation: () => void;
}

export function InterAgencesHeader({ onOpenNewDelegation }: InterAgencesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <Handshake className="w-4 h-4" />
          <span>Fichier Commun & Partage Confrères (L’Alternative Supérieure à Interkab)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Bourse Inter-Agences & Délégations de Mandats
        </h1>
        <p className="text-xs text-gray-500">
          Déléguez vos mandats exclusifs en toute sécurité juridique (Loi Hoguet Art. 65 & 77) avec répartition claire des honoraires 50/50.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onOpenNewDelegation}
          className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nouvelle Convention de Délégation</span>
        </button>
      </div>
    </div>
  );
}
