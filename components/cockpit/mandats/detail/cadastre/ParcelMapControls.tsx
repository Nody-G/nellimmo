'use client';

import React from 'react';
import { ZoomIn, ZoomOut, LocateFixed, Maximize2, ExternalLink, Map, Satellite, Ruler, Globe } from 'lucide-react';

export type MapMode = 'satellite' | 'plan' | 'arpenteur' | 'ign';

interface ParcelMapControlsProps {
  mode: MapMode;
  onSelectMode: (mode: MapMode) => void;
  streetViewUrl: string;
  onOpenInspector?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const MODES = [
  { id: 'satellite' as const, label: 'Satellite HD', icon: Satellite },
  { id: 'plan' as const, label: 'Plan & Rues', icon: Map },
  { id: 'arpenteur' as const, label: 'Arpenteur', icon: Ruler },
  { id: 'ign' as const, label: 'IGN Live', icon: Globe },
];

export function ParcelMapControls({
  mode,
  onSelectMode,
  streetViewUrl,
  onOpenInspector,
  onZoomIn,
  onZoomOut,
  onReset,
}: ParcelMapControlsProps) {
  return (
    <>
      {/* Top Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-[#131B26]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          {MODES.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectMode(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === tab.id ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <a
            href={streetViewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg"
          >
            <span>Street View</span>
            <ExternalLink className="w-3 h-3 text-teal-300" />
          </a>
          {onOpenInspector && (
            <button
              type="button"
              onClick={onOpenInspector}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grand Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Navigation Controls */}
      <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReset}
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
        >
          <LocateFixed className="w-4 h-4 text-teal-400" />
        </button>
      </div>
    </>
  );
}
