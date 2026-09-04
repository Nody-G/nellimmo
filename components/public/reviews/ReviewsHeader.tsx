'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function ReviewsHeader() {
  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Avis Contrôlés & Certifiés Conformes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
          Avis Clients & Témoignages
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Découvrez les retours d’expérience authentiques de nos propriétaires vendeurs et acquéreurs accompagnés par Nelly Fernandez à Pélissanne et en Pays Salonais.
        </p>
      </div>

      {/* Mot d'accueil chaleureux de Nelly */}
      <div className="bg-[#FCFAF7] rounded-3xl p-8 sm:p-10 border border-[#F3E8EE] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E12B7B]/10 flex items-center justify-center text-[#E12B7B] font-serif font-black text-lg">
            N
          </div>
          <div>
            <strong className="text-sm font-bold text-gray-900 block">Le mot de Nelly Fernandez</strong>
            <span className="text-xs text-[#C59A45] font-semibold">Fondatrice de l’agence Nell’Immo</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 italic border-l-2 border-[#E12B7B] pl-4 sm:pl-6">
          <p>« Chers clients,</p>
          <p>
            La concrétisation d’un projet n’est pas toujours un long fleuve tranquille, notamment en matière d’immobilier ! J’ai toujours eu à cœur d’exercer mon métier avec dévouement et implication, dans le but d’atteindre vos objectifs.
          </p>
          <p>
            Je vous invite ici à poster vos témoignages, car comme le dit le proverbe :{' '}
            <span className="font-bold text-gray-900 not-italic">
              « Des petits ruisseaux font les grandes rivières »
            </span>
            .
          </p>
          <p>
            En espérant que vos mots reflètent la qualité du travail que je souhaite accomplir au quotidien, et qu’ainsi Nell’Immo devienne votre agence locale, innovante, incontournable et de confiance.
          </p>
          <p className="font-bold not-italic text-gray-900">
            Bien à vous,<br />
            Nelly
          </p>
        </div>
      </div>
    </div>
  );
}
