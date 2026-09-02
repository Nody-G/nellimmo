'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { TrendingUp, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { PropertyType } from '@/lib/types';

export default function PublicEstimationPage() {
  const { addEstimationLead } = useNellimoStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: 'maison' as PropertyType,
    city: 'Pélissanne',
    address: '',
    livingArea: '',
    landArea: '',
    roomsCount: '',
    hasPool: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEstimationLead({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      property_type: formData.propertyType,
      city: formData.city,
      address: formData.address,
      living_area: Number(formData.livingArea) || 0,
      land_area: formData.landArea ? Number(formData.landArea) : undefined,
      rooms_count: formData.roomsCount ? Number(formData.roomsCount) : undefined,
      has_pool: formData.hasPool,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1.5 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Estimation Immobilière Gratuite & Sans Engagement
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#131B26]">
          Connaître la Valeur Réelle de Votre Bien en Provence
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Vous envisagez une mise en vente de votre bien immobilier ? Nous réalisons votre estimation gratuitement, en adéquation avec la réalité du marché immobilier. Bénéficiez d&apos;une étude personnalisée réalisée par Nelly Fernandez.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-[#F3E8EE] shadow-xl space-y-6">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-2xl text-gray-900">
                  Demande d&apos;Avis de Valeur Reçue !
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Merci <span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span>. Nelly étudie actuellement les données cadastrales et les ventes notariées DVF pour votre bien situé à {formData.city}.
                </p>
                <p className="text-xs text-gray-500">
                  Vous recevrez votre dossier patrimonial complet sous 24h ouvrées.
                </p>
              </div>
              <Link
                href="/biens"
                className="inline-block px-6 py-3 bg-[#131B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#E12B7B] transition"
              >
                Découvrir nos biens en vente
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Stepper indicator */}
              <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-4 text-xs font-bold">
                <span className={step === 1 ? 'text-[#E12B7B]' : 'text-gray-400'}>
                  1. Caractéristiques du Bien
                </span>
                <span>→</span>
                <span className={step === 2 ? 'text-[#E12B7B]' : 'text-gray-400'}>
                  2. Vos Coordonnées
                </span>
              </div>

              {step === 1 ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type de bien</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      >
                        <option value="maison">Maison / Villa</option>
                        <option value="appartement">Appartement</option>
                        <option value="terrain">Terrain à bâtir</option>
                        <option value="immeuble">Immeuble de rapport</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Commune</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      >
                        <option value="Pélissanne">Pélissanne (13330)</option>
                        <option value="Salon-de-Provence">Salon-de-Provence (13300)</option>
                        <option value="Lambesc">Lambesc (13410)</option>
                        <option value="Aurons">Aurons / La Barben</option>
                        <option value="Grans">Grans / Lançon</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse ou Quartier</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Chemin des Costes"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Surface Hab. (m²)</label>
                      <input
                        type="number"
                        required
                        placeholder="Ex: 140"
                        value={formData.livingArea}
                        onChange={(e) => setFormData({ ...formData, livingArea: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Terrain (m²)</label>
                      <input
                        type="number"
                        placeholder="Ex: 800"
                        value={formData.landArea}
                        onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Pièces</label>
                      <input
                        type="number"
                        placeholder="Ex: 5"
                        value={formData.roomsCount}
                        onChange={(e) => setFormData({ ...formData, roomsCount: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.hasPool}
                        onChange={(e) => setFormData({ ...formData, hasPool: e.target.checked })}
                        className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
                      />
                      <span>Présence d&apos;une piscine ou aménagement extérieur d&apos;exception</span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <span>Étape suivante : Mes coordonnées</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone de contact</label>
                    <input
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="jean.dupont@email.fr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Recevoir mon estimation offerte
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

        {/* Benefits Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#131B26] text-white rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#C59A45]">
              Pourquoi faire estimer avec Nell&apos;Immo ?
            </h3>
            <ul className="space-y-3.5 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span>Expertise locale de plus de 15 ans à Pélissanne & Salon-de-Provence</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span>Analyse précise des biens comparables vendus récemment</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span>Prise en compte des spécificités uniques de votre bien (rénovations, vue, calme)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E12B7B] shrink-0 mt-0.5" />
                <span>Remise d&apos;un dossier clair et complet sous 24 à 48h</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FCFAF7] rounded-3xl p-6 border border-[#F3E8EE] space-y-3 text-xs text-gray-700">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-[#E12B7B]" />
              <span>100% Gratuit & Sans Engagement</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Vos coordonnées restent strictement confidentielles et ne sont jamais cédées à des tiers.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
