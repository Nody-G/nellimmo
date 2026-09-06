'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AmenityItem, CATEGORY_CONFIG } from '@/lib/amenities';
import { GooglePlaceSheet } from './GooglePlaceSheet';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Map,
  Satellite,
} from 'lucide-react';

interface NeighborhoodAmenitiesMapProps {
  centerLat: number;
  centerLon: number;
  amenities: AmenityItem[];
  selectedAmenityId: string | null;
  onSelectAmenity: (amenity: AmenityItem | null) => void;
  height?: number;
  propertyAddress?: string;
}

export function NeighborhoodAmenitiesMap({
  centerLat,
  centerLon,
  amenities,
  selectedAmenityId,
  onSelectAmenity,
  height = 560,
  propertyAddress,
}: NeighborhoodAmenitiesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveringOverlayRef = useRef(false);
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

  const [mapMode, setMapMode] = useState<'plan' | 'satellite'>('plan');

  // Multi-scale Web Mercator engine: adapts tile level (Z6 to Z19) to zoom level
  const effectiveZoom = 15.0 + Math.log2(Math.max(zoom, 0.01));
  const tileZoom = Math.max(6, Math.min(19, Math.round(effectiveZoom)));
  const nTile = Math.pow(2, tileZoom);

  const centerTileX = ((centerLon + 180) / 360) * nTile;
  const radCenter = (centerLat * Math.PI) / 180;
  const centerTileY = ((1 - Math.asinh(Math.tan(radCenter)) / Math.PI) / 2) * nTile;

  const tileScale = Math.pow(2, effectiveZoom - tileZoom);
  const tileSize = 256 * tileScale;

  // Selected amenity auto-pan offset
  const selectedItem = amenities.find((a) => a.id === selectedAmenityId);
  const selectedOffsetX = selectedItem
    ? -(((selectedItem.lon + 180) / 360) * nTile - centerTileX) * tileSize * 0.45
    : 0;
  const selectedOffsetY = selectedItem
    ? -(((1 - Math.asinh(Math.tan((selectedItem.lat * Math.PI) / 180)) / Math.PI) / 2) * nTile - centerTileY) * tileSize * 0.45
    : 0;

  const currentPanX = pan.x + selectedOffsetX;
  const currentPanY = pan.y + selectedOffsetY;

  const centerPos = { x: containerSize.width / 2 + currentPanX, y: containerSize.height / 2 + currentPanY };

  // View center in tile units
  const viewCenterTileX = centerTileX - currentPanX / tileSize;
  const viewCenterTileY = centerTileY - currentPanY / tileSize;

  const halfWTiles = (containerSize.width / 2) / tileSize;
  const halfHTiles = (containerSize.height / 2) / tileSize;

  const minTileX = Math.floor(viewCenterTileX - halfWTiles - 0.5);
  const maxTileX = Math.floor(viewCenterTileX + halfWTiles + 0.5);
  const minTileY = Math.floor(viewCenterTileY - halfHTiles - 0.5);
  const maxTileY = Math.floor(viewCenterTileY + halfHTiles + 0.5);

  const tiles: { tx: number; ty: number; tz: number; left: number; top: number; size: number }[] = [];
  for (let ty = minTileY; ty <= maxTileY; ty++) {
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      tiles.push({
        tx,
        ty,
        tz: tileZoom,
        left: (tx - viewCenterTileX) * tileSize + containerSize.width / 2,
        top: (ty - viewCenterTileY) * tileSize + containerSize.height / 2,
        size: tileSize,
      });
    }
  }

  const getScreenPos = useCallback(
    (lat: number, lon: number) => {
      const aTileX = ((lon + 180) / 360) * nTile;
      const rad = (lat * Math.PI) / 180;
      const aTileY = ((1 - Math.asinh(Math.tan(rad)) / Math.PI) / 2) * nTile;
      const x = centerPos.x + (aTileX - centerTileX) * tileSize;
      const y = centerPos.y + (aTileY - centerTileY) * tileSize;
      return { x, y };
    },
    [centerPos.x, centerPos.y, centerTileX, centerTileY, nTile, tileSize]
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
      if (isHoveringOverlayRef.current) {
        return;
      }
      const target = e.target as (HTMLElement | SVGElement | null);
      const element = target?.nodeType === 3 ? (target.parentElement as HTMLElement | null) : (target as HTMLElement | null);
      if (element && element.closest('[data-no-drag], [data-overlay-container], [data-sheet-container], .overflow-y-auto, .overflow-y-scroll, [data-allow-scroll]')) {
        return; // Let natural scroll happen inside GooglePlaceSheet without zooming the map
      }
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0018);
      setZoom((cur) => Math.max(0.04, Math.min(6.0, cur * factor)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

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
      {/* 1. Dynamic Real Map Tiles Layer (IGN Plan & Satellite) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {tiles.map((t) => {
          const planUrl = `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX=${t.tz}&TILEROW=${t.ty}&TILECOL=${t.tx}`;
          const satUrl = `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX=${t.tz}&TILEROW=${t.ty}&TILECOL=${t.tx}`;

          return (
            <React.Fragment key={`${mapMode}-${t.tz}-${t.tx}-${t.ty}`}>
              {mapMode === 'plan' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={planUrl}
                  alt=""
                  className="absolute select-none pointer-events-none filter contrast-105"
                  style={{ left: `${t.left}px`, top: `${t.top}px`, width: `${t.size}px`, height: `${t.size}px` }}
                  loading="eager"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={satUrl}
                  alt=""
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${t.tz}/${t.ty}/${t.tx}`;
                  }}
                  className="absolute select-none pointer-events-none filter brightness-95"
                  style={{ left: `${t.left}px`, top: `${t.top}px`, width: `${t.size}px`, height: `${t.size}px` }}
                  loading="eager"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* SVG Canvas for Isochrone circles and Markers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Isochrone Walking Rings around property (Rayons HUD fixes et stables, indépendants du zoom) */}
        <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
          {/* 300m = ~4 min à pied (Rayon fixe 110px) */}
          <circle r={110} fill="#14B8A6" fillOpacity={mapMode === 'plan' ? 0.07 : 0.12} stroke="#14B8A6" strokeWidth={1.5} strokeDasharray="4 3" />
          <g transform="translate(0, -116)">
            <rect x="-65" y="-9" width="130" height="18" rx="5" fill="#0B132B" fillOpacity="0.85" stroke="#14B8A6" strokeWidth="1" />
            <text y="3.5" fill="#5EEAD4" fontSize="9" fontWeight="bold" textAnchor="middle">
              Rayon 300m (4 min à pied)
            </text>
          </g>

          {/* 500m = ~7 min à pied (Rayon fixe 190px) */}
          <circle r={190} fill="#3B82F6" fillOpacity={mapMode === 'plan' ? 0.05 : 0.08} stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 3" />
          <g transform="translate(0, -196)">
            <rect x="-65" y="-9" width="130" height="18" rx="5" fill="#0B132B" fillOpacity="0.85" stroke="#3B82F6" strokeWidth="1" />
            <text y="3.5" fill="#93C5FD" fontSize="9" fontWeight="bold" textAnchor="middle">
              Rayon 500m (7 min à pied)
            </text>
          </g>

          {/* 1000m = ~13 min à pied (Rayon fixe 270px) */}
          <circle r={270} fill="none" stroke={mapMode === 'plan' ? '#475569' : '#64748B'} strokeWidth={1.2} strokeDasharray="6 4" opacity="0.6" />
          <g transform="translate(0, -276)">
            <rect x="-55" y="-9" width="110" height="18" rx="5" fill="#0B132B" fillOpacity="0.85" stroke="#64748B" strokeWidth="1" />
            <text y="3.5" fill="#CBD5E1" fontSize="9" fontWeight="bold" textAnchor="middle">
              1.0 km (13 min)
            </text>
          </g>

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
        {/* Left Badge: Title & Amenities count */}
        <div className="pointer-events-auto bg-[#131B26]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg text-xs text-white">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-bold">Radar de Quartier</span>
          <span className="text-gray-400 text-[11px] font-mono">
            ({amenities.length} commodités • {zoom >= 1 ? `~${(1.2 / zoom).toFixed(1)}km` : `~${(1.2 / zoom).toFixed(0)}km`})
          </span>
        </div>

        {/* Right Controls: Mode Toggle [Plan | Satellite] + Zoom & Reset */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <div className="bg-[#131B26]/90 backdrop-blur-md border border-white/15 p-0.5 rounded-xl flex items-center shadow-lg">
            <button
              type="button"
              onClick={() => setMapMode('plan')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                mapMode === 'plan' ? 'bg-teal-500 text-black shadow-xs' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Map className="w-3 h-3" />
              <span>Plan</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                mapMode === 'satellite' ? 'bg-teal-500 text-black shadow-xs' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Satellite className="w-3 h-3" />
              <span>Satellite</span>
            </button>
          </div>

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

      {/* Fiche Google Maps Intégrée (Google Business Profile) */}
      {selectedItem && (
        <div
          data-overlay-container
          onPointerEnter={() => {
            isHoveringOverlayRef.current = true;
          }}
          onPointerLeave={() => {
            isHoveringOverlayRef.current = false;
          }}
          className="z-50 pointer-events-auto"
        >
          <GooglePlaceSheet
            key={selectedItem.id}
            item={selectedItem}
            propertyAddress={propertyAddress}
            onClose={() => onSelectAmenity(null)}
          />
        </div>
      )}
    </div>
  );
}
