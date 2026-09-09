'use client';

import React from 'react';
import { Send, Star, Printer, X, Mail, Calendar, Landmark } from 'lucide-react';
import { TransactionDeal } from '@/lib/types';
import { openGmailCompose, createGoogleCalendarUrl } from '@/lib/google';

interface DealActionButtonsProps {
  deal: TransactionDeal;
  onSendLoanReminder: (deal: TransactionDeal) => void;
  onSendReviewRequest: (deal: TransactionDeal) => void;
  onOpenInvoice: () => void;
  onOpenNotaryPack?: () => void;
  onClose: () => void;
}

export const DealActionButtons: React.FC<DealActionButtonsProps> = ({
  deal,
  onSendLoanReminder,
  onSendReviewRequest,
  onOpenInvoice,
  onOpenNotaryPack = () => {},
  onClose,
}) => {
  const handleEmailNotary = () => {
    openGmailCompose({
      to: deal.seller_notary_email || '',
      subject: `Dossier de vente — ${deal.buyer_name} / ${deal.seller_name} — Agence Nell'Immo`,
      body: `Maître,\n\nDans le cadre du dossier de vente entre ${deal.seller_name} (Vendeur) et ${deal.buyer_name} (Acquéreur), je me tiens à votre disposition pour vous transmettre l'ensemble des pièces ALUR et éléments administratifs nécessaires.\n\nRestant à votre entière écoute,\nBien cordialement,\n\nNelly FERNANDEZ — SASU NELL'IMMO\n📞 07 55 68 61 09 | ✉️ nellimmo.acte@gmail.com`,
    });
  };

  const handleAddMilestoneToCalendar = () => {
    const targetDate =
      deal.final_deed_target_date ||
      deal.actual_closing_date ||
      deal.loan_approval_deadline ||
      deal.compromis_date ||
      new Date().toISOString();
    const isDeed = Boolean(deal.final_deed_target_date || deal.actual_closing_date);
    const title = isDeed
      ? `Signature Acte Notarié — ${deal.buyer_name} / ${deal.seller_name}`
      : `Échéance Prêt Bancaire — ${deal.buyer_name}`;

    const url = createGoogleCalendarUrl({
      title,
      location: deal.seller_notary_office || 'Office Notarial',
      startDate: targetDate,
      allDay: true,
      description: `Dossier Transaction Nell'Immo\nNotaire: ${deal.seller_notary_name || 'N/C'} (${deal.seller_notary_phone || 'N/C'})\nAcquéreur: ${deal.buyer_name} (${deal.buyer_phone})\nVendeur: ${deal.seller_name}\nMontant FAI: ${deal.offer_price_fai.toLocaleString('fr-FR')} €`,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Send Loan Reminder WhatsApp */}
        <button
          type="button"
          onClick={() => onSendLoanReminder(deal)}
          className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-purple-600" />
          <span>Relance Prêt (WhatsApp)</span>
        </button>

        {/* Dossier Compromis Notaire en 1 Clic */}
        <button
          type="button"
          onClick={onOpenNotaryPack}
          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          title="Générer le dossier ALUR et le courrier pour le notaire"
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Dossier Notaire 1 Clic</span>
        </button>

        {/* Email Notary via Gmail */}
        <button
          type="button"
          onClick={handleEmailNotary}
          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          title="Écrire au notaire directement via Gmail"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Email Notaire</span>
        </button>

        {/* Google Calendar Milestone */}
        <button
          type="button"
          onClick={handleAddMilestoneToCalendar}
          className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          title="Ajouter l'échéance légale dans Google Agenda"
        >
          <Calendar className="w-3.5 h-3.5 text-[#E12B7B]" />
          <span>Google Agenda</span>
        </button>

        {/* Google Review Button */}
        <button
          type="button"
          onClick={() => onSendReviewRequest(deal)}
          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{deal.google_review_requested ? 'Avis Demandé' : 'Demander Avis Google'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Generate Official Notary Fee Invoice */}
        <button
          type="button"
          onClick={onOpenInvoice}
          className="px-4 py-2 bg-[#131B26] hover:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#C59A45]" />
          <span>Note d’Honoraires (PDF)</span>
        </button>

        {/* Bouton Fermer Explicite */}
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
          <span>Fermer</span>
        </button>
      </div>
    </div>
  );
};
