'use client';

import React from 'react';
import { Send, Star, Printer } from 'lucide-react';
import { TransactionDeal } from '@/lib/types';

interface DealActionButtonsProps {
  deal: TransactionDeal;
  onSendLoanReminder: (deal: TransactionDeal) => void;
  onSendReviewRequest: (deal: TransactionDeal) => void;
  onOpenInvoice: () => void;
}

export const DealActionButtons: React.FC<DealActionButtonsProps> = ({
  deal,
  onSendLoanReminder,
  onSendReviewRequest,
  onOpenInvoice
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2">
        {/* Send Loan Reminder WhatsApp */}
        <button
          type="button"
          onClick={() => onSendLoanReminder(deal)}
          className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-purple-600" />
          Relancer Prêt (WhatsApp)
        </button>

        {/* Google Review Button */}
        <button
          type="button"
          onClick={() => onSendReviewRequest(deal)}
          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {deal.google_review_requested ? 'Avis Déjà Demandé' : 'Demander Avis Google'}
        </button>
      </div>

      {/* Generate Official Notary Fee Invoice */}
      <button
        type="button"
        onClick={onOpenInvoice}
        className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
      >
        <Printer className="w-4 h-4 text-[#C59A45]" />
        Note d’Honoraires Notaire (PDF)
      </button>
    </div>
  );
};
