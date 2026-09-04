'use client';

import React from 'react';

export function AgenceHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
        L’Agence de Nelly • Pélissanne & Pays Salonais
      </span>
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
        Une vision humaine, sur-mesure et indépendante
      </h1>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        Fondée et dirigée par Nelly Fernandez, spécialiste reconnue de la transaction immobilière avec près de 20 ans d’expérience sur le secteur.
      </p>
    </div>
  );
}
