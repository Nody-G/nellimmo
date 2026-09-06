'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import { FileText } from 'lucide-react';
import { MandateTableRow } from './MandateTableRow';
import { PropertyShareModal } from '../PropertyShareModal';
import { SortableColumnHeader } from '../../common/SortableColumnHeader';
import type { MandatesSortOption } from './MandatesFilterBar';

interface MandatesTableViewProps {
  properties: Property[];
  sortBy?: MandatesSortOption;
  onSortChange?: (newSort: MandatesSortOption) => void;
}

export function MandatesTableView({
  properties,
  sortBy = 'recent',
  onSortChange,
}: MandatesTableViewProps) {
  const [shareProperty, setShareProperty] = useState<Property | null>(null);

  const handleSort = (option: MandatesSortOption) => {
    if (onSortChange) onSortChange(option);
  };

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
    <>
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FCFAF7] border-b border-[#F3E8EE] text-gray-600 font-bold uppercase text-[10px]">
                <th className="p-4">
                  <SortableColumnHeader
                    label="N° Mandat"
                    active={sortBy === 'ref_desc' || sortBy === 'ref_asc'}
                    direction={sortBy === 'ref_asc' ? 'asc' : 'desc'}
                    onClick={() => handleSort(sortBy === 'ref_desc' ? 'ref_asc' : 'ref_desc')}
                  />
                </th>
                <th className="p-4">
                  <SortableColumnHeader
                    label="Bien & Titre"
                    active={sortBy === 'title_asc' || sortBy === 'title_desc' || sortBy === 'city_asc' || sortBy === 'city_desc'}
                    direction={sortBy === 'title_desc' || sortBy === 'city_desc' ? 'desc' : 'asc'}
                    onClick={() => handleSort(sortBy === 'title_asc' ? 'title_desc' : 'title_asc')}
                  />
                </th>
                <th className="p-4">
                  <SortableColumnHeader
                    label="Vendeur (Mandant)"
                    active={sortBy === 'seller_asc' || sortBy === 'seller_desc'}
                    direction={sortBy === 'seller_desc' ? 'desc' : 'asc'}
                    onClick={() => handleSort(sortBy === 'seller_asc' ? 'seller_desc' : 'seller_asc')}
                  />
                </th>
                <th className="p-4">
                  <SortableColumnHeader
                    label="Prix FAI (Loi ALUR)"
                    active={sortBy === 'price_desc' || sortBy === 'price_asc'}
                    direction={sortBy === 'price_asc' ? 'asc' : 'desc'}
                    onClick={() => handleSort(sortBy === 'price_desc' ? 'price_asc' : 'price_desc')}
                  />
                </th>
                <th className="p-4">
                  <SortableColumnHeader
                    label="Type / Dates"
                    active={sortBy === 'recent' || sortBy === 'oldest'}
                    direction={sortBy === 'oldest' ? 'asc' : 'desc'}
                    onClick={() => handleSort(sortBy === 'recent' ? 'oldest' : 'recent')}
                  />
                </th>
                <th className="p-4">Diagnostics</th>
                <th className="p-4">Canaux</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((property) => (
                <MandateTableRow
                  key={property.id}
                  property={property}
                  onShare={(p) => setShareProperty(p)}
                />
              ))}
            </tbody>
          </table>
        </div>
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
