'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, Buyer, VisitSheet } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { Printer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PrintableVisitData } from './PrintableVisitModal';

interface VisitRegisterTableProps {
  visits: VisitSheet[];
  properties: Property[];
  buyers: Buyer[];
  onSelectVisitToPrint: (data: PrintableVisitData) => void;
}

export const VisitRegisterTable: React.FC<VisitRegisterTableProps> = ({
  visits,
  properties,
  buyers,
  onSelectVisitToPrint
}) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-base text-[#131B26]">
          Bons de Visite ({visits.length})
        </h3>
        <span className="text-xs font-sans font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-0.5 rounded-full">
          Horodatés
        </span>
      </div>

      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
        {visits.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-6 text-center">
            Aucun bon de visite enregistré.
          </p>
        ) : (
          visits.map((v) => {
            const prop = properties.find((p) => p.id === v.property_id);
            const buyer = buyers.find((b) => b.id === v.buyer_id);

            return (
              <div
                key={v.id}
                className="p-3.5 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-2 text-xs hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {buyer?.first_name} {buyer?.last_name}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(v.visit_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {prop ? (
                  <Link
                    href={`/cockpit/mandats/${prop.id}`}
                    className="text-[11px] font-semibold text-[#E12B7B] hover:underline block truncate"
                  >
                    {formatMandateRef(prop.mandate_number)} - {prop.title} ({prop.city})
                  </Link>
                ) : (
                  <span className="text-[11px] text-gray-500 block truncate">Bien visité</span>
                )}

                {v.notes && (
                  <p className="text-[10px] text-gray-600 line-clamp-2 italic">{v.notes}</p>
                )}

                {v.signature_data_url && (
                  <div className="h-10 bg-white rounded border border-gray-200 p-1 flex items-center justify-center relative">
                    <div className="relative w-full h-full">
                      <Image
                        src={v.signature_data_url}
                        alt="Signature"
                        fill
                        sizes="160px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectVisitToPrint({
                        property: prop,
                        buyer: buyer,
                        visit_date: v.visit_date,
                        signature_data_url: v.signature_data_url,
                        notes: v.notes,
                        hash: 'sha256-bv-' + v.id.slice(0, 8) + '-certifie'
                      })
                    }
                    className="text-[10px] text-[#C59A45] hover:text-[#131B26] font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Bon de Visite Officiel</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
