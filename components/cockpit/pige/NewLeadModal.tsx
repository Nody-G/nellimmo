'use client';

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { SOURCE_OPTIONS } from './pige-types';
import type { NewLeadFormState } from './pige-types';
import { computePigeDvfGap } from './pige-import';
import { AssistedPigeInput } from './AssistedPigeInput';
import { PigeDvfBenchmarkBox } from './PigeDvfBenchmarkBox';

interface NewLeadModalProps {
  isOpen: boolean;
  form: NewLeadFormState;
  onChange: (patch: Partial<NewLeadFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const inputClass =
  'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]';

/** Modal to add a new private-seller listing to the pigeon radar (assisted entry). */
export function NewLeadModal({ isOpen, form, onChange, onSubmit, onClose }: NewLeadModalProps) {
  const dvfGap = useMemo(() => {
    return computePigeDvfGap(form.price, form.surface, form.city);
  }, [form.price, form.surface, form.city]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Ajouter une Annonce de Particulier (Pige)
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <AssistedPigeInput onApplyPatch={onChange} />

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Titre de l’Annonce</label>
            <input
              type="text"
              required
              placeholder="Ex: Villa contemporaine 120m² Pélissanne"
              value={form.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Nom du Vendeur</label>
              <input
                type="text"
                required
                placeholder="Ex: M. Bernard"
                value={form.sellerName}
                onChange={(e) => onChange({ sellerName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                required
                placeholder="06..."
                value={form.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Prix Vendeur (€)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => onChange({ price: Number(e.target.value) })}
                className={`${inputClass} font-bold`}
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Surface (m²)</label>
              <input
                type="number"
                required
                value={form.surface}
                onChange={(e) => onChange({ surface: Number(e.target.value) })}
                className={`${inputClass} font-bold`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Commune</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">
                Quartier / Secteur Terrain
              </label>
              <input
                type="text"
                placeholder="Ex: Les Enjouvènes, Viougues..."
                value={form.neighborhood || ''}
                onChange={(e) => onChange({ neighborhood: e.target.value })}
                className={inputClass}
              />
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {['Enjouvènes', 'Viougues', 'Costes', 'Centre', 'Colline'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onChange({ neighborhood: q })}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 hover:bg-[#E12B7B]/10 hover:text-[#E12B7B] text-gray-600 transition cursor-pointer"
                  >
                    +{q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <PigeDvfBenchmarkBox dvfGap={dvfGap} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Source de l’Annonce</label>
              <select
                value={form.source}
                onChange={(e) => onChange({ source: e.target.value as NewLeadFormState['source'] })}
                className={inputClass}
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Lien Web de l’Annonce</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => onChange({ url: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Notes & Contexte</label>
            <textarea
              rows={2}
              placeholder="Ex: Vente cause mutation, annonce en ligne depuis 3 semaines..."
              value={form.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
          >
            Enregistrer dans le Radar de Pige
          </button>
        </form>
      </div>
    </div>
  );
}
