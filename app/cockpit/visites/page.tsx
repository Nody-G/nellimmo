'use client';

import React, { Suspense } from 'react';
import { VoiceVisitRecorder } from '@/components/cockpit/VoiceVisitRecorder';
import {
  VisitHeader,
  VisitSelectors,
  MicroBilan,
  LegalClause,
  SignatureCanvas,
  VisitNotes,
  VisitActionBar,
  VisitRegisterTable,
  VisitModals,
  toggleInList,
} from '@/components/cockpit/visites';
import { useVisitSheetWorkflow } from '@/components/cockpit/visites/useVisitSheetWorkflow';
import { VisitDebriefWhatsAppModal } from '@/components/cockpit/visites/VisitDebriefWhatsAppModal';

function VisitSheetsContent() {
  const {
    properties,
    buyers,
    visits,
    selectedProperty,
    selectedBuyer,
    selectedPropertyId,
    selectedBuyerId,
    notes,
    setNotes,
    isSigned,
    isCalendarModalOpen,
    setIsCalendarModalOpen,
    isLegalPrintModalOpen,
    setIsLegalPrintModalOpen,
    isOfferModalOpen,
    setIsOfferModalOpen,
    isDebriefModalOpen,
    setIsDebriefModalOpen,
    selectedVisitToPrint,
    setSelectedVisitToPrint,
    visitorSentiment,
    setVisitorSentiment,
    selectedStrengths,
    setSelectedStrengths,
    selectedWeaknesses,
    setSelectedWeaknesses,
    setPriceFeedback,
    canvasRef,
    tourStops,
    handlePropertyChange,
    handleBuyerChange,
    handleSaveVisit,
  } = useVisitSheetWorkflow();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <VisitHeader
        onOpenOffer={() => setIsOfferModalOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        propertyAddress={selectedProperty?.address}
        propertyCity={selectedProperty?.city}
        tourStops={tourStops}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-5">
          <VisitSelectors
            properties={properties}
            buyers={buyers}
            selectedPropertyId={selectedPropertyId}
            selectedBuyerId={selectedBuyerId}
            onPropertyChange={handlePropertyChange}
            onBuyerChange={handleBuyerChange}
          />

          {/* Voice Visit Recorder */}
          <VoiceVisitRecorder
            onTranscriptComplete={({ rawTranscript, sentiment, strengths, weaknesses, priceFeedback: pf }) => {
              if (sentiment) setVisitorSentiment(sentiment);
              if (strengths && strengths.length > 0) setSelectedStrengths(strengths);
              if (weaknesses && weaknesses.length > 0) setSelectedWeaknesses(weaknesses);
              if (pf) setPriceFeedback(pf);
              setNotes((prev) =>
                prev ? `${prev}\n\n[Dictée Vocale] ${rawTranscript}` : `[Dictée Vocale] ${rawTranscript}`
              );
            }}
          />

          {/* Micro-Compte-Rendu Post-Visite */}
          <MicroBilan
            sentiment={visitorSentiment}
            strengths={selectedStrengths}
            weaknesses={selectedWeaknesses}
            onSentimentChange={setVisitorSentiment}
            onToggleStrength={(val) => setSelectedStrengths((prev) => toggleInList(prev, val))}
            onToggleWeakness={(val) => setSelectedWeaknesses((prev) => toggleInList(prev, val))}
          />

          {/* Legal clause */}
          <LegalClause buyer={selectedBuyer} property={selectedProperty} />

          {/* Tactile Canvas */}
          <SignatureCanvas canvasRef={canvasRef} />

          {/* Notes */}
          <VisitNotes notes={notes} onChange={setNotes} />

          {/* Action Button */}
          <VisitActionBar
            isSigned={isSigned}
            onSave={handleSaveVisit}
            onViewOfficial={() => setIsLegalPrintModalOpen(true)}
          />
        </div>

        {/* Right col: History of Visit Sheets */}
        <VisitRegisterTable
          visits={visits}
          properties={properties}
          buyers={buyers}
          onSelectVisitToPrint={(data) => {
            setSelectedVisitToPrint(data);
            setIsLegalPrintModalOpen(true);
          }}
        />
      </div>

      <VisitModals
        isOfferModalOpen={isOfferModalOpen}
        onCloseOfferModal={() => setIsOfferModalOpen(false)}
        selectedProperty={selectedProperty}
        selectedBuyer={selectedBuyer}
        isCalendarModalOpen={isCalendarModalOpen}
        onCloseCalendarModal={() => setIsCalendarModalOpen(false)}
        isLegalPrintModalOpen={isLegalPrintModalOpen}
        onCloseLegalPrintModal={() => setIsLegalPrintModalOpen(false)}
        selectedVisitToPrint={selectedVisitToPrint}
      />

      <VisitDebriefWhatsAppModal
        isOpen={isDebriefModalOpen}
        onClose={() => setIsDebriefModalOpen(false)}
        property={selectedProperty}
        buyer={selectedBuyer}
        sentiment={visitorSentiment}
        strengths={selectedStrengths}
        weaknesses={selectedWeaknesses}
        notes={notes}
      />
    </div>
  );
}

export default function VisitSheetsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500 font-semibold">Chargement des bons de visite...</div>}>
      <VisitSheetsContent />
    </Suspense>
  );
}
