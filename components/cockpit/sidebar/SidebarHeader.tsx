'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const SidebarHeader: React.FC = () => {
  return (
    <div className="p-4 border-b border-gray-800 space-y-3.5">
      <div className="flex items-center justify-between">
        <Link href="/cockpit" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
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

      <Link
        href="/cockpit/mandats/nouveau"
        className="w-full py-2.5 px-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Nouveau Mandat</span>
      </Link>
    </div>
  );
};
