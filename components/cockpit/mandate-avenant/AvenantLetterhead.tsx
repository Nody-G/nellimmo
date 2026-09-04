'use client';

import React from 'react';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface AvenantLetterheadProps {
  property: Property;
  avenantNumber: number;
}

export function AvenantLetterhead({ property, avenantNumber }: AvenantLetterheadProps) {
  return (
    <>
      {/* Letterhead */}
      <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
        <div>
          <h2 className="text-lg font-serif font-black tracking-tight text-[#131B26]">
            SASU NELL{"\u2019"}IMMO
          </h2>
          <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">
            Agence Immobilière Transactionnelle • Pélissanne & Pays Salonais
          </span>
          <span className="text-[9px] text-gray-500 block">
            Siège social : 26 avenue des Enjouvènes, 13330 Pélissanne • RCS Salon-de-Provence B 853 807 006
          </span>
          <span className="text-[9px] text-gray-500 block">
            Carte Pro Transaction CPI 1310 2019 000 042 974 (CCI Marseille) • Garantie GALIAN 120 000 €
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 block">
            AVENANT N° {avenantNumber}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">
            Mandat Réf. : {formatMandateRef(property.mandate_number)}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center py-2 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="font-serif font-bold text-sm text-[#131B26] uppercase tracking-wider">
          AVENANT DE MODIFICATION AU MANDAT DE VENTE {property.mandate_type.toUpperCase()}
        </h3>
        <span className="text-[10px] text-gray-500">
          Établi en application du Décret n° 72-678 du 20 juillet 1972 (Loi Hoguet, Article 72)
        </span>
      </div>
    </>
  );
}
