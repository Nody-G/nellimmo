'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Maximize2, LocateFixed, ZoomIn, ZoomOut, ExternalLink } from 'lucide-react';
import { CadastreParcel, calculateDistanceMeters } from '@/lib/cadastre';

interface InteractiveParcelMapProps {
  parcel: CadastreParcel;
  onOpenInspector?: () => void;
  height?: number;
}

type LayerType = 'satellite' | 'plan' | 'osmfr';

const TILES: Record<LayerType, { label: string; url: string; sub?: string[] }> = {
  satellite: { label: 'Satellite HD', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  plan: { label: 'Plan & Rues', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', sub: ['a', 'b', 'c', 'd'] },
  osmfr: { label: 'Cadastre & IGN', url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', sub: ['a', 'b', 'c'] },
};

export function InteractiveParcelMap({ parcel, onOpenInspector, height = 340 }: InteractiveParcelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');

  const fitBounds = useCallback(() => {
    if (!mapRef.current || !parcel.polygon || parcel.polygon.length < 3) return;
    const pts = parcel.polygon.map(([lon, lat]) => [lat, lon] as [number, number]);
    mapRef.current.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 19 });
  }, [parcel.polygon]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [parcel.coordinates.lat || 43.64, parcel.coordinates.lon || 5.197],
      zoom: 18,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    const t = TILES.satellite;
    tileRef.current = L.tileLayer(t.url, { maxZoom: 19, subdomains: t.sub || 'abc' }).addTo(map);

    if (parcel.polygon && parcel.polygon.length >= 3) {
      const pts = parcel.polygon.map(([lon, lat]) => [lat, lon] as [number, number]);
      L.polygon(pts, { color: '#0D9488', weight: 3, dashArray: '5, 5', fillColor: '#14B8A6', fillOpacity: 0.28 }).addTo(map);

      pts.forEach(([lat, lon], idx) => {
        const next = pts[(idx + 1) % pts.length];
        const dist = calculateDistanceMeters(lon, lat, next[1], next[0]);
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:#F59E0B;color:#FFF;font-size:9px;font-weight:900;width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;border:2px solid #FFF;box-shadow:0 2px 4px rgba(0,0,0,0.4)">${idx + 1}</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        L.marker([lat, lon], { icon }).addTo(map).bindTooltip(`Borne B${idx + 1} • vers B${((idx + 1) % pts.length) + 1} : ${dist} m`, { direction: 'top', offset: [0, -8] });
      });

      map.fitBounds(L.latLngBounds(pts), { padding: [35, 35], maxZoom: 19 });
    }

    return () => { map.remove(); mapRef.current = null; };
  }, [parcel, fitBounds]);

  const switchLayer = (layer: LayerType) => {
    setActiveLayer(layer);
    if (!mapRef.current || !tileRef.current) return;
    mapRef.current.removeLayer(tileRef.current);
    const t = TILES[layer];
    tileRef.current = L.tileLayer(t.url, { maxZoom: 19, subdomains: t.sub || 'abc' }).addTo(mapRef.current);
  };

  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${parcel.coordinates.lat},${parcel.coordinates.lon}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#F3E8EE] shadow-inner bg-black">
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-[#131B26]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          {(Object.keys(TILES) as LayerType[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => switchLayer(k)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeLayer === k ? 'bg-teal-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
              }`}
            >
              {TILES[k].label}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <a
            href={streetViewUrl}
            target="_blank"
            rel="noreferrer"
            title="Ouvrir Google Street View"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg"
          >
            <span>Street View</span>
            <ExternalLink className="w-3 h-3 text-teal-300" />
          </a>
          {onOpenInspector && (
            <button
              type="button"
              onClick={onOpenInspector}
              title="Agrandir en grand studio"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131B26]/90 backdrop-blur-md border border-white/10 text-white hover:bg-teal-600 text-xs font-bold transition shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio</span>
            </button>
          )}
        </div>
      </div>

      <div ref={containerRef} style={{ height: `${height}px` }} className="w-full z-0 cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-3 right-3 z-[400] flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          title="Zoomer (+)"
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          title="Dézoomer (-)"
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={fitBounds}
          title="Recentrer sur la parcelle"
          className="p-2 rounded-xl bg-[#131B26]/90 backdrop-blur-md text-white border border-white/10 hover:bg-teal-600 transition shadow-lg cursor-pointer"
        >
          <LocateFixed className="w-4 h-4 text-teal-400" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-[400] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-gray-300 font-mono pointer-events-none">
        Parcelle {parcel.section} N°{parcel.numero} • {parcel.contenance} m²
      </div>
    </div>
  );
}
