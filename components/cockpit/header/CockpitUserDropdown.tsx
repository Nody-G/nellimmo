'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Smartphone,
  Calculator,
  Palette,
  LogOut,
  ChevronDown,
  Globe,
  Settings,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { lockVault } from '@/lib/vault';
import { ThemeSwitcherModal } from '@/components/cockpit/theme/ThemeSwitcherModal';

interface CockpitUserDropdownProps {
  onOpenSync: () => void;
}

export function CockpitUserDropdown({ onOpenSync }: CockpitUserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    lockVault();
    router.push('/cockpit');
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-gray-100 transition cursor-pointer border border-gray-200/80 bg-white"
        aria-label="Menu profil et outils"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#E12B7B] to-[#C59A45] flex items-center justify-center text-white font-serif font-bold text-xs shadow-xs">
          NF
        </div>
        <span className="text-xs font-bold text-gray-800 hidden sm:inline">Nelly</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in text-xs">
          {/* En-tête profil */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E12B7B] to-[#C59A45] flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs shrink-0">
              NF
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 truncate">Nelly Fernandez</p>
              <p className="text-[11px] text-gray-400 truncate flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                Gérante • SASU Nell’Immo
              </p>
            </div>
          </div>

          {/* Raccourcis Outils */}
          <div className="p-1 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenSync();
              }}
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-[#FCFAF7] hover:text-[#E12B7B] rounded-xl flex items-center gap-2.5 transition font-medium"
            >
              <Smartphone className="w-4 h-4 text-[#C59A45]" />
              <span>Passerelle Sync Smartphone</span>
            </button>

            <Link
              href="/cockpit/simulateurs"
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-[#FCFAF7] hover:text-[#E12B7B] rounded-xl flex items-center gap-2.5 transition font-medium"
            >
              <Calculator className="w-4 h-4 text-purple-600" />
              <span>Simulateurs Financiers & Notaire</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsThemeOpen(true);
              }}
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-[#FCFAF7] hover:text-[#E12B7B] rounded-xl flex items-center gap-2.5 transition font-medium"
            >
              <Palette className="w-4 h-4 text-[#E12B7B]" />
              <span>Personnalisation Thème</span>
            </button>

            <Link
              href="/biens"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-[#FCFAF7] hover:text-[#E12B7B] rounded-xl flex items-center gap-2.5 transition font-medium"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Voir le Site Public ↗</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent('open-cockpit-help'));
              }}
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-[#FCFAF7] hover:text-[#E12B7B] rounded-xl flex items-center gap-2.5 transition font-medium cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Aide & Raccourcis Clavier</span>
            </button>

            <Link
              href="/cockpit/parametres"
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-[#FCFAF7] hover:text-[#E12B7B] rounded-xl flex items-center gap-2.5 transition font-medium"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Paramètres de l’Agence</span>
            </Link>
          </div>

          {/* Déconnexion */}
          <div className="pt-1 border-t border-gray-100 px-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition font-bold"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Se Déconnecter</span>
            </button>
          </div>
        </div>
      )}

      <ThemeSwitcherModal isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
    </div>
  );
}
