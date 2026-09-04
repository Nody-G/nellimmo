'use client';

import React, { useState, useEffect } from 'react';
import { Compass, ExternalLink, Save, Check, MapPin, RefreshCw } from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel, generateSvgParcelPath } from '@/lib/cadastre';

interface MandateCadastreCardProps {
  property: Property;
  onSaveCadastre: (section: string, numero: string, surface: number, idu: string) => Promise<void>;
}

export function MandateCadastreCard({ property, onSaveCadastre }: MandateCadastreCardProps) {
  const [parcel, setParcel] = useState<CadastreParcel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCadastre() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (property.latitude && property.longitude) {
          params.set('lat', String(property.latitude));
          params.set('lon', String(property.longitude));
        }
        params.set('address', property.address);
        params.set('postal_code', property.postal_code);
        params.set('city', property.city);

        const res = await fetch(`/api/cadastre?${params.toString()}`);
        const data = await res.json();
        if (isMounted && data.success && data.parcel) {
          setParcel(data.parcel);
        }
      } catch (err) {
        console.error('Erreur chargement cadastre:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCadastre();
    return () => {
      isMounted = false;
    };
  }, [property.address, property.postal_code, property.city, property.latitude, property.longitude]);

  const handleSave = async () => {
    if (!parcel) return;
    await onSaveCadastre(parcel.section, parcel.numero, parcel.contenance, parcel.idu);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const svgPath = parcel?.polygon ? generateSvgParcelPath(parcel.polygon, 200, 140, 15) : '';

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700 block">
              Cadastre & Foncier Officiel
            </span>
            <h4 className="font-serif font-bold text-sm text-[#131B26]">
              Parcelle IGN & Référence Foncière
            </h4>
          </div>
        </div>

        {isLoading ? (
          <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
            IGN Carto Live
          </span>
        )}
      </div>

      {parcel ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* SVG Vector Parcel Preview */}
          <div className="md:col-span-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl p-3 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
            {svgPath ? (
              <svg width="200" height="140" className="w-full h-auto max-h-[120px]">
                <path
                  d={svgPath}
                  fill="#0D9488"
                  fillOpacity="0.15"
                  stroke="#0D9488"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Tracé géométrique disponible</span>
              </div>
            )}
            <span className="text-[9px] font-mono text-gray-400 absolute bottom-1.5 right-2">
              Échelle vectorielle IGN
            </span>
          </div>

          {/* Details & Specs */}
          <div className="md:col-span-8 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-medium block">Section Cadastrale</span>
                <span className="font-black text-[#131B26] text-sm">
                  Section {property.cadastral_section || parcel.section}
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-medium block">N° de Parcelle</span>
                <span className="font-black text-[#131B26] text-sm font-mono">
                  N° {property.cadastral_number || parcel.numero}
                </span>
              </div>
              <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-teal-800 font-medium block">Contenance Foncière</span>
                <span className="font-black text-teal-900 text-sm">
                  {(property.cadastral_surface || parcel.contenance).toLocaleString('fr-FR')} m²
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-600 flex items-center gap-1.5 font-mono">
              <span className="text-gray-400">IDU National :</span>
              <strong className="text-gray-800">{property.cadastral_id || parcel.idu}</strong>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <a
                  href={parcel.geoportailUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Géoportail IGN</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-300">•</span>
                <a
                  href={parcel.cadastreGouvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-gray-600 hover:underline flex items-center gap-1"
                >
                  <span>cadastre.gouv.fr</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enregistré !</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-[#C59A45]" />
                    <span>Lier au Mandat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 p-4 text-center">
          Recherche des coordonnées cadastrales en cours...
        </div>
      )}
    </div>
  );
}
