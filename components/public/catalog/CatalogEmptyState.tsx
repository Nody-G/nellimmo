'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface CatalogEmptyStateProps {
  onReset: () => void;
}

export function CatalogEmptyState({ onReset }: CatalogEmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-[#F3E8EE] space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center mx-auto">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="font-serif font-bold text-xl text-gray-900">
        Aucun bien ne correspond à ces critères
      </h3>
      <p className="text-gray-500 text-xs max-w-md mx-auto">
        Modifiez vos filtres ou contactez Nelly directement pour enregistrer votre recherche personnalisée dans notre CRM Acquéreurs.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 bg-[#131B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#E12B7B] transition cursor-pointer"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
