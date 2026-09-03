'use client';

import React from 'react';
import { Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface StepFeaturesProps {
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
  featuresInput: string;
  onFeaturesInputChange: (val: string) => void;
}

const COMMON_FEATURES = [
  'Piscine',
  'Climatisation réversible',
  'Garage',
  'Terrasse',
  'Vue dégagée',
  'Plain-pied',
  'Cuisine équipée',
  'Jardin arboré',
  'Double vitrage',
  'Panneaux solaires',
  'Calme absolu',
  'Forage / Puits'
];

export const StepFeatures: React.FC<StepFeaturesProps> = ({
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
  featuresInput,
  onFeaturesInputChange
}) => {
  const toggleFeature = (feature: string) => {
    const list = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    if (list.includes(feature)) {
      onFeaturesInputChange(list.filter((f) => f !== feature).join(', '));
    } else {
      onFeaturesInputChange([...list, feature].join(', '));
    }
  };

  const activeFeatures = featuresInput
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);

  return (
    <Card id="step-features">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-4 h-4 text-[#E12B7B]" />
          <span>4. Caractéristiques & Prestations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {/* Features Tags */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Prestations & Équipements (séparés par des virgules)
          </label>
          <input
            type="text"
            placeholder="Piscine, Climatisation, Garage, Terrasse, Vue dégagée..."
            value={featuresInput}
            onChange={(e) => onFeaturesInputChange(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B] mb-2"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_FEATURES.map((f) => {
              const isSelected = activeFeatures.includes(f);
              return (
                <button
                  type="button"
                  key={f}
                  onClick={() => toggleFeature(f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#E12B7B] text-white border-[#E12B7B]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
