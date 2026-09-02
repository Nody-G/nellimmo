'use client';

import React from 'react';
import Link from 'next/link';
import { Property } from '@/lib/types';
import { MapPin, BedDouble, Maximize, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useFavorites } from '@/lib/useFavorites';
import { useToast } from '@/components/ui/Toast';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const isFav = isFavorite(property.id);

  const coverImage = property.images?.find(img => img.is_cover)?.image_url 
    || property.images?.[0]?.image_url 
    || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const isExclusive = property.mandate_type === 'exclusif';
  const isUnderContract = property.status === 'sous_compromis';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
    if (!isFav) {
      showToast('Bien ajouté à vos favoris !', 'success');
    } else {
      showToast('Bien retiré de vos favoris', 'info');
    }
  };

  return (
    <Link
      href={`/biens/${property.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#F3E8EE] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 block cursor-pointer relative"
    >
      {/* Clean Photo Container without clutter */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Heart Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full transition-all duration-200 backdrop-blur-md shadow-md cursor-pointer ${
            isFav
              ? 'bg-white text-[#E12B7B] scale-110'
              : 'bg-black/30 hover:bg-white text-white hover:text-[#E12B7B]'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-[#E12B7B]' : ''}`} />
        </button>

        {/* Minimal clean status badge only if needed */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {isExclusive && (
            <span className="px-3 py-1 bg-[#E12B7B] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FBF6E9]" />
              Exclusivité
            </span>
          )}
          {isUnderContract && (
            <span className="px-3 py-1 bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md">
              Sous Compromis
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & City */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E12B7B] mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{property.city} ({property.postal_code}) • Pays Salonais</span>
          </div>

          {/* Title - clickable with hover color change */}
          <h3 className="font-serif font-bold text-lg text-[#131B26] line-clamp-2 group-hover:text-[#E12B7B] transition-colors leading-snug">
            {property.title}
          </h3>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#FAF5F8] text-xs text-gray-700">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Surface</span>
            <span className="font-bold flex items-center gap-1 text-gray-900 mt-0.5">
              <Maximize className="w-3.5 h-3.5 text-[#E12B7B]" />
              {property.living_area} m²
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Pièces / Ch.</span>
            <span className="font-bold flex items-center gap-1 text-gray-900 mt-0.5">
              <BedDouble className="w-3.5 h-3.5 text-[#E12B7B]" />
              {property.rooms_count}p / {property.bedrooms_count}ch
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Terrain</span>
            <span className="font-bold text-gray-900 mt-0.5">
              {property.land_area ? `${property.land_area} m²` : '—'}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-2xl font-black text-[#E12B7B]">
              {property.price_fai.toLocaleString('fr-FR')} €
            </div>
            <div className="text-[10px] text-gray-400">
              {property.fees_paid_by === 'acquereur'
                ? `Dont ${property.agency_fees_percentage}% TTC d'honoraires charge acq.`
                : 'Honoraires inclus charge vendeur'}
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#131B26] text-white group-hover:bg-[#E12B7B] transition-colors shadow-sm flex items-center gap-1">
            <span>Découvrir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
