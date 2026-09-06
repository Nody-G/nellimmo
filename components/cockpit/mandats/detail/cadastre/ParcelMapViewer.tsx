'use client';

import React, { useState } from 'react';
import { Ruler, Satellite, Globe, Maximize2 } from 'lucide-react';
import { CadastreParcel, generateSvgGeometryWithPoints, getGeoportailEmbedUrl } from '@/lib/cadastre';
import { ParcelArpenteurSvg } from './ParcelArpenteurSvg';

interface ParcelMapViewerProps {
  parcel: CadastreParcel;
  onOpenInspector: () => void;
  className?: string;
  height?: number;
}

type ViewMode = 'arpenteur' | 'satellite' | 'ign';

export function ParcelMapViewer({
  parcel,
  onOpenInspector,
  className = '',
  height = 280,
}: ParcelMapViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('arpenteur');

  const geom = parcel.polygon
    ? generateSvgGeometryWithPoints(parcel.polygon, 380, 240, 32)
    : null;

  const ignEmbedUrl = getGeoportailEmbedUrl(parcel.coordinates.lon, parcel.coordinates.lat);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#F3E8EE] bg-[#0E1520] ${className}`}>
      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-[#131B26]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode('arpenteur')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'arpenteur' ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Arpenteur</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'satellite' ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Satellite</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ign')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'ign' ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">IGN Live</span>
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
        {viewMode === 'arpenteur' && <ParcelArpenteurSvg geom={geom} />}

        {viewMode === 'satellite' && (
          <div className="w-full h-full relative overflow-hidden bg-[#0c131d] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110"
              style={{
                backgroundImage: 'radial-gradient(circle at center, #1b2838 0%, #0c131d 100%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

            {geom?.path && (
              <svg viewBox={geom.viewBox} className="w-full h-full max-h-[85%] relative z-10 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]">
                <path
                  d={geom.path}
                  fill="#0D9488"
                  fillOpacity="0.30"
                  stroke="#2DD4BF"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                  strokeLinejoin="round"
                />
                {geom.points.map((pt) => (
                  <circle key={`sat-pt-${pt.index}`} cx={pt.x} cy={pt.y} r="4.5" fill="#FBBF24" stroke="#FFF" strokeWidth="1.5" />
                ))}
              </svg>
            )}

            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-gray-300 font-mono">
              Orthophoto HD • Emprise {parcel.section} N°{parcel.numero}
            </div>
          </div>
        )}

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
