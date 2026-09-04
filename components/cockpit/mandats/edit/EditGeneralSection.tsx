'use client';

import React from 'react';
import { MandateType, PropertyStatus } from '@/lib/types';

interface EditGeneralSectionProps {
  title: string;
  onTitleChange: (title: string) => void;
  mandateType: MandateType;
  onMandateTypeChange: (type: MandateType) => void;
  status: PropertyStatus;
  onStatusChange: (status: PropertyStatus) => void;
}

export function EditGeneralSection({
  title,
  onTitleChange,
  mandateType,
  onMandateTypeChange,
  status,
  onStatusChange,
}: EditGeneralSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
      <h3 className="font-serif font-bold text-lg text-[#131B26]">Général & Statut</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Titre de l&apos;annonce</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type de mandat</label>
          <select
            value={mandateType}
            onChange={(e) => onMandateTypeChange(e.target.value as MandateType)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E12B7B] focus:outline-[#E12B7B]"
          >
            <option value="exclusif">Mandat Exclusif</option>
            <option value="simple">Mandat Simple</option>
            <option value="semi-exclusif">Mandat Semi-Exclusif</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Statut</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as PropertyStatus)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-[#E12B7B]"
          >
            <option value="actif">Actif en vente</option>
            <option value="sous_compromis">Sous compromis</option>
            <option value="vendu">Vendu</option>
            <option value="archive">Archivé</option>
            <option value="resilie">Résilié</option>
          </select>
        </div>
      </div>
    </div>
  );
}
