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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
            <div className="text-white space-y-1">
              <span className="font-serif font-bold text-xl block">Nelly Fernandez</span>
              <span className="text-xs text-[#C59A45] font-semibold block">Fondatrice & Agent Immobilier • 20 ans d&apos;expertise</span>
              <span className="text-[11px] text-gray-300 block">26 Avenue des Enjouvènes, 13330 Pélissanne</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
              L&apos;immobilier comme une rencontre humaine
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Chez **Nell&apos;Immo**, vous n&apos;êtes pas un numéro parmi des centaines de mandats. Chaque bien immobilier possède son histoire, et chaque projet de vie mérite une attention totale et exclusive.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Forte de près de 20 ans de pratique sur le Pays Salonais (Pélissanne, Salon-de-Provence, Lambesc, Aurons, Grans, Lançon), Nelly met un point d&apos;honneur à vous offrir un accompagnement direct, réactif et sans intermédiaire du premier rendez-vous d&apos;estimation jusqu&apos;à la signature de l&apos;acte authentique.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-sm font-bold text-gray-900 block">Mise en valeur Visuelle Haute Qualité</strong>
                <p className="text-xs text-gray-500">Reportage photographique soigné, plans cotés et vidéos immersives pour sublimer votre bien.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EEF3EF] text-[#3D4E41] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-sm font-bold text-gray-900 block">Rigueur Juridique & Conformité Loi Hoguet</strong>
                <p className="text-xs text-gray-500">Vérification scrupuleuse des diagnostics, solvabilité des acquéreurs et actes sécurisés.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FBF6E9] text-[#C59A45] flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-sm font-bold text-gray-900 block">Honoraires Compétitifs & Justes</strong>
                <p className="text-xs text-gray-500">Barème transparent conforme Loi ALUR, charge acquéreur ou vendeur clairement définie.</p>
              </div>
            </div>
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
