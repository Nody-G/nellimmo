'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Sparkles, CheckCircle2, Phone, MapPin, ArrowRight, Camera, Clock } from 'lucide-react';

export default function AgencyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
          L&apos;Agence de Nelly • Pélissanne & Pays Salonais
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#131B26]">
          Une vision humaine, sur-mesure et indépendante
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Fondée et dirigée par Nelly Fernandez, spécialiste reconnue de la transaction immobilière avec près de 20 ans d&apos;expérience sur le secteur.
        </p>
      </div>

      {/* Story & Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-[#F3E8EE] bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
            alt="L'agence Nell'Immo à Pélissanne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end p-8">
            <div className="text-white space-y-1">
              <span className="font-serif font-bold text-xl block">Nelly Fernandez</span>
              <span className="text-xs text-[#C59A45] font-semibold block">Fondatrice & Négociatrice Immobilière • Pélissanne</span>
              <span className="text-[11px] text-gray-300 block">26 Avenue des Enjouvènes, 13330 Pélissanne</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
              <span>Actez vos projets sereinement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
              Le Concept de l&apos;Agence Nell&apos;Immo
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Le concept de l&apos;agence <strong>Nell&apos;Immo</strong> est né aux pieds du magnifique <strong>Massif des Costes à Pélissanne</strong>.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Forte de plus de <strong>15 années d&apos;exercice</strong> en qualité de négociatrice immobilier sur le <strong>Pays Salonais</strong>, sa créatrice <strong>Nelly Fernandez</strong> est à votre écoute du lundi au samedi, par mail ou téléphone.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Avec le concept Nell&apos;Immo, vous bénéficiez :
            </h3>

            <ul className="space-y-2.5 text-xs text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>Des conseils d&apos;un agent immobilier local expérimenté</strong>, mobile et à votre écoute</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>De barèmes d&apos;honoraires parmi les plus bas du marché</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>D&apos;une diffusion de vos biens</strong> sur des sites web d&apos;annonces immobilières à forte audience</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>D&apos;un accompagnement suivi de votre projet</strong>, avec une visibilité à tout instant grâce à notre espace client</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span><strong>D&apos;outils web de pointe</strong> tels que la diffusion de vidéo mettant en valeur vos biens, pour faire la différence !</span>
              </li>
            </ul>
          </div>

          {/* Citation Personnelle de Nelly */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border-l-4 border-[#E12B7B] border-y border-r border-[#F3E8EE] space-y-2">
            <p className="text-xs text-gray-800 italic leading-relaxed">
              « Attentive, dévouée, créative et dynamique, je saurai être votre agent immobilier de confiance... pour que vos rêves d&apos;immobilier aboutissent. Alors à bientôt ! »
            </p>
            <span className="text-[11px] font-bold text-[#E12B7B] block">— Nelly Fernandez</span>
          </div>
        </div>
      </div>

      {/* Barème Officiel d'Honoraires Loi ALUR */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F3E8EE] shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
            Transparence Tarifaire (Loi ALUR & Arrêté du 10 janvier 2017)
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Barème d&apos;Honoraires de l&apos;Agence Nell&apos;Immo
          </h2>
          <p className="text-xs text-gray-500">
            Honoraires TTC (Taux de TVA en vigueur 20%) à la charge de l&apos;acquéreur ou du vendeur selon mandat.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FCFAF7] border-y border-[#F3E8EE] text-gray-700 font-bold uppercase text-[11px]">
                <th className="p-4">Tranche de Prix de Vente</th>
                <th className="p-4">Taux d&apos;Honoraires TTC Maximum</th>
                <th className="p-4">Type de Mandat & Prestations Incluses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-4 font-bold">Jusqu&apos;à 150 000 €</td>
                <td className="p-4 font-bold text-[#E12B7B]">Forfait 7 500 € TTC</td>
                <td className="p-4 text-gray-600">Estimation, reportage photo, diffusion multi-portails</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">De 150 001 € à 300 000 €</td>
                <td className="p-4 font-bold text-[#E12B7B]">5.00 % TTC</td>
                <td className="p-4 text-gray-600">Visites qualifiées, compte-rendu sous 24h, négociation</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">De 300 001 € à 600 000 €</td>
                <td className="p-4 font-bold text-[#E12B7B]">4.50 % TTC</td>
                <td className="p-4 text-gray-600">Vidéo prestige, rapprochement CRM, accompagnement notaire</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Au-delà de 600 001 €</td>
                <td className="p-4 font-bold text-[#E12B7B]">4.00 % TTC</td>
                <td className="p-4 text-gray-600">Stratégie confidentielle sur-mesure & diffusion prioritaire</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Info & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
          <MapPin className="w-5 h-5 text-[#E12B7B]" />
          <strong className="text-sm font-bold block text-gray-900">Adresse de l&apos;Agence</strong>
          <span className="text-xs text-gray-600 block">
            26 Avenue des Enjouvènes<br />13330 Pélissanne
          </span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
          <Clock className="w-5 h-5 text-[#E12B7B]" />
          <strong className="text-sm font-bold block text-gray-900">Horaires d&apos;Ouverture</strong>
          <span className="text-xs text-gray-600 block">
            Du Lundi au Vendredi<br />De 08h00 à 18h00 (et sur RDV le samedi)
          </span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] space-y-2">
          <Phone className="w-5 h-5 text-[#E12B7B]" />
          <strong className="text-sm font-bold block text-gray-900">Contact Direct</strong>
          <span className="text-xs text-gray-600 block">
            Tél : 07 55 68 61 09<br />E-mail : nellimmo.acte@gmail.com
          </span>
        </div>
      </div>

    </div>
  );
}
