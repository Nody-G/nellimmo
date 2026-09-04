'use client';

import React from 'react';
import { Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StepFeaturesSurfaces, StepFeaturesTags } from './features';

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
  onFeaturesInputChange,
}) => {
  return (
    <Card id="step-features">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-4 h-4 text-[#E12B7B]" />
          <span>4. Caractéristiques & Prestations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StepFeaturesSurfaces
          livingArea={livingArea}
          onLivingAreaChange={onLivingAreaChange}
          carrezArea={carrezArea}
          onCarrezAreaChange={onCarrezAreaChange}
          landArea={landArea}
          onLandAreaChange={onLandAreaChange}
          roomsCount={roomsCount}
          onRoomsCountChange={onRoomsCountChange}
          bedroomsCount={bedroomsCount}
          onBedroomsCountChange={onBedroomsCountChange}
          bathroomsCount={bathroomsCount}
          onBathroomsCountChange={onBathroomsCountChange}
        />

        <StepFeaturesTags
          featuresInput={featuresInput}
          onFeaturesInputChange={onFeaturesInputChange}
        />
      </CardContent>
    </Card>
  );
};
