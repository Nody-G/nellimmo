'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Property, AgencySettings } from '@/lib/types';
import {
  SocialFormat,
  SocialBadge,
  SocialTheme,
  SOCIAL_FORMATS,
  SOCIAL_BADGES,
  SOCIAL_THEMES,
} from './social-types';

interface SocialVisualGeneratorProps {
  property: Property;
  settings: AgencySettings;
  selectedFormat: SocialFormat;
  selectedBadge: SocialBadge;
  selectedTheme: SocialTheme;
  onFormatChange: (fmt: SocialFormat) => void;
  onBadgeChange: (b: SocialBadge) => void;
  onThemeChange: (t: SocialTheme) => void;
}

export function SocialVisualGenerator({
  property,
  settings,
  selectedFormat,
  selectedBadge,
  selectedTheme,
  onFormatChange,
  onBadgeChange,
  onThemeChange,
}: SocialVisualGeneratorProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const carouselSlide = (photoIndex % 5) + 1;
  const [isDownloading, setIsDownloading] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images.map((img) => img.image_url)
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const currentPhoto = images[photoIndex % images.length];

  const handleDownloadPng = async () => {
    const el = document.getElementById('social-visual-canvas-card');
    if (!el) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      const link = document.createElement('a');
      link.download = `post_${selectedFormat}_mandat_${property.mandate_number}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const badgeObj = SOCIAL_BADGES.find((b) => b.id === selectedBadge) || SOCIAL_BADGES[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      {/* Controls Bar */}
      <div className="space-y-4">
        {/* Format Selector */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            1. Format Réseau Social
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SOCIAL_FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => onFormatChange(fmt.id)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedFormat === fmt.id
                    ? 'border-[#E12B7B] bg-rose-50/50 shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-xs text-[#131B26]">{fmt.label}</div>
                <div className="text-[9px] text-gray-500 line-clamp-1">{fmt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Badge & Theme Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              2. Badge d’Accroche
            </span>
            <select
              value={selectedBadge}
              onChange={(e) => onBadgeChange(e.target.value as SocialBadge)}
              className="w-full p-2.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
            >
              {SOCIAL_BADGES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              3. Ambiance & Style
            </span>
            <select
              value={selectedTheme}
              onChange={(e) => onThemeChange(e.target.value as SocialTheme)}
              className="w-full p-2.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
            >
              {SOCIAL_THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Canvas Card */}
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
              <span>{settings.instagram_business_id ? `@${settings.instagram_business_id}` : "@nellimmo_provence"}</span>
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

      {/* Photo Switcher & HD Download Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo ({photoIndex + 1}/{images.length}) :</span>
          </span>
          <button
            type="button"
            onClick={() => setPhotoIndex((p) => (p > 0 ? p - 1 : images.length - 1))}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
            title="Photo précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPhotoIndex((p) => (p + 1) % images.length)}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
            title="Photo suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-[#C59A45]" />
          <span>{isDownloading ? 'Génération HD...' : 'Télécharger le Visuel HD (PNG)'}</span>
        </button>
      </div>
    </div>
  );
}
