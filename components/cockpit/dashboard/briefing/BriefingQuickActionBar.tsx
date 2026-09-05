'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, PhoneCall, Sparkles, Smartphone, Calculator, Compass } from 'lucide-react';

interface BriefingQuickActionBarProps {
  onOpenQuickCall: () => void;
  onOpenLeadParser: () => void;
  onOpenMobileSync: () => void;
  onOpenFinance: () => void;
  onOpenSellerDiscovery: () => void;
}

export function BriefingQuickActionBar({
  onOpenQuickCall,
  onOpenLeadParser,
  onOpenMobileSync,
  onOpenFinance,
  onOpenSellerDiscovery,
}: BriefingQuickActionBarProps) {
  return (
    <div className="pt-2 border-t border-gray-100">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
        Réflexes Rapides Terrain :
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <Link
          href="/cockpit/visites"
          className="p-2.5 bg-[#FCFAF7] hover:bg-rose-50 border border-rose-100/60 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-rose-700 transition group"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="block leading-tight">Débrief Vocal</span>
            <span className="text-[9px] font-normal text-gray-500">Visite terminée</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={onOpenQuickCall}
          className="p-2.5 bg-[#FCFAF7] hover:bg-emerald-50 border border-emerald-100/60 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-emerald-700 transition group cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block leading-tight">Noter Appel</span>
            <span className="text-[9px] font-normal text-gray-500">Matching 15s</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenLeadParser}
          className="p-2.5 bg-[#FCFAF7] hover:bg-purple-50 border border-purple-100/60 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-purple-700 transition group cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block leading-tight">Coller Lead</span>
            <span className="text-[9px] font-normal text-gray-500">Portail ou SMS</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenFinance}
          className="p-2.5 bg-[#FCFAF7] hover:bg-blue-50 border border-blue-100/60 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-blue-700 transition group cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block leading-tight">Calculette</span>
            <span className="text-[9px] font-normal text-gray-500">Prêt & Notaire</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenSellerDiscovery}
          className="p-2.5 bg-[#FCFAF7] hover:bg-[#FBF6E9] border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-[#967026] transition group cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#967026] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block leading-tight">Découverte R1</span>
            <span className="text-[9px] font-normal text-gray-500">Estimation terrain</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenMobileSync}
          className="p-2.5 bg-[#FCFAF7] hover:bg-amber-50 border border-amber-100/60 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-amber-700 transition group cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#967026] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block leading-tight">Sync Mobile</span>
            <span className="text-[9px] font-normal text-gray-500">PC ↔ Téléphone</span>
          </div>
        </button>
      </div>
    </div>
  );
}
