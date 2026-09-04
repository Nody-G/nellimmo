'use client';

import React from 'react';
import type { Property, TransactionDeal } from '@/lib/types';
import {
  DealWorkflowButtons,
  DealFinancialOverview,
  DealPartiesCards,
  DealAlurChecklist,
  DealActionButtons
} from './detail';

interface DealDetailModalProps {
  deal: TransactionDeal;
  properties: Property[];
  onUpdateStatus: (id: string, status: TransactionDeal['status']) => void;
  onUpdateChecklist: (id: string, docs: TransactionDeal['checklist_documents']) => void;
  onClose: () => void;
  onSendLoanReminder: (deal: TransactionDeal) => void;
  onSendReviewRequest: (deal: TransactionDeal) => void;
  onOpenInvoice: () => void;
}

export function DealDetailModal({
  deal,
  properties,
  onUpdateStatus,
  onUpdateChecklist,
  onClose,
  onSendLoanReminder,
  onSendReviewRequest,
  onOpenInvoice
}: DealDetailModalProps) {
  const prop = properties.find((p) => p.id === deal.property_id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#E12B7B]/10 text-[#E12B7B] rounded-lg text-[10px] font-black uppercase tracking-wider">
                Dossier Transaction
              </span>
              <span className="text-xs font-bold text-gray-400">ID: {deal.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
              {prop?.title || 'Transaction Immobilière'}
            </h2>
            <p className="text-xs text-gray-500">
              {prop?.city || 'Pélissanne'} — Mandat N° {prop?.mandate_number}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <DealWorkflowButtons
          dealId={deal.id}
          currentStatus={deal.status}
          onUpdateStatus={onUpdateStatus}
        />

        <DealFinancialOverview deal={deal} />

        <DealPartiesCards deal={deal} />

        <DealAlurChecklist
          dealId={deal.id}
          checklistDocuments={deal.checklist_documents}
          onUpdateChecklist={onUpdateChecklist}
        />

        <DealActionButtons
          deal={deal}
          onSendLoanReminder={onSendLoanReminder}
          onSendReviewRequest={onSendReviewRequest}
          onOpenInvoice={onOpenInvoice}
        />
      </div>
    </div>
  );
}
