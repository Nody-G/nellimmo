'use client';

import React, { useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PropertyType } from '@/lib/types';

import { PublicEstimationFormData } from './estimation-types';

interface EstimationStepSpecsProps {
  formData: PublicEstimationFormData;
  onChange: <K extends keyof PublicEstimationFormData>(field: K, value: PublicEstimationFormData[K]) => void;
  onNext: () => void;
}

const CITY_RATES: Record<string, { min: number; max: number; avg: number }> = {
  'Pélissanne': { min: 3200, max: 4200, avg: 3650 },
  'Salon-de-Provence': { min: 2700, max: 3700, avg: 3150 },
  'Lambesc': { min: 3300, max: 4500, avg: 3850 },
  'Aurons': { min: 3400, max: 4700, avg: 3950 },
  'Grans': { min: 3000, max: 4000, avg: 3450 },
};

export function EstimationStepSpecs({ formData, onChange, onNext }: EstimationStepSpecsProps) {
  const estimatedRange = useMemo(() => {
    const area = Number(formData.livingArea);
    if (!area || area < 15) return null;

    const rates = CITY_RATES[formData.city] || { min: 3000, max: 4000, avg: 3500 };
    let mult = 1.0;
    if (formData.propertyType === 'appartement') mult = 0.95;
    else if (formData.propertyType === 'immeuble') mult = 0.85;

    const poolBonus = formData.hasPool && formData.propertyType === 'maison' ? 22000 : 0;
    const min = Math.round((area * rates.min * mult + poolBonus) / 1000) * 1000;
    const max = Math.round((area * rates.max * mult + poolBonus) / 1000) * 1000;
    const avgM2 = Math.round(rates.avg * mult);

    return { min, max, avgM2 };
  }, [formData.livingArea, formData.city, formData.propertyType, formData.hasPool]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Type de bien
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => onChange('propertyType', e.target.value as PropertyType)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="maison">Maison / Villa</option>
            <option value="appartement">Appartement</option>
            <option value="terrain">Terrain à bâtir</option>
            <option value="immeuble">Immeuble de rapport</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Commune
          </label>
          <select
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="Pélissanne">Pélissanne (13330)</option>
            <option value="Salon-de-Provence">Salon-de-Provence (13300)</option>
            <option value="Lambesc">Lambesc (13410)</option>
            <option value="Aurons">Aurons / La Barben</option>
            <option value="Grans">Grans / Lançon</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
          Adresse ou Quartier
        </label>
        <input
          type="text"
          required
          placeholder="Ex: Chemin des Costes, Quartier Saint-Pierre"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Surface Hab. (m²) *
          </label>
          <input
            type="number"
            required
            placeholder="Ex: 140"
            value={formData.livingArea}
            onChange={(e) => onChange('livingArea', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Terrain (m²)
          </label>
          <input
            type="number"
            placeholder="Ex: 800"
            value={formData.landArea}
            onChange={(e) => onChange('landArea', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Pièces
          </label>
          <input
            type="number"
            placeholder="Ex: 5"
            value={formData.roomsCount}
            onChange={(e) => onChange('roomsCount', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={formData.hasPool}
            onChange={(e) => onChange('hasPool', e.target.checked)}
            className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
          />
          <span>Présence d’une piscine ou aménagement extérieur d’exception</span>
        </label>
      </div>

      {/* Dynamic Instant Price Benchmark */}
      {estimatedRange && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5F8] to-[#FFF9F3] border border-[#F3E8EE] space-y-2 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E12B7B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Repère Marché Indicatif • {formData.city}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              Base DVF ~{estimatedRange.avgM2.toLocaleString('fr-FR')} €/m²
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-serif font-black text-[#131B26]">
              {estimatedRange.min.toLocaleString('fr-FR')} € – {estimatedRange.max.toLocaleString('fr-FR')} €
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">
            Fourchette indicative brute basée sur les transactions du secteur. L’avis de valeur personnalisé de Nelly Fernandez prendra en compte l’exposition, l’état, le calme et les diagnostics réels.
          </p>
        </div>
      )}

      <div className="pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.address || !formData.livingArea}
          className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Étape suivante : Mes coordonnées</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
