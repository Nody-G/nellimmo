'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { useFavorites } from '@/lib/useFavorites';
import { useToast } from '@/components/ui/Toast';
import { ShareModal } from '@/components/public/ShareModal';
import { LoanCalculator } from '@/components/public/LoanCalculator';
import { formatMandateRef } from '@/lib/hoguet';
import {
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  CheckCircle2,
  Calendar,
  Phone,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
  Expand,
  MessageCircle,
  Award,
  Heart,
  Video,
  PlayCircle,
  ExternalLink,
  Printer,
  Compass
} from 'lucide-react';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { properties, addContactLead } = useNellimoStore();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorMessage, setVisitorMessage] = useState('');

  const property = properties.find((p) => p.id === resolvedParams.id);
  const isFav = property ? isFavorite(property.id) : false;

  const images = property?.images && property.images.length > 0
    ? property.images
    : [{
        id: '1',
        property_id: property?.id || '',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        display_order: 1,
        is_cover: true,
        created_at: ''
      }];

  const currentPhoto = images[selectedPhotoIndex]?.image_url || images[0].image_url;
  const mandateRef = property ? formatMandateRef(property.mandate_number) : '';

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Bien non trouvé</h2>
        <p className="text-sm text-gray-500">Ce bien a été retiré de la vente ou l&apos;adresse est incorrecte.</p>
        <Link href="/biens" className="inline-block px-5 py-2.5 bg-[#E12B7B] text-white font-bold text-xs uppercase rounded-xl">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactLead({
      name: visitorName,
      phone: visitorPhone,
      email: visitorEmail,
      subject: 'visite',
      property_id: property.id,
      property_title: `${property.title} (${property.city})`,
      message: visitorMessage || `Bonjour Nelly, je souhaiterais organiser une visite pour cette ${property.property_type} à ${property.city} (Réf. ${mandateRef}).`,
    });
    setContactSent(true);
  };

  const pricePerM2 = Math.round(property.price_fai / property.living_area);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-32">
      
      {/* 1. BREADCRUMB & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#E12B7B] transition">Accueil</Link>
          <span>/</span>
          <Link href="/biens" className="hover:text-[#E12B7B] transition">Catalogue</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{property.city}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-[#FCFAF7] text-gray-700 px-3 py-1 rounded-full border border-[#F3E8EE] font-bold">
            Réf. {mandateRef}
          </span>
          
          <button
            onClick={() => {
              if (property) {
                toggleFavorite(property.id);
                if (!isFav) {
                  showToast('Bien ajouté à vos favoris !', 'success');
                } else {
                  showToast('Bien retiré de vos favoris', 'info');
                }
              }
            }}
            className={`p-2 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
              isFav
                ? 'bg-[#FDF2F8] border-[#E12B7B] text-[#E12B7B]'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E12B7B]' : ''}`} />
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-[#E12B7B] hover:bg-gray-50 transition cursor-pointer"
            title="Partager ce bien (WhatsApp, QR Code, Email)"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => window.print()}
            className="hidden sm:flex p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-[#E12B7B] hover:bg-gray-50 transition cursor-pointer items-center gap-1 text-xs font-semibold px-3"
            title="Imprimer la brochure du bien"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Imprimer la fiche</span>
          </button>
        </div>
      </div>

      {/* 2. TITLE & BADGES BAR 2026 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {property.mandate_type === 'exclusif' && (
            <span className="px-3.5 py-1 bg-[#E12B7B] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FBF6E9]" />
              Exclusivité Nell&apos;Immo
            </span>
          )}
          {property.status === 'sous_compromis' && (
            <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              Sous Compromis
            </span>
          )}
          <span className="px-3 py-1 bg-[#131B26] text-white text-xs font-semibold uppercase tracking-wider rounded-full capitalize">
            {property.property_type}
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Certifié Nell&apos;Immo
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold ml-1">
            <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
            {property.city} ({property.postal_code}) • Pays Salonais
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#131B26] leading-tight">
          {property.title}
        </h1>
      </div>

      {/* 3. PHOTO GALLERY 2026 WITH FULLSCREEN LIGHTBOX TRIGGER */}
      <div className="space-y-4">
        {/* Main Photo Viewport */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden bg-gray-950 shadow-2xl group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
          <img
            src={currentPhoto}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />

          {/* Overlay controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Prev / Next buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center backdrop-blur-md shadow-xl transition opacity-90 group-hover:opacity-100"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center backdrop-blur-md shadow-xl transition opacity-90 group-hover:opacity-100"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Lightbox Trigger Button bottom left */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 transition shadow-lg"
          >
            <Expand className="w-3.5 h-3.5" />
            <span>Plein Écran ({images.length} photos)</span>
          </button>

          {/* Photo Counter bottom right */}
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
            {selectedPhotoIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails Tray */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-24 sm:w-28 h-16 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhotoIndex === idx
                    ? 'border-[#E12B7B] ring-2 ring-[#E12B7B]/30 scale-102 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. TWO COLUMN MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT COLUMN (2 Cols) : SPECS, DESCRIPTION, FEATURES, DPE, LOAN */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key Specs Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 border-r border-gray-100 last:border-0">
              <span className="text-[11px] uppercase font-bold text-gray-400">Surface Habitable</span>
              <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                <Maximize className="w-4 h-4 text-[#E12B7B]" />
                {property.living_area} m²
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">{pricePerM2.toLocaleString('fr-FR')} €/m²</span>
            </div>

            <div className="space-y-1 border-r border-gray-100 last:border-0">
              <span className="text-[11px] uppercase font-bold text-gray-400">Pièces / Chambres</span>
              <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                <BedDouble className="w-4 h-4 text-[#E12B7B]" />
                {property.rooms_count}p / {property.bedrooms_count}ch
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">Idéal famille</span>
            </div>

            <div className="space-y-1 border-r border-gray-100 last:border-0">
              <span className="text-[11px] uppercase font-bold text-gray-400">Terrain / Parcelle</span>
              <div className="text-2xl font-bold text-gray-900">
                {property.land_area ? `${property.land_area} m²` : '—'}
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">Jardin privatif</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-gray-400">Salles de Bains</span>
              <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                <Bath className="w-4 h-4 text-[#E12B7B]" />
                {property.bathrooms_count || 1}
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">Baignoire / Douche</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-[#131B26]">
              Descriptif du Bien & Art de Vivre
            </h2>
            <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {property.description}
              {property.dpe_letter && !property.description.includes('DPE') && (
                `\n\nDiagnostics énergétiques : DPE Classe ${property.dpe_letter} (${property.dpe_value || '-'} kWh/m²/an)${property.ges_letter ? ` • GES Classe ${property.ges_letter} (${property.ges_value || '-'} kg CO₂/m²/an)` : ''}.`
              )}
            </div>
          </div>

          {/* Features / Prestations */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#131B26]">
                Équipements & Prestations Remarquables
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3.5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] text-xs font-semibold text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video & Virtual Tour */}
          {(property.video_url || property.virtual_tour_url) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                    Médias
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#131B26] flex items-center gap-2 mt-0.5">
                    <Video className="w-5 h-5 text-[#E12B7B]" />
                    Visite Vidéo & 360°
                  </h3>
                </div>
              </div>

              {property.video_url && (
                <div className="space-y-2">
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black shadow-lg border border-gray-800">
                    {property.video_url.includes('youtube') || property.video_url.includes('youtu.be') ? (
                      <iframe
                        src={
                          property.video_url.includes('watch?v=')
                            ? property.video_url.replace('watch?v=', 'embed/')
                            : property.video_url.replace('youtu.be/', 'www.youtube.com/embed/')
                        }
                        title="Visite Vidéo du Bien"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : property.video_url.includes('vimeo') ? (
                      <iframe
                        src={property.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                        title="Visite Vidéo du Bien"
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={property.video_url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <PlayCircle className="w-4 h-4 text-[#E12B7B]" />
                      Vidéo de visite guidée
                    </span>
                    <a
                      href={property.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E12B7B] font-bold flex items-center gap-1 hover:underline text-[11px]"
                    >
                      Ouvrir en plein écran
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {property.virtual_tour_url && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-900 block">Visite Virtuelle 360°</span>
                    <span className="text-[11px] text-gray-500">Navigation interactive pièce par pièce</span>
                  </div>
                  <a
                    href={property.virtual_tour_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>Lancer la visite 360°</span>
                    <ExternalLink className="w-3 h-3 text-[#C59A45]" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Pricing & Fees */}
          <div className="bg-[#FCFAF7] rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E12B7B]" />
              Détail des Prix & Honoraires
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
              <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                <span className="text-gray-400">Prix FAI (Frais d&apos;Agence Inclus) :</span>
                <div className="text-xl font-black text-[#E12B7B]">
                  {property.price_fai.toLocaleString('fr-FR')} €
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                <span className="text-gray-400">Prix Net Vendeur :</span>
                <div className="text-xl font-bold text-gray-900">
                  {property.price_net_seller.toLocaleString('fr-FR')} €
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                <span className="text-gray-400">Honoraires d&apos;Agence TTC :</span>
                <div className="font-bold text-gray-900">
                  {property.agency_fees_amount.toLocaleString('fr-FR')} € ({property.agency_fees_percentage} %)
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                <span className="text-gray-400">Charge des Honoraires :</span>
                <div className="font-bold text-gray-900 capitalize">
                  À la charge de l&apos;{property.fees_paid_by}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : <a href="https://www.georisques.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E12B7B]">www.georisques.gouv.fr</a>.
            </p>
          </div>

          {/* Loan & Financing Simulator */}
          <LoanCalculator initialPrice={property.price_fai} />

        </div>

        {/* RIGHT COLUMN (1 Col) : STICKY AGENT & VISIT REQUEST */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6">
            
            {/* Price Header */}
            <div className="border-b border-[#FAF5F8] pb-4">
              <span className="text-xs uppercase font-bold text-gray-400">Prix de vente FAI</span>
              <div className="text-3xl sm:text-4xl font-black text-[#E12B7B]">
                {property.price_fai.toLocaleString('fr-FR')} €
              </div>
              <span className="text-[11px] text-gray-400">
                {property.fees_paid_by === 'acquereur'
                  ? `Dont ${property.agency_fees_percentage}% TTC d'honoraires charge acquéreur`
                  : 'Honoraires inclus charge vendeur'}
              </span>
            </div>

            {/* Agent Contact Card */}
            <div className="flex items-center gap-4 bg-[#FCFAF7] p-4 rounded-2xl border border-[#F3E8EE]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-serif font-bold text-lg shrink-0 shadow-xs">
                NF
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#131B26]">Nelly Fernandez</h4>
                <span className="text-[11px] text-gray-500 block">Agent Immobilier Indépendant</span>
                <span className="text-[10px] text-[#C59A45] font-semibold">CPI 1310 2019 000 042 974</span>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="space-y-2.5">
              <a
                href="tel:0755686109"
                className="w-full py-3.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <Phone className="w-4 h-4 text-[#E12B7B]" />
                Appeler le 07 55 68 61 09
              </a>
              <a
                href={`https://wa.me/33755686109?text=${encodeURIComponent(`Bonjour Nelly, je souhaite avoir plus d'informations ou visiter la propriété ${property.title} (Réf. ${mandateRef}) à ${property.city}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                Échanger sur WhatsApp
              </a>
            </div>

            {/* Visit Request Form */}
            <div className="border-t border-[#FAF5F8] pt-4 space-y-4" id="visite-form">
              <h4 className="font-serif font-bold text-sm text-[#131B26] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#E12B7B]" />
                Demander une Visite Privée
              </h4>

              {contactSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1 animate-fade-in">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Demande transmise à Nelly !
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Nelly Fernandez vous recontactera sous 2 heures pour convenir d&apos;un créneau.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Votre Nom & Prénom"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="Votre Numéro de Téléphone"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="Votre E-mail"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      value={visitorMessage}
                      onChange={(e) => setVisitorMessage(e.target.value)}
                      placeholder={`Bonjour Nelly, je souhaiterais organiser une visite pour cette ${property.property_type} à ${property.city} (Réf. ${mandateRef}).`}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-[#E12B7B]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmettre ma demande
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 5. FAST-CONTACT BAR FLOTTANTE 2026 (MOBILE & DESKTOP) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto bg-[#131B26]/95 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={currentPhoto}
            alt=""
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20 hidden sm:block"
          />
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">{property.title}</span>
            <span className="text-sm font-black text-[#E12B7B]">
              {property.price_fai.toLocaleString('fr-FR')} € <span className="text-[10px] text-gray-400 font-normal">FAI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:0755686109"
            className="p-2.5 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Appeler Nelly"
          >
            <Phone className="w-4 h-4 text-[#E12B7B]" />
            <span className="hidden sm:inline">07 55 68 61 09</span>
          </a>

          <a
            href={`https://wa.me/33755686109?text=${encodeURIComponent(`Bonjour Nelly, je vous contacte au sujet du bien réf. ${mandateRef} à ${property.city}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            title="WhatsApp Nelly"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <a
            href="#visite-form"
            className="px-3 py-2.5 sm:px-4 sm:py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Visiter</span>
          </a>
        </div>
      </div>

      {/* 6. FULLSCREEN IMMERSIVE LIGHTBOX MODAL 2026 */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-white truncate max-w-xl">
                {property.title}
              </h3>
              <span className="text-xs text-gray-400">
                Photo {selectedPhotoIndex + 1} sur {images.length} • {property.city}
              </span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              aria-label="Fermer le plein écran"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image Container */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentPhoto}
              alt=""
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-2xl cursor-pointer"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition shadow-2xl cursor-pointer"
                  aria-label="Photo suivante"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  selectedPhotoIndex === idx
                    ? 'border-[#E12B7B] scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={property.title}
        price={property.price_fai}
        city={property.city}
        mandateRef={mandateRef}
      />

    </div>
  );
}
