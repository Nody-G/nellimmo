'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { CheckCircle2, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DpeBadge } from '@/components/ui/DpeBadge';
import { MandateFinancialCards } from './MandateFinancialCards';
import { MandateCadastreCard } from './MandateCadastreCard';

interface MandateOverviewTabProps {
  property: Property;
}

export const MandateOverviewTab: React.FC<MandateOverviewTabProps> = ({ property }) => {
  const { updateProperty } = useNellimoStore();

  const handleSaveCadastre = async (
    section: string,
    numero: string,
    surface: number,
    idu: string
  ) => {
    await updateProperty(property.id, {
      cadastral_section: section,
      cadastral_number: numero,
      cadastral_surface: surface,
      cadastral_id: idu,
    });
  };

  return (
    <div className="space-y-6">
      {/* Financials & Specs Cards */}
      <MandateFinancialCards property={property} />

      {/* Cadastre & IGN Geoportail Parcel Card */}
      <MandateCadastreCard property={property} onSaveCadastre={handleSaveCadastre} />

      {/* DPE & Diagnostic preview */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#131B26]">Diagnostic de Performance Énergétique (DPE)</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Consommation primaire et estimation des dépenses énergétiques annuelles
            </p>
          </div>
          <DpeBadge
            dpeLetter={property.dpe_letter}
            dpeValue={property.dpe_value}
            gesLetter={property.ges_letter}
            gesValue={property.ges_value}
            energyCostMin={property.energy_cost_min}
            energyCostMax={property.energy_cost_max}
            compact={false}
          />
        </div>
      </Card>

      {/* Description & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#131B26] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E12B7B]" />
              <span>Descriptif de l&apos;Annonce</span>
            </h3>
            <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
              {property.description}
            </div>
          </Card>

          {/* Photo Gallery */}
          {property.images && property.images.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-bold text-[#131B26] mb-3">
                Galerie Photos ({property.images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl overflow-hidden border border-gray-200 aspect-4/3 group"
                  >
                    <Image
                      src={img.image_url}
                      alt={`Photo ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {img.is_cover && (
                      <span className="absolute top-1.5 left-1.5 bg-[#E12B7B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                        Couverture
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Features Sidebar */}
        <div>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#131B26] mb-3">Prestations Clés</h3>
            <div className="flex flex-wrap gap-1.5">
              {property.features.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#E12B7B]" />
                  {f}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
