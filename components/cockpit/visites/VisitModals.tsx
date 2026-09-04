'use client';

import React from 'react';
import type { Property, Buyer } from '@/lib/types';
import { InstantOfferModal } from './InstantOfferModal';
import { CalendarSyncModal } from './CalendarSyncModal';
import { PrintableVisitModal, PrintableVisitData } from './PrintableVisitModal';

interface VisitModalsProps {
  isOfferModalOpen: boolean;
  onCloseOfferModal: () => void;
  selectedProperty?: Property;
  selectedBuyer?: Buyer;

  isCalendarModalOpen: boolean;
  onCloseCalendarModal: () => void;

  isLegalPrintModalOpen: boolean;
  onCloseLegalPrintModal: () => void;
  selectedVisitToPrint: PrintableVisitData | null;
}

export function VisitModals({
  isOfferModalOpen,
  onCloseOfferModal,
  selectedProperty,
  selectedBuyer,
  isCalendarModalOpen,
  onCloseCalendarModal,
  isLegalPrintModalOpen,
  onCloseLegalPrintModal,
  selectedVisitToPrint,
}: VisitModalsProps) {
  return (
    <>
      {/* Modal Formuler une Offre d'Achat Express */}
      <InstantOfferModal
        isOpen={isOfferModalOpen}
        onClose={onCloseOfferModal}
        property={selectedProperty}
        buyer={selectedBuyer}
      />

      {/* Modal Calendrier iCal */}
      <CalendarSyncModal
        isOpen={isCalendarModalOpen}
        onClose={onCloseCalendarModal}
      />

      {/* Modal Bon de Visite Officiel Imprimable */}
      <PrintableVisitModal
        isOpen={isLegalPrintModalOpen}
        onClose={onCloseLegalPrintModal}
        visitData={selectedVisitToPrint}
      />
    </>
  );
}
