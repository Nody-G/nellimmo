'use client';

import React, { useState } from 'react';
import { Mic, Smartphone, Sparkles, Megaphone, ScanText, PhoneCall } from 'lucide-react';
import { VoiceDebriefModal } from '@/components/cockpit/visites/VoiceDebriefModal';
import { MobileVisitSignModal } from '@/components/cockpit/visites/MobileVisitSignModal';
import { QuickLeadParserModal } from './leads/QuickLeadParserModal';
import { MandateLaunchPackModal } from '@/components/cockpit/mandats/MandateLaunchPackModal';
import { PigeScannerModal } from '@/components/cockpit/pige/PigeScannerModal';
import { QuickCallModal } from './QuickCallModal';

export function QuickCockpitActionsBar() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [visitSignOpen, setVisitSignOpen] = useState(false);
  const [leadParserOpen, setLeadParserOpen] = useState(false);
  const [launchPackOpen, setLaunchPackOpen] = useState(false);
  const [pigeScannerOpen, setPigeScannerOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100/80">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Actions Express Terrain • Pélissanne & Provence
        </span>
        <span className="text-[10px] text-gray-400 hidden sm:inline">
          Gagnez jusqu’à 1h30 par jour
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          type="button"
          onClick={() => setVoiceOpen(true)}
          className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#E12B7B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-gray-900">Débrief Vocal</span>
            <span className="text-[10px] text-gray-400 font-normal">WhatsApp vendeur</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setVisitSignOpen(true)}
          className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-gray-900">Bon Tactile</span>
            <span className="text-[10px] text-gray-400 font-normal">Signer au doigt</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setLeadParserOpen(true)}
          className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-gray-900">Coller un Lead</span>
            <span className="text-[10px] text-gray-400 font-normal">Portail ou SMS</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setLaunchPackOpen(true)}
          className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#C59A45] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-gray-900">Pack Lancement</span>
            <span className="text-[10px] text-gray-400 font-normal">ALUR & Réseaux</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setPigeScannerOpen(true)}
          className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ScanText className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-gray-900">Scanner Pige</span>
            <span className="text-[10px] text-gray-400 font-normal">DVF & Appel 30s</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCallModalOpen(true)}
          className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-gray-900">Noter Appel</span>
            <span className="text-[10px] text-gray-400 font-normal">Fiche contact</span>
          </div>
        </button>
      </div>

      {/* Modals */}
      <VoiceDebriefModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <MobileVisitSignModal isOpen={visitSignOpen} onClose={() => setVisitSignOpen(false)} />
      <QuickLeadParserModal isOpen={leadParserOpen} onClose={() => setLeadParserOpen(false)} />
      <MandateLaunchPackModal isOpen={launchPackOpen} onClose={() => setLaunchPackOpen(false)} />
      <PigeScannerModal isOpen={pigeScannerOpen} onClose={() => setPigeScannerOpen(false)} />
      <QuickCallModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
