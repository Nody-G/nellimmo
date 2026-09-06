'use client';

import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Maximize2,
  Minimize2,
  ExternalLink,
  Map,
  Satellite,
  Ruler,
  Globe,
  Sun,
  Layers,
  ChevronDown,
  MapPin,
} from 'lucide-react';

export type MapMode = 'arpenteur' | 'satellite' | 'plan' | 'ign';

export interface ActiveLayers {
  lines: boolean;
  points: boolean;
  texts: boolean;
  sun?: boolean;
  radius?: boolean;
  amenities?: boolean;
}

interface ParcelMapControlsProps {
  mode: MapMode;
  onSelectMode: (mode: MapMode) => void;
  streetViewUrl: string;
  earth3dUrl?: string;
  layers: ActiveLayers;
  onToggleLayer: (layer: keyof ActiveLayers) => void;
  isMeasuring: boolean;
  onToggleMeasuring: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const MODES = [
  { id: 'arpenteur' as const, label: 'Cadastre', icon: Ruler },
  { id: 'satellite' as const, label: 'Satellite HD', icon: Satellite },
  { id: 'plan' as const, label: 'Plan & Rues', icon: Map },
  { id: 'ign' as const, label: 'IGN Live', icon: Globe },
];

export function ParcelMapControls({
  mode,
  onSelectMode,
  streetViewUrl,
  earth3dUrl,
  layers,
  onToggleLayer,
  isMeasuring,
  onToggleMeasuring,
  isFullscreen,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onReset,
}: ParcelMapControlsProps) {
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  return (
    <>
      {/* Top Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div
          onPointerDown={(e) => e.stopPropagation()}
          data-no-drag
          className="pointer-events-auto flex flex-wrap items-center gap-1 bg-[#131B26]/95 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-xl"
        >
          {/* Base Map selector */}
          <div className="flex items-center gap-0.5">
            {MODES.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectMode(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mode === tab.id ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

          {/* Quick Direct Layer Toggles */}
          <button
            type="button"
            onClick={() => onToggleLayer('lines')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              layers.lines ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Afficher/masquer les contours et limites"
          >
            Lignes
          </button>
          <button
            type="button"
            onClick={() => onToggleLayer('points')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              layers.points ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Afficher/masquer les bornes B1, B2..."
          >
            Points
          </button>
          <button
            type="button"
            onClick={() => onToggleLayer('texts')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              layers.texts ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Afficher/masquer les cotes en mètres et la surface"
          >
            Textes
          </button>

          {/* Direct Amenities Layer Toggle */}
          <button
            type="button"
            onClick={() => onToggleLayer('amenities')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              layers.amenities
                ? 'bg-indigo-600 text-white shadow-xs font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Afficher ou masquer les commodités (écoles, commerces, sports, santé) sur la carte"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-300" />
            <span>Commodités</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                layers.amenities ? 'bg-indigo-800 text-white' : 'bg-white/10 text-gray-400'
              }`}
            >
              {layers.amenities ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Menu Calques Avancés (Soleil & Rayons) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLayersMenuOpen((cur) => !cur)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                layers.sun || layers.radius ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
              }`}
              title="Calques d'analyse avancée"
            >
              <Layers className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {layersMenuOpen && (
              <div className="absolute top-full left-0 mt-2 bg-[#131B26] border border-white/15 rounded-2xl shadow-2xl p-2 w-48 space-y-1 z-50 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => onToggleLayer('sun')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    layers.sun ? 'bg-amber-500/20 text-amber-200 font-bold' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Course Solaire
                  </span>
                  <span className="text-[10px] font-mono">{layers.sun ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleLayer('radius')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    layers.radius ? 'bg-teal-500/20 text-teal-200 font-bold' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <LocateFixed className="w-3.5 h-3.5 text-teal-400" />
                    Rayon 300m / 500m
                  </span>
                  <span className="text-[10px] font-mono">{layers.radius ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleLayer('amenities')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    layers.amenities ? 'bg-indigo-500/20 text-indigo-200 font-bold' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    Commodités (Écoles / Commerces)
                  </span>
                  <span className="text-[10px] font-mono">{layers.amenities ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

          {/* Outil Télémètre / Mesure interactive */}
          <button
            type="button"
            onClick={onToggleMeasuring}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              isMeasuring
                ? 'bg-amber-500 text-black shadow-md font-black animate-pulse'
                : 'text-gray-300 hover:text-white'
            }`}
            title="Cliquer 2 points sur la carte pour mesurer une distance"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isMeasuring ? 'Mesure active' : 'Mesurer'}</span>
          </button>
        </div>

        {/* Action Links & Fullscreen */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          data-no-drag
          className="pointer-events-auto flex items-center gap-1.5"
        >
          <a
            href={streetViewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg"
            title="Google Street View 360°"
          >
            <span>Street View</span>
            <ExternalLink className="w-3 h-3 text-teal-300" />
          </a>

          {earth3dUrl && (
            <a
              href={earth3dUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg"
              title="Survol 3D Google Earth"
            >
              <span>Earth 3D</span>
              <ExternalLink className="w-3 h-3 text-teal-300" />
            </a>
          )}

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg cursor-pointer"
              title={isFullscreen ? 'Quitter le Plein Écran (Échap)' : 'Plein Écran Total'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Quitter</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plein écran</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Navigation Controls */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        data-no-drag
        className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5"
      >
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
          title="Zoomer (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
          title="Dézoomer (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReset}
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
          title="Centrer la parcelle"
        >
          <LocateFixed className="w-4 h-4 text-teal-400" />
        </button>
      </div>
    </>
  );
}

