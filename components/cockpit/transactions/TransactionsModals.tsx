'use client';

import React from 'react';
import type { TransactionDeal, Property, AgencySettings } from '@/lib/types';
import { DealDetailModal } from './DealDetailModal';
import { InvoicePrintModal } from './InvoicePrintModal';
import { NewDealModal } from './NewDealModal';

interface TransactionsModalsProps {
  selectedDeal: TransactionDeal | null;
  properties: Property[];
  settings: AgencySettings;
  onUpdateStatus: (id: string, status: TransactionDeal['status']) => void;
  onUpdateChecklist: (id: string, docs: TransactionDeal['checklist_documents']) => void;
  onCloseDealModal: () => void;
  onSendLoanReminder: (deal: TransactionDeal) => void;
  onSendReviewRequest: (deal: TransactionDeal) => void;

  isInvoiceModalOpen: boolean;
  invoiceDocumentType: 'facture' | 'sequestre';
  onSetDocumentType: (type: 'facture' | 'sequestre') => void;
  onInvoiceSent: (id: string) => void;
  onCloseInvoiceModal: () => void;

  isNewDealModalOpen: boolean;
  onCreateDeal: (data: {
    property_id: string;
    offer_price_fai: number;
    agency_fees_amount: number;
    buyer_name: string;
    buyer_phone: string;
    seller_notary_name: string;
  }) => void;
  onCloseNewDealModal: () => void;
}

export function TransactionsModals({
  selectedDeal,
  properties,
  settings,
  onUpdateStatus,
  onUpdateChecklist,
  onCloseDealModal,
  onSendLoanReminder,
  onSendReviewRequest,
  isInvoiceModalOpen,
  invoiceDocumentType,
  onSetDocumentType,
  onInvoiceSent,
  onCloseInvoiceModal,
  isNewDealModalOpen,
  onCreateDeal,
  onCloseNewDealModal,
}: TransactionsModalsProps) {
  const [isInvoiceOpenLocal, setIsInvoiceOpenLocal] = React.useState(false);

  return (
    <>
      {/* DEAL DETAIL MODAL */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          properties={properties}
          onUpdateStatus={onUpdateStatus}
          onUpdateChecklist={onUpdateChecklist}
          onClose={onCloseDealModal}
          onSendLoanReminder={onSendLoanReminder}
          onSendReviewRequest={onSendReviewRequest}
          onOpenInvoice={() => setIsInvoiceOpenLocal(true)}
        />
      )}

      {/* INVOICE OFFICIAL PRINT MODAL */}
      {(isInvoiceModalOpen || isInvoiceOpenLocal) && selectedDeal && (
        <InvoicePrintModal
          deal={selectedDeal}
          properties={properties}
          settings={settings}
          documentType={invoiceDocumentType}
          onSetDocumentType={onSetDocumentType}
          onInvoiceSent={onInvoiceSent}
          onClose={() => {
            onCloseInvoiceModal();
            setIsInvoiceOpenLocal(false);
          }}
        />
      )}

      {/* NEW DEAL MODAL */}
      {isNewDealModalOpen && (
        <NewDealModal
          properties={properties}
          onCreate={onCreateDeal}
          onClose={onCloseNewDealModal}
        />
      )}
    </>
  );
}
