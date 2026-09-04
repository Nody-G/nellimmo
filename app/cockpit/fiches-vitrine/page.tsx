'use client';

import React, { Suspense } from 'react';
import {
  VitrinePrintStyles,
  VitrineHeader,
  FlyerCustomizerDrawer,
  FlyerControlPanel,
  FlyerGallery,
  FlyerCanvas,
  SocialCaptionStudio,
  useFlyerCustomizerState,
} from '@/components/cockpit/fiches-vitrine';

function WindowFlyersContent() {
  const {
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
  } = useFlyerCustomizerState();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <VitrinePrintStyles flyerFormat={flyerFormat} />

      <VitrineHeader
        showCustomizer={showCustomizer}
        onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
        flyerFormat={flyerFormat}
        onPrint={handlePrint}
      />

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

      <FlyerGallery
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        availableImages={availableImages}
        activeSlot={activeSlot}
        onAssignPhoto={assignPhotoToSlot}
      />

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

      {property && <SocialCaptionStudio property={property} mandateRef={mandateRef} />}
    </div>
  );
}

export default function WindowFlyersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500 font-semibold">
          Chargement du studio vitrine...
        </div>
      }
    >
      <WindowFlyersContent />
    </Suspense>
  );
}
