'use client';

import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Property, AgencySettings } from '@/lib/types';
import { SocialFormat, SocialBadge, SocialTheme } from './social-types';
import { SocialVisualControls } from './SocialVisualControls';
import { SocialVisualCanvas } from './SocialVisualCanvas';

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

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      {/* Controls Bar */}
      <SocialVisualControls
        selectedFormat={selectedFormat}
        selectedBadge={selectedBadge}
        selectedTheme={selectedTheme}
        onFormatChange={onFormatChange}
        onBadgeChange={onBadgeChange}
        onThemeChange={onThemeChange}
      />

      {/* Visual Canvas Card */}
      <SocialVisualCanvas
        property={property}
        settings={settings}
        selectedFormat={selectedFormat}
        selectedBadge={selectedBadge}
        selectedTheme={selectedTheme}
        currentPhoto={currentPhoto}
        carouselSlide={carouselSlide}
      />

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
