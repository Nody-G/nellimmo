'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Users,
  PenTool,
  Printer,
  Radio,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  Settings,
  ExternalLink,
  PlusCircle
} from 'lucide-react';

export function CockpitSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Tableau de Bord', href: '/cockpit', icon: LayoutDashboard },
    { name: 'Mandats & Biens', href: '/cockpit/mandats', icon: FileText },
    { name: 'Studio Rédaction', href: '/cockpit/redacteur', icon: Sparkles },
    { name: 'Avis de Valeur', href: '/cockpit/avis-de-valeur', icon: TrendingUp },
    { name: 'Acquéreurs & Matching', href: '/cockpit/acquereurs', icon: Users },
    { name: 'Bons de Visite', href: '/cockpit/visites', icon: PenTool },
    { name: 'Fiches Vitrine', href: '/cockpit/fiches-vitrine', icon: Printer },
    { name: 'Multidiffusion Portails', href: '/cockpit/diffusion', icon: Radio },
    { name: 'Registre des Mandats', href: '/cockpit/registre-dgccrf', icon: ShieldCheck },
    { name: 'Import Hektor', href: '/cockpit/import-hektor', icon: FileSpreadsheet },
    { name: 'Paramètres Agence', href: '/cockpit/parametres', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#131B26] text-white flex flex-col justify-between shrink-0 border-r border-gray-800 min-h-screen">
      
      {/* Brand & Agency Header */}
      <div className="p-5 border-b border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/cockpit" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-serif font-black text-xl shadow-md">
              N
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-tight block leading-none">
                COCKPIT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C59A45]">
                Nell&apos;Immo
              </span>
            </div>
          </Link>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Système en ligne" />
        </div>

        {/* Quick CTA New Mandate */}
        <Link
          href="/cockpit/mandats/nouveau"
          className="w-full py-2.5 px-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Nouveau Mandat
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
          Gestion & Production
        </span>

        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/cockpit' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#E12B7B] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Switch to Public */}
      <div className="p-4 border-t border-gray-800 space-y-3 bg-[#0E141D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E12B7B] flex items-center justify-center text-white font-bold text-xs">
            NF
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">Nelly Fernandez</span>
            <span className="text-[10px] text-[#C59A45] block truncate">CPI 1310 2019 000 042 974</span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition"
        >
          <span>Voir le site public nellimo.fr</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </aside>
  );
}

export default CockpitSidebar;
