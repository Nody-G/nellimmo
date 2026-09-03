'use client';

import React from 'react';
import { PropertyType } from '@/lib/types';
import { Home, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StepLocationProps {
  title: string;
  onTitleChange: (val: string) => void;
  propertyType: PropertyType;
  onPropertyTypeChange: (val: PropertyType) => void;
  address: string;
  onAddressChange: (val: string) => void;
  postalCode: string;
  onPostalCodeChange: (val: string) => void;
  city: string;
  onCityChange: (val: string) => void;
}

const LOCAL_CITIES = [
  { name: 'Pélissanne', cp: '13330' },
  { name: 'Salon-de-Provence', cp: '13300' },
  { name: 'Lançon-Provence', cp: '13680' },
  { name: 'La Barben', cp: '13330' },
  { name: 'Aurons', cp: '13121' },
  { name: 'Vernègues', cp: '13116' },
  { name: 'Alleins', cp: '13980' },
  { name: 'Grans', cp: '13450' },
  { name: 'Mallemort', cp: '13370' },
  { name: 'Lambesc', cp: '13410' },
  { name: 'Éguilles', cp: '13510' },
  { name: 'Sénas', cp: '13560' }
];

export const StepLocation: React.FC<StepLocationProps> = ({
  title,
  onTitleChange,
  propertyType,
  onPropertyTypeChange,
  address,
  onAddressChange,
  postalCode,
  onPostalCodeChange,
  city,
  onCityChange
}) => {
  return (
    <Card id="step-location">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E12B7B]" />
          <span>2. Localisation & Titre de l&apos;Annonce</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Titre accrocheur du mandat *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Superbe villa contemporaine 5 pièces avec piscine au calme absolu"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-2">
            Typologie du bien immobilier *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'maison', label: 'Maison / Villa' },
              { id: 'appartement', label: 'Appartement' },
              { id: 'terrain', label: 'Terrain à bâtir' },
              { id: 'immeuble', label: 'Immeuble' },
              { id: 'local_commercial', label: 'Local commercial' }
            ].map((pt) => (
              <button
                type="button"
                key={pt.id}
                onClick={() => onPropertyTypeChange(pt.id as PropertyType)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                  propertyType === pt.id
                    ? 'border-[#E12B7B] bg-[#E12B7B] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick select city of Pays Salonais */}
        <div>
          <label className="text-[11px] font-semibold text-gray-500 block mb-1">
            Sélection rapide commune (Provence & Pays Salonais) :
          </label>
          <div className="flex flex-wrap gap-1.5">
            {LOCAL_CITIES.map((c) => (
              <button
                type="button"
                key={c.name}
                onClick={() => {
                  onCityChange(c.name);
                  onPostalCodeChange(c.cp);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                  city === c.name
                    ? 'bg-[#131B26] text-white border-[#131B26]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-gray-500 block mb-1">
              Adresse ou secteur du bien *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Quartier Saint-Pierre, Chemin des Espérels"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 block mb-1">
              Code Postal
            </label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => onPostalCodeChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
