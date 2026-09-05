'use client';

import React from 'react';

interface ContactIdentityFieldsProps {
  civility: 'M' | 'Mme' | 'M_Mme' | 'Societe' | '';
  firstName: string;
  lastName: string;
  onCivilityChange: (civility: 'M' | 'Mme' | 'M_Mme' | 'Societe') => void;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
}

export function ContactIdentityFields({
  civility,
  firstName,
  lastName,
  onCivilityChange,
  onFirstNameChange,
  onLastNameChange,
}: ContactIdentityFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Civilité
        </label>
        <select
          value={civility}
          onChange={(e) =>
            onCivilityChange(e.target.value as 'M' | 'Mme' | 'M_Mme' | 'Societe')
          }
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
        >
          <option value="M">M.</option>
          <option value="Mme">Mme</option>
          <option value="M_Mme">M. &amp; Mme</option>
          <option value="Societe">Société</option>
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Prénom *
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Ex: Jean-Luc"
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-semibold"
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Nom / Enseigne *
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Ex: Faure"
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-semibold"
          required
        />
      </div>
    </div>
  );
}
