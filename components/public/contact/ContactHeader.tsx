'use client';

import React from 'react';

export function ContactHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
        Écoute & Proximité • Pélissanne & Pays Salonais
      </span>
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
        Contactez l’Agence Nell’Immo
      </h1>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        Un projet d’achat, une mise en vente ou une question sur le marché provençal ? Nelly Fernandez vous répond avec réactivité.
      </p>
    </div>
  );
}
