'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export function AgenceStorySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-[#F3E8EE] bg-gray-100">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
          alt="L’agence Nell’Immo à Pélissanne"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end p-8">
          <div className="text-white space-y-1">
            <span className="font-serif font-bold text-xl block">Nelly Fernandez</span>
            <span className="text-xs text-[#C59A45] font-semibold block">
              Fondatrice & Négociatrice Immobilière • Pélissanne
            </span>
            <span className="text-[11px] text-gray-300 block">
              26 Avenue des Enjouvènes, 13330 Pélissanne
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
            <span>Actez vos projets sereinement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Le Concept de l’Agence Nell’Immo
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Le concept de l’agence <strong>Nell’Immo</strong> est né aux pieds du magnifique <strong>Massif des Costes à Pélissanne</strong>.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Forte de plus de <strong>15 années d’exercice</strong> en qualité de négociatrice immobilier sur le <strong>Pays Salonais</strong>, sa créatrice <strong>Nelly Fernandez</strong> est à votre écoute du lundi au samedi, par mail ou téléphone.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Avec le concept Nell’Immo, vous bénéficiez :
          </h3>

          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
              <span>
                <strong>Des conseils d’un agent immobilier local expérimenté</strong>, mobile et à votre écoute
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
              <span>
                <strong>De barèmes d’honoraires parmi les plus bas du marché</strong>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
              <span>
                <strong>D’une diffusion de vos biens</strong> sur des sites web d’annonces immobilières à forte audience
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
              <span>
                <strong>D’un accompagnement suivi de votre projet</strong>, avec une visibilité à tout instant grâce à notre espace client
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
              <span>
                <strong>D’outils web de pointe</strong> tels que la diffusion de vidéo mettant en valeur vos biens, pour faire la différence !
              </span>
            </li>
          </ul>
        </div>

        {/* Citation Personnelle de Nelly */}
        <div className="p-4 bg-[#FCFAF7] rounded-2xl border-l-4 border-[#E12B7B] border-y border-r border-[#F3E8EE] space-y-2">
          <p className="text-xs text-gray-800 italic leading-relaxed">
            « Attentive, dévouée, créative et dynamique, je saurai être votre agent immobilier de confiance... pour que vos rêves d’immobilier aboutissent. Alors à bientôt ! »
          </p>
          <span className="text-[11px] font-bold text-[#E12B7B] block">— Nelly Fernandez</span>
        </div>
      </div>
    </div>
  );
}
