'use client';

import React from 'react';
import { Home } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';
import type { Property } from '@/lib/types';

interface ReportPropertyPickerProps {
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (propertyId: string) => void;
  currentProperty: Property | undefined;
  reportPeriod: 'hebdomadaire' | 'mensuel' | 'bilan_30_jours';
  onChangeReportPeriod: (period: 'hebdomadaire' | 'mensuel' | 'bilan_30_jours') => void;
}

export const ReportPropertyPicker: React.FC<ReportPropertyPickerProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  currentProperty,
  reportPeriod,
  onChangeReportPeriod
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-[#E12B7B]" />
          <h3 className="font-serif font-bold text-base text-[#131B26]">
            1. Sélection du Mandat Vendeur & Paramètres d’Activité
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => onChangeReportPeriod('hebdomadaire')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              reportPeriod === 'hebdomadaire' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600'
            }`}
          >
            Hebdomadaire
          </button>
          <button
            type="button"
            onClick={() => onChangeReportPeriod('mensuel')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              reportPeriod === 'mensuel' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600'
            }`}
          >
            Mensuel
          </button>
          <button
            type="button"
            onClick={() => onChangeReportPeriod('bilan_30_jours')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              reportPeriod === 'bilan_30_jours' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600'
            }`}
          >
            Bilan 30 Jours
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2">
          <label className="block font-bold uppercase text-gray-700 mb-1">Mandat Actif en Portefeuille</label>
          <select
            value={selectedPropertyId}
            onChange={(e) => onSelectProperty(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-[#E12B7B]"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {formatMandateRef(p.mandate_number)} - {p.title} ({p.city}) — Vendeur: {p.seller_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone Vendeur WhatsApp</label>
          <input
            type="text"
            readOnly
            value={currentProperty?.seller_phone || ''}
            className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl font-mono font-bold text-gray-700"
          />
        </div>
      </div>
    </>
  );
};
