'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  Printer,
  QrCode,
  Home,
  Palette,
  Sparkles,
  Download,
  Image as ImageIcon,
  Check,
  Zap,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Layers,
  ChevronRight,
  Maximize2,
  Share2,
  ZoomIn,
  X,
  ChevronLeft,
  Eye
} from 'lucide-react';

type ColorTheme = 'nellimo' | 'gold' | 'minimal' | 'provence';
type LayoutFormat = 'A4_landscape' | 'A4_portrait' | 'A3_landscape' | 'social_square';

export default function WindowFlyersPage() {
  const { properties, settings } = useNellimoStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [flyerFormat, setFlyerFormat] = useState<LayoutFormat>('A4_landscape');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('nellimo');
  const [showQrCode, setShowQrCode] = useState(true);
  
  // Selected photos for the 3 slots
  const [selectedPhotoIndex0, setSelectedPhotoIndex0] = useState(0);
  const [selectedPhotoIndex1, setSelectedPhotoIndex1] = useState(1);
  const [selectedPhotoIndex2, setSelectedPhotoIndex2] = useState(2);

  // Active slot for click-to-assign
  const [activeSlot, setActiveSlot] = useState<0 | 1 | 2>(0);

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

  // Theme color maps
  const themeStyles = {
    nellimo: {
      primary: '#E12B7B',
      secondary: '#131B26',
      accent: '#FDF2F8',
      badgeBg: 'bg-[#E12B7B] text-white',
      border: 'border-[#E12B7B]',
      textAccent: 'text-[#E12B7B]'
    },
    gold: {
      primary: '#C59A45',
      secondary: '#0F172A',
      accent: '#FAF6EE',
      badgeBg: 'bg-[#C59A45] text-white',
      border: 'border-[#C59A45]',
      textAccent: 'text-[#C59A45]'
    },
    minimal: {
      primary: '#18181B',
      secondary: '#27272A',
      accent: '#F4F4F5',
      badgeBg: 'bg-zinc-900 text-white',
      border: 'border-zinc-900',
      textAccent: 'text-zinc-900'
    },
    provence: {
      primary: '#0284C7',
      secondary: '#0C4A6E',
      accent: '#F0F9FF',
      badgeBg: 'bg-[#0284C7] text-white',
      border: 'border-[#0284C7]',
      textAccent: 'text-[#0284C7]'
    }
  };

  const currentTheme = themeStyles[colorTheme];

  const photo0 = availableImages[selectedPhotoIndex0]?.image_url || availableImages[0]?.image_url;
  const photo1 = availableImages[selectedPhotoIndex1]?.image_url || availableImages[1]?.image_url || photo0;
  const photo2 = availableImages[selectedPhotoIndex2]?.image_url || availableImages[2]?.image_url || photo0;

  const handlePrint = () => {
    window.print();
  };

  const assignPhotoToSlot = (photoIndex: number, slot: 0 | 1 | 2) => {
    if (slot === 0) setSelectedPhotoIndex0(photoIndex);
    if (slot === 1) setSelectedPhotoIndex1(photoIndex);
    if (slot === 2) setSelectedPhotoIndex2(photoIndex);
  };

  // QR Code URL based on domain
  const publicPropertyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/biens/${property?.id}`
    : `https://www.nellimmo.fr/biens/${property?.id}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicPropertyUrl)}&color=13-27-38&bgcolor=255-255-255`;

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
                  : 'A4 landscape'
              };
              margin: 6mm;
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
            <span>Marketing & Affichage Vitrine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Studio Fiches Vitrine & Affiches
          </h1>
          <p className="text-xs text-gray-500">
            Créez des affiches sur-mesure avec sélection visuelle des photos en petit et grand aperçu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-[#E12B7B] hover:bg-[#c42068] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer en {flyerFormat.replace('_', ' ').toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        
        {/* 1. Property & Format Selection */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
              Choisir le Bien ({properties.length} disponibles)
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
                setSelectedPhotoIndex0(0);
                setSelectedPhotoIndex1(1);
                setSelectedPhotoIndex2(2);
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
              Format d&apos;Affichage Réel
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFlyerFormat('A4_landscape')}
                className={`p-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  flyerFormat === 'A4_landscape'
                    ? 'bg-[#131B26] text-white shadow-sm ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-8 h-5 border-2 border-current rounded-sm flex items-center justify-center opacity-80">
                  <span className="text-[7px]">LED</span>
                </div>
                <span>A4 Paysage (LED)</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('A4_portrait')}
                className={`p-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  flyerFormat === 'A4_portrait'
                    ? 'bg-[#131B26] text-white shadow-sm ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-5 h-7 border-2 border-current rounded-sm flex items-center justify-center opacity-80">
                  <span className="text-[7px]">A4</span>
                </div>
                <span>A4 Portrait (Fiche)</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('A3_landscape')}
                className={`p-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  flyerFormat === 'A3_landscape'
                    ? 'bg-[#131B26] text-white shadow-sm ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-9 h-6 border-2 border-current rounded-sm flex items-center justify-center opacity-80">
                  <span className="text-[7px]">A3</span>
                </div>
                <span>A3 Vitrine Grand</span>
              </button>

              <button
                type="button"
                onClick={() => setFlyerFormat('social_square')}
                className={`p-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  flyerFormat === 'social_square'
                    ? 'bg-[#131B26] text-white shadow-sm ring-2 ring-[#E12B7B]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="w-6 h-6 border-2 border-current rounded-sm flex items-center justify-center opacity-80">
                  <span className="text-[7px]">1:1</span>
                </div>
                <span>Carré Social (1:1)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Color Themes & Options */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-[#E12B7B]" />
            Ambiance Graphique & Marque
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setColorTheme('nellimo')}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${
                colorTheme === 'nellimo' ? 'border-[#E12B7B] bg-[#FDF2F8] text-[#E12B7B]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#E12B7B]" />
              Nell&apos;Immo Rose
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('gold')}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${
                colorTheme === 'gold' ? 'border-[#C59A45] bg-[#FAF6EE] text-[#C59A45]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#C59A45]" />
              Or Prestige
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('minimal')}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${
                colorTheme === 'minimal' ? 'border-zinc-900 bg-zinc-100 text-zinc-900' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-zinc-900" />
              Noir Minimal
            </button>
            <button
              type="button"
              onClick={() => setColorTheme('provence')}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${
                colorTheme === 'provence' ? 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7]' : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#0284C7]" />
              Bleu Azur
            </button>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showQrCode}
                onChange={(e) => setShowQrCode(e.target.checked)}
                className="rounded text-[#E12B7B] accent-[#E12B7B]"
              />
              <span>QR Code Web</span>
            </label>
          </div>
        </div>

        {/* 3. Les 3 Emplacements Actuels de l'Affiche */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#E12B7B]" />
              Photos Sélectionnées (3 Emplacements)
            </label>
            <span className="text-[10px] text-gray-400 font-semibold">Cliquez pour modifier</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Slot 0 : Hero */}
            <div
              onClick={() => setActiveSlot(0)}
              className={`relative rounded-2xl overflow-hidden border-2 transition cursor-pointer group bg-gray-100 aspect-4/3 ${
                activeSlot === 0 ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={photo0} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhotoIndex(selectedPhotoIndex0);
                  }}
                  className="p-1.5 bg-white text-gray-900 rounded-full hover:bg-[#E12B7B] hover:text-white transition"
                  title="Grand aperçu HD"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">
                1. Hero ({selectedPhotoIndex0 + 1})
              </span>
            </div>

            {/* Slot 1 */}
            <div
              onClick={() => setActiveSlot(1)}
              className={`relative rounded-2xl overflow-hidden border-2 transition cursor-pointer group bg-gray-100 aspect-4/3 ${
                activeSlot === 1 ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={photo1} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhotoIndex(selectedPhotoIndex1);
                  }}
                  className="p-1.5 bg-white text-gray-900 rounded-full hover:bg-[#E12B7B] hover:text-white transition"
                  title="Grand aperçu HD"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">
                2. Photo ({selectedPhotoIndex1 + 1})
              </span>
            </div>

            {/* Slot 2 */}
            <div
              onClick={() => setActiveSlot(2)}
              className={`relative rounded-2xl overflow-hidden border-2 transition cursor-pointer group bg-gray-100 aspect-4/3 ${
                activeSlot === 2 ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={photo2} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhotoIndex(selectedPhotoIndex2);
                  }}
                  className="p-1.5 bg-white text-gray-900 rounded-full hover:bg-[#E12B7B] hover:text-white transition"
                  title="Grand aperçu HD"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 px-1 rounded text-center truncate">
                3. Photo ({selectedPhotoIndex2 + 1})
              </span>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
            Emplacement actif : <span className="font-bold text-[#E12B7B]">Emplacement #{activeSlot + 1}</span>. Choisissez ci-dessous une photo pour la remplacer.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* GALERIE VISUELLE COMPLÈTE DU BIEN (PETITS & GRANDS APERÇUS) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#E12B7B]" />
              Galerie Photos du Bien ({availableImages.length} photos)
            </h3>
            <p className="text-xs text-gray-500">
              Cliquez sur une photo pour l&apos;affecter à l&apos;emplacement #{activeSlot + 1}, ou cliquez sur la loupe pour le grand aperçu HD.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold">Affecter vers :</span>
            <button
              onClick={() => setActiveSlot(0)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeSlot === 0 ? 'bg-[#E12B7B] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1. Hero
            </button>
            <button
              onClick={() => setActiveSlot(1)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeSlot === 1 ? 'bg-[#E12B7B] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              2. Photo
            </button>
            <button
              onClick={() => setActiveSlot(2)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeSlot === 2 ? 'bg-[#E12B7B] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              3. Photo
            </button>
          </div>
        </div>

        {/* Visual Thumbnails Grid with Hover Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {availableImages.map((img, idx) => {
            const isSlot0 = selectedPhotoIndex0 === idx;
            const isSlot1 = selectedPhotoIndex1 === idx;
            const isSlot2 = selectedPhotoIndex2 === idx;

            return (
              <div
                key={img.id || idx}
                onClick={() => assignPhotoToSlot(idx, activeSlot)}
                className={`relative aspect-4/3 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group bg-gray-100 shadow-2xs hover:scale-102 ${
                  isSlot0 || isSlot1 || isSlot2
                    ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/20'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />

                {/* Badges for currently assigned slots */}
                <div className="absolute top-1 left-1 flex flex-col gap-1">
                  {isSlot0 && (
                    <span className="px-1.5 py-0.5 bg-[#E12B7B] text-white text-[9px] font-black rounded-md shadow-xs">
                      #1 Hero
                    </span>
                  )}
                  {isSlot1 && (
                    <span className="px-1.5 py-0.5 bg-[#131B26] text-white text-[9px] font-black rounded-md shadow-xs">
                      #2
                    </span>
                  )}
                  {isSlot2 && (
                    <span className="px-1.5 py-0.5 bg-[#131B26] text-white text-[9px] font-black rounded-md shadow-xs">
                      #3
                    </span>
                  )}
                </div>

                {/* Photo number indicator */}
                <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  #{idx + 1}
                </span>

                {/* Hover overlay with Quick Actions & Big Preview Trigger */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewPhotoIndex(idx);
                      }}
                      className="p-1.5 bg-white/90 hover:bg-white text-gray-900 rounded-lg shadow-sm transition"
                      title="Ouvrir le grand aperçu HD"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-[#E12B7B]" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        assignPhotoToSlot(idx, 0);
                      }}
                      className="px-1.5 py-0.5 bg-[#E12B7B] hover:bg-[#c42068] text-white text-[9px] font-bold rounded"
                      title="Mettre en photo 1 (Hero)"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        assignPhotoToSlot(idx, 1);
                      }}
                      className="px-1.5 py-0.5 bg-[#131B26] hover:bg-gray-800 text-white text-[9px] font-bold rounded"
                      title="Mettre en photo 2"
                    >
                      2
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        assignPhotoToSlot(idx, 2);
                      }}
                      className="px-1.5 py-0.5 bg-[#131B26] hover:bg-gray-800 text-white text-[9px] font-bold rounded"
                      title="Mettre en photo 3"
                    >
                      3
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL GRAND APERÇU HD POUR INSPECTION DES PHOTOS */}
      {/* ========================================================================= */}
      {previewPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in print:hidden">
          
          {/* Top Bar Modal */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Grand Aperçu HD • Photo #{previewPhotoIndex + 1} sur {availableImages.length}
              </h3>
              <p className="text-xs text-gray-400">
                {property.title} — {property.city}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewPhotoIndex(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Center Image Container with Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={availableImages[previewPhotoIndex]?.image_url}
              alt=""
              className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300"
            />

            {availableImages.length > 1 && (
              <>
                <button
                  onClick={() => setPreviewPhotoIndex((prev) => (prev! - 1 + availableImages.length) % availableImages.length)}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-2xl cursor-pointer"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={() => setPreviewPhotoIndex((prev) => (prev! + 1) % availableImages.length)}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-2xl cursor-pointer"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Action Bar in Modal */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto max-w-xl py-1">
              {availableImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setPreviewPhotoIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                    previewPhotoIndex === idx ? 'border-[#E12B7B] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-300 font-semibold hidden sm:inline">Affecter cette photo à :</span>
              <button
                onClick={() => {
                  assignPhotoToSlot(previewPhotoIndex, 0);
                  setPreviewPhotoIndex(null);
                }}
                className="px-4 py-2 bg-[#E12B7B] hover:bg-[#c42068] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                ✓ Emplacement 1 (Hero)
              </button>
              <button
                onClick={() => {
                  assignPhotoToSlot(previewPhotoIndex, 1);
                  setPreviewPhotoIndex(null);
                }}
                className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-xl text-xs font-bold transition shadow-sm"
              >
                Emplacement 2
              </button>
              <button
                onClick={() => {
                  assignPhotoToSlot(previewPhotoIndex, 2);
                  setPreviewPhotoIndex(null);
                }}
                className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-xl text-xs font-bold transition shadow-sm"
              >
                Emplacement 3
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* FLYER PREVIEW & PRINT CANVAS (TAILORED ADAPTIVE LAYOUTS FOR EACH FORMAT) */}
      {/* ========================================================================= */}
      {property && (
        <div className="flex justify-center">
          
          {/* FORMAT 1 : A4 PORTRAIT (Fiche Commerciale Verticale) */}
          {flyerFormat === 'A4_portrait' && (
            <div className="print-flyer-target bg-white border-2 border-gray-300 rounded-3xl p-8 sm:p-10 shadow-2xl w-full max-w-[800px] min-h-[1050px] space-y-6 flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 pb-4" style={{ borderColor: currentTheme.primary }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl text-white font-serif font-black text-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    N
                  </div>
                  <div>
                    <span className="text-2xl font-serif font-black text-[#131B26] tracking-tight block">
                      NELL&apos;IMMO IMMOBILIER
                    </span>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#E12B7B]">
                      Pélissanne & Pays Salonais • 07 55 68 61 09 • www.nellimmo.fr
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-500">Réf. {mandateRef}</span>
                  <span
                    className="block text-xs font-black uppercase px-3 py-1 rounded-full text-white mt-1 shadow-xs"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    {property.mandate_type === 'exclusif' ? '★ Mandat Exclusif' : 'Vente Privilège'}
                  </span>
                </div>
              </div>

              {/* Photos Vertical Stack: 1 Hero Photo + 2 Side-by-Side Photos */}
              <div className="space-y-3">
                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  <img src={photo0} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={photo1} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={photo2} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Title & Location */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
                  <span>{property.city} ({property.postal_code})</span>
                  <span>•</span>
                  <span>{property.property_type.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-serif font-black text-[#131B26] leading-tight">
                  {property.title}
                </h2>
              </div>

              {/* Price Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Prix de Vente FAI</span>
                  <div className="text-3xl font-serif font-black tracking-tight" style={{ color: currentTheme.primary }}>
                    {property.price_fai.toLocaleString('fr-FR')} €
                  </div>
                </div>
                <div className="text-right text-[10px] text-gray-500 font-semibold max-w-[200px]">
                  Honoraires agence inclus {property.fees_paid_by === 'vendeur' ? 'à la charge du vendeur' : 'à la charge de l\'acquéreur'}
                </div>
              </div>

              {/* 3 Pillars Grid (Clean, Balanced & No DPE) */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Surface Habitable</span>
                  <span className="text-lg font-black text-gray-900">{property.living_area} m²</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Pièces / Chambres</span>
                  <span className="text-lg font-black text-gray-900">{property.rooms_count} Pièces • {property.bedrooms_count} chb</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Terrain / Extérieur</span>
                  <span className="text-lg font-black text-gray-900">{property.land_area && property.land_area > 0 ? `${property.land_area} m²` : 'Jardin / Terrasse'}</span>
                </div>
              </div>

              {/* Features Badges */}
              <div className="flex flex-wrap gap-2">
                {property.features?.slice(0, 6).map((feat, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-50 rounded-xl text-xs font-bold text-gray-800 border border-gray-200 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {feat}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#131B26] block">
                    Votre Conseillère : Nelly FERNANDEZ
                  </span>
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#E12B7B]" /> 07 55 68 61 09</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#E12B7B]" /> nellimmo.acte@gmail.com</span>
                  </div>
                </div>

                {showQrCode && (
                  <div className="flex items-center gap-2 p-2 bg-[#FAF5F8] border border-[#F3E8EE] rounded-xl">
                    <img src={qrCodeImageUrl} alt="QR Code" className="w-10 h-10 rounded-md" />
                    <span className="text-[9px] text-gray-500 font-bold leading-tight">Scannez pour<br />visite complète</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* FORMAT 2 : A4 PAYSAGE (LED Vitrine Horizontale) */}
          {flyerFormat === 'A4_landscape' && (
            <div className="print-flyer-target bg-white border-2 border-gray-300 rounded-3xl p-8 sm:p-10 shadow-2xl w-full max-w-5xl aspect-[1.414/1] space-y-6 flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 pb-4" style={{ borderColor: currentTheme.primary }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl text-white font-serif font-black text-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    N
                  </div>
                  <div>
                    <span className="text-2xl font-serif font-black text-[#131B26] tracking-tight block">
                      NELL&apos;IMMO IMMOBILIER
                    </span>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#E12B7B]">
                      Pélissanne & Pays Salonais • 07 55 68 61 09 • www.nellimmo.fr
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-500">Réf. {mandateRef}</span>
                  <span
                    className="block text-xs font-black uppercase px-3 py-1 rounded-full text-white mt-1 shadow-xs"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    {property.mandate_type === 'exclusif' ? '★ Mandat Exclusif' : 'Vente Privilège'}
                  </span>
                </div>
              </div>

              {/* Photos Grid 2 Cols : Large Main + 2 Sub-photos stacked */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  <img src={photo0} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={photo1} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={photo2} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Title & Price Line */}
              <div className="flex items-end justify-between gap-4 border-b pb-4 border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
                    <span>{property.city} ({property.postal_code})</span>
                    <span>•</span>
                    <span>{property.property_type.toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-black text-[#131B26] leading-tight">
                    {property.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-3xl font-serif font-black tracking-tight" style={{ color: currentTheme.primary }}>
                    {property.price_fai.toLocaleString('fr-FR')} €
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium block">
                    Honoraires inclus charge {property.fees_paid_by}
                  </span>
                </div>
              </div>

              {/* 3 Pillars Grid (Clean, Balanced & No DPE) */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Surface Habitable</span>
                  <span className="text-lg font-black text-gray-900">{property.living_area} m²</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Pièces / Chambres</span>
                  <span className="text-lg font-black text-gray-900">{property.rooms_count} Pièces • {property.bedrooms_count} chb</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Terrain / Extérieur</span>
                  <span className="text-lg font-black text-gray-900">{property.land_area && property.land_area > 0 ? `${property.land_area} m²` : 'Jardin / Terrasse'}</span>
                </div>
              </div>

              {/* Highlights & Footer */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-gray-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#131B26] block">
                    Votre Conseillère Dédiée : Nelly FERNANDEZ
                  </span>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#E12B7B]" /> 07 55 68 61 09</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#E12B7B]" /> nellimmo.acte@gmail.com</span>
                  </div>
                </div>

                {showQrCode && (
                  <div className="flex items-center gap-3 p-2 bg-[#FAF5F8] border border-[#F3E8EE] rounded-2xl">
                    <img src={qrCodeImageUrl} alt="QR Code" className="w-10 h-10 rounded-md" />
                    <div className="text-[10px] text-gray-500 font-bold leading-tight">
                      Scannez pour la visite 360°<br />et la fiche complète
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* FORMAT 3 : A3 GRAND FORMAT VITRINE (A3 Landscape) */}
          {flyerFormat === 'A3_landscape' && (
            <div className="print-flyer-target bg-white border-2 border-gray-300 rounded-3xl p-10 sm:p-14 shadow-2xl w-full max-w-6xl aspect-[1.414/1] space-y-8 flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-4 pb-6" style={{ borderColor: currentTheme.primary }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-3xl text-white font-serif font-black text-3xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    N
                  </div>
                  <div>
                    <span className="text-3xl font-serif font-black text-[#131B26] tracking-tight block">
                      NELL&apos;IMMO IMMOBILIER
                    </span>
                    <span className="block text-xs uppercase font-bold tracking-widest text-[#E12B7B]">
                      Pélissanne & Pays Salonais • Agence Immobilière de Référence
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-gray-500">Réf. {mandateRef}</span>
                  <span
                    className="block text-sm font-black uppercase px-4 py-1.5 rounded-full text-white mt-1 shadow-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    {property.mandate_type === 'exclusif' ? '★ Mandat Exclusif' : 'Vente Privilège'}
                  </span>
                </div>
              </div>

              {/* Photos Grid Panorama */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 aspect-16/10 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
                  <img src={photo0} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-6 flex flex-col justify-between">
                  <div className="aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={photo1} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={photo2} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Title & Massive Price Callout */}
              <div className="flex items-end justify-between gap-6 border-b pb-6 border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                    <MapPin className="w-4 h-4 text-[#E12B7B]" />
                    <span>{property.city} ({property.postal_code})</span>
                    <span>•</span>
                    <span>{property.property_type.toUpperCase()}</span>
                  </div>
                  <h2 className="text-3xl font-serif font-black text-[#131B26] leading-tight">
                    {property.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-4xl font-serif font-black tracking-tight" style={{ color: currentTheme.primary }}>
                    {property.price_fai.toLocaleString('fr-FR')} €
                  </div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Honoraires d&apos;agence inclus
                  </span>
                </div>
              </div>

              {/* 3 Pillars Grid Large (Clean, Balanced & No DPE) */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400 block">Surface Habitable</span>
                  <span className="text-2xl font-black text-gray-900">{property.living_area} m²</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400 block">Pièces / Chambres</span>
                  <span className="text-2xl font-black text-gray-900">{property.rooms_count} Pièces • {property.bedrooms_count} chb</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400 block">Terrain / Extérieur</span>
                  <span className="text-2xl font-black text-gray-900">{property.land_area && property.land_area > 0 ? `${property.land_area} m²` : 'Jardin / Terrasse'}</span>
                </div>
              </div>

              {/* Footer A3 */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#131B26] block">
                    Votre Conseillère : Nelly FERNANDEZ • 07 55 68 61 09
                  </span>
                  <span className="text-xs text-gray-500">26 Avenue des Enjouvènes, 13330 Pélissanne • nellimmo.acte@gmail.com</span>
                </div>

                {showQrCode && (
                  <div className="flex items-center gap-3 p-3 bg-[#FAF5F8] border border-[#F3E8EE] rounded-2xl">
                    <img src={qrCodeImageUrl} alt="QR Code" className="w-14 h-14 rounded-lg" />
                    <div className="text-xs text-gray-700 font-bold leading-tight">
                      Scannez pour la visite 360°<br />et la vidéo HD
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* FORMAT 4 : SOCIAL SQUARE (Instagram / Facebook Post 1:1) */}
          {flyerFormat === 'social_square' && (
            <div className="print-flyer-target bg-white border-2 border-gray-300 rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-xl aspect-square space-y-4 flex flex-col justify-between">
              
              {/* Top Bar with Brand & Exclusive Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl text-white font-serif font-black text-base flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    N
                  </div>
                  <span className="font-serif font-black text-sm text-[#131B26]">NELL&apos;IMMO</span>
                </div>

                <span
                  className="px-3 py-1 rounded-full text-white text-[10px] font-black uppercase shadow-xs flex items-center gap-1"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  {property.mandate_type === 'exclusif' ? 'Exclusivité' : 'Nouveau Bien'}
                </span>
              </div>

              {/* Hero Photo with overlay price badge */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                <img src={photo0} alt="" className="w-full h-full object-cover" />
                
                {/* Floating Price Pill */}
                <div
                  className="absolute bottom-3 left-3 px-4 py-2 rounded-xl text-white font-serif font-black text-xl shadow-lg backdrop-blur-md"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {property.price_fai.toLocaleString('fr-FR')} € <span className="text-[10px] font-normal">FAI</span>
                </div>

                {/* City pill */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E12B7B]" />
                  {property.city}
                </div>
              </div>

              {/* Title & 2 Sub-photos row */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2">
                  <h3 className="font-serif font-bold text-base text-[#131B26] line-clamp-2 leading-snug">
                    {property.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    {property.living_area} m² • {property.bedrooms_count} chambres {property.land_area ? `• ${property.land_area} m² terrain` : ''}
                  </p>
                </div>
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={photo1} alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Social Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-xs">
                  <span className="font-bold text-gray-900 block">Nelly Fernandez</span>
                  <span className="text-[11px] text-[#E12B7B] font-bold">07 55 68 61 09 • @nellimmo</span>
                </div>

                {showQrCode && (
                  <div className="flex items-center gap-2 p-1.5 bg-[#FAF5F8] border border-[#F3E8EE] rounded-xl">
                    <img src={qrCodeImageUrl} alt="QR Code" className="w-8 h-8 rounded-md" />
                    <span className="text-[8px] font-bold text-gray-500 leading-tight">Visite 360°<br />en ligne</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
