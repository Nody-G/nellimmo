'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Ruler, Map, Globe, Maximize2 } from 'lucide-react';
import { CadastreParcel, generateSvgGeometryWithPoints, getGeoportailEmbedUrl } from '@/lib/cadastre';
import { ParcelArpenteurSvg } from './ParcelArpenteurSvg';

const InteractiveParcelMap = dynamic(
  () => import('./InteractiveParcelMap').then((mod) => mod.InteractiveParcelMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[280px] bg-[#0c131d] flex flex-col items-center justify-center text-teal-400 text-xs font-mono gap-2">
        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span>Chargement de la navigation cartographique HD...</span>
      </div>
    ),
  }
);

interface ParcelMapViewerProps {
  parcel: CadastreParcel;
  onOpenInspector: () => void;
  className?: string;
  height?: number;
}

type ViewMode = 'satellite' | 'arpenteur' | 'ign';

export function ParcelMapViewer({
  parcel,
  onOpenInspector,
  className = '',
  height = 300,
}: ParcelMapViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('satellite');

  const geom = parcel.polygon
    ? generateSvgGeometryWithPoints(parcel.polygon, 380, 240, 32)
    : null;

  const ignEmbedUrl = getGeoportailEmbedUrl(parcel.coordinates.lon, parcel.coordinates.lat);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#F3E8EE] bg-[#0E1520] ${className}`}>
      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-[#131B26]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'satellite' ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Carte & Satellite HD</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('arpenteur')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'arpenteur' ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plan Arpenteur</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ign')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'ign' ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">IGN Officiel</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenInspector}
          title="Ouvrir le grand studio d’inspection foncière"
          className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 hover:border-teal-500 text-xs font-bold transition shadow-lg cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Grand Studio</span>
        </button>
      </div>

      {/* Viewer Canvas */}
      <div style={{ height: `${height}px` }} className="w-full relative flex items-center justify-center">
        {viewMode === 'satellite' && (
          <InteractiveParcelMap
            parcel={parcel}
            onOpenInspector={onOpenInspector}
            height={height}
          />
        )}

        {viewMode === 'arpenteur' && <ParcelArpenteurSvg geom={geom} />}

        {viewMode === 'ign' && (
          <iframe
            title="Géoportail IGN Cadastre Live"
            src={ignEmbedUrl}
            className="w-full h-full border-0 relative z-10"
            loading="lazy"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
