'use client';

import React, { useState } from 'react';
import { Ruler, Sun, Compass, MapPin, Hash, ShieldCheck, Copy, Check, Trees } from 'lucide-react';
import type { Property } from '@/lib/types';
import { CadastreParcel } from '@/lib/cadastre';

interface ParcelSpecsGridProps {
  property: Property;
  parcel: CadastreParcel;
}

export function ParcelSpecsGrid({ property, parcel }: ParcelSpecsGridProps) {
  const [copied, setCopied] = useState(false);
  const section = property.cadastral_section || parcel.section;
  const numero = property.cadastral_number || parcel.numero;
  const surface = property.cadastral_surface || parcel.contenance;
  const perimeter = parcel.perimeter;
  const dimensions = parcel.dimensions;
  const exposure = parcel.exposure || 'Sud / Traversant (Ensoleillement optimal)';
  const idu = property.cadastral_id || parcel.idu;
  const livingArea = property.living_area || 0;
  const gardenArea = surface && livingArea && surface > livingArea ? surface - livingArea : null;

  const handleCopyIdu = () => {
    if (!idu) return;
    navigator.clipboard.writeText(idu);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Section & N° */}
        <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100/80">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Hash className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Cadastre</span>
          </div>
          <div className="text-sm font-black text-[#131B26]">
            Section {section} <span className="font-mono text-teal-800">N° {numero}</span>
          </div>
        </div>

        {/* Contenance Foncière */}
        <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100/80">
          <div className="flex items-center gap-1.5 text-teal-800 mb-1">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Contenance</span>
          </div>
          <div className="text-sm font-black text-teal-950">
            {surface ? `${surface.toLocaleString('fr-FR')} m²` : 'Non renseignée'}
          </div>
        </div>

        {/* Périmètre Linéaire (ML) */}
        <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100/80">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Ruler className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Périmètre Total</span>
          </div>
          <div className="text-sm font-black text-[#131B26]">
            {perimeter ? `${perimeter.toLocaleString('fr-FR')} ML` : '—'}
          </div>
        </div>

        {/* Gabarit Terrain */}
        <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100/80">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Gabarit</span>
          </div>
          <div className="text-xs font-bold text-[#131B26] truncate">
            {dimensions ? `${dimensions.width} m × ${dimensions.depth} m` : 'Régulier'}
          </div>
        </div>

        {/* Exposition Solaire */}
        <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100/60 col-span-2">
          <div className="flex items-center gap-1.5 text-amber-700 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Exposition & Ensoleillement</span>
          </div>
          <div className="text-xs font-bold text-amber-950">{exposure}</div>
        </div>

        {/* Espaces Verts / Plein Air */}
        {gardenArea && (
          <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 col-span-2">
            <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
              <Trees className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Extérieurs & Plein Air</span>
            </div>
            <div className="text-xs font-bold text-emerald-950">
              ~{gardenArea.toLocaleString('fr-FR')} m² non bâtis ({Math.round((gardenArea / surface) * 100)}% de la parcelle)
            </div>
          </div>
        )}

        {/* IDU National */}
        <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100/80 col-span-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Identifiant Unique (IDU)</span>
            </div>
            <div className="text-xs font-mono font-bold text-gray-800 tracking-tight">
              {idu}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyIdu}
            className="px-2.5 py-1 bg-white border border-gray-200 hover:border-teal-500 text-gray-700 hover:text-teal-700 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
            title="Copier l'identifiant cadastral"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

