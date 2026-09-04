'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/public-store';
import { useFavorites } from '@/lib/useFavorites';
import { useToast } from '@/components/ui/Toast';
import { ShareModal } from '@/components/public/ShareModal';
import { LoanCalculator } from '@/components/public/LoanCalculator';
import { formatMandateRef } from '@/lib/hoguet';
import {
  PropertyPhotoGallery,
  PropertySidebar,
  PropertyTopBar,
  PropertyTitleBar,
  PropertyKeySpecs,
  PropertyDescription,
  PropertyFeatures,
  PropertyMedia,
  PropertyPricing,
  PropertyFastContactBar,
} from '@/components/public/property-detail';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { properties, addContactLead } = useNellimoStore();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const property = properties.find((p) => p.id === resolvedParams.id);
  const isFav = property ? isFavorite(property.id) : false;

  const images = property?.images && property.images.length > 0
    ? property.images
    : [{
      id: '1',
      property_id: property?.id || '',
      image_url: FALLBACK_IMAGE,
      display_order: 1,
      is_cover: true,
      created_at: ''
    }];

  const currentPhoto = images[selectedPhotoIndex]?.image_url || images[0].image_url;
  const mandateRef = property ? formatMandateRef(property.mandate_number) : '';

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Bien non trouvé</h2>
        <p className="text-sm text-gray-500">Ce bien a été retiré de la vente ou l’adresse est incorrecte.</p>
        <Link href="/biens" className="inline-block px-5 py-2.5 bg-[#E12B7B] text-white font-bold text-xs uppercase rounded-xl">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const pricePerM2 = Math.round(property.price_fai / property.living_area);

  const handleToggleFavorite = () => {
    toggleFavorite(property.id);
    if (!isFav) {
      showToast('Bien ajouté à vos favoris !', 'success');
    } else {
      showToast('Bien retiré de vos favoris', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-32">

      {/* 1. BREADCRUMB & TOP CONTROLS */}
      <PropertyTopBar
        property={property}
        mandateRef={mandateRef}
        isFav={isFav}
        onToggleFavorite={handleToggleFavorite}
        onShare={() => setIsShareModalOpen(true)}
      />

      {/* 2. TITLE & BADGES BAR */}
      <PropertyTitleBar property={property} />

      {/* 3. PHOTO GALLERY WITH FULLSCREEN LIGHTBOX */}
      <PropertyPhotoGallery
        property={property}
        images={images}
        selectedPhotoIndex={selectedPhotoIndex}
        onSelectPhoto={setSelectedPhotoIndex}
        isLightboxOpen={isLightboxOpen}
        onToggleLightbox={setIsLightboxOpen}
      />

      {/* 4. TWO COLUMN MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        {/* LEFT COLUMN (2 Cols) : SPECS, DESCRIPTION, FEATURES, MEDIA, PRICING, LOAN */}
        <div className="lg:col-span-2 space-y-10">
          <PropertyKeySpecs property={property} pricePerM2={pricePerM2} />
          <PropertyDescription property={property} />
          <PropertyFeatures property={property} />
          <PropertyMedia property={property} />
          <PropertyPricing property={property} />

          {/* Loan & Financing Simulator */}
          <LoanCalculator initialPrice={property.price_fai} />
        </div>

        {/* RIGHT COLUMN (1 Col) : STICKY AGENT & VISIT REQUEST */}
        <PropertySidebar
          property={property}
          mandateRef={mandateRef}
          addContactLead={addContactLead}
        />

      </div>

      {/* 5. FAST-CONTACT BAR FLOTTANTE */}
      <PropertyFastContactBar
        property={property}
        mandateRef={mandateRef}
        currentPhoto={currentPhoto}
      />

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
