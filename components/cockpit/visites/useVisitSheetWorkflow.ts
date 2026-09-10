'use client';

import { useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import {
  VisitorSentiment,
  compileVisitNotes,
  generateVisitHash,
  captureCanvasSignature,
} from './visites-types';
import type { PrintableVisitData } from './PrintableVisitModal';

export function useVisitSheetWorkflow() {
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
      showToast("Erreur lors de l’archivage du bon de visite", 'error');
    }
  };

  const tourStops = useMemo(() => {
    const stops: string[] = [];
    visits.forEach((v) => {
      const prop = properties.find((p) => p.id === v.property_id);
      if (prop && (prop.address || prop.city)) {
        const fullAddr = `${prop.address || ''}, ${prop.postal_code || ''} ${prop.city || 'Pélissanne'}`.trim();
        if (fullAddr && !stops.includes(fullAddr)) {
          stops.push(fullAddr);
        }
      }
    });
    return stops.slice(0, 8);
  }, [visits, properties]);

  return {
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
    priceFeedback,
    setPriceFeedback,
    canvasRef,
    tourStops,
    handlePropertyChange,
    handleBuyerChange,
    handleSaveVisit,
  };
}
