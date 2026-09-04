'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import { Printer, Sliders } from 'lucide-react';
import {
  THEME_STYLES,
  FORMAT_LABELS,
  getQrTargetUrl,
  type ColorTheme,
  type LayoutFormat,
  type PhotoArrangement,
  type BadgePreset,
  type QrDestination
} from '@/components/cockpit/fiches-vitrine/flyer-types';
import { FlyerCustomizerDrawer } from '@/components/cockpit/fiches-vitrine/FlyerCustomizerDrawer';
import { FlyerControlPanel } from '@/components/cockpit/fiches-vitrine/FlyerControlPanel';
import { FlyerGallery } from '@/components/cockpit/fiches-vitrine/FlyerGallery';
import { FlyerCanvas } from '@/components/cockpit/fiches-vitrine/FlyerCanvas';
import { SocialCaptionStudio } from '@/components/cockpit/fiches-vitrine/SocialCaptionStudio';

function WindowFlyersContent() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId');
  const { properties, settings } = useNellimoStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    if (initialPropertyId && properties.some((p) => p.id === initialPropertyId)) {
      return initialPropertyId;
    }
    return properties[0]?.id || '';
  });
  const [flyerFormat, setFlyerFormat] = useState<LayoutFormat>('A4_landscape');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('nellimo');
  const [photoArrangement, setPhotoArrangement] = useState<PhotoArrangement>('standard_3');
  const [badgePreset, setBadgePreset] = useState<BadgePreset>('auto');
  const [customBadgeText, setCustomBadgeText] = useState('★ COUP DE CŒUR EN PROVENCE');
  const [customBadgeColor, setCustomBadgeColor] = useState('#E12B7B');
  const [qrDestination, setQrDestination] = useState<QrDestination>('web');
  const [showQrCode, setShowQrCode] = useState(true);

  // Custom text overrides
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');

  // Selected photos for up to 5 slots
  const [photoSlots, setPhotoSlots] = useState<number[]>([0, 1, 2, 3, 4]);
  const [activeSlot, setActiveSlot] = useState<number>(0);

  // Gallery collapsible state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const mandateRef = property ? formatMandateRef(property.mandate_number) : '';
  const availableImages = property?.images && property.images.length > 0
    ? property.images
    : [{
      id: '1',
      property_id: property?.id || '',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      display_order: 1,
      is_cover: true,
      created_at: ''
    }];

  const currentTheme = THEME_STYLES[colorTheme];

  const getPhotoUrl = (slotIndex: number) => {
    const photoIdx = photoSlots[slotIndex] ?? 0;
    return availableImages[photoIdx]?.image_url || availableImages[0]?.image_url;
  };

  const assignPhotoToSlot = (photoIndex: number, slot: number) => {
    setPhotoSlots((prev) => {
      const next = [...prev];
      next[slot] = photoIndex;
      return next;
    });
  };

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(getQrTargetUrl(property, qrDestination, mandateRef, settings))}&color=13-27-38&bgcolor=255-255-255`;

  const displayTitle = customTitle.trim() || property?.title || '';
  const displaySubtitle = customSubtitle.trim() || `${property?.city} (${property?.postal_code}) • ${property?.property_type.toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: ${flyerFormat === 'A4_portrait'
            ? 'A4 portrait'
            : flyerFormat === 'A3_landscape'
              ? 'A3 landscape'
              : flyerFormat === 'social_square'
                ? '210mm 210mm'
                : flyerFormat === 'story_vertical'
                  ? '108mm 192mm'
                  : 'A4 landscape'
          };
              margin: 4mm;
            }
            body {
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            body * {
              visibility: hidden;
            }
            .print-flyer-target, .print-flyer-target * {
              visibility: visible;
            }
            .print-flyer-target {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 16px !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `
      }} />

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Printer className="w-4 h-4" />
            <span>Marketing Vitrine & Atelier Graphique Illimité</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Studio Fiches Vitrine & Affiches LED
          </h1>
          <p className="text-xs text-gray-500">
            5 agencements photos, badges sans restriction, QR code multi-destinations et 6 thèmes haute couture.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition cursor-pointer ${showCustomizer ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Sliders className="w-4 h-4 text-[#C59A45]" />
            <span>Personnaliser Titres & Badges</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#c42068] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer ({FORMAT_LABELS[flyerFormat]})</span>
          </button>
        </div>
      </div>

      {/* Customizer Drawer (Badges & Content Overrides) */}
      <FlyerCustomizerDrawer
        show={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        property={property}
        badgePreset={badgePreset}
        setBadgePreset={setBadgePreset}
        customBadgeText={customBadgeText}
        setCustomBadgeText={setCustomBadgeText}
        customBadgeColor={customBadgeColor}
        setCustomBadgeColor={setCustomBadgeColor}
        customTitle={customTitle}
        setCustomTitle={setCustomTitle}
        customSubtitle={customSubtitle}
        setCustomSubtitle={setCustomSubtitle}
      />

      {/* Control Panel Grid */}
      <FlyerControlPanel
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={(id) => {
          setSelectedPropertyId(id);
          setPhotoSlots([0, 1, 2, 3, 4]);
        }}
        flyerFormat={flyerFormat}
        setFlyerFormat={setFlyerFormat}
        photoArrangement={photoArrangement}
        setPhotoArrangement={setPhotoArrangement}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        showQrCode={showQrCode}
        setShowQrCode={setShowQrCode}
        qrDestination={qrDestination}
        setQrDestination={setQrDestination}
        availableImages={availableImages}
        activeSlot={activeSlot}
        setActiveSlot={setActiveSlot}
        isGalleryOpen={isGalleryOpen}
        setIsGalleryOpen={setIsGalleryOpen}
        getPhotoUrl={getPhotoUrl}
      />

      {/* Accordion Gallery */}
      <FlyerGallery
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        availableImages={availableImages}
        activeSlot={activeSlot}
        onAssignPhoto={assignPhotoToSlot}
      />

      {/* FLYER CANVAS PREVIEW */}
      {property && (
        <FlyerCanvas
          property={property}
          mandateRef={mandateRef}
          flyerFormat={flyerFormat}
          currentTheme={currentTheme}
          photoArrangement={photoArrangement}
          badgePreset={badgePreset}
          customBadgeText={customBadgeText}
          customBadgeColor={customBadgeColor}
          showQrCode={showQrCode}
          qrDestination={qrDestination}
          qrCodeImageUrl={qrCodeImageUrl}
          displayTitle={displayTitle}
          displaySubtitle={displaySubtitle}
          getPhotoUrl={getPhotoUrl}
        />
      )}

      {/* Social Media Studio (Légende & Hashtags) */}
      {property && (
        <SocialCaptionStudio property={property} mandateRef={mandateRef} />
      )}
    </div>
  );
}

export default function WindowFlyersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500 font-semibold">Chargement du studio vitrine...</div>}>
      <WindowFlyersContent />
    </Suspense>
  );
}
