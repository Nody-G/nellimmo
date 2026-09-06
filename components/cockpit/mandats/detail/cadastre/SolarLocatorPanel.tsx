'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Sunrise,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { getSolarPosition, getDaySolarSummary, SolarPosition, DaySolarSummary } from '@/lib/solar';

interface SolarLocatorPanelProps {
  lat: number;
  lon: number;
  selectedSeason: 'summer' | 'winter' | 'equinox' | 'today';
  onSelectSeason: (season: 'summer' | 'winter' | 'equinox' | 'today') => void;
  hourDecimal: number;
  onChangeHour: (updater: number | ((prev: number) => number)) => void;
  onClose?: () => void;
}

const SEASONS = [
  { id: 'today' as const, label: "Aujourd'hui", emoji: '📅' },
  { id: 'summer' as const, label: 'Été (21 juin)', emoji: '☀️' },
  { id: 'equinox' as const, label: 'Équinoxe', emoji: '🍂' },
  { id: 'winter' as const, label: 'Hiver (21 déc)', emoji: '❄️' },
];

export function SolarLocatorPanel({
  lat,
  lon,
  selectedSeason,
  onSelectSeason,
  hourDecimal,
  onChangeHour,
  onClose,
}: SolarLocatorPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const solarSummary: DaySolarSummary = getDaySolarSummary(lat, lon, selectedSeason);
  const currentPos: SolarPosition = getSolarPosition(lat, lon, solarSummary.date, hourDecimal);

  // Animation player (SunLocator timelapse simulation)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onChangeHour((h: number) => {
        const next = h + 0.25;
        if (next > 21) {
          setIsPlaying(false);
          return 6;
        }
        return Math.round(next * 100) / 100;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, onChangeHour]);

  const formatH = (dec: number) => {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60);
    return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      data-no-drag
      className="absolute top-16 left-3 sm:left-4 z-40 w-[310px] sm:w-[360px] bg-[#0B132B]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl text-white select-none animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sun className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <h4 className="text-xs font-bold font-serif text-amber-300">
              SunLocator Pro • Course Solaire
            </h4>
            <span className="text-[10px] text-gray-400 font-mono">
              GPS : {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCollapsed((cur) => !cur)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={collapsed ? 'Agrandir' : 'Réduire'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Fermer le calque solaire"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-3 pt-3">
          {/* Season Selector */}
          <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-2xl border border-white/10 text-center">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSeason(s.id)}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex flex-col items-center gap-0.5 ${
                  selectedSeason === s.id
                    ? 'bg-amber-500 text-black shadow-md font-black'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{s.emoji}</span>
                <span className="truncate text-[10px]">{s.id === 'today' ? "Aujourd'hui" : s.id === 'summer' ? 'Été' : s.id === 'winter' ? 'Hiver' : 'Équinoxe'}</span>
              </button>
            ))}
          </div>

          {/* Time Scrubber & Controls */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Heure locale :
              </span>
              <span className="text-sm font-black text-amber-300 font-mono bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                {formatH(hourDecimal)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((cur) => !cur)}
                className={`p-2 rounded-xl transition cursor-pointer shadow-md ${
                  isPlaying ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isPlaying ? 'Pause' : 'Simuler la journée'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <input
                type="range"
                min={6}
                max={21}
                step={0.25}
                value={hourDecimal}
                onChange={(e) => {
                  setIsPlaying(false);
                  onChangeHour(parseFloat(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-white/20 rounded-lg"
              />

              <button
                type="button"
                onClick={() => { setIsPlaying(false); onChangeHour(14); }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                title="Revenir à 14h00"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Solar Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-teal-400" /> Azimut
              </span>
              <div className="font-mono font-bold text-white text-sm">
                {currentPos.azimuthDeg}° <span className="text-xs font-normal text-amber-300">({currentPos.cardinalLabel})</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> Élévation
              </span>
              <div className="font-mono font-bold text-white text-sm">
                {currentPos.elevationDeg}°
                <span className="text-[10px] font-normal text-gray-400 ml-1">
                  (Zénith {solarSummary.maxElevationDeg}°)
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-300" /> Lever / Coucher
              </span>
              <div className="font-mono font-bold text-white text-xs">
                {solarSummary.sunriseTime} → {solarSummary.sunsetTime}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                👥 Ombre portée
              </span>
              <div className="font-mono font-bold text-amber-300 text-xs">
                {currentPos.elevationDeg > 5 ? `${currentPos.shadowRatio}× la hauteur` : 'Ombre rasante'}
              </div>
            </div>
          </div>

          {/* Real Estate Advice Badge */}
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
            {selectedSeason === 'summer' ? (
              <span>☀️ <strong>Été</strong> : Journée de {solarSummary.daylightDuration}. Soleil au zénith à {solarSummary.maxElevationDeg}°, ombres très courtes au sol.</span>
            ) : selectedSeason === 'winter' ? (
              <span>❄️ <strong>Hiver</strong> : Journée de {solarSummary.daylightDuration}. Soleil rasant à {solarSummary.maxElevationDeg}°, ombres allongées de {currentPos.shadowRatio}×.</span>
            ) : (
              <span>🍂 <strong>Équinoxe</strong> : Équilibre parfait jour/nuit (12h). Exposition optimale au Sud de 10h à 17h.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
