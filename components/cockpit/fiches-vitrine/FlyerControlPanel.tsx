'use client';

import React from 'react';
import type { Property } from '@/lib/types';
import type {
  ColorTheme,
  LayoutFormat,
  PhotoArrangement,
  QrDestination
} from './flyer-types';
import {
  FlyerLayoutColumn,
  FlyerThemeColumn,
  FlyerPhotoSlotColumn
} from './control-panel';

interface FlyerControlPanelProps {
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  flyerFormat: LayoutFormat;
  setFlyerFormat: (v: LayoutFormat) => void;
  photoArrangement: PhotoArrangement;
  setPhotoArrangement: (v: PhotoArrangement) => void;
  colorTheme: ColorTheme;
  setColorTheme: (v: ColorTheme) => void;
  showQrCode: boolean;
  setShowQrCode: (v: boolean) => void;
  qrDestination: QrDestination;
  setQrDestination: (v: QrDestination) => void;
  availableImages: NonNullable<Property['images']>;
  activeSlot: number;
  setActiveSlot: (v: number) => void;
  isGalleryOpen: boolean;
  setIsGalleryOpen: (v: boolean) => void;
  getPhotoUrl: (slotIndex: number) => string;
}

export function FlyerControlPanel({
  properties,
  selectedPropertyId,
  onSelectProperty,
  flyerFormat,
  setFlyerFormat,
  photoArrangement,
  setPhotoArrangement,
  colorTheme,
  setColorTheme,
  showQrCode,
  setShowQrCode,
  qrDestination,
  setQrDestination,
  availableImages,
  activeSlot,
  setActiveSlot,
  isGalleryOpen,
  setIsGalleryOpen,
  getPhotoUrl
}: FlyerControlPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
      <FlyerLayoutColumn
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={onSelectProperty}
        flyerFormat={flyerFormat}
        setFlyerFormat={setFlyerFormat}
        photoArrangement={photoArrangement}
        setPhotoArrangement={setPhotoArrangement}
      />

      <FlyerThemeColumn
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        showQrCode={showQrCode}
        setShowQrCode={setShowQrCode}
        qrDestination={qrDestination}
        setQrDestination={setQrDestination}
      />

      <FlyerPhotoSlotColumn
        availableImages={availableImages}
        activeSlot={activeSlot}
        setActiveSlot={setActiveSlot}
        isGalleryOpen={isGalleryOpen}
        setIsGalleryOpen={setIsGalleryOpen}
        getPhotoUrl={getPhotoUrl}
      />
    </div>
  );
}
