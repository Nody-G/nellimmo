'use client';

import React from 'react';

interface StepFeaturesSurfacesProps {
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
  bathroomsCount: number;
  onBathroomsCountChange: (val: number) => void;
}

export function StepFeaturesSurfaces({
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
  bathroomsCount,
  onBathroomsCountChange,
}: StepFeaturesSurfacesProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Surface Habitable (m²) *
          </label>
          <input
            type="number"
            min={1}
            required
            value={livingArea}
            onChange={(e) => {
              const val = Number(e.target.value);
              onLivingAreaChange(val);
              if (carrezArea === 0 || carrezArea === livingArea) {
                onCarrezAreaChange(val);
              }
            }}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Surface Loi Carrez (m²)
          </label>
          <input
            type="number"
            min={0}
            value={carrezArea}
            onChange={(e) => onCarrezAreaChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Surface du Terrain (m²)
          </label>
          <input
            type="number"
            min={0}
            value={landArea}
            onChange={(e) => onLandAreaChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Nombre de pièces *
          </label>
          <input
            type="number"
            min={1}
            required
            value={roomsCount}
            onChange={(e) => onRoomsCountChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Nombre de chambres *
          </label>
          <input
            type="number"
            min={0}
            required
            value={bedroomsCount}
            onChange={(e) => onBedroomsCountChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Salles de bain / d&apos;eau
          </label>
          <input
            type="number"
            min={0}
            value={bathroomsCount}
            onChange={(e) => onBathroomsCountChange(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>
    </>
  );
}
