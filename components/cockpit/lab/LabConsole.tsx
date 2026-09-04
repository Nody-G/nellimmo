'use client';

import React from 'react';
import { Bot, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';
import type { Property } from '@/lib/types';
import type { LabMode } from './lab-types';

interface LabConsoleProps {
  properties: Property[];
  selectedPropertyId: string;
  onSelectPropertyId: (id: string) => void;
  currentProperty: Property | undefined;
  activeMode: LabMode;
  userPrompt: string;
  onChangeUserPrompt: (val: string) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  generatedOutput: string;
  copied: boolean;
  onCopy: () => void;
}

export function LabConsole({
  properties,
  selectedPropertyId,
  onSelectPropertyId,
  currentProperty,
  activeMode,
  userPrompt,
  onChangeUserPrompt,
  onGenerate,
  isProcessing,
  generatedOutput,
  copied,
  onCopy,
}: LabConsoleProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Prompt Editor & Property Context */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-5">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold text-[#E12B7B] tracking-wider block">
            Étape 1 • Contexte du Bien
          </span>
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Associer un Mandat de l&apos;Agence
          </h3>
          <p className="text-xs text-gray-500">
            L&apos;IA prendra en compte le prix, la ville, les surfaces et les caractéristiques exactes du bien.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Mandat Associé
          </label>
          <select
            value={selectedPropertyId}
            onChange={(e) => onSelectPropertyId(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs text-gray-800 focus:outline-[#E12B7B]"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                [{formatMandateRef(p.mandate_number)}] {p.title} — {p.city} ({p.price_fai.toLocaleString('fr-FR')} €)
              </option>
            ))}
          </select>
        </div>

        {currentProperty && (
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs grid grid-cols-2 gap-2 text-gray-600 font-medium">
            <span>Ville : <strong className="text-gray-900">{currentProperty.city}</strong></span>
            <span>Surface : <strong className="text-gray-900">{currentProperty.living_area} m²</strong></span>
            <span>Prix FAI : <strong className="text-gray-900">{currentProperty.price_fai.toLocaleString('fr-FR')} €</strong></span>
            <span>Mandat : <strong className="text-gray-900">{currentProperty.mandate_type}</strong></span>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase text-gray-700">
              Étape 2 • Instructions & Prompt Personnalisé
            </label>
            <span className="text-[10px] text-gray-400">Mode {activeMode}</span>
          </div>
          <textarea
            rows={5}
            value={userPrompt}
            onChange={(e) => onChangeUserPrompt(e.target.value)}
            placeholder="Décrivez votre problématique ou consigne précise pour l'IA..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs leading-relaxed focus:outline-[#E12B7B] resize-none"
          />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isProcessing || !userPrompt.trim()}
          className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Génération & Réflexion en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Lancer le Laboratoire d&apos;Idées</span>
            </>
          )}
        </button>
      </div>

      {/* Output Console Terminal */}
      <div className="bg-[#131B26] text-white rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-base text-white">
              Restitution Haute Précision
            </h3>
          </div>

          {generatedOutput && (
            <button
              type="button"
              onClick={onCopy}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          )}
        </div>

        {generatedOutput ? (
          <div className="bg-[#0E141D] p-5 rounded-2xl border border-gray-800/80 font-mono text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto">
            {generatedOutput}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-gray-500 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-gray-600 animate-pulse" />
            <p>Sélectionnez un scénario d&apos;inspiration ou saisissez votre consigne pour générer une stratégie sur-mesure.</p>
          </div>
        )}
      </div>
    </div>
  );
}
