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
          className="p-2.5 rounded-xl bg-[#FAF5F8] hover:bg-[#F3E8EE] border border-[#F3E8EE] text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#E12B7B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold leading-tight truncate">Débrief Vocal</span>
            <span className="text-[9px] text-gray-500 font-medium">WhatsApp vendeur</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setVisitSignOpen(true)}
          className="p-2.5 rounded-xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold leading-tight truncate">Bon Tactile</span>
            <span className="text-[9px] text-gray-500 font-medium">Signer au doigt</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setLeadParserOpen(true)}
          className="p-2.5 rounded-xl bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold leading-tight truncate">Coller un Lead</span>
            <span className="text-[9px] text-gray-500 font-medium">Portail ou SMS</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setLaunchPackOpen(true)}
          className="p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-100 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold leading-tight truncate">Pack Lancement</span>
            <span className="text-[9px] text-gray-500 font-medium">ALUR & Réseaux</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setPigeScannerOpen(true)}
          className="p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ScanText className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold leading-tight truncate">Scanner Pige</span>
            <span className="text-[9px] text-gray-500 font-medium">DVF & Appel 30s</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCallModalOpen(true)}
          className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-800 flex items-center gap-2.5 transition text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gray-200/80 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold leading-tight truncate">Noter Appel</span>
            <span className="text-[9px] text-gray-500 font-medium">Fiche contact</span>
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
