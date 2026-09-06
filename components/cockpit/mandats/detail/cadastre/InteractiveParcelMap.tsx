'use client';

import React, { useState, useRef, useCallback } from 'react';
import { CadastreParcel, calculateDistanceMeters, getGeoportailEmbedUrl } from '@/lib/cadastre';
import { ParcelTileOverlaySvg } from './ParcelTileOverlaySvg';
import { ParcelMapControls, MapMode } from './ParcelMapControls';

interface InteractiveParcelMapProps {
  parcel: CadastreParcel;
  onOpenInspector?: () => void;
  height?: number;
}

export function InteractiveParcelMap({
  parcel,
  onOpenInspector,
  height = 340,
}: InteractiveParcelMapProps) {
  const [mode, setMode] = useState<MapMode>('satellite');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const centerLat = parcel.coordinates?.lat || 43.64;
  const centerLon = parcel.coordinates?.lon || 5.197;

  // Slippy Mercator tile projection at zoom 18
  const z = 18;
  const n = Math.pow(2, z);
  const lonToX = useCallback((l: number) => ((l + 180) / 360) * n, [n]);
  const latToY = useCallback((l: number) => ((1 - Math.asinh(Math.tan((l * Math.PI) / 180)) / Math.PI) / 2) * n, [n]);

  const centerTileX = Math.floor(lonToX(centerLon));
  const centerTileY = Math.floor(latToY(centerLat));
  const originTileX = centerTileX - 1;
  const originTileY = centerTileY - 1;

  const parcelCenterX = (lonToX(centerLon) - originTileX) * 256;
  const parcelCenterY = (latToY(centerLat) - originTileY) * 256;

  const polygonPts = (parcel.polygon || []).map(([lon, lat], idx) => ({
    x: (lonToX(lon) - originTileX) * 256,
    y: (latToY(lat) - originTileY) * 256,
    lon,
    lat,
    index: idx + 1,
  }));

  const svgPath = polygonPts.length >= 3 ? `M ${polygonPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} Z` : '';

  const midpoints = polygonPts.map((p1, i) => {
    const p2 = polygonPts[(i + 1) % polygonPts.length];
    const dist = calculateDistanceMeters(p1.lon, p1.lat, p2.lon, p2.lat);
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, label: `${dist} m` };
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: dragStartRef.current.panX + (e.clientX - dragStartRef.current.x),
      y: dragStartRef.current.panY + (e.clientY - dragStartRef.current.y),
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((cur) => Math.max(0.6, Math.min(3.5, cur - e.deltaY * 0.0015)));
  };

  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${centerLat},${centerLon}`;
  const ignEmbedUrl = getGeoportailEmbedUrl(centerLon, centerLat);

  return (
    <div
      style={{ height: `${height}px` }}
      className="relative w-full rounded-2xl overflow-hidden border border-[#F3E8EE] bg-[#0A1017] select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onWheel={handleWheel}
    >
      <ParcelMapControls
        mode={mode}
        onSelectMode={setMode}
        streetViewUrl={streetViewUrl}
        onOpenInspector={onOpenInspector}
        onZoomIn={() => setZoom((zVal) => Math.min(3.5, zVal + 0.3))}
        onZoomOut={() => setZoom((zVal) => Math.max(0.6, zVal - 0.3))}
        onReset={() => { setPan({ x: 0, y: 0 }); setZoom(1); }}
      />

      {mode === 'ign' ? (
        <iframe title="IGN Géoportail Live" src={ignEmbedUrl} className="w-full h-full border-0" allowFullScreen />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <div className="relative w-[768px] h-[768px] shrink-0" style={{ left: `${384 - parcelCenterX}px`, top: `${384 - parcelCenterY}px` }}>
            {mode !== 'arpenteur' ? (
              [-1, 0, 1].map((dy) =>
                [-1, 0, 1].map((dx) => {
                  const tx = centerTileX + dx;
                  const ty = centerTileY + dy;
                  const url =
                    mode === 'satellite'
                      ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/${ty}/${tx}`
                      : `https://tile.openstreetmap.org/18/${tx}/${ty}.png`;
                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={`${tx}-${ty}`}
                      src={url}
                      alt=""
                      className="absolute w-[256px] h-[256px] select-none pointer-events-none filter brightness-95"
                      style={{ left: `${(dx + 1) * 256}px`, top: `${(dy + 1) * 256}px` }}
                      loading="eager"
                    />
                  );
                })
              )
            ) : (
              <div
                className="absolute inset-0 bg-[#0c1622] opacity-90"
                style={{
                  backgroundImage: 'radial-gradient(circle, #0D9488 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              />
            )}

            <ParcelTileOverlaySvg
              svgPath={svgPath}
              points={polygonPts}
              midpoints={midpoints}
              isSatellite={mode === 'satellite'}
            />
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-30 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-gray-300 font-mono pointer-events-none">
        Parcelle {parcel.section} N°{parcel.numero} • {parcel.contenance} m² • Zoom {zoom.toFixed(1)}x
      </div>
    </div>
  );
}
