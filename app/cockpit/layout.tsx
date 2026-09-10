'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CockpitSidebar } from '@/components/cockpit/CockpitSidebar';
import { CommandPalette } from '@/components/cockpit/CommandPalette';
import { CockpitMobileNav } from '@/components/cockpit/CockpitMobileNav';
import { ContextualHelpDrawer } from '@/components/cockpit/ContextualHelpDrawer';
import { AuthGate } from '@/components/cockpit/AuthGate';
import { PwaRegister } from '@/components/cockpit/pwa/PwaRegister';
import { NellimoProvider } from '@/lib/store';
import { Menu, X, PlusCircle } from 'lucide-react';
import { LocalMobileSyncModal } from '@/components/cockpit/sync/LocalMobileSyncModal';
import { LocalDataHealthPill } from '@/components/cockpit/LocalDataHealthPill';
import { CopilotDrawer, CopilotFloatingTrigger } from '@/components/cockpit/copilot';
import { CockpitUserDropdown } from '@/components/cockpit/header/CockpitUserDropdown';

export default function CockpitLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSyncOpen, setMobileSyncOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Raccourci clavier universel Ctrl+J ou Cmd+J pour le Copilote
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setCopilotOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NellimoProvider>
      <AuthGate>
        <PwaRegister />
        <div className="min-h-screen bg-[#FAF5F8] flex flex-col md:flex-row text-gray-900 font-sans antialiased pb-16 md:pb-0 print:pb-0 print:bg-white">

          {/* Desktop Sidebar */}
          <div className="hidden md:block print:hidden">
            <CockpitSidebar />
          </div>

          {/* Mobile Header Bar */}
          <div className="md:hidden bg-[#131B26] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md print:hidden">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                aria-label="Ouvrir le menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E12B7B] flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                  N
                </div>
                <span className="font-serif font-bold text-sm tracking-wide">NELL’IMMO</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <CommandPalette />
              <Link
                href="/cockpit/mandats/nouveau"
                className="p-2 bg-[#E12B7B] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="text-[11px] hidden xs:inline">Mandat</span>
              </Link>
              <CockpitUserDropdown onOpenSync={() => setMobileSyncOpen(true)} />
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
              <div className="w-72 bg-[#131B26] h-full shadow-2xl animate-fade-in flex flex-col justify-between">
                <CockpitSidebar />
              </div>
              <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

            {/* Top Header Bar for Desktop */}
            <header className="bg-white/90 backdrop-blur-md border-b border-[#F3E8EE] px-6 py-3 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-2xs print:hidden">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-gray-900 font-serif">Nell’Immo Cockpit</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-medium">Pélissanne & Pays Salonais</span>
                <LocalDataHealthPill onOpenSync={() => setMobileSyncOpen(true)} />
              </div>

              {/* Centre : Recherche Rapide */}
              <div className="flex items-center gap-2">
                <CommandPalette />
              </div>

              {/* Droite : Actions Épurées */}
              <div className="flex items-center gap-2">
                <ContextualHelpDrawer />
                <Link
                  href="/biens"
                  target="_blank"
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl text-xs font-medium border border-gray-200/60 transition"
                  title="Voir la vitrine publique Nell'Immo"
                >
                  Site Public ↗
                </Link>
                <CockpitUserDropdown onOpenSync={() => setMobileSyncOpen(true)} />
              </div>
            </header>

            {/* Page Content View */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 2xl:px-10 w-full max-w-[1920px] mx-auto print:p-0 print:max-w-none">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="print:hidden">
            <CockpitMobileNav />
          </div>

          <LocalMobileSyncModal
            isOpen={mobileSyncOpen}
            onClose={() => setMobileSyncOpen(false)}
          />

          {/* Copilote IA Omniprésent Nell'Immo */}
          <CopilotFloatingTrigger
            isOpen={copilotOpen}
            onOpen={() => setCopilotOpen(true)}
          />
          <CopilotDrawer
            isOpen={copilotOpen}
            onClose={() => setCopilotOpen(false)}
          />
        </div>
      </AuthGate>
    </NellimoProvider>
  );
}
