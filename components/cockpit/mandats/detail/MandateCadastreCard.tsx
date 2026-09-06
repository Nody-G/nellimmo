'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Save, Check, RefreshCw, Maximize2 } from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel } from '@/lib/cadastre';
import { ParcelMapViewer } from './cadastre/ParcelMapViewer';
import { ParcelSpecsGrid } from './cadastre/ParcelSpecsGrid';
import { ParcelInspectorModal } from './cadastre/ParcelInspectorModal';

interface MandateCadastreCardProps {
  property: Property;
  onSaveCadastre: (section: string, numero: string, surface: number, idu: string) => Promise<void>;
}

export function MandateCadastreCard({ property, onSaveCadastre }: MandateCadastreCardProps) {
  const [parcel, setParcel] = useState<CadastreParcel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

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

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
      {/* Header */}
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
              Studio Foncier & Parcelle Cotée
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
              IGN Carto Live
            </span>
          )}
        </div>
      </div>

      {parcel ? (
        <div className="space-y-4">
          {/* Main Visualizer */}
          <ParcelMapViewer
            parcel={parcel}
            onOpenInspector={() => setIsInspectorOpen(true)}
            height={240}
          />

          {/* Technical Specs Grid */}
          <ParcelSpecsGrid property={property} parcel={parcel} />

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Ouvrir en plein écran • Simulateur & Géorisques</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enregistré au Mandat !</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>Lier au Mandat</span>
                </>
              )}
            </button>
          </div>

          {/* Fullscreen Inspector Modal */}
          <ParcelInspectorModal
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
            parcel={parcel}
            property={property}
          />
        </div>
      ) : (
        <div className="text-xs text-gray-400 p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          Recherche des coordonnées cadastrales IGN en cours...
        </div>
      )}
    </div>
  );
}
