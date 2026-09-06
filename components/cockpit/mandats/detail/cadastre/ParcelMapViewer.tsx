'use client';

import React from 'react';
import { CadastreParcel } from '@/lib/cadastre';
import { InteractiveParcelMap } from './InteractiveParcelMap';

interface ParcelMapViewerProps {
  parcel: CadastreParcel;
  className?: string;
  height?: number | string;
}

export function ParcelMapViewer({
  parcel,
  className = '',
  height = 850,
}: ParcelMapViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <InteractiveParcelMap
        parcel={parcel}
        height={height}
      />
    </div>
  );
}
