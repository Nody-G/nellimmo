'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Compass } from 'lucide-react';
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
  const [mode, setMode] = useState<MapMode>('arpenteur');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const minX = polygonPts.length ? Math.min(...polygonPts.map((p) => p.x)) : 300;
  const maxX = polygonPts.length ? Math.max(...polygonPts.map((p) => p.x)) : 380;
  const minY = polygonPts.length ? Math.min(...polygonPts.map((p) => p.y)) : 220;
  const maxY = polygonPts.length ? Math.max(...polygonPts.map((p) => p.y)) : 300;
  const spanX = Math.max(maxX - minX, 25);
  const spanY = Math.max(maxY - minY, 25);

  const targetPx = Math.max(130, Math.min(height * 0.62, 260));
  const autoScale = Math.min(5.0, Math.max(1.2, targetPx / Math.max(spanX, spanY)));
  const currentScale = autoScale * zoom;

  const midpoints = polygonPts.map((p1, i) => {
    const p2 = polygonPts[(i + 1) % polygonPts.length];
    const dist = calculateDistanceMeters(p1.lon, p1.lat, p2.lon, p2.lat);
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, label: `${dist} m` };
  });

  // Native non-passive wheel listener: PREVENTS PAGE SCROLL WHILE ZOOMING
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY * 0.0015;
      setZoom((cur) => Math.max(0.5, Math.min(4.0, cur - delta)));
    };
    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY, panX: pan.x, panY: pan.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPan({
      x: dragStartRef.current.panX + (clientX - dragStartRef.current.x),
      y: dragStartRef.current.panY + (clientY - dragStartRef.current.y),
    });
  };

  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${centerLat},${centerLon}`;
  const earth3dUrl = `https://earth.google.com/web/@${centerLat},${centerLon},150a,600d,35y,0h,45t,0r`;
  const ignEmbedUrl = getGeoportailEmbedUrl(centerLon, centerLat);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px` }}
      className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-[#2A374A] bg-[#0B132B] select-none cursor-grab active:cursor-grabbing shadow-inner"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={(e) => e.touches[0] && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <ParcelMapControls
        mode={mode}
        onSelectMode={setMode}
        streetViewUrl={streetViewUrl}
        earth3dUrl={earth3dUrl}
        showOverlays={showOverlays}
        onToggleOverlays={() => setShowOverlays((cur) => !cur)}
        onOpenInspector={onOpenInspector}
        onZoomIn={() => setZoom((zVal) => Math.min(4.0, zVal + 0.35))}
        onZoomOut={() => setZoom((zVal) => Math.max(0.5, zVal - 0.35))}
        onReset={() => { setPan({ x: 0, y: 0 }); setZoom(1); }}
      />

      {mode === 'ign' ? (
        <iframe title="IGN Géoportail Live" src={ignEmbedUrl} className="w-full h-full border-0" allowFullScreen />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${currentScale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <div className="relative w-[768px] h-[768px] shrink-0" style={{ left: `${384 - parcelCenterX}px`, top: `${384 - parcelCenterY}px` }}>
            {mode === 'arpenteur' ? (
              <div
                className="absolute inset-0 bg-[#0B132B]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              />
            ) : (
              [-1, 0, 1].map((dy) =>
                [-1, 0, 1].map((dx) => {
                  const tx = centerTileX + dx;
                  const ty = centerTileY + dy;
                  // Official French IGN GeoPF open data tiles (zero API key, zero watermark)
                  const url =
                    mode === 'satellite'
                      ? `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX=18&TILEROW=${ty}&TILECOL=${tx}`
                      : `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX=18&TILEROW=${ty}&TILECOL=${tx}`;
                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={`${tx}-${ty}`}
                      src={url}
                      alt=""
                      onError={(e) => {
                        // Fallback to Esri if IGN tile temporarily fails
                        if (mode === 'satellite') {
                          (e.currentTarget as HTMLImageElement).src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/${ty}/${tx}`;
                        }
                      }}
                      className="absolute w-[256px] h-[256px] select-none pointer-events-none filter brightness-95"
                      style={{ left: `${(dx + 1) * 256}px`, top: `${(dy + 1) * 256}px` }}
                      loading="eager"
                    />
                  );
                })
              )
            )}

            <ParcelTileOverlaySvg
              svgPath={svgPath}
              points={polygonPts}
              midpoints={midpoints}
              isSatellite={mode === 'satellite'}
              surfaceText={`${parcel.contenance} m²`}
              centerPos={{ x: parcelCenterX, y: parcelCenterY }}
              scale={currentScale}
              showOverlays={showOverlays}
            />
          </div>
        </div>
      )}

      {/* Compass North rose */}
      <div className="absolute top-14 right-3 z-20 flex flex-col items-center pointer-events-none opacity-85">
        <Compass className="w-5 h-5 text-teal-400 animate-pulse" />
        <span className="text-[8px] font-bold text-teal-300 font-mono tracking-wider">N</span>
      </div>

      {/* Cadastral live badge */}
      <div className="absolute bottom-3 left-3 z-30 bg-[#0B132B]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-gray-200 font-mono pointer-events-none flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span>Section <strong>{parcel.section}</strong> N°<strong>{parcel.numero}</strong></span>
        <span className="text-teal-400 font-bold">• {parcel.contenance} m²</span>
        <span className="text-gray-400 text-[10px]">({(currentScale).toFixed(1)}x)</span>
      </div>
    </div>
  );
}

