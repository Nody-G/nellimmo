'use client';

import React from 'react';
import Image from 'next/image';
import { Printer } from 'lucide-react';
import { Buyer, Property } from '@/lib/types';
import { calculateMatchingScore, formatMandateRef } from '@/lib/hoguet';

interface BuyerSelectionPrintSheetProps {
  buyer: Buyer;
  selectedProperties: Property[];
  origin: string;
  onPrint: () => void;
}

export function BuyerSelectionPrintSheet({
  buyer,
  selectedProperties,
  origin,
  onPrint,
}: BuyerSelectionPrintSheetProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-3">
      <div className="border border-gray-300 rounded-2xl p-5 bg-white shadow-xs max-h-[380px] overflow-y-auto space-y-4 print:p-0 print:border-none">
        {/* Agency Header */}
        <div className="border-b-2 border-[#C59A45] pb-3 flex items-center justify-between">
          <div>
            <span className="font-serif font-black text-xl text-[#131B26] tracking-tight block">
              SASU NELL’IMMO
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C59A45] block">
              Sélection Exclusive de Biens Immobiliers • Pays Salonais & Provence
            </span>
            <span className="text-[9px] text-gray-400 block mt-0.5">
              Carte T CPI 1310 2019 000 042 974 • Garantie GALIAN 120 000 € • RCS Salon B 849 712 345
            </span>
          </div>
          <div className="text-right text-[10px] text-gray-500">
            <span className="font-bold text-gray-900 block text-xs">
              Acquéreur : {buyer.first_name} {buyer.last_name}
            </span>
            <span>Budget cible : {buyer.budget_max.toLocaleString('fr-FR')} € FAI</span>
            <span className="block text-[9px] text-gray-400">
              Édité le {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Property Cards */}
        <div className="space-y-3">
          {selectedProperties.map((p) => {
            const matchScore = calculateMatchingScore(p, buyer).score;
            return (
              <div
                key={p.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex gap-3 text-xs"
              >
                <div className="w-28 h-22 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                  <Image
                    src={
                      p.images?.[0]?.image_url ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
                    }
                    alt={p.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-gray-400 block">
                        {formatMandateRef(p.mandate_number)}
                      </span>
                      <h4 className="font-bold text-xs text-gray-900 truncate">{p.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-black text-sm text-[#E12B7B] block">
                        {p.price_fai.toLocaleString('fr-FR')} € FAI
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {matchScore}% match
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    {p.city} • {p.living_area} m² habitables • {p.rooms_count} pièces ({p.bedrooms_count} ch.)
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-semibold text-gray-500">
                    {p.land_area ? (
                      <span className="bg-white px-1.5 py-0.5 rounded border">Terrain {p.land_area} m²</span>
                    ) : null}
                    <span className="bg-white px-1.5 py-0.5 rounded border">DPE : {p.dpe_letter || 'C'}</span>
                    <span className="bg-white px-1.5 py-0.5 rounded border text-[#E12B7B]">
                      Fiche web : {origin}/biens/{p.id}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-2 text-[10px] text-gray-400 flex items-center justify-between">
          <span>Nelly Fernandez — Directrice d’Agence • 06 12 34 56 78 • contact@nellimmo.fr</span>
          <span className="font-mono text-[9px]">Document non contractuel • SASU Nell’Immo</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onPrint}
          className="w-full py-2.5 px-4 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#C59A45]" />
          <span>Imprimer la Fiche Sélection A4 / Exporter PDF</span>
        </button>
      </div>
    </div>
  );
}
