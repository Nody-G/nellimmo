'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Compass } from 'lucide-react';
import { CadastreParcel, calculateDistanceMeters, getGeoportailEmbedUrl } from '@/lib/cadastre';
import { getDaySolarSummary, getSolarPosition } from '@/lib/solar';
import { AmenityItem, CATEGORY_CONFIG } from '@/lib/amenities';
import { ParcelTileOverlaySvg } from './ParcelTileOverlaySvg';
import { ParcelMapControls, MapMode, ActiveLayers } from './ParcelMapControls';
import { SolarLocatorPanel } from './SolarLocatorPanel';
import { GooglePlaceSheet } from '../amenities/GooglePlaceSheet';

interface InteractiveParcelMapProps {
  parcel: CadastreParcel;
  height?: number | string;
  amenities?: AmenityItem[];
  selectedAmenityId?: string | null;
  onSelectAmenity?: (amenity: AmenityItem | null) => void;
  propertyAddress?: string;
  initialLayers?: Partial<ActiveLayers>;
  showAmenitiesLayer?: boolean;
  onToggleAmenitiesLayer?: (show: boolean) => void;
}

export function InteractiveParcelMap({
  parcel,
  height = 850,
  amenities,
  selectedAmenityId,
  onSelectAmenity,
  propertyAddress,
  initialLayers,
  showAmenitiesLayer,
  onToggleAmenitiesLayer,
}: InteractiveParcelMapProps) {
  const [mode, setMode] = useState<MapMode>('arpenteur');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 700 });
  const [internalLayers, setInternalLayers] = useState<ActiveLayers>({
    lines: true,
    points: true,
    texts: true,
    sun: false,
    radius: false,
    amenities: true,
    ...initialLayers,
  });

  // Effective layers derive amenities from showAmenitiesLayer if provided, otherwise internalLayers
  const layers: ActiveLayers = {
    ...internalLayers,
    amenities: showAmenitiesLayer !== undefined ? showAmenitiesLayer : (internalLayers.amenities ?? true),
  };

  const [amenitiesList, setAmenitiesList] = useState<AmenityItem[]>([]);
  const [internalSelectedAmenityId, setInternalSelectedAmenityId] = useState<string | null>(null);
  const activeSelectedAmenityId = selectedAmenityId !== undefined ? selectedAmenityId : internalSelectedAmenityId;

  const handleSelectAmenity = (item: AmenityItem | null) => {
    if (onSelectAmenity) onSelectAmenity(item);
    else setInternalSelectedAmenityId(item ? item.id : null);
  };

  const [solarSeason, setSolarSeason] = useState<'summer' | 'winter' | 'equinox' | 'today'>('today');
  const [solarHour, setSolarHour] = useState<number>(14);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<{ lon: number; lat: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveringOverlayRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, moved: false });

  const centerLat = parcel.coordinates?.lat || 43.64;
  const centerLon = parcel.coordinates?.lon || 5.197;

  // Astronomical ephemeris for exact coordinates & chosen season/hour
  const solarSummary = getDaySolarSummary(centerLat, centerLon, solarSeason);
  const solarPosition = getSolarPosition(centerLat, centerLon, solarSummary.date, solarHour);

  // Track real container width & height via ResizeObserver
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

  // Slippy Mercator constants at zoom 18
  const z = 18;
  const n = Math.pow(2, z);
  const lonToX = useCallback((l: number) => ((l + 180) / 360) * n, [n]);
  const latToY = useCallback((l: number) => ((1 - Math.asinh(Math.tan((l * Math.PI) / 180)) / Math.PI) / 2) * n, [n]);

  const parcelWorldPxX = lonToX(centerLon) * 256;
  const parcelWorldPxY = latToY(centerLat) * 256;

  // World bounding box of parcel
  const rawPts = (parcel.polygon || []).map(([lon, lat], idx) => ({
    worldX: lonToX(lon) * 256,
    worldY: latToY(lat) * 256,
    lon,
    lat,
    index: idx + 1,
  }));

  const minX = rawPts.length ? Math.min(...rawPts.map((p) => p.worldX)) : parcelWorldPxX - 50;
  const maxX = rawPts.length ? Math.max(...rawPts.map((p) => p.worldX)) : parcelWorldPxX + 50;
  const minY = rawPts.length ? Math.min(...rawPts.map((p) => p.worldY)) : parcelWorldPxY - 50;
  const maxY = rawPts.length ? Math.max(...rawPts.map((p) => p.worldY)) : parcelWorldPxY + 50;
  const spanX = Math.max(maxX - minX, 20);
  const spanY = Math.max(maxY - minY, 20);

  // Auto-fit parcel comfortably to viewport
  const targetPx = Math.max(280, Math.min(containerSize.height * 0.65, containerSize.width * 0.65, 560));
  const autoScale = Math.min(5.0, Math.max(1.0, targetPx / Math.max(spanX, spanY)));
  const currentScale = autoScale * zoom;

  const effectiveAmenities = amenities && amenities.length > 0 ? amenities : amenitiesList;
  const selectedAmenity = effectiveAmenities.find((a) => a.id === activeSelectedAmenityId);

  // Dynamic multi-scale tile calculation: adapts TILEMATRIX from 6 (France/Region) to 19 (High-precision Street)
  // Ensures tile count on screen stays optimal (typically 12-25 tiles) regardless of zoom level
  const effectiveZoom = 18 + Math.log2(Math.max(currentScale, 0.0001));
  const tileZoom = Math.max(6, Math.min(19, Math.round(effectiveZoom)));
  const nTile = Math.pow(2, tileZoom);

  const centerTileX = ((centerLon + 180) / 360) * nTile;
  const radCenter = (centerLat * Math.PI) / 180;
  const centerTileY = ((1 - Math.asinh(Math.tan(radCenter)) / Math.PI) / 2) * nTile;

  const tileScale = Math.pow(2, effectiveZoom - tileZoom);
  const tileSize = 256 * tileScale;

  // Selected amenity auto-pan offset: aligns viewport smoothly when an amenity is chosen
  const selectedOffsetX = selectedAmenity
    ? -(((selectedAmenity.lon + 180) / 360) * nTile - centerTileX) * tileSize * 0.45
    : 0;
  const selectedOffsetY = selectedAmenity
    ? -(((1 - Math.asinh(Math.tan((selectedAmenity.lat * Math.PI) / 180)) / Math.PI) / 2) * nTile - centerTileY) * tileSize * 0.45
    : 0;

  const currentPanX = pan.x + selectedOffsetX;
  const currentPanY = pan.y + selectedOffsetY;

  // Viewport center in world pixels
  const viewCenterWorldX = parcelWorldPxX - currentPanX / currentScale;
  const viewCenterWorldY = parcelWorldPxY - currentPanY / currentScale;

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

  // Transform polygon points and center into screen coordinates
  const polygonPts = rawPts.map((p) => ({
    x: (p.worldX - viewCenterWorldX) * currentScale + containerSize.width / 2,
    y: (p.worldY - viewCenterWorldY) * currentScale + containerSize.height / 2,
    lon: p.lon,
    lat: p.lat,
    index: p.index,
  }));

  const centerScreenPos = {
    x: (parcelWorldPxX - viewCenterWorldX) * currentScale + containerSize.width / 2,
    y: (parcelWorldPxY - viewCenterWorldY) * currentScale + containerSize.height / 2,
  };

  const svgPath = polygonPts.length >= 3
    ? `M ${polygonPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} Z`
    : '';

  const midpoints = polygonPts.map((p1, i) => {
    const p2 = polygonPts[(i + 1) % polygonPts.length];
    const dist = calculateDistanceMeters(p1.lon, p1.lat, p2.lon, p2.lat);
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, dist, label: `${dist} m` };
  });

  // Dynamic multi-point measurement calculations
  const measureScreenPoints = measurePoints.map((pt, idx) => {
    const mWorldX = lonToX(pt.lon) * 256;
    const mWorldY = latToY(pt.lat) * 256;
    return {
      x: (mWorldX - viewCenterWorldX) * currentScale + containerSize.width / 2,
      y: (mWorldY - viewCenterWorldY) * currentScale + containerSize.height / 2,
      label: String.fromCharCode(65 + idx),
    };
  });

  const measureSegments = measurePoints.slice(0, -1).map((p1, idx) => {
    const p2 = measurePoints[idx + 1];
    const dist = calculateDistanceMeters(p1.lon, p1.lat, p2.lon, p2.lat);
    const s1 = measureScreenPoints[idx];
    const s2 = measureScreenPoints[idx + 1];
    return {
      p1: { x: s1.x, y: s1.y },
      p2: { x: s2.x, y: s2.y },
      dist,
      midX: (s1.x + s2.x) / 2,
      midY: (s1.y + s2.y) / 2,
    };
  });

  const totalMeasureDistance = measureSegments.reduce((acc, seg) => acc + seg.dist, 0);

  // Native non-passive wheel listener: PREVENTS PAGE SCROLL WHILE ZOOMING (Multiplicative infinite zoom)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleNativeWheel = (e: WheelEvent) => {
      // 1. If mouse pointer is over an overlay sheet or panel, NEVER zoom the map!
      if (isHoveringOverlayRef.current) {
        return;
      }
      const target = e.target as (HTMLElement | SVGElement | null);
      const element = target?.nodeType === 3 ? (target.parentElement as HTMLElement | null) : (target as HTMLElement | null);
      if (element && element.closest('[data-no-drag], [data-overlay-container], [data-sheet-container], .overflow-y-auto, .overflow-y-scroll, [data-allow-scroll]')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const factor = Math.exp(-e.deltaY * 0.0018);
      setZoom((cur) => Math.max(0.0005, Math.min(8.0, cur * factor)));
    };
    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleNativeWheel);
  }, []);

  // Fetch amenities when user enables amenities layer or default
  useEffect(() => {
    if (amenities && amenities.length > 0) return;
    if (!layers.amenities || amenitiesList.length > 0) return;
    fetch(`/api/amenities?lat=${centerLat}&lon=${centerLon}&city=${encodeURIComponent(parcel.nom_com || 'Provence')}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.amenities) {
          setAmenitiesList(d.data.amenities);
        }
      })
      .catch(() => {});
  }, [amenities, layers.amenities, amenitiesList.length, centerLat, centerLon, parcel.nom_com]);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // ROCK-SOLID POINTER EVENTS (Captures all drags even outside container or fast movements)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    // Don't intercept clicks on buttons, inputs, links, or HUD control elements
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, input, a, select, [data-no-drag]')) {
      return;
    }
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

    // Measuring click
    if (isMeasuring && !dragStartRef.current.moved && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickScreenX = e.clientX - rect.left;
      const clickScreenY = e.clientY - rect.top;

      const clickWorldX = viewCenterWorldX + (clickScreenX - containerSize.width / 2) / currentScale;
      const clickWorldY = viewCenterWorldY + (clickScreenY - containerSize.height / 2) / currentScale;

      const tileX = clickWorldX / 256;
      const tileY = clickWorldY / 256;
      const lon = (tileX / n) * 360 - 180;
      const lat = (Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileY / n)))) * 180) / Math.PI;

      setMeasurePoints((prev) => [...prev, { lon, lat }]);
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
    if (layer === 'amenities' && onToggleAmenitiesLayer) {
      onToggleAmenitiesLayer(!layers.amenities);
    }
    setInternalLayers((prev) => ({
      ...prev,
      [layer]: layer === 'amenities' && showAmenitiesLayer !== undefined ? !showAmenitiesLayer : !prev[layer],
    }));
  };

  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${centerLat},${centerLon}`;
  const earth3dUrl = `https://earth.google.com/web/@${centerLat},${centerLon},150a,600d,35y,0h,45t,0r`;
  const ignEmbedUrl = getGeoportailEmbedUrl(centerLon, centerLat);

  return (
    <div
      ref={containerRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#2A374A] bg-[#070D1B] select-none shadow-2xl touch-none ${
        isMeasuring ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
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
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onZoomIn={() => setZoom((zVal) => Math.min(8.0, zVal * 1.4))}
        onZoomOut={() => setZoom((zVal) => Math.max(0.0005, zVal / 1.4))}
        onReset={() => { setPan({ x: 0, y: 0 }); setZoom(1); setMeasurePoints([]); }}
      />

      {mode === 'ign' ? (
        <iframe title="IGN Géoportail Live" src={ignEmbedUrl} className="w-full h-full border-0" allowFullScreen />
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dynamic Multi-Scale Tiles Layer covering 100% of viewport in any direction and zoom level */}
          {tiles.map((t) => {
            const planUrl = `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX=${t.tz}&TILEROW=${t.ty}&TILECOL=${t.tx}`;
            const cadastreUrl = `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX=${t.tz}&TILEROW=${t.ty}&TILECOL=${t.tx}`;
            const satUrl = `https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX=${t.tz}&TILEROW=${t.ty}&TILECOL=${t.tx}`;

            return (
              <React.Fragment key={`${t.tz}-${t.tx}-${t.ty}`}>
                {mode === 'arpenteur' && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={planUrl}
                      alt=""
                      className="absolute select-none pointer-events-none filter contrast-105"
                      style={{ left: `${t.left}px`, top: `${t.top}px`, width: `${t.size}px`, height: `${t.size}px` }}
                      loading="eager"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cadastreUrl}
                      alt=""
                      className="absolute select-none pointer-events-none opacity-90"
                      style={{ left: `${t.left}px`, top: `${t.top}px`, width: `${t.size}px`, height: `${t.size}px` }}
                      loading="eager"
                    />
                  </>
                )}

                {mode === 'satellite' && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cadastreUrl}
                      alt=""
                      className="absolute select-none pointer-events-none opacity-60 filter invert"
                      style={{ left: `${t.left}px`, top: `${t.top}px`, width: `${t.size}px`, height: `${t.size}px` }}
                      loading="eager"
                    />
                  </>
                )}

                {mode === 'plan' && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={planUrl}
                    alt=""
                    className="absolute select-none pointer-events-none filter contrast-105"
                    style={{ left: `${t.left}px`, top: `${t.top}px`, width: `${t.size}px`, height: `${t.size}px` }}
                    loading="eager"
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* SVG Cadastre, Sun & Measurement Overlay */}
          <ParcelTileOverlaySvg
            svgPath={svgPath}
            points={polygonPts}
            midpoints={midpoints}
            isSatellite={mode === 'satellite'}
            surfaceText={`${parcel.contenance} m²`}
            centerPos={centerScreenPos}
            scale={1}
            layers={layers}
            measurePoints={measureScreenPoints}
            measureSegments={measureSegments}
            totalMeasureDistance={totalMeasureDistance}
            solarPosition={solarPosition}
            solarSummary={solarSummary}
            amenityPoints={[]}
          />
        </div>
      )}

      {/* Interactive Amenities HTML Pins (Full tooltips, clicks & smooth selection) */}
      {layers.amenities && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
          {effectiveAmenities.map((a) => {
            const aWorldX = lonToX(a.lon) * 256;
            const aWorldY = latToY(a.lat) * 256;
            const aScreenX = (aWorldX - viewCenterWorldX) * currentScale + containerSize.width / 2;
            const aScreenY = (aWorldY - viewCenterWorldY) * currentScale + containerSize.height / 2;

            if (
              aScreenX < -80 ||
              aScreenX > containerSize.width + 80 ||
              aScreenY < -80 ||
              aScreenY > containerSize.height + 80
            ) {
              return null;
            }

            const isSelected = a.id === activeSelectedAmenityId;
            const config = CATEGORY_CONFIG[a.category] || { emoji: '📍', color: '#3B82F6' };

            return (
              <div
                key={`amenity-marker-${a.id}`}
                data-no-drag
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAmenity(a);
                }}
                style={{ left: `${aScreenX}px`, top: `${aScreenY}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group transition-transform duration-150"
              >
                <div
                  className={`p-1.5 rounded-xl border flex items-center gap-1 shadow-lg transition transform group-hover:scale-110 ${
                    isSelected
                      ? 'bg-amber-500 text-black border-white ring-4 ring-amber-500/40 font-black scale-110'
                      : 'bg-[#131B26]/90 text-white border-white/20 hover:bg-[#1C2738]'
                  }`}
                  style={{ borderColor: isSelected ? '#FFF' : config.color }}
                >
                  <span className="text-xs">{config.emoji}</span>
                  <span className="text-[10px] font-mono font-bold whitespace-nowrap">
                    {a.distanceMeters < 1000
                      ? `${a.distanceMeters}m`
                      : `${(a.distanceMeters / 1000).toFixed(1)}km`}
                  </span>
                </div>
                {isSelected && (
                  <span className="mt-1 px-2 py-0.5 rounded-lg bg-black/90 backdrop-blur-md text-white font-bold text-[10px] whitespace-nowrap max-w-[140px] truncate border border-white/20 shadow-md block text-center">
                    {a.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Google Place Profile Sheet Modal over Map */}
      {selectedAmenity && (
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
            key={selectedAmenity.id}
            item={selectedAmenity}
            propertyAddress={propertyAddress}
            onClose={() => handleSelectAmenity(null)}
          />
        </div>
      )}

      {/* SolarLocator Pro HUD Overlay */}
      {layers.sun && (
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
          <SolarLocatorPanel
            lat={centerLat}
            lon={centerLon}
            selectedSeason={solarSeason}
            onSelectSeason={setSolarSeason}
            hourDecimal={solarHour}
            onChangeHour={setSolarHour}
            onClose={() => setInternalLayers((l) => ({ ...l, sun: false }))}
          />
        </div>
      )}

      {/* Multi-point Polyline Measurement Tool Guide Banner */}
      {isMeasuring && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          data-no-drag
          className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#131B26]/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-amber-500/50 animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-amber-300">Télémètre Multi-points :</span>
            {measurePoints.length === 0 && (
              <span className="text-gray-300">Cliquez n&apos;importe où sur la carte pour poser le point A</span>
            )}
            {measurePoints.length === 1 && (
              <span className="text-gray-300">Point A posé. Cliquez pour poser le point B...</span>
            )}
            {measurePoints.length >= 2 && (
              <div className="flex items-center gap-2">
                <span className="bg-rose-500 text-white font-mono font-black px-2 py-0.5 rounded-lg">
                  {totalMeasureDistance >= 1000
                    ? `${(totalMeasureDistance / 1000).toFixed(2)} km`
                    : `${totalMeasureDistance} m`}
                </span>
                <span className="text-gray-400 text-[11px]">
                  ({measurePoints.length} points • ~{Math.round((totalMeasureDistance / 1000) * 12)} min à pied)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/20 pl-2">
            {measurePoints.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMeasurePoints((prev) => prev.slice(0, -1));
                }}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg text-[11px] font-bold cursor-pointer transition"
                title="Annuler le dernier point"
              >
                Annuler
              </button>
            )}
            {measurePoints.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMeasurePoints([]);
                }}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-rose-300 rounded-lg text-[11px] font-bold cursor-pointer transition"
                title="Effacer tous les points"
              >
                Effacer
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMeasuring(false);
              }}
              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-600 text-black rounded-lg text-[11px] font-black cursor-pointer transition shadow-xs"
            >
              Terminer
            </button>
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
        <span className="text-gray-400 text-[10px]">
          ({currentScale >= 1 ? `${currentScale.toFixed(1)}x` : `1/${Math.round(1 / currentScale)}x`} • Z{tileZoom})
        </span>
      </div>
    </div>
  );
}

