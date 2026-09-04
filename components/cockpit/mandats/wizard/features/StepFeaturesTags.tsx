'use client';

import React from 'react';

interface StepFeaturesTagsProps {
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
  'Forage / Puits',
];

export function StepFeaturesTags({
  featuresInput,
  onFeaturesInputChange,
}: StepFeaturesTagsProps) {
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
  );
}
