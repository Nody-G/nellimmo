'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AmenityItem, CATEGORY_CONFIG } from '@/lib/amenities';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Navigation,
  MapPin,
} from 'lucide-react';

interface NeighborhoodAmenitiesMapProps {
  centerLat: number;
  centerLon: number;
  amenities: AmenityItem[];
  selectedAmenityId: string | null;
  onSelectAmenity: (amenity: AmenityItem) => void;
  height?: number;
}

export function NeighborhoodAmenitiesMap({
  centerLat,
  centerLon,
  amenities,
  selectedAmenityId,
  onSelectAmenity,
  height = 560,
}: NeighborhoodAmenitiesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1); // 1 = ~1.5km radius
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, moved: false });
  const [containerSize, setContainerSize] = useState({ width: 600, height: 560 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height: h } = entry.contentRect;
        if (width > 50 && h > 50) {
          setContainerSize({ width: Math.round(width), height: Math.round(h) });
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Projections métriques locales par rapport au centre du bien
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  const mPerDegLat = 111132;
  const mPerDegLon = 111320 * cosLat;

  // Base scale: à zoom 1, 1200 mètres = ~300 pixels
  const pxPerMeter = (300 / 1200) * zoom;

  // Dynamic smooth offset when an amenity is selected without triggering cascading setState in effects
  const selectedItem = amenities.find((a) => a.id === selectedAmenityId);
  const selectedOffsetX = selectedItem ? -(selectedItem.lon - centerLon) * mPerDegLon * pxPerMeter * 0.5 : 0;
  const selectedOffsetY = selectedItem ? (selectedItem.lat - centerLat) * mPerDegLat * pxPerMeter * 0.5 : 0;

  const currentPanX = pan.x + selectedOffsetX;
  const currentPanY = pan.y + selectedOffsetY;

  const getScreenPos = useCallback(
    (lat: number, lon: number) => {
      const dEast = (lon - centerLon) * mPerDegLon;
      const dNorth = (lat - centerLat) * mPerDegLat;
      const x = containerSize.width / 2 + currentPanX + dEast * pxPerMeter;
      const y = containerSize.height / 2 + currentPanY - dNorth * pxPerMeter;
      return { x, y };
    },
    [centerLat, centerLon, mPerDegLat, mPerDegLon, containerSize, currentPanX, currentPanY, pxPerMeter]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, a, [data-no-drag]')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragStartRef.current.moved = true;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Prevent wheel scroll & enable smooth multiplicative zoom with wide dezoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0018);
      setZoom((cur) => Math.max(0.04, Math.min(6.0, cur * factor)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const centerPos = { x: containerSize.width / 2 + currentPanX, y: containerSize.height / 2 + currentPanY };

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px` }}
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#2A374A] bg-[#0B132B] select-none shadow-xl touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background Cartography Grid / Slippy look */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#14B8A6 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }} />

      {/* SVG Canvas for Isochrone circles and Markers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Isochrone Walking Rings around property (Rayons HUD fixes et stables, indépendants du zoom) */}
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          {/* 300m = ~4 min à pied (Rayon fixe 110px) */}
          <circle r={110} fill="#14B8A6" fillOpacity="0.04" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="4 3" />
          <text y={-116} fill="#14B8A6" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.9">
            Rayon 300m (4 min à pied)
          </text>

          {/* 500m = ~7 min à pied (Rayon fixe 190px) */}
          <circle r={190} fill="#3B82F6" fillOpacity="0.03" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 3" />
          <text y={-196} fill="#60A5FA" fontSize={10} fontWeight="bold" textAnchor="middle" opacity="0.9">
            Rayon 500m (7 min à pied)
          </text>

          {/* 1000m = ~13 min à pied (Rayon fixe 270px) */}
          <circle r={270} fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.6" />
          <text y={-276} fill="#94A3B8" fontSize={10} fontWeight="bold" textAnchor="middle" opacity="0.8">
            1.0 km (13 min)
          </text>

          {/* Connecting line to selected amenity */}
          {selectedItem && (() => {
            const pos = getScreenPos(selectedItem.lat, selectedItem.lon);
            const dx = pos.x - centerPos.x;
            const dy = pos.y - centerPos.y;
            return (
              <line
                x1="0"
                y1="0"
                x2={dx}
                y2={dy}
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            );
          })()}
        </g>
      </svg>

      {/* Property Center Pin (Golden Glow) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center"
        style={{ left: `${centerPos.x}px`, top: `${centerPos.y}px` }}
      >
        <div className="relative flex items-center justify-center">
          <span className="w-8 h-8 rounded-full bg-amber-400/30 animate-ping absolute" />
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C59A45] to-amber-300 text-black flex items-center justify-center shadow-2xl border-2 border-white">
            <MapPin className="w-5 h-5 fill-black" />
          </div>
        </div>
        <span className="mt-1 px-2 py-0.5 rounded-full bg-[#0B132B]/90 border border-amber-400/40 text-amber-300 font-bold text-[10px] whitespace-nowrap shadow-lg">
          Le Bien
        </span>
      </div>

      {/* Amenity Pins */}
      {amenities.map((item) => {
        const pos = getScreenPos(item.lat, item.lon);
        const isSelected = item.id === selectedAmenityId;
        const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.commerce;

        return (
          <div
            key={item.id}
            data-no-drag
            onClick={(e) => {
              e.stopPropagation();
              onSelectAmenity(item);
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 cursor-pointer z-10 flex flex-col items-center group ${
              isSelected ? 'scale-125 z-30' : 'hover:scale-115'
            }`}
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          >
            <div
              className={`p-1.5 rounded-xl border flex items-center gap-1 shadow-lg transition ${
                isSelected
                  ? 'bg-amber-500 text-black border-white ring-4 ring-amber-500/40 font-black'
                  : 'bg-[#131B26]/90 text-white border-white/20 hover:bg-[#1C2738]'
              }`}
              style={{ borderColor: isSelected ? '#FFF' : config.color }}
            >
              <span className="text-xs">{config.emoji}</span>
              <span className="text-[10px] font-mono font-bold whitespace-nowrap">
                {item.distanceMeters < 1000
                  ? `${item.distanceMeters}m`
                  : `${(item.distanceMeters / 1000).toFixed(1)}km`}
              </span>
            </div>

            {/* Label preview on hover or selection */}
            {(isSelected || false) && (
              <span className="mt-1 px-2 py-0.5 rounded-lg bg-black/90 backdrop-blur-md text-white font-bold text-[10px] whitespace-nowrap max-w-[140px] truncate border border-white/20 shadow-md">
                {item.name}
              </span>
            )}
          </div>
        );
      })}

      {/* Top Floating Controls */}
      <div
        data-no-drag
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-40"
      >
        <div className="pointer-events-auto bg-[#131B26]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg text-xs text-white">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-bold">Radar de Quartier</span>
          <span className="text-gray-400 text-[11px] font-mono">
            ({amenities.length} commodités • {zoom >= 1 ? `~${(1.2 / zoom).toFixed(1)}km` : `~${(1.2 / zoom).toFixed(0)}km`})
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(6.0, z * 1.35))}
            className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
            title="Zoomer (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.04, z / 1.35))}
            className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
            title="Dézoomer (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPan({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
            title="Recentrer sur le bien"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected Amenity Info Card (Floating Bottom Panel) */}
      {selectedItem && (
        <div
          data-no-drag
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[360px] bg-[#0B132B]/95 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl shadow-2xl z-40 text-white animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-0.5">
                <span>{CATEGORY_CONFIG[selectedItem.category]?.emoji}</span>
                <span>{selectedItem.subtypeLabel}</span>
              </div>
              <h5 className="font-bold text-sm text-white line-clamp-1">{selectedItem.name}</h5>
              <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">{selectedItem.address}</p>
            </div>

            <span className="px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold whitespace-nowrap">
              {selectedItem.distanceMeters < 1000
                ? `${selectedItem.distanceMeters} m`
                : `${(selectedItem.distanceMeters / 1000).toFixed(1)} km`}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3 text-gray-300">
              <span>🚶 <strong>{selectedItem.walkingMinutes} min</strong> à pied</span>
              <span>🚗 <strong>{selectedItem.drivingMinutes} min</strong> auto</span>
            </div>

            <a
              href={selectedItem.googleMapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-md cursor-pointer"
            >
              <Navigation className="w-3 h-3" />
              <span>Itinéraire</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
