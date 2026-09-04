'use client';

import React from 'react';
import { Property } from '@/lib/types';
import { FileText } from 'lucide-react';
import { MandateTableRow } from './MandateTableRow';

interface MandatesCardsGridProps {
  properties: Property[];
}

export function MandatesCardsGrid({ properties }: MandatesCardsGridProps) {
  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-12 text-center text-gray-500 space-y-3">
        <FileText className="w-10 h-10 text-gray-300 mx-auto" />
        <h3 className="font-bold text-gray-700">Aucun mandat trouvé</h3>
        <p className="text-xs text-gray-500">
          Modifiez vos filtres de recherche ou créez un nouveau mandat.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FCFAF7] border-b border-[#F3E8EE] text-gray-600 font-bold uppercase text-[10px]">
              <th className="p-4">N° Mandat</th>
              <th className="p-4">Bien & Titre</th>
              <th className="p-4">Vendeur (Mandant)</th>
              <th className="p-4">Prix FAI (Loi ALUR)</th>
              <th className="p-4">Type / Dates</th>
              <th className="p-4">Diagnostics</th>
              <th className="p-4">Canaux</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <MandateTableRow key={property.id} property={property} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
