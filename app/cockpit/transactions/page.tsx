'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { TransactionDeal, TransactionStatus } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { TransactionsHeader } from '@/components/cockpit/transactions/TransactionsHeader';
import { KanbanBoard } from '@/components/cockpit/transactions/KanbanBoard';
import { DealDetailModal } from '@/components/cockpit/transactions/DealDetailModal';
import { InvoicePrintModal } from '@/components/cockpit/transactions/InvoicePrintModal';
import { NewDealModal } from '@/components/cockpit/transactions/NewDealModal';
import { getDaysRemaining, computeUrgentAlert } from '@/components/cockpit/transactions/transactions-types';

export default function TransactionsPipelinePage() {
  const { transactions, properties, settings, updateTransaction, createTransaction } = useNellimoStore();
  const { showToast } = useToast();
  const [selectedDeal, setSelectedDeal] = useState<TransactionDeal | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceDocumentType, setInvoiceDocumentType] = useState<'facture' | 'sequestre'>('facture');
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics
  const activeDeals = transactions.filter(t => t.status !== 'acte_signe' && t.status !== 'annule');
  const closedDeals = transactions.filter(t => t.status === 'acte_signe');

  const totalActiveVolume = activeDeals.reduce((sum, t) => sum + (t.offer_price_fai || 0), 0);
  const totalActiveFees = activeDeals.reduce((sum, t) => sum + (t.agency_fees_amount || 0), 0);
  const totalEarnedFees = closedDeals.reduce((sum, t) => sum + (t.agency_fees_amount || 0), 0);

  // Filtered
  const filteredDeals = transactions.filter(t => {
    const prop = properties.find(p => p.id === t.property_id);
    const searchString = `${t.buyer_name} ${t.seller_name} ${t.seller_notary_name} ${prop?.title || ''} ${prop?.city || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const urgentAlert = computeUrgentAlert(activeDeals);

  const handleQuickAdvance = async (e: React.MouseEvent, deal: TransactionDeal, nextStatus: TransactionStatus, stageLabel: string) => {
    e.stopPropagation();
    await updateTransaction(deal.id, { status: nextStatus });
    showToast(`Dossier ${deal.buyer_name} : ${stageLabel}`, 'success');
  };

  // WhatsApp reminder generator
  const sendWhatsAppLoanReminder = (deal: TransactionDeal) => {
    const prop = properties.find(p => p.id === deal.property_id);
    const message = `Bonjour ${deal.buyer_name.split(' ')[0]}, c'est Nelly Fernandez de l'agence Nell'Immo. Un petit point d'étape sur votre dossier de prêt pour la maison à ${prop?.city || 'Pélissanne'}. Avez-vous reçu l'accord de principe de la banque ? Le notaire ${deal.seller_notary_name} attend l'attestation avant le ${deal.loan_approval_deadline ? new Date(deal.loan_approval_deadline).toLocaleDateString('fr-FR') : 'prochainement'}. Bien à vous, Nelly.`;
    const cleanPhone = deal.buyer_phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Google review generator
  const sendGoogleReviewRequest = (deal: TransactionDeal) => {
    const reviewUrl = settings.google_my_business_url || 'https://g.page/r/nellimmo/review';
    const message = `Bonjour ${deal.buyer_name.split(' ')[0]}, félicitations encore pour la signature officielle de votre nouveau chez-vous ! Ce fut un plaisir de vous accompagner dans cette belle étape de vie. Si vous avez apprécié mon écoute et mon accompagnement, pourriez-vous m'accorder 30 secondes pour déposer votre avis 5 étoiles sur Google ? Cela m'aide énormément : ${reviewUrl} Merci infiniment, Nelly Fernandez — SASU Nell'Immo.`;
    const cleanPhone = deal.buyer_phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');

    // Mark as requested
    updateTransaction(deal.id, { google_review_requested: true });
    if (selectedDeal && selectedDeal.id === deal.id) {
      setSelectedDeal({ ...selectedDeal, google_review_requested: true });
    }
  };

  const handleUpdateStatus = (id: string, status: TransactionDeal['status']) => {
    updateTransaction(id, { status });
    if (selectedDeal && selectedDeal.id === id) {
      setSelectedDeal({ ...selectedDeal, status });
    }
  };

  const handleUpdateChecklist = (id: string, docs: TransactionDeal['checklist_documents']) => {
    updateTransaction(id, { checklist_documents: docs });
    if (selectedDeal && selectedDeal.id === id) {
      setSelectedDeal({ ...selectedDeal, checklist_documents: docs });
    }
  };

  // B1 — Marque la facture comme envoyée au notaire après ouverture du mailto.
  const handleInvoiceSentToNotary = (id: string) => {
    updateTransaction(id, { invoice_sent_to_notary: true });
    if (selectedDeal && selectedDeal.id === id) {
      setSelectedDeal({ ...selectedDeal, invoice_sent_to_notary: true });
    }
    showToast('Email de facture ouvert — pensez à joindre le PDF A4.', 'success');
  };

  const handleCreateDeal = (data: {
    property_id: string;
    offer_price_fai: number;
    agency_fees_amount: number;
    buyer_name: string;
    buyer_phone: string;
    seller_notary_name: string;
  }) => {
    const prop = properties.find(p => p.id === data.property_id);
    createTransaction({
      property_id: data.property_id,
      status: 'offre_acceptee',
      offer_price_fai: data.offer_price_fai,
      offer_price_net: data.offer_price_fai - data.agency_fees_amount,
      agency_fees_amount: data.agency_fees_amount,
      deposit_amount: Math.round(data.offer_price_fai * 0.05),
      deposit_holder: data.seller_notary_name || 'Étude Notariale',
      seller_name: prop?.seller_name || 'Vendeur Mandant',
      seller_phone: prop?.seller_phone || '07 55 68 61 09',
      buyer_name: data.buyer_name,
      buyer_phone: data.buyer_phone,
      seller_notary_name: data.seller_notary_name,
      seller_notary_email: 'notaire@notaires.fr',
      seller_notary_phone: '04 90 00 00 00',
      seller_notary_office: 'Office Notarial',
      offer_date: new Date().toISOString().split('T')[0],
      checklist_documents: {
        titre_propriete: false,
        taxe_fonciere: false,
        dossier_diagnostics: false,
        audit_energetique: false,
        pre_etat_date: false,
        reglement_copro: false,
        cni_vendeur: false,
        cni_acquereur: false,
        justificatif_domicile: false,
        simulation_pret: false,
        offre_achat_signee: true
      },
      invoice_sent_to_notary: false,
      fees_received: false,
      google_review_requested: false
    });
    setIsNewDealModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <TransactionsHeader
        activeDealsCount={activeDeals.length}
        closedDealsCount={closedDeals.length}
        totalActiveVolume={totalActiveVolume}
        totalActiveFees={totalActiveFees}
        totalEarnedFees={totalEarnedFees}
        urgentAlert={urgentAlert}
        properties={properties}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewDeal={() => setIsNewDealModalOpen(true)}
      />

      {/* Kanban Pipeline Board */}
      <KanbanBoard
        filteredDeals={filteredDeals}
        properties={properties}
        getDaysRemaining={getDaysRemaining}
        onQuickAdvance={handleQuickAdvance}
        onSelectDeal={setSelectedDeal}
      />

      {/* DEAL DETAIL MODAL */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          properties={properties}
          onUpdateStatus={handleUpdateStatus}
          onUpdateChecklist={handleUpdateChecklist}
          onClose={() => setSelectedDeal(null)}
          onSendLoanReminder={sendWhatsAppLoanReminder}
          onSendReviewRequest={sendGoogleReviewRequest}
          onOpenInvoice={() => setIsInvoiceModalOpen(true)}
        />
      )}

      {/* INVOICE OFFICIAL PRINT MODAL */}
      {isInvoiceModalOpen && selectedDeal && (
        <InvoicePrintModal
          deal={selectedDeal}
          properties={properties}
          settings={settings}
          documentType={invoiceDocumentType}
          onSetDocumentType={setInvoiceDocumentType}
          onInvoiceSent={handleInvoiceSentToNotary}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      )}

      {/* NEW DEAL MODAL */}
      {isNewDealModalOpen && (
        <NewDealModal
          properties={properties}
          onCreate={handleCreateDeal}
          onClose={() => setIsNewDealModalOpen(false)}
        />
      )}
    </div>
  );
}
