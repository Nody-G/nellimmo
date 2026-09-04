'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  THEME_STYLES,
  getQrTargetUrl,
  type ColorTheme,
  type LayoutFormat,
  type PhotoArrangement,
  type BadgePreset,
  type QrDestination,
} from './flyer-types';

export function useFlyerCustomizerState() {
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
  const availableImages =
    property?.images && property.images.length > 0
      ? property.images
      : [
          {
            id: '1',
            property_id: property?.id || '',
            image_url:
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            display_order: 1,
            is_cover: true,
            created_at: '',
          },
        ];

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

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    getQrTargetUrl(property, qrDestination, mandateRef, settings)
  )}&color=13-27-38&bgcolor=255-255-255`;

  const displayTitle = customTitle.trim() || property?.title || '';
  const displaySubtitle =
    customSubtitle.trim() ||
    `${property?.city} (${property?.postal_code}) • ${property?.property_type.toUpperCase()}`;

  return {
    properties,
    property,
    mandateRef,
    selectedPropertyId,
    setSelectedPropertyId,
    flyerFormat,
    setFlyerFormat,
    colorTheme,
    setColorTheme,
    photoArrangement,
    setPhotoArrangement,
    badgePreset,
    setBadgePreset,
    customBadgeText,
    setCustomBadgeText,
    customBadgeColor,
    setCustomBadgeColor,
    qrDestination,
    setQrDestination,
    showQrCode,
    setShowQrCode,
    customTitle,
    setCustomTitle,
    customSubtitle,
    setCustomSubtitle,
    photoSlots,
    setPhotoSlots,
    activeSlot,
    setActiveSlot,
    isGalleryOpen,
    setIsGalleryOpen,
    showCustomizer,
    setShowCustomizer,
    availableImages,
    currentTheme,
    getPhotoUrl,
    assignPhotoToSlot,
    qrCodeImageUrl,
    displayTitle,
    displaySubtitle,
  };
}
