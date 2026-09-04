'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

export function SellerCallToActionSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-[#131B26] via-[#1C2532] to-[#131B26] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A45]/20 text-[#C59A45] text-xs font-bold uppercase tracking-wider border border-[#C59A45]/30">
              <TrendingUp className="w-4 h-4" />
              <span>Étude de Marché & Estimation Gratuite</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Vous envisagez de vendre à Pélissanne ou dans les environs ?
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
              Obtenez une estimation personnalisée et objective basée sur les ventes réelles du secteur. Étude complète offerte par Nelly Fernandez.
            </p>
          </div>

          <div className="text-center lg:text-right">
            <Link
              href="/estimation"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <span>Demander mon estimation gratuite</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
