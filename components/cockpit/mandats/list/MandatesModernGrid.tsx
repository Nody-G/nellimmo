'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { MandatePropertyCard } from './MandatePropertyCard';
import { PropertyShareModal } from '../PropertyShareModal';

interface MandatesModernGridProps {
  properties: Property[];
  showRanking?: boolean;
}

export function MandatesModernGrid({
  properties,
  showRanking = true,
}: MandatesModernGridProps) {
  const [shareProperty, setShareProperty] = useState<Property | null>(null);

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-16 text-center text-gray-500 space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#FCFAF7] border border-[#F3E8EE] flex items-center justify-center mx-auto text-[#E12B7B]">
          <FileText className="w-8 h-8 text-gray-300" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-gray-800 text-base">Aucun mandat trouvé</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Modifiez vos critères de recherche ou vos filtres pour voir les mandats correspondants.
          </p>
        </div>
        <Link
          href="/cockpit/mandats/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un nouveau mandat</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {properties.map((property, idx) => (
          <MandatePropertyCard
            key={property.id}
            property={property}
            rankIndex={showRanking ? idx + 1 : undefined}
            onShare={(p) => setShareProperty(p)}
          />
        ))}
      </div>

      {shareProperty && (
        <PropertyShareModal
          isOpen={!!shareProperty}
          onClose={() => setShareProperty(null)}
          property={shareProperty}
        />
      )}
    </>
  );
}
