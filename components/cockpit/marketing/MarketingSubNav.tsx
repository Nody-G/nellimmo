'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Printer, Radio } from 'lucide-react';

const MARKETING_TABS = [
  { href: '/cockpit/redacteur', label: 'Rédaction d’Annonces IA', icon: Sparkles },
  { href: '/cockpit/fiches-vitrine', label: 'Fiches Vitrine & Affiches', icon: Printer },
  { href: '/cockpit/diffusion', label: 'Passerelles Portails & SeLoger', icon: Radio },
];

export function MarketingSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-gray-100 no-scrollbar mb-4">
      {MARKETING_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition whitespace-nowrap ${
              isActive
                ? 'bg-[#131B26] text-white shadow-2xs font-semibold'
                : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C59A45]' : 'text-gray-400'}`} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
