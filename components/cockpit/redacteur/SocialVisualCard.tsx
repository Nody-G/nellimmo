'use client';

import React from 'react';
import Image from 'next/image';
import type { Property, AgencySettings } from '@/lib/types';

interface SocialVisualCardProps {
  property: Property;
  settings: AgencySettings;
  style: string;
}

export function SocialVisualCard({ property, settings, style }: SocialVisualCardProps) {
  const isReel = style === 'script_video_reel';

  return (
    <div className="p-4 bg-[#131B26] rounded-2xl text-white space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
            <div className="w-full h-full bg-[#131B26] rounded-full flex items-center justify-center font-bold text-[10px] text-white">
              NF
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-tight">
              {settings.instagram_business_id || '@nellimmo_provence'}
            </span>
            <span className="text-[10px] text-gray-400">
              {property.city}, Provence • {isReel ? 'Format Reel 9:16' : 'Post Carré 1:1'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white/10 text-[#C59A45] rounded-lg text-[10px] font-bold uppercase tracking-wider">
          {isReel ? 'Reel / TikTok 9:16' : 'Aperçu Post 1:1'}
        </span>
      </div>

      {/* Visual Frame */}
      <div
        className={`relative mx-auto rounded-xl overflow-hidden bg-gray-900 border border-white/10 shadow-lg ${
          isReel ? 'aspect-9/16 max-w-[200px]' : 'aspect-square max-w-[260px]'
        }`}
      >
        <Image
          src={
            property.images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
          }
          alt={property.title}
          fill
          sizes="260px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 bg-[#E12B7B] text-white rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
            {property.mandate_type === 'exclusif' ? "EXCLUSIVITÉ NELL'IMMO" : 'NOUVEAUTÉ'}
          </span>
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
          <span className="text-[10px] font-bold text-[#C59A45] uppercase tracking-wider block">
            📍 {property.city} ({property.postal_code})
          </span>
          <p className="text-xs font-bold text-white font-serif line-clamp-1">
            {property.living_area} m² • {property.rooms_count} pièces
          </p>
          <span className="text-sm font-black text-white font-serif block mt-0.5">
            {property.price_fai.toLocaleString('fr-FR')} € FAI
          </span>
        </div>
      </div>
    </div>
  );
}
