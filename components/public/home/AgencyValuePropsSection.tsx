'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Phone } from 'lucide-react';

export function AgencyValuePropsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#F3E8EE] shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Spécialiste de l’Immobilier en Pays Salonais</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#131B26] leading-tight">
            Un spécialiste à l’écoute de vos besoins sur Pélissanne & alentours
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            <strong>Nell’Immo</strong>, c’est l’histoire d’une négociatrice immobilière experte en la matière, qui après plus de 15 ans d’exercice sur le Pays Salonais, a souhaité mettre à profit ses compétences à travers des outils innovants et des barèmes d’honoraires parmi les plus bas du marché.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="text-[#E12B7B] font-black text-lg">15+ Ans</span>
              <strong className="block text-gray-900">D’Expérience Locale</strong>
              <p className="text-[11px] text-gray-500">Pélissanne & Pays Salonais</p>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="text-[#3D4E41] font-black text-lg">0 €</span>
              <strong className="block text-gray-900">Estimation Offerte</strong>
              <p className="text-[11px] text-gray-500">Adéquation avec le marché</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/agence"
              className="px-6 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Découvrir l’agence de Nelly
            </Link>
            <a
              href="tel:0755686109"
              className="px-6 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-sm"
            >
              <Phone className="w-4 h-4" />
              07 55 68 61 09
            </a>
          </div>
        </div>

        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-[#F3E8EE]">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
            alt="Nelly Fernandez Nell'Immo Pélissanne"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
            <div className="text-white space-y-0.5">
              <span className="font-serif font-bold text-xl block">Nelly Fernandez</span>
              <span className="text-xs text-[#C59A45] font-semibold block">26 Avenue des Enjouvènes, 13330 Pélissanne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
