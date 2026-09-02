'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  FileText,
  Users,
  PenTool,
  PlusCircle,
  TrendingUp,
  Settings
} from 'lucide-react';

export function CockpitMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/cockpit', label: 'Dashboard', icon: ShieldCheck },
    { href: '/cockpit/mandats', label: 'Mandats', icon: FileText },
    { href: '/cockpit/mandats/nouveau', label: 'Créer', icon: PlusCircle, highlight: true },
    { href: '/cockpit/acquereurs', label: 'Acquéreurs', icon: Users },
    { href: '/cockpit/visites', label: 'Visites', icon: PenTool },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F3E8EE] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-[#E12B7B] hover:bg-[#C71B62] text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-95">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#E12B7B] mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                isActive ? 'text-[#E12B7B] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#E12B7B]' : 'text-gray-400'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
