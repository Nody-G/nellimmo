'use client';

import React from 'react';
import {
  BrainCircuit,
  Lightbulb,
  FileSignature,
  PartyPopper,
} from 'lucide-react';
import type { LabMode } from './lab-types';

interface LabHeaderProps {
  activeMode: LabMode;
  onSelectMode: (mode: LabMode) => void;
}

export function LabHeader({ activeMode, onSelectMode }: LabHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <BrainCircuit className="w-4 h-4" />
            <span>Incubateur d&apos;Idées & Intelligence Augmentée</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Nell&apos;IA Infinite Lab
          </h1>
          <p className="text-xs text-gray-500">
            Brainstorming d&apos;angles de vente, simulations de négociation, clauses juridiques et événements VIP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FCFAF7] border border-[#E9DFD3] text-[#C59A45] flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Espace Stratégie & Idéation</span>
          </span>
        </div>
      </div>

      {/* Workshop Mode Selector (4 Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onSelectMode('ideation')}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${
            activeMode === 'ideation'
              ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Lightbulb className="w-5 h-5 text-[#C59A45]" />
          <h3 className="font-serif font-bold text-sm">1. Idéation & Brainstorming</h3>
          <p className="text-[11px] opacity-75 leading-tight">
            Relancer des mandats, concepts marketing, partenariats locaux.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('negotiation')}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${
            activeMode === 'negotiation'
              ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <BrainCircuit className="w-5 h-5 text-[#E12B7B]" />
          <h3 className="font-serif font-bold text-sm">2. Négociation & Tactique</h3>
          <p className="text-[11px] opacity-75 leading-tight">
            Réponses aux offres agressives, psychologie vendeur/acheteur.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('legal_clauses')}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${
            activeMode === 'legal_clauses'
              ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FileSignature className="w-5 h-5 text-blue-500" />
          <h3 className="font-serif font-bold text-sm">3. Clauses & Notariat</h3>
          <p className="text-[11px] opacity-75 leading-tight">
            Conditions suspensives sur-mesure, servitudes, divisions.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('vip_events')}
          className={`p-4 rounded-3xl border text-left transition space-y-1.5 cursor-pointer ${
            activeMode === 'vip_events'
              ? 'bg-[#131B26] text-white border-[#131B26] shadow-md ring-2 ring-[#E12B7B]'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <PartyPopper className="w-5 h-5 text-emerald-500" />
          <h3 className="font-serif font-bold text-sm">4. Événements VIP & Salons</h3>
          <p className="text-[11px] opacity-75 leading-tight">
            Visites nocturnes privées, cocktails d&apos;inauguration de mandat.
          </p>
        </button>
      </div>
    </div>
  );
}
