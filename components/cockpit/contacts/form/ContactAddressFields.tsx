'use client';

import React from 'react';

interface ContactAddressFieldsProps {
  address: string;
  postalCode: string;
  city: string;
  notes: string;
  onAddressChange: (address: string) => void;
  onPostalCodeChange: (postalCode: string) => void;
  onCityChange: (city: string) => void;
  onNotesChange: (notes: string) => void;
}

export function ContactAddressFields({
  address,
  postalCode,
  city,
  notes,
  onAddressChange,
  onPostalCodeChange,
  onCityChange,
  onNotesChange,
}: ContactAddressFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Adresse
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Rue, numéro, ZA..."
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Code postal
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            placeholder="13330"
            className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Ville
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Pélissanne / Salon-de-Provence..."
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Notes internes &amp; Historique
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Disponibilités, particularités, consignes spéciales..."
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-medium resize-none h-20"
        />
      </div>
    </div>
  );
}
