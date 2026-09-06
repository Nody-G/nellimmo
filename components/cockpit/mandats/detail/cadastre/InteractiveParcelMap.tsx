'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Compass } from 'lucide-react';
import { CadastreParcel, calculateDistanceMeters, getGeoportailEmbedUrl } from '@/lib/cadastre';
import { ParcelTileOverlaySvg } from './ParcelTileOverlaySvg';
import { ParcelMapControls, MapMode, ActiveLayers } from './ParcelMapControls';

interface InteractiveParcelMapProps {
  parcel: CadastreParcel;
  onOpenInspector?: () => void;
  height?: number | string;
}

export function InteractiveParcelMap({
  parcel,
  onOpenInspector,
  height = 700,
}: InteractiveParcelMapProps) {
  const [mode, setMode] = useState<MapMode>('arpenteur');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [layers, setLayers] = useState<ActiveLayers>({
    lines: true,
    points: true,
    texts: true,
    sun: false,
    radius: false,
  });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number; lon: number; lat: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, moved: false });

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

  const targetPx = typeof height === 'number' ? Math.max(220, Math.min(height * 0.65, 420)) : 320;
  const autoScale = Math.min(5.0, Math.max(1.2, targetPx / Math.max(spanX, spanY)));
  const currentScale = autoScale * zoom;

  const midpoints = polygonPts.map((p1, i) => {
    const p2 = polygonPts[(i + 1) % polygonPts.length];
    const dist = calculateDistanceMeters(p1.lon, p1.lat, p2.lon, p2.lat);
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, dist, label: `${dist} m` };
  });

  const measureDistance = measurePoints.length === 2
    ? calculateDistanceMeters(measurePoints[0].lon, measurePoints[0].lat, measurePoints[1].lon, measurePoints[1].lat)
    : null;

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

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY, panX: pan.x, panY: pan.y, moved: false };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragStartRef.current.moved = true;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleEnd = (clientX: number, clientY: number) => {
    setIsDragging(false);
    // If we were measuring and the user didn't drag, place a point!
    if (isMeasuring && !dragStartRef.current.moved && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickScreenX = clientX - rect.left;
      const clickScreenY = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const svgRelX = (clickScreenX - centerX - pan.x) / currentScale + parcelCenterX;
      const svgRelY = (clickScreenY - centerY - pan.y) / currentScale + parcelCenterY;

      const tileX = originTileX + svgRelX / 256;
      const tileY = originTileY + svgRelY / 256;
      const lon = (tileX / n) * 360 - 180;
      const lat = (Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileY / n)))) * 180) / Math.PI;

      if (measurePoints.length === 0 || measurePoints.length === 2) {
        setMeasurePoints([{ x: svgRelX, y: svgRelY, lon, lat }]);
      } else if (measurePoints.length === 1) {
        setMeasurePoints((prev) => [...prev, { x: svgRelX, y: svgRelY, lon, lat }]);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleLayer = (layer: keyof ActiveLayers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${centerLat},${centerLon}`;
  const earth3dUrl = `https://earth.google.com/web/@${centerLat},${centerLon},150a,600d,35y,0h,45t,0r`;
  const ignEmbedUrl = getGeoportailEmbedUrl(centerLon, centerLat);

  return (
    <div
      ref={containerRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#2A374A] bg-[#070D1B] select-none shadow-2xl ${
        isMeasuring ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={(e) => e.touches[0] && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => e.changedTouches[0] && handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
    >
      <ParcelMapControls
        mode={mode}
        onSelectMode={setMode}
        streetViewUrl={streetViewUrl}
        earth3dUrl={earth3dUrl}
        layers={layers}
        onToggleLayer={toggleLayer}
        isMeasuring={isMeasuring}
        onToggleMeasuring={() => {
          setIsMeasuring((cur) => !cur);
          if (isMeasuring) setMeasurePoints([]);
        }}
        onOpenInspector={onOpenInspector}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onZoomIn={() => setZoom((zVal) => Math.min(4.0, zVal + 0.35))}
        onZoomOut={() => setZoom((zVal) => Math.max(0.5, zVal - 0.35))}
        onReset={() => { setPan({ x: 0, y: 0 }); setZoom(1); setMeasurePoints([]); }}
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
              layers={layers}
              measurePoints={measurePoints}
              measureDistance={measureDistance}
            />
          </div>
        </div>
      )}

      {/* Measurement Tool Guide Banner */}
      {isMeasuring && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-black px-4 py-1.5 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 border-2 border-black/20 animate-in fade-in">
          <span>📐 {measurePoints.length === 0 ? 'Cliquez le 1er point' : measurePoints.length === 1 ? 'Cliquez le 2ème point' : `Distance mesurée : ${measureDistance} m`}</span>
          {measurePoints.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setMeasurePoints([]); }}
              className="ml-2 px-2 py-0.5 bg-black/20 hover:bg-black/40 rounded text-[11px] font-bold cursor-pointer"
            >
              Effacer
            </button>
          )}
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

