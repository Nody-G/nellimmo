'use client';

import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function ReviewsCtaBox() {
  return (
    <div className="bg-[#131B26] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
      <span className="text-xs uppercase font-bold tracking-widest text-[#C59A45]">
        Votre Projet Immobilier en Provence
      </span>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold max-w-2xl mx-auto">
        Vous souhaitez vendre ou acquérir un bien en toute sérénité ?
      </h2>
      <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
        Contactez directement Nelly Fernandez pour une estimation offerte et un entretien personnalisé à Pélissanne.
      </p>
      <div className="pt-4 flex flex-wrap justify-center gap-4">
        <a
          href="tel:0755686109"
          className="px-6 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition"
        >
          <Phone className="w-4 h-4" />
          07 55 68 61 09
        </a>
        <Link
          href="/contact"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
        >
          Envoyer un message
        </Link>
      </div>
    </div>
  );
}
