'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { PropertyCard } from '@/components/public/PropertyCard';
import { Search, MapPin, Home, Euro, Sparkles, TrendingUp, ArrowRight, Phone } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { properties } = useNellimoStore();

  // Search state
  const [propertyType, setPropertyType] = useState('tous');
  const [city, setCity] = useState('tous');
  const [budgetMax, setBudgetMax] = useState('1000000');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType !== 'tous') params.append('type', propertyType);
    if (city !== 'tous') params.append('ville', city);
    if (budgetMax) params.append('budget', budgetMax);
    router.push(`/biens?${params.toString()}`);
  };

  const activeProperties = properties.filter(p => p.status === 'actif' || p.status === 'sous_compromis');

  return (
    <div className="space-y-20 pb-20 animate-fade-in">

      {/* 1. HERO SECTION PRESTIGE AVEC MOTEUR DE RECHERCHE */}
      <section className="relative min-h-[620px] flex items-center justify-center bg-[#131B26] text-white overflow-hidden py-20 px-4">

        {/* Background Image with warm Provence glow */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
            alt="Maison en Provence - Pélissanne"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131B26] via-[#131B26]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

          {/* Devise Officielle Nell'Immo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-lg animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#E12B7B] animate-pulse"></span>
            <span className="tracking-wide">Actez vos projets sereinement</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
              Nell&apos;Immo, votre agence immobilière à <span className="text-[#C59A45] italic">Pélissanne</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-lg font-light leading-relaxed">
              Parce qu&apos;un projet immobilier est souvent le projet de toute une vie, Nell&apos;Immo vous accompagne dans la concrétisation de tous vos rêves immobiliers à Pélissanne et en Pays Salonais.
            </p>
          </div>

          {/* Search Box Glassmorphism */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 text-gray-900">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">

              {/* Type de bien */}
              <div className="text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
                  Type de bien
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
                >
                  <option value="tous">Tous types de biens</option>
                  <option value="maison">Maison / Villa</option>
                  <option value="appartement">Appartement</option>
                  <option value="terrain">Terrain à bâtir</option>
                </select>
              </div>

              {/* Commune */}
              <div className="text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
                  Commune
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
                >
                  <option value="tous">Toutes les communes</option>
                  <option value="Pelissanne">Pélissanne (13330)</option>
                  <option value="Salon-de-Provence">Salon-de-Provence (13300)</option>
                  <option value="Lambesc">Lambesc (13410)</option>
                  <option value="Aurons">Aurons / La Barben</option>
                  <option value="Grans">Grans / Lançon</option>
                </select>
              </div>

              {/* Budget */}
              <div className="text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                  <Euro className="w-3.5 h-3.5 text-[#E12B7B]" />
                  Budget Maximum
                </label>
                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
                >
                  <option value="400000">Jusqu&apos;à 400 000 €</option>
                  <option value="600000">Jusqu&apos;à 600 000 €</option>
                  <option value="800000">Jusqu&apos;à 800 000 €</option>
                  <option value="1200000">Jusqu&apos;à 1 200 000 €</option>
                  <option value="2000000">Plus de 1 200 000 €</option>
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link
              href="/biens?type=maison"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-gray-200 backdrop-blur-xs transition"
            >
              🏡 Maisons & Villas
            </Link>
            <Link
              href="/biens?type=appartement"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-gray-200 backdrop-blur-xs transition"
            >
              🏢 Appartements
            </Link>
            <Link
              href="/biens?type=terrain"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-gray-200 backdrop-blur-xs transition"
            >
              🌳 Terrains à bâtir
            </Link>
            <Link
              href="/estimation"
              className="px-3.5 py-1.5 rounded-full bg-[#E12B7B]/60 hover:bg-[#E12B7B] text-xs font-bold text-white transition"
            >
              📊 Estimer mon bien
            </Link>
          </div>

        </div>
      </section>

      {/* 2. DERNIERS BIENS EN VENTE (PORTFOLIO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3E8EE] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
              Sélection Rigoureuse
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#131B26] mt-1">
              Nos Nouveautés Immobilières en Provence
            </h2>
          </div>
          <Link
            href="/biens"
            className="text-xs font-bold uppercase text-[#E12B7B] hover:text-[#C71B62] flex items-center gap-1"
          >
            <span>Voir tous nos biens en vente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Properties Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </section>

      {/* 3. SECTION L'AGENCE DE NELLY (STORYTELLING & HUMAIN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#F3E8EE] shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Spécialiste de l&apos;Immobilier en Pays Salonais</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#131B26] leading-tight">
              Un spécialiste à l&apos;écoute de vos besoins sur Pélissanne & alentours
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Nell&apos;Immo</strong>, c&apos;est l&apos;histoire d&apos;une négociatrice immobilière experte en la matière, qui après plus de 15 ans d&apos;exercice sur le Pays Salonais, a souhaité mettre à profit ses compétences à travers des outils innovants et des barèmes d&apos;honoraires parmi les plus bas du marché.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                <span className="text-[#E12B7B] font-black text-lg">15+ Ans</span>
                <strong className="block text-gray-900">D&apos;Expérience Locale</strong>
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
                Découvrir l&apos;agence de Nelly
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
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
              alt="Nelly Fernandez Nell'Immo Pélissanne"
              className="w-full h-full object-cover"
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

      {/* 4. BANNIÈRE ESTIMATION DVF VENDEUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#131B26] via-[#1C2532] to-[#131B26] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A45]/20 text-[#C59A45] text-xs font-bold uppercase tracking-wider border border-[#C59A45]/30">
                <TrendingUp className="w-4 h-4" />
                <span>Étude de Marché & Estimation Gratuite</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                Vous envisagez de vendre à Pélissanne ou dans les environs ?
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                Obtenez une estimation personnalisée et objective basée sur les ventes réelles du secteur. Étude complète offerte par Nelly Fernandez.
              </p>
            </div>

            <div className="text-center lg:text-right">
              <Link
                href="/estimation"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <span>Demander mon estimation gratuite</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. AVIS CLIENTS OPINION SYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3E8EE] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
              Témoignages Vérifiés
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#131B26] mt-1">
              Ce que disent nos clients de Nell&apos;Immo
            </h2>
          </div>
          <Link
            href="/avis-clients"
            className="text-xs font-bold uppercase text-[#E12B7B] hover:text-[#C71B62] flex items-center gap-1"
          >
            <span>Consulter tous les avis (98%)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="flex text-amber-400 text-sm">★★★★★</div>
            <strong className="text-sm font-bold text-gray-900 block">Vente rapide et prix respecté</strong>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              « Nelly a su positionner notre villa au prix parfait. Vente conclue en moins d&apos;un mois avec des acquéreurs finançables. Merci pour tout ! »
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100">
              Michel & Claire D. • Pélissanne
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="flex text-amber-400 text-sm">★★★★★</div>
            <strong className="text-sm font-bold text-gray-900 block">Accompagnement de A à Z</strong>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              « Premier achat pour nous : Nelly nous a guidés avec clarté, pédagogie et une grande disponibilité chez le notaire. »
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100">
              Thomas & Sophie V. • Salon-de-Provence
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
            <div className="flex text-amber-400 text-sm">★★★★★</div>
            <strong className="text-sm font-bold text-gray-900 block">Transparence et honoraires justes</strong>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              « Une écoute attentive, aucune pression commerciale, et des honoraires compétitifs. C&apos;est le vrai luxe d&apos;une agence indépendante. »
            </p>
            <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100">
              Gilles F. • Lambesc
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
