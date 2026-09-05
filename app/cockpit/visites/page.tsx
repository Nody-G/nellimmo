'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
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
  PrintableVisitData,
  VisitorSentiment,
  compileVisitNotes,
  generateVisitHash,
  captureCanvasSignature,
  toggleInList,
} from '@/components/cockpit/visites';
import { VisitDebriefWhatsAppModal } from '@/components/cockpit/visites/VisitDebriefWhatsAppModal';
import { useToast } from '@/components/ui/Toast';

function VisitSheetsContent() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId');
  const { properties, buyers, visits, createVisitSheet } = useNellimoStore();
  const { showToast } = useToast();

  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    if (initialPropertyId && properties.some((p) => p.id === initialPropertyId)) {
      return initialPropertyId;
    }
    return properties[0]?.id || '';
  });
  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isLegalPrintModalOpen, setIsLegalPrintModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [selectedVisitToPrint, setSelectedVisitToPrint] = useState<PrintableVisitData | null>(null);

  // Sentiment & Feedback state
  const [visitorSentiment, setVisitorSentiment] = useState<VisitorSentiment>('coup_de_coeur');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([
    'Luminosité',
    'Jardin / Extérieur',
  ]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [priceFeedback, setPriceFeedback] = useState<string>('Au prix du marché');

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePropertyChange = (id: string) => {
    setSelectedPropertyId(id);
    setIsSigned(false);
  };

  const handleBuyerChange = (id: string) => {
    setSelectedBuyerId(id);
    setIsSigned(false);
  };

  const handleSaveVisit = async () => {
    const signatureUrl = captureCanvasSignature(canvasRef.current);

    const compiledNotes = compileVisitNotes({
      sentiment: visitorSentiment,
      strengths: selectedStrengths,
      weaknesses: selectedWeaknesses,
      priceFeedback,
      notes,
    });

    try {
      await createVisitSheet({
        property_id: selectedProperty?.id || '',
        buyer_id: selectedBuyer?.id || '',
        visit_date: new Date().toISOString(),
        notes: compiledNotes,
        signature_data_url: signatureUrl,
      });

      setIsSigned(true);
      showToast('Bon de visite horodaté et archivé avec succès !', 'success');
      setIsDebriefModalOpen(true);

      setSelectedVisitToPrint({
        property: selectedProperty,
        buyer: selectedBuyer,
        visit_date: new Date().toISOString(),
        signature_data_url: signatureUrl,
        notes: compiledNotes,
        hash: generateVisitHash(),
      });
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'archivage du bon de visite", 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <VisitHeader
        onOpenOffer={() => setIsOfferModalOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        propertyAddress={selectedProperty?.address}
        propertyCity={selectedProperty?.city}
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
