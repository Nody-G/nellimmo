'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CockpitSidebar } from '@/components/cockpit/CockpitSidebar';
import { CommandPalette } from '@/components/cockpit/CommandPalette';
import { CockpitMobileNav } from '@/components/cockpit/CockpitMobileNav';
import { ContextualHelpDrawer } from '@/components/cockpit/ContextualHelpDrawer';
import { AuthGate } from '@/components/cockpit/AuthGate';
import { PwaRegister } from '@/components/cockpit/pwa/PwaRegister';
import { InstallAppButton } from '@/components/cockpit/pwa/InstallAppButton';
import { NellimoProvider } from '@/lib/store';
import { logout } from '@/lib/auth';
import { lockVault } from '@/lib/vault';
import { useRouter } from 'next/navigation';
import { Menu, X, PlusCircle, LogOut, Smartphone, Calculator } from 'lucide-react';
import { LocalMobileSyncModal } from '@/components/cockpit/sync/LocalMobileSyncModal';
import { LocalDataHealthPill } from '@/components/cockpit/LocalDataHealthPill';
import { ThemeSwitcherButton } from '@/components/cockpit/theme/ThemeSwitcherButton';

export default function CockpitLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSyncOpen, setMobileSyncOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    lockVault();
    router.push('/cockpit');
    router.refresh();
  };

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
          <div className="md:hidden bg-[#131B26] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md print:hidden">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-white/10 text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E12B7B] flex items-center justify-center font-serif font-bold text-sm">
                  N
                </div>
                <span className="font-serif font-bold text-base tracking-tight">COCKPIT</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ContextualHelpDrawer />
              <CommandPalette />
              <ThemeSwitcherButton compact />
              <button
                type="button"
                onClick={() => setMobileSyncOpen(true)}
                title="Synchroniser avec le PC"
                className="p-2 rounded-lg bg-white/10 text-[#C59A45] hover:text-white"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <InstallAppButton />
              <Link
                href="/cockpit/mandats/nouveau"
                className="p-2 bg-[#E12B7B] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Mandat</span>
              </Link>
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
            <header className="bg-white border-b border-[#F3E8EE] px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-2xs print:hidden">
              <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-gray-900">Nell&apos;Immo Cockpit</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">Pélissanne & Pays Salonais</span>
                <LocalDataHealthPill onOpenSync={() => setMobileSyncOpen(true)} />
              </div>

              <div className="flex items-center gap-3">
                <ContextualHelpDrawer />
                <CommandPalette />
                <Link
                  href="/cockpit/simulateurs"
                  title="Simulateurs Frais de Notaire & Plus-Value"
                  className="p-2 text-gray-500 hover:text-[#E12B7B] hover:bg-pink-50 rounded-lg text-xs font-bold transition flex items-center cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                </Link>
                <ThemeSwitcherButton />
                <InstallAppButton />
                <button
                  type="button"
                  onClick={() => setMobileSyncOpen(true)}
                  title="Synchroniser avec votre smartphone"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#967026] border border-amber-200/80 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Sync Mobile</span>
                </button>
                <button
                  onClick={handleLogout}
                  title="Se déconnecter"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Déconnexion
                </button>
                <Link
                  href="/biens"
                  target="_blank"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                >
                  Voir le Site Public ↗
                </Link>
                <Link
                  href="/cockpit/mandats/nouveau"
                  className="px-3.5 py-1.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Nouveau Mandat
                </Link>
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
        </div>
      </AuthGate>
    </NellimoProvider>
  );
}
