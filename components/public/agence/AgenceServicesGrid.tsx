'use client';

import React from 'react';

export function AgenceServicesGrid() {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F3E8EE] shadow-xs space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
          Nos Prestations & Engagements
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
          Un Accompagnement Immobilier Complet & Sur-Mesure
        </h2>
        <p className="text-xs text-gray-500">
          Chaque projet est unique : bénéficiez d’un suivi rigoureux et personnalisé de l’estimation initiale jusqu’à la signature chez le notaire.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="font-bold text-sm text-[#131B26]">Estimation & Mise en Valeur</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Étude comparative de marché approfondie, reportage photographique soigné et valorisation de votre bien.
          </p>
        </div>

        <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="font-bold text-sm text-[#131B26]">Multidiffusion Ciblée</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Présence sur les plus grands portails immobiliers et diffusion auprès de notre fichier d’acquéreurs qualifiés.
          </p>
        </div>

        <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="font-bold text-sm text-[#131B26]">Visites & Négociation</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Sélection rigoureuse des candidats, vérification de solvabilité et comptes-rendus systématiques après chaque visite.
          </p>
        </div>

        <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h3 className="font-bold text-sm text-[#131B26]">Suivi Notarial Sécurisé</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Constitution complète du dossier Loi ALUR, interface directe avec l’étude notariale et accompagnement jusqu’à l’acte authentique.
          </p>
        </div>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          Honoraires adaptés et compétitifs définis lors du mandat • Barème complet disponible sur simple demande et à l’agence.
        </p>
      </div>
    </div>
  );
}
