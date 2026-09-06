'use client';

import React, { useState, useEffect } from 'react';
import { Portal } from '@/components/ui/Portal';
import {
  X,
  ExternalLink,
  ShieldAlert,
  Map,
  Globe,
  Compass,
  Printer,
  Navigation,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel } from '@/lib/cadastre';
import { ParcelMapViewer } from './ParcelMapViewer';

interface ParcelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: CadastreParcel;
  property: Property;
}

export function ParcelInspectorModal({
  isOpen,
  onClose,
  parcel,
  property,
}: ParcelInspectorModalProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [copiedGps, setCopiedGps] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lat = parcel.coordinates?.lat || 43.64;
  const lon = parcel.coordinates?.lon || 5.197;
  const gpsCoordStr = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

  const handleCopyGps = () => {
    navigator.clipboard.writeText(gpsCoordStr);
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 2000);
  };

  const googleMapsSatUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lon}&zoom=19&basemap=satellite`;
  const earth3dUrl = `https://earth.google.com/web/@${lat},${lon},150a,600d,35y,0h,45t,0r`;
  const gpsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  const portalLinks = [
    { label: 'cadastre.gouv.fr', icon: Map, color: 'text-teal-400', url: parcel.cadastreGouvUrl },
    { label: 'IGN Géoportail', icon: Globe, color: 'text-teal-400', url: parcel.geoportailUrl },
    { label: 'Géorisques (ERRIAL)', icon: ShieldAlert, color: 'text-amber-400', url: 'https://errial.georisques.gouv.fr/' },
    { label: 'Google Earth 3D', icon: Globe, color: 'text-blue-400', url: earth3dUrl },
    { label: 'Google Sat HD', icon: Globe, color: 'text-blue-400', url: googleMapsSatUrl },
    { label: 'Itinéraire GPS', icon: Navigation, color: 'text-emerald-400', url: gpsDirectionsUrl },
  ];

  const surface = parcel.contenance || 0;
  const livingArea = property.living_area || 0;
  const gardenArea = surface && livingArea && surface > livingArea ? surface - livingArea : null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#070D1B] flex flex-col overflow-hidden text-white animate-in fade-in duration-200">
        {/* Fullscreen HUD Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0B132B]/95 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-black text-base sm:text-lg text-white">
                  Grand Studio Foncier & Cadastre Plein Écran
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                  Section {parcel.section} N°{parcel.numero}
                </span>
                <span className="text-teal-400 text-xs font-bold font-mono">
                  • {parcel.contenance} m²
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                {property.address} • {property.postal_code} {property.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copie GPS */}
            <button
              type="button"
              onClick={handleCopyGps}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Copier les coordonnées GPS précises"
            >
              {copiedGps ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              <span className="hidden md:inline font-mono">{copiedGps ? 'Copié !' : 'GPS'}</span>
            </button>

            {/* Imprimer Fiche */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-teal-500/40"
              title="Imprimer ou exporter en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#C59A45]" />
              <span className="hidden sm:inline">Imprimer Fiche PDF</span>
            </button>

            {/* Bouton Fermer */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer border border-white/10"
              title="Fermer (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 100% Viewport Map Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <ParcelMapViewer
            parcel={parcel}
            onOpenInspector={() => {}}
            height="100%"
          />

          {/* Floating HUD Drawer Trigger */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowPanel((cur) => !cur)}
              className="px-4 py-2 rounded-2xl bg-[#0B132B]/95 backdrop-blur-md border border-white/20 text-white hover:bg-teal-600/80 transition text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-teal-400" />
              <span>{showPanel ? 'Masquer Fiche Technique & Portails' : 'Détails Foncier, Limites & Portails SIG'}</span>
              {showPanel ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible HUD Bottom Panel */}
          {showPanel && (
            <div className="absolute bottom-16 left-3 right-3 sm:left-6 sm:right-6 max-h-[48vh] overflow-y-auto bg-[#0B132B]/98 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl z-40 animate-in slide-in-from-bottom duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Spécifications & Extérieurs */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Spécifications & Extérieurs
                  </span>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Surface Cadastrale :</span>
                      <span className="font-bold font-mono text-white">{parcel.contenance} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Périmètre Total :</span>
                      <span className="font-bold font-mono text-white">{parcel.perimeter} ML</span>
                    </div>
                    {gardenArea && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Plein Air / Jardin :</span>
                        <span>~{gardenArea.toLocaleString('fr-FR')} m² non bâtis ({Math.round((gardenArea / surface) * 100)}%)</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Exposition :</span>
                      <span className="font-bold text-amber-300">{parcel.exposure || 'Sud / Traversant'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IDU National :</span>
                      <span className="font-mono text-gray-300 text-[11px]">{property.cadastral_id || parcel.idu}</span>
                    </div>
                  </div>
                </div>

                {/* Limites Métrées */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 max-h-[180px] overflow-y-auto">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Limites de Propriété ({parcel.segments?.length || 0} côtés)
                  </span>
                  <div className="space-y-1">
                    {parcel.segments?.map((seg) => (
                      <div key={seg.index} className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                        <span className="text-gray-400">
                          B{seg.index} → B{(seg.index % parcel.segments!.length) + 1} ({seg.cardinalLabel})
                        </span>
                        <span className="font-mono font-bold text-teal-300">{seg.lengthMeters} m</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portails d'État & SIG */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Portails d&apos;État & Outils SIG
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {portalLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-gray-200 hover:text-white transition"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${link.color}`} />
                            <span className="truncate">{link.label}</span>
                          </span>
                          <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}


