'use client';

import React from 'react';
import { CadastreParcel } from '@/lib/cadastre';
import { InteractiveParcelMap } from './InteractiveParcelMap';

interface ParcelMapViewerProps {
  parcel: CadastreParcel;
  onOpenInspector: () => void;
  className?: string;
  height?: number;
}

export function ParcelMapViewer({
  parcel,
  onOpenInspector,
  className = '',
  height = 320,
}: ParcelMapViewerProps) {
  return (
    <div className={`w-full ${className}`}>
      <InteractiveParcelMap
        parcel={parcel}
        onOpenInspector={onOpenInspector}
        height={height}
      />
    </div>
  );
}
