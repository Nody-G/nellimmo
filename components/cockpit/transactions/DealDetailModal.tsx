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

  // Écouteur touche Échap et verrouillage du défilement d'arrière-plan
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête Fixe Garanti Visible */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#E12B7B]/10 text-[#E12B7B] rounded-lg text-[10px] font-black uppercase tracking-wider">
                Dossier Transaction
              </span>
              <span className="text-xs font-bold text-gray-400">ID: {deal.id}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#131B26] mt-0.5 line-clamp-1">
              {prop?.title || 'Transaction Immobilière'}
            </h2>
            <p className="text-xs text-gray-500">
              {prop?.city || 'Pélissanne'} — Mandat N° {prop?.mandate_number}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-gray-400 font-medium">Échap pour fermer</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center font-bold text-base transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Corps Défilant Indépendant */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
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
        </div>

        {/* Pied d'Actions Fixe avec Bouton Fermer */}
        <div className="border-t border-gray-100 px-6 py-3.5 bg-gray-50/80 shrink-0">
          <DealActionButtons
            deal={deal}
            onSendLoanReminder={onSendLoanReminder}
            onSendReviewRequest={onSendReviewRequest}
            onOpenInvoice={onOpenInvoice}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
