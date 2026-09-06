'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Save, Check, RefreshCw } from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel } from '@/lib/cadastre';
import { ParcelMapViewer } from './cadastre/ParcelMapViewer';
import { ParcelSpecsGrid } from './cadastre/ParcelSpecsGrid';

interface MandateCadastreCardProps {
  property: Property;
  onSaveCadastre: (section: string, numero: string, surface: number, idu: string) => Promise<void>;
}

export function MandateCadastreCard({ property, onSaveCadastre }: MandateCadastreCardProps) {
  const [parcel, setParcel] = useState<CadastreParcel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCadastre() {
      setIsLoading(true);
      setNotFound(false);
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
        } else if (isMounted) {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Erreur chargement cadastre:', err);
        if (isMounted) setNotFound(true);
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
          {/* Main Visualizer - Grande fenêtre panoramique immersive 850px */}
          <ParcelMapViewer
            parcel={parcel}
            height={850}
          />

          {/* Technical Specs Grid */}
          <ParcelSpecsGrid property={property} parcel={parcel} />

          {/* Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
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
        </div>
      ) : (
        <div className="text-xs text-gray-400 p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          {isLoading ? (
            'Recherche des coordonnées cadastrales IGN en cours...'
          ) : notFound ? (
            <>
              <span className="block font-semibold text-gray-500 mb-1">
                Parcelle cadastrale introuvable
              </span>
              Aucune parcelle IGN n’a pu être localisée pour cette adresse / ces coordonnées.
              Vérifiez l’adresse du bien ou renseignez la référence cadastrale manuellement.
            </>
          ) : (
            'Aucune donnée cadastrale disponible pour ce bien.'
          )}
        </div>
      )}
    </div>
  );
}
