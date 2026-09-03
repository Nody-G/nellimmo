'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  Printer,
  QrCode,
  Home,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Check,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2,
  Sliders,
  Copy
} from 'lucide-react';

type ColorTheme = 'nellimo' | 'gold' | 'minimal' | 'provence' | 'terracotta' | 'dark_led';
type LayoutFormat = 'A4_landscape' | 'A4_portrait' | 'A3_landscape' | 'social_square' | 'story_vertical';
type PhotoArrangement = 'standard_3' | 'hero_only' | 'split_2' | 'grid_4' | 'mosaic_5';
type BadgePreset = 'auto' | 'exclusif' | 'coup_de_coeur' | 'baisse_prix' | 'sous_compromis' | 'offre_en_cours' | 'vendu' | 'dpe_a' | 'custom';
type QrDestination = 'web' | 'whatsapp' | 'visite360' | 'google_review' | 'gps';

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
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Custom text overrides
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');

  // Selected photos for up to 5 slots
  const [photoSlots, setPhotoSlots] = useState<number[]>([0, 1, 2, 3, 4]);
  const [activeSlot, setActiveSlot] = useState<number>(0);

  // Gallery collapsible state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Big HD preview modal state
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number | null>(null);

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

  // Theme styles definition
  const themeStyles: Record<ColorTheme, {
    primary: string;
    secondary: string;
    accent: string;
    badgeBg: string;
    border: string;
    textAccent: string;
    bgWrapper: string;
    textColor: string;
    subText: string;
    cardBg: string;
  }> = {
    nellimo: {
      primary: '#E12B7B',
      secondary: '#131B26',
      accent: '#FDF2F8',
      badgeBg: 'bg-[#E12B7B] text-white',
      border: 'border-[#E12B7B]',
      textAccent: 'text-[#E12B7B]',
      bgWrapper: 'bg-white',
      textColor: 'text-[#131B26]',
      subText: 'text-gray-500',
      cardBg: 'bg-gray-50'
    },
    gold: {
      primary: '#C59A45',
      secondary: '#0F172A',
      accent: '#FAF6EE',
      badgeBg: 'bg-[#C59A45] text-white',
      border: 'border-[#C59A45]',
      textAccent: 'text-[#C59A45]',
      bgWrapper: 'bg-white',
      textColor: 'text-[#0F172A]',
      subText: 'text-gray-500',
      cardBg: 'bg-[#FAF6EE]/50'
    },
    minimal: {
      primary: '#18181B',
      secondary: '#27272A',
      accent: '#F4F4F5',
      badgeBg: 'bg-zinc-900 text-white',
      border: 'border-zinc-900',
      textAccent: 'text-zinc-900',
      bgWrapper: 'bg-white',
      textColor: 'text-zinc-900',
      subText: 'text-zinc-500',
      cardBg: 'bg-zinc-50'
    },
    provence: {
      primary: '#0284C7',
      secondary: '#0C4A6E',
      accent: '#F0F9FF',
      badgeBg: 'bg-[#0284C7] text-white',
      border: 'border-[#0284C7]',
      textAccent: 'text-[#0284C7]',
      bgWrapper: 'bg-white',
      textColor: 'text-[#0C4A6E]',
      subText: 'text-sky-700',
      cardBg: 'bg-sky-50/50'
    },
    terracotta: {
      primary: '#C05621',
      secondary: '#7B341E',
      accent: '#FFFAF0',
      badgeBg: 'bg-[#C05621] text-white',
      border: 'border-[#C05621]',
      textAccent: 'text-[#C05621]',
      bgWrapper: 'bg-white',
      textColor: 'text-[#7B341E]',
      subText: 'text-amber-800',
      cardBg: 'bg-amber-50/40'
    },
    dark_led: {
      primary: '#F43F5E',
      secondary: '#020617',
      accent: '#1E293B',
      badgeBg: 'bg-[#F43F5E] text-white',
      border: 'border-[#F43F5E]',
      textAccent: 'text-[#F43F5E]',
      bgWrapper: 'bg-[#0B1120]',
      textColor: 'text-white',
      subText: 'text-gray-400',
      cardBg: 'bg-white/5 border border-white/10'
    }
  };

  const currentTheme = themeStyles[colorTheme];

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

  // Badge label calculation
  const getBadgeText = () => {
    if (badgePreset === 'custom' && customBadgeText.trim()) return customBadgeText;
    if (badgePreset === 'exclusif') return "★ EXCLUSIVITÉ NELL'IMMO";
    if (badgePreset === 'coup_de_coeur') return "❤️ COUP DE CŒUR";
    if (badgePreset === 'baisse_prix') return "📉 BAISSE DE PRIX RÉCENTE";
    if (badgePreset === 'sous_compromis') return "🔒 SOUS COMPROMIS";
    if (badgePreset === 'offre_en_cours') return "📝 OFFRE EN COURS";
    if (badgePreset === 'vendu') return "🎉 VENDU PAR NELL'IMMO";
    if (badgePreset === 'dpe_a') return "🌱 DPE A • ÉCO-PERFORMANT";
    return property?.mandate_type === 'exclusif' ? "★ EXCLUSIVITÉ NELL'IMMO" : "NOUVEAUTÉ EXCLUSIVE";
  };

  // QR Code destination calculation
  const getQrTargetUrl = () => {
    if (!property) return 'https://www.nellimmo.fr';
    if (qrDestination === 'whatsapp') {
      const msg = encodeURIComponent(`Bonjour Nelly Fernandez, je vous contacte au sujet du bien ${property.title} (Réf. ${mandateRef}) vu en vitrine.`);
      return `https://wa.me/33755686109?text=${msg}`;
    }
    if (qrDestination === 'visite360') {
      return property.virtual_tour_url || property.video_url || `https://www.nellimmo.fr/biens/${property.id}`;
    }
    if (qrDestination === 'google_review') {
      return settings.google_my_business_url || 'https://g.page/r/nellimmo/review';
    }
    if (qrDestination === 'gps') {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address}, ${property.postal_code} ${property.city}`)}`;
    }
    return typeof window !== 'undefined'
      ? `${window.location.origin}/biens/${property.id}`
      : `https://www.nellimmo.fr/biens/${property.id}`;
  };

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(getQrTargetUrl())}&color=13-27-38&bgcolor=255-255-255`;

  const displayTitle = customTitle.trim() || property?.title || '';
  const displaySubtitle = customSubtitle.trim() || `${property?.city} (${property?.postal_code}) • ${property?.property_type.toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Dynamic Print Styles according to chosen flyerFormat */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: ${
                flyerFormat === 'A4_portrait'
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition cursor-pointer ${
              showCustomizer ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
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
            <span>Imprimer ({flyerFormat.replace('_', ' ').toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Customizer Drawer (Badges & Content Overrides) */}
      {showCustomizer && (
        <div className="bg-gradient-to-r from-[#FCFAF7] to-white rounded-3xl p-6 border border-[#E9DFD3] shadow-md space-y-4 animate-fade-in print:hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#E12B7B]" />
              Personnalisation Poussée du Contenu de l&apos;Affiche
            </h3>
            <button onClick={() => setShowCustomizer(false)} className="text-xs text-gray-400 hover:text-gray-800">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title Override */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Titre d&apos;Accroche Vitrine (Optionnel)
              </label>
              <input
                type="text"
                placeholder={property?.title || 'Titre du bien'}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            {/* Subtitle Override */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Sous-Titre / Localisation (Optionnel)
              </label>
              <input
                type="text"
                placeholder={`${property?.city} (${property?.postal_code}) • ${property?.property_type.toUpperCase()}`}
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            {/* Badge Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Type de Badge Vitrine
              </label>
              <select
                value={badgePreset}
                onChange={(e) => setBadgePreset(e.target.value as BadgePreset)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                <option value="auto">Automatique selon Mandat</option>
                <option value="exclusif">★ EXCLUSIVITÉ NELL&apos;IMMO</option>
                <option value="coup_de_coeur">❤️ COUP DE CŒUR</option>
                <option value="baisse_prix">📉 BAISSE DE PRIX</option>
                <option value="sous_compromis">🔒 SOUS COMPROMIS</option>
                <option value="offre_en_cours">📝 OFFRE EN COURS</option>
                <option value="vendu">🎉 VENDU PAR NELL&apos;IMMO</option>
                <option value="dpe_a">🌱 DPE A • ÉCO-PERFORMANT</option>
                <option value="custom">Badge Texte Libre Personnalisé</option>
              </select>
            </div>
          </div>

          {badgePreset === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-[#E12B7B] mb-1">
                  Texte Libre du Badge
                </label>
                <input
                  type="text"
                  value={customBadgeText}
                  onChange={(e) => setCustomBadgeText(e.target.value)}
                  placeholder="Ex: VUE SAINTE-VICTOIRE, TERRAIN PISCINABLE..."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-[#E12B7B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#E12B7B] mb-1">
                  Couleur du Badge
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customBadgeColor}
                    onChange={(e) => setCustomBadgeColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={customBadgeColor}
                    onChange={(e) => setCustomBadgeColor(e.target.value)}
                    className="w-28 p-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="text-xs text-gray-500">Aperçu :</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: customBadgeColor }}
                  >
                    {customBadgeText || 'VOTRE BADGE'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        
        {/* 1. Property, Format & Layout */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
              Choisir le Bien ({properties.length} disponibles)
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
                setPhotoSlots([0, 1, 2, 3, 4]);
              }}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatMandateRef(p.mandate_number)} - {p.title} ({p.city}) - {p.price_fai.toLocaleString('fr-FR')} €
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
              Format d&apos;Affichage
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFlyerFormat('A4_landscape')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  flyerFormat === 'A4_landscape'
                    ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-5 h-3.5 border border-current rounded-2xs flex items-center justify-center shrink-0">
                  <span className="text-[6px]">LED</span>
                </div>
                <span>A4 Paysage</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('A4_portrait')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  flyerFormat === 'A4_portrait'
                    ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-3.5 h-5 border border-current rounded-2xs flex items-center justify-center shrink-0">
                  <span className="text-[6px]">A4</span>
                </div>
                <span>A4 Portrait</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('A3_landscape')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  flyerFormat === 'A3_landscape'
                    ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-6 h-4 border border-current rounded-2xs flex items-center justify-center shrink-0">
                  <span className="text-[6px]">A3</span>
                </div>
                <span>A3 Grand Vitrine</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('social_square')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  flyerFormat === 'social_square'
                    ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-4 h-4 border border-current rounded-2xs flex items-center justify-center shrink-0">
                  <span className="text-[6px]">1:1</span>
                </div>
                <span>Carré Post 1:1</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('story_vertical')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  flyerFormat === 'story_vertical'
                    ? 'bg-[#131B26] text-white shadow-2xs ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-3 h-5 border border-current rounded-2xs flex items-center justify-center shrink-0">
                  <span className="text-[5px]">9:16</span>
                </div>
                <span>Story Insta 9:16</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
              Agencement Photos
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setPhotoArrangement('hero_only')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  photoArrangement === 'hero_only' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                1 Solo Hero
              </button>
              <button
                type="button"
                onClick={() => setPhotoArrangement('split_2')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  photoArrangement === 'split_2' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                2 Photos Split
              </button>
              <button
                type="button"
                onClick={() => setPhotoArrangement('standard_3')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  photoArrangement === 'standard_3' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                3 Photos Classique
              </button>
              <button
                type="button"
                onClick={() => setPhotoArrangement('grid_4')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  photoArrangement === 'grid_4' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                4 Photos Grille
              </button>
              <button
                type="button"
                onClick={() => setPhotoArrangement('mosaic_5')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer col-span-2 ${
                  photoArrangement === 'mosaic_5' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                5 Photos Mosaïque Prestige
              </button>
            </div>
          </div>
        </div>

        {/* 2. Color Themes & QR Code Destination */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-[#E12B7B]" />
            Ambiance Graphique ({Object.keys(themeStyles).length} Thèmes)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setColorTheme('nellimo')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                colorTheme === 'nellimo' ? 'border-[#E12B7B] bg-[#FDF2F8] text-[#E12B7B]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#E12B7B]" />
              Nell&apos;Immo Rose
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('gold')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                colorTheme === 'gold' ? 'border-[#C59A45] bg-[#FAF6EE] text-[#C59A45]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#C59A45]" />
              Or Prestige
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('minimal')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                colorTheme === 'minimal' ? 'border-zinc-900 bg-zinc-100 text-zinc-900' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-zinc-900" />
              Noir Minimal
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('provence')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                colorTheme === 'provence' ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#0284C7]" />
              Bleu Azur
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('terracotta')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                colorTheme === 'terracotta' ? 'border-[#C05621] bg-[#FFFAF0] text-[#C05621]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#C05621]" />
              Terracotta
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('dark_led')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                colorTheme === 'dark_led' ? 'border-[#F43F5E] bg-gray-900 text-white' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#F43F5E]" />
              Nuit LED Sombre
            </button>
          </div>

          <div className="pt-2 space-y-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showQrCode}
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  className="rounded text-[#E12B7B] accent-[#E12B7B]"
                />
                <span>Activer QR Code</span>
              </label>

              <span className="text-[10px] uppercase font-bold text-gray-400">Destination</span>
            </div>

            {showQrCode && (
              <select
                value={qrDestination}
                onChange={(e) => setQrDestination(e.target.value as QrDestination)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                <option value="web">🌐 Fiche Web Publique Nell&apos;Immo</option>
                <option value="whatsapp">💬 WhatsApp Direct Nelly (avec message)</option>
                <option value="visite360">🕶️ Visite Virtuelle 360° / Vidéo</option>
                <option value="google_review">⭐ Déposer un Avis Google</option>
                <option value="gps">📍 Itinéraire Google Maps</option>
              </select>
            )}
          </div>
        </div>

        {/* 3. Slot Photo Manager */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#E12B7B]" />
              Emplacements Photos (Actif: #{activeSlot + 1})
            </label>
            <button
              type="button"
              onClick={() => setIsGalleryOpen(!isGalleryOpen)}
              className="text-xs font-bold text-[#E12B7B] hover:text-[#C71B62] transition flex items-center gap-1 cursor-pointer"
            >
              {isGalleryOpen ? 'Replier' : `Dérouler (${availableImages.length})`}
              {isGalleryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[0, 1, 2, 3, 4].map((slot) => {
              const url = getPhotoUrl(slot);
              const isActive = activeSlot === slot;

              return (
                <div
                  key={slot}
                  onClick={() => {
                    setActiveSlot(slot);
                    setIsGalleryOpen(true);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer group bg-gray-100 ${
                    isActive ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] font-bold py-0.5 text-center truncate">
                    #{slot + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-500 bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
            Cliquez sur un emplacement ci-dessus puis sur une photo de la galerie pour l&apos;affecter.
          </p>
        </div>

      </div>

      {/* Accordion Gallery */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F3E8EE] shadow-2xs print:hidden transition-all">
        <button
          type="button"
          onClick={() => setIsGalleryOpen(!isGalleryOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#131B26] group-hover:text-[#E12B7B] transition flex items-center gap-2">
                <span>Galerie Complète des Photos du Bien</span>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {availableImages.length} photos
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                {isGalleryOpen ? `Affectation en cours sur l'Emplacement #${activeSlot + 1}` : "Dérouler pour changer les photos de l'affiche"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#E12B7B]">
            <span>{isGalleryOpen ? 'Masquer' : 'Dérouler la galerie'}</span>
            {isGalleryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isGalleryOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {availableImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => assignPhotoToSlot(idx, activeSlot)}
                  className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#E12B7B] transition cursor-pointer group bg-gray-100"
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                    #{idx + 1}
                  </span>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white bg-[#E12B7B] px-1.5 py-0.5 rounded">
                      Affecter à #{activeSlot + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FLYER CANVAS PREVIEW */}
      {property && (
        <div className="flex justify-center">
          <div
            className={`print-flyer-target rounded-3xl p-8 sm:p-10 shadow-2xl w-full border-2 transition-all flex flex-col justify-between ${
              currentTheme.bgWrapper
            } ${currentTheme.textColor} ${
              flyerFormat === 'A4_portrait'
                ? 'max-w-[780px] min-h-[1020px]'
                : flyerFormat === 'social_square'
                ? 'max-w-[650px] aspect-square'
                : flyerFormat === 'story_vertical'
                ? 'max-w-[450px] min-h-[780px]'
                : 'max-w-5xl aspect-[1.414/1]'
            }`}
            style={{ borderColor: currentTheme.primary }}
          >
            {/* Header Brand */}
            <div className="flex items-center justify-between border-b-2 pb-4" style={{ borderColor: currentTheme.primary }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl text-white font-serif font-black text-2xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  N
                </div>
                <div>
                  <span className="text-xl font-serif font-black tracking-tight block leading-tight">
                    NELL&apos;IMMO IMMOBILIER
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest block" style={{ color: currentTheme.primary }}>
                    Pélissanne & Pays Salonais • 07 55 68 61 09 • www.nellimmo.fr
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-mono font-bold ${currentTheme.subText}`}>Réf. {mandateRef}</span>
                <span
                  className="block text-xs font-black uppercase px-3 py-1 rounded-full text-white mt-1 shadow-xs"
                  style={{ backgroundColor: badgePreset === 'custom' ? customBadgeColor : currentTheme.primary }}
                >
                  {getBadgeText()}
                </span>
              </div>
            </div>

            {/* Dynamic Photo Arrangement */}
            <div className="my-4 flex-1 flex flex-col justify-center">
              {photoArrangement === 'hero_only' && (
                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                  <img src={getPhotoUrl(0)} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {photoArrangement === 'split_2' && (
                <div className="grid grid-cols-2 gap-3 aspect-16/9 w-full">
                  <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                    <img src={getPhotoUrl(0)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                    <img src={getPhotoUrl(1)} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {photoArrangement === 'standard_3' && (
                <div className="grid grid-cols-3 gap-3 aspect-16/9 w-full">
                  <div className="col-span-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
                    <img src={getPhotoUrl(0)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={getPhotoUrl(1)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={getPhotoUrl(2)} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}

              {photoArrangement === 'grid_4' && (
                <div className="grid grid-cols-2 gap-3 aspect-16/9 w-full">
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(0)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(1)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(2)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(3)} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {photoArrangement === 'mosaic_5' && (
                <div className="grid grid-cols-4 gap-2.5 aspect-16/9 w-full">
                  <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(0)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(1)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(2)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(3)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={getPhotoUrl(4)} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* Title & Price Header */}
            <div className="flex items-end justify-between gap-4 border-b pb-3 border-gray-200/50">
              <div className="space-y-0.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{displaySubtitle}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black leading-tight line-clamp-2">
                  {displayTitle}
                </h2>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight" style={{ color: currentTheme.primary }}>
                  {property.price_fai.toLocaleString('fr-FR')} € FAI
                </div>
                <span className={`text-[10px] font-medium block ${currentTheme.subText}`}>
                  Honoraires charge {property.fees_paid_by}
                </span>
              </div>
            </div>

            {/* Key Metrics 3 Pillars */}
            <div className="grid grid-cols-3 gap-3 my-3 text-center">
              <div className={`p-2.5 rounded-2xl ${currentTheme.cardBg}`}>
                <span className={`text-[9px] font-bold uppercase block ${currentTheme.subText}`}>Surface Habitable</span>
                <span className="text-base font-black">{property.living_area} m²</span>
              </div>
              <div className={`p-2.5 rounded-2xl ${currentTheme.cardBg}`}>
                <span className={`text-[9px] font-bold uppercase block ${currentTheme.subText}`}>Pièces / Chambres</span>
                <span className="text-base font-black">{property.rooms_count}p • {property.bedrooms_count}ch</span>
              </div>
              <div className={`p-2.5 rounded-2xl ${currentTheme.cardBg}`}>
                <span className={`text-[9px] font-bold uppercase block ${currentTheme.subText}`}>Terrain / Extérieur</span>
                <span className="text-base font-black">{property.land_area ? `${property.land_area} m²` : 'Jardin / Cour'}</span>
              </div>
            </div>

            {/* Features Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {property.features?.slice(0, 5).map((feat, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${currentTheme.cardBg}`}
                >
                  <Check className="w-3 h-3" style={{ color: currentTheme.primary }} />
                  {feat}
                </span>
              ))}
            </div>

            {/* Footer with QR Code */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200/50">
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">
                  Conseillère Dédiée : Nelly FERNANDEZ • SASU Nell&apos;Immo
                </span>
                <div className={`flex items-center gap-3 text-[11px] font-semibold ${currentTheme.subText}`}>
                  <span className="flex items-center gap-1">📞 07 55 68 61 09</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">✉️ nellimmo.acte@gmail.com</span>
                </div>
              </div>

              {showQrCode && (
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-2xs border border-gray-200">
                  <img src={qrCodeImageUrl} alt="QR Code" className="w-9 h-9 rounded" />
                  <div className="text-[8px] font-bold text-gray-700 leading-tight">
                    <span>Scannez pour</span><br />
                    <span style={{ color: currentTheme.primary }}>
                      {qrDestination === 'whatsapp' ? 'WhatsApp Direct' : qrDestination === 'visite360' ? 'Visite 360°' : qrDestination === 'google_review' ? 'Avis Google' : qrDestination === 'gps' ? 'Itinéraire GPS' : 'Fiche Web HD'}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Social Media Studio (Légende & Hashtags) */}
      {property && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#E12B7B]" />
              <div>
                <h3 className="font-serif font-bold text-base text-[#131B26]">
                  Studio Réseaux Sociaux : Légende Prête à Publier
                </h3>
                <span className="text-xs text-gray-500">
                  Texte optimisé pour Instagram, Facebook & LinkedIn avec émoticônes et hashtags locaux.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const caption = `✨ [NOUVEAUTÉ EN PROVENCE] ✨\n\n🏡 ${property.title} — ${property.city} (${property.postal_code})\n\n📍 Réf. ${mandateRef} • Mandat ${property.mandate_type.toUpperCase()}\n📐 ${property.living_area} m² habitables • ${property.rooms_count} pièces (${property.bedrooms_count} chambres)\n🌿 Terrain : ${property.land_area ? `${property.land_area} m²` : 'Sans terrain'}\n💶 Prix FAI : ${property.price_fai.toLocaleString('fr-FR')} € (Honoraires charge ${property.fees_paid_by})\n\n${property.description ? property.description.slice(0, 180) + '...' : ''}\n\n📲 Informations & Visites privées auprès de Nelly Fernandez :\n📞 07 55 68 61 09\n📩 nellimmo.acte@gmail.com\n🔗 Fiche complète sur https://nellimmo.fr/biens/${property.id}\n\n#immobilier #pelissanne #payssalonais #provence #villaavendre #maisonprovencale #nellimmo #exclusivite #achatimmobilier`;
                navigator.clipboard.writeText(caption);
                setCopiedCaption(true);
                setTimeout(() => setCopiedCaption(false), 2000);
              }}
              className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCaption ? 'Légende Copiée !' : 'Copier la Légende Instagram'}</span>
            </button>
          </div>

          <pre className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
            {`✨ [NOUVEAUTÉ EN PROVENCE] ✨\n\n🏡 ${property.title} — ${property.city} (${property.postal_code})\n\n📍 Réf. ${mandateRef} • Mandat ${property.mandate_type.toUpperCase()}\n📐 ${property.living_area} m² habitables • ${property.rooms_count} pièces (${property.bedrooms_count} chambres)\n🌿 Terrain : ${property.land_area ? `${property.land_area} m²` : 'Sans terrain'}\n💶 Prix FAI : ${property.price_fai.toLocaleString('fr-FR')} € (Honoraires charge ${property.fees_paid_by})\n\n${property.description ? property.description.slice(0, 180) + '...' : ''}\n\n📲 Informations & Visites privées auprès de Nelly Fernandez :\n📞 07 55 68 61 09\n📩 nellimmo.acte@gmail.com\n🔗 Fiche complète sur https://nellimmo.fr/biens/${property.id}\n\n#immobilier #pelissanne #payssalonais #provence #villaavendre #maisonprovencale #nellimmo #exclusivite #achatimmobilier`}
          </pre>
        </div>
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
