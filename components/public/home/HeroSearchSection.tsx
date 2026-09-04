'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, MapPin, Euro, Search } from 'lucide-react';

interface HeroSearchSectionProps {
  propertyType: string;
  onPropertyTypeChange: (type: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  budgetMax: string;
  onBudgetMaxChange: (budget: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function HeroSearchSection({
  propertyType,
  onPropertyTypeChange,
  city,
  onCityChange,
  budgetMax,
  onBudgetMaxChange,
  onSubmit,
}: HeroSearchSectionProps) {
  return (
    <section className="relative min-h-[620px] flex items-center justify-center bg-[#131B26] text-white overflow-hidden py-20 px-4">
      {/* Background Image with warm Provence glow */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Maison en Provence - Pélissanne"
          fill
          sizes="100vw"
          className="object-cover opacity-35 filter brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131B26] via-[#131B26]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
            Nell’Immo, votre agence immobilière à <span className="text-[#C59A45] italic">Pélissanne</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-lg font-light leading-relaxed">
            Parce qu’un projet immobilier est souvent le projet de toute une vie, Nell’Immo vous accompagne dans la concrétisation de tous vos rêves immobiliers à Pélissanne et en Pays Salonais.
          </p>
        </div>

        {/* Search Box Glassmorphism */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 text-gray-900">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            {/* Type de bien */}
            <div className="text-left">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
                Type de bien
              </label>
              <select
                value={propertyType}
                onChange={(e) => onPropertyTypeChange(e.target.value)}
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
                onChange={(e) => onCityChange(e.target.value)}
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
                onChange={(e) => onBudgetMaxChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
              >
                <option value="400000">Jusqu’à 400 000 €</option>
                <option value="600000">Jusqu’à 600 000 €</option>
                <option value="800000">Jusqu’à 800 000 €</option>
                <option value="1200000">Jusqu’à 1 200 000 €</option>
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
  );
}
