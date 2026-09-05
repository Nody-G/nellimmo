'use client';

import React from 'react';
import Image from 'next/image';
import type { Property, AgencySettings } from '@/lib/types';
import {
  SocialFormat,
  SocialBadge,
  SocialTheme,
  SOCIAL_BADGES,
} from './social-types';

interface SocialVisualCanvasProps {
  property: Property;
  settings: AgencySettings;
  selectedFormat: SocialFormat;
  selectedBadge: SocialBadge;
  selectedTheme: SocialTheme;
  currentPhoto: string;
  carouselSlide: number;
}

export function SocialVisualCanvas({
  property,
  settings,
  selectedFormat,
  selectedBadge,
  selectedTheme,
  currentPhoto,
  carouselSlide,
}: SocialVisualCanvasProps) {
  const badgeObj = SOCIAL_BADGES.find((b) => b.id === selectedBadge) || SOCIAL_BADGES[0];

  return (
    <div className="flex justify-center p-4 sm:p-6 bg-gray-950 rounded-2xl overflow-hidden relative">
      <div
        id="social-visual-canvas-card"
        className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
          selectedFormat === 'story'
            ? 'w-[280px] h-[498px]'
            : selectedFormat === 'landscape'
            ? 'w-[440px] h-[248px]'
            : 'w-[340px] h-[340px]'
        } ${selectedTheme === 'dark_gold' ? 'bg-[#131B26]' : 'bg-white'}`}
      >
        {/* Main Background Image */}
        <div className="absolute inset-0">
          <Image
            src={currentPhoto}
            alt={property.title}
            fill
            sizes="500px"
            className="object-cover"
            crossOrigin="anonymous"
          />
          {/* Cinematic Gradient Overlays */}
          <div
            className={`absolute inset-0 ${
              selectedTheme === 'dark_gold'
                ? 'bg-gradient-to-t from-[#131B26] via-[#131B26]/30 to-black/60'
                : selectedTheme === 'provence_sun'
                ? 'bg-gradient-to-t from-black/85 via-transparent to-black/40'
                : 'bg-gradient-to-t from-black/80 via-transparent to-black/30'
            }`}
          />
        </div>

        {/* Top Brand Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span
            className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md ${badgeObj.color}`}
          >
            {badgeObj.label}
          </span>
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-[9px] font-bold border border-white/15">
            <span>{settings.instagram_business_id ? `@${settings.instagram_business_id}` : '@nellimmo_provence'}</span>
          </div>
        </div>

        {/* Carousel Slide Indicator if in Carousel format */}
        {selectedFormat === 'carousel' && (
          <div className="absolute top-12 right-3 bg-black/70 px-2 py-0.5 rounded-md text-[9px] font-bold text-white z-10">
            Diapo {carouselSlide} / 5
          </div>
        )}

        {/* Bottom Card Info */}
        <div className="absolute bottom-3 left-3 right-3 text-left z-10 space-y-1">
          <div className="text-[10px] font-bold text-[#C59A45] uppercase tracking-wider flex items-center gap-1">
            <span>📍 {property.city} ({property.postal_code})</span>
          </div>
          <h4 className="text-sm font-bold text-white font-serif line-clamp-1 leading-snug drop-shadow-md">
            {property.title}
          </h4>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-gray-200 font-sans">
              {property.living_area} m² • {property.rooms_count} pièces
            </span>
            <span className="text-base font-black text-white font-serif tracking-tight drop-shadow-lg">
              {property.price_fai.toLocaleString('fr-FR')} € <span className="text-[10px] font-normal text-gray-300">FAI</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
