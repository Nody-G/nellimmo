'use client';

import React from 'react';
import {
  Compass,
  GraduationCap,
  Bus,
  ShoppingCart,
  HeartPulse,
  Navigation,
  ExternalLink,
  Satellite,
  Eye,
} from 'lucide-react';
import type { Property } from '@/lib/types';
import {
  getGoogleMapsPoiUrl,
  getGoogleMapsCommuteUrl,
  getGoogleMapsSatelliteUrl,
  createGoogleStreetViewUrl,
  PROVENCE_COMMUTE_PRESETS,
  PoiCategory,
} from '@/lib/google';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface GoogleMapsNeighborhoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function GoogleMapsNeighborhoodModal({
  isOpen,
  onClose,
  property,
}: GoogleMapsNeighborhoodModalProps) {
  const address = property.address || '';
  const city = property.city || 'Pélissanne';

  const poiCategories: { type: PoiCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'ecoles', label: 'Écoles & Crèches', icon: <GraduationCap className="w-4 h-4" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { type: 'transports', label: 'Gares & Bus', icon: <Bus className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { type: 'commerces', label: 'Commerces & Marchés', icon: <ShoppingCart className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'sante', label: 'Médecins & Pharmacie', icon: <HeartPulse className="w-4 h-4" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  const satelliteUrl = getGoogleMapsSatelliteUrl(address, city, property.latitude, property.longitude);
  const streetViewUrl = createGoogleStreetViewUrl(address, city, property.latitude, property.longitude);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-base text-[#131B26] block">
              Radar Google Maps : Vie de Quartier &amp; Trajets
            </span>
            <span className="text-xs text-gray-500 font-normal">
              {property.title} &bull; {address}, {city}
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {/* 1. Direct Visual Exploration (Satellite & Street View) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={satelliteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-emerald-50 to-white hover:from-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-between transition shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Vue Satellite HD &amp; Soleil</span>
                <span className="text-[10px] text-emerald-700">Vérifier l&apos;exposition Sud/Nord du jardin</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition" />
          </a>

          <a
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 border border-amber-200 rounded-2xl flex items-center justify-between transition shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-950 block">Google Street View 360°</span>
                <span className="text-[10px] text-amber-700">Explorer la rue et le voisinage immédiat</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition" />
          </a>
        </div>

        {/* 2. Radar des Commodités */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            1. Radar des Commodités à Proximité (Google Places)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {poiCategories.map((poi) => (
              <a
                key={poi.type}
                href={getGoogleMapsPoiUrl(address, city, poi.type)}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition hover:shadow-xs ${poi.color}`}
              >
                {poi.icon}
                <span className="text-[11px] font-bold">{poi.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 3. Calculateur de Temps de Trajet Clés (Domicile - Travail) */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            2. Temps de Trajet Quotidien depuis le Bien (Itinéraires Google Maps)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {PROVENCE_COMMUTE_PRESETS.map((preset) => {
              const commuteUrl = getGoogleMapsCommuteUrl(address, city, preset.destination);
              return (
                <a
                  key={preset.id}
                  href={commuteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-200 rounded-xl flex items-center justify-between transition group"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700">
                        {preset.badge}
                      </span>
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {preset.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium block">
                      Temps estimé : <strong className="text-blue-700">{preset.typicalDuration}</strong>
                    </span>
                  </div>
                  <Navigation className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 shrink-0" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
