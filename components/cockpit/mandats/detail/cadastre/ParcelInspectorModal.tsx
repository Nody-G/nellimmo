'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Calculator, ShieldAlert, Map, Globe, Compass } from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel } from '@/lib/cadastre';
import { ParcelMapViewer } from './ParcelMapViewer';

interface ParcelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: CadastreParcel;
  property: Property;
}

const PRESETS = [
  { label: 'Haie Vive', price: 40 },
  { label: 'Grillage Pro', price: 75 },
  { label: 'Clôture Alu', price: 150 },
];

export function ParcelInspectorModal({
  isOpen,
  onClose,
  parcel,
  property,
}: ParcelInspectorModalProps) {
  const [costPerMeter, setCostPerMeter] = useState<number>(75);
  const perimeter = parcel.perimeter || 100;
  const totalCost = Math.round(perimeter * costPerMeter);

  if (!isOpen) return null;

  const googleMapsSatUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${parcel.coordinates.lat},${parcel.coordinates.lon}&zoom=19&basemap=satellite`;

  const portalLinks = [
    { label: 'cadastre.gouv', icon: Map, color: 'text-teal-600', url: parcel.cadastreGouvUrl },
    { label: 'IGN Géoportail', icon: Globe, color: 'text-teal-600', url: parcel.geoportailUrl },
    { label: 'Géorisques', icon: ShieldAlert, color: 'text-amber-600', url: 'https://www.georisques.gouv.fr/' },
    { label: 'Google Sat HD', icon: Globe, color: 'text-blue-600', url: googleMapsSatUrl },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#F3E8EE]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FCFAF7]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-700">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg text-[#131B26]">
                  Studio Foncier & Cadastre Haute Précision
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  Section {parcel.section} N°{parcel.numero}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {property.address} • {property.postal_code} {property.city} ({parcel.contenance} m²)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ParcelMapViewer parcel={parcel} onOpenInspector={() => {}} height={380} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              {/* Simulateur Clôture & Haies */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131B26] flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-teal-600" />
                    Simulateur Clôture / Haie
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">{perimeter} ML à clore</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCostPerMeter(preset.price)}
                      className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        costPerMeter === preset.price
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">{preset.label}</div>
                      <div>{preset.price} €/m</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <span className="text-xs text-gray-600">Budget estimé TTC :</span>
                  <span className="text-base font-black text-teal-800 font-mono">
                    {totalCost.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>

              {/* Limites de propriété */}
              {parcel.segments && parcel.segments.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 max-h-[150px] overflow-y-auto">
                  <span className="text-xs font-bold text-[#131B26] block">Limites de propriété & Linéaires</span>
                  <div className="space-y-1">
                    {parcel.segments.map((seg) => (
                      <div key={seg.index} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                        <span className="text-gray-500">
                          Borne B{seg.index} → B{(seg.index % parcel.segments!.length) + 1} ({seg.cardinalLabel})
                        </span>
                        <span className="font-mono font-bold text-gray-900">{seg.lengthMeters} m</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portails d’État */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2.5">
                <span className="text-xs font-bold text-teal-900 block">Portails d’État & Cartographie Officielle</span>
                <div className="grid grid-cols-2 gap-2">
                  {portalLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-teal-100 text-xs font-medium text-gray-700 hover:text-teal-700 hover:border-teal-300 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${link.color}`} />
                          {link.label}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
