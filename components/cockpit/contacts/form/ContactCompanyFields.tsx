'use client';

import React from 'react';

interface ContactCompanyFieldsProps {
  company: string;
  specialty: string;
  siret: string;
  website: string;
  onCompanyChange: (company: string) => void;
  onSpecialtyChange: (specialty: string) => void;
  onSiretChange: (siret: string) => void;
  onWebsiteChange: (website: string) => void;
}

export function ContactCompanyFields({
  company,
  specialty,
  siret,
  website,
  onCompanyChange,
  onSpecialtyChange,
  onSiretChange,
  onWebsiteChange,
}: ContactCompanyFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Société / Étude
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => onCompanyChange(e.target.value)}
            placeholder="Ex: SCP Notaires du Pays Salonais"
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Spécialité / Fonction
          </label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            placeholder="Ex: Notaire associé / Rénovation"
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Numéro SIRET (optionnel)
          </label>
          <input
            type="text"
            value={siret}
            onChange={(e) => onSiretChange(e.target.value)}
            placeholder="14 chiffres"
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-mono text-[11px]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Site web
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            placeholder="https://..."
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium text-[11px]"
          />
        </div>
      </div>
    </div>
  );
}
