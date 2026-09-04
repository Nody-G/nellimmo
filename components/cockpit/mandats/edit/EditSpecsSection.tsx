'use client';

import React from 'react';

interface EditSpecsSectionProps {
  livingArea: number;
  onLivingAreaChange: (val: number) => void;
  carrezArea: number;
  onCarrezAreaChange: (val: number) => void;
  landArea: number;
  onLandAreaChange: (val: number) => void;
  roomsCount: number;
  onRoomsCountChange: (val: number) => void;
  bedroomsCount: number;
  onBedroomsCountChange: (val: number) => void;
  featuresInput: string;
  onFeaturesInputChange: (val: string) => void;
}

export function EditSpecsSection({
  livingArea,
  onLivingAreaChange,
  carrezArea,
  onCarrezAreaChange,
  landArea,
  onLandAreaChange,
  roomsCount,
  onRoomsCountChange,
  bedroomsCount,
  onBedroomsCountChange,
  featuresInput,
  onFeaturesInputChange,
}: EditSpecsSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
      <h3 className="font-serif font-bold text-lg text-[#131B26]">Surfaces & Caractéristiques</h3>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Hab. (m²)</label>
          <input
            type="number"
            required
            value={livingArea}
            onChange={(e) => onLivingAreaChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Loi Carrez (m²)</label>
          <input
            type="number"
            value={carrezArea}
            onChange={(e) => onCarrezAreaChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Terrain (m²)</label>
          <input
            type="number"
            value={landArea}
            onChange={(e) => onLandAreaChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Pièces</label>
          <input
            type="number"
            required
            value={roomsCount}
            onChange={(e) => onRoomsCountChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Chambres</label>
          <input
            type="number"
            required
            value={bedroomsCount}
            onChange={(e) => onBedroomsCountChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
          Équipements & Prestations (séparés par des virgules)
        </label>
        <input
          type="text"
          value={featuresInput}
          onChange={(e) => onFeaturesInputChange(e.target.value)}
          placeholder="Piscine, Climatisation, Garage, Terrasse, Vue dégagée"
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        />
      </div>
    </div>
  );
}
