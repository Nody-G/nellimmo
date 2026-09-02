'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { TransactionDeal, TransactionStatus } from '@/lib/types';
import {
  Landmark,
  FileSignature,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  Euro,
  Calendar,
  Printer,
  Star,
  Send,
  Plus,
  ArrowRight,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';

const STATUS_COLUMNS: { id: TransactionStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'offre_acceptee', label: 'Offres Validées', color: 'border-amber-400 text-amber-800', badgeBg: 'bg-amber-50' },
  { id: 'compromis_signe', label: 'Compromis & SRU (10j)', color: 'border-blue-400 text-blue-800', badgeBg: 'bg-blue-50' },
  { id: 'attente_pret', label: 'Financement (J+60)', color: 'border-purple-400 text-purple-800', badgeBg: 'bg-purple-50' },
  { id: 'acte_planifie', label: 'Acte Planifié', color: 'border-indigo-400 text-indigo-800', badgeBg: 'bg-indigo-50' },
  { id: 'acte_signe', label: 'Ventes Clôturées', color: 'border-emerald-500 text-emerald-800', badgeBg: 'bg-emerald-50' },
];

export default function TransactionsPipelinePage() {
  const { transactions, properties, settings, updateTransaction, createTransaction } = useNellimoStore();
  const [selectedDeal, setSelectedDeal] = useState<TransactionDeal | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
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

  // Calculate days remaining
  const getDaysRemaining = (targetDateStr?: string) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Landmark className="w-4 h-4" />
            <span>Suivi Notarial & Pipeline Transactionnel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Pipeline des Ventes & Dossiers Notaires
          </h1>
          <p className="text-xs text-gray-500">
            Du compromis de vente à l&apos;acte authentique : suivez vos délais SRU, vos conditions suspensives de prêt et vos honoraires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B] w-48 sm:w-64"
            />
          </div>

          <button
            onClick={() => setIsNewDealModalOpen(true)}
            className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nouveau Dossier
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              Ventes en cours ({activeDeals.length})
            </span>
            <span className="text-2xl font-serif font-black text-[#131B26] mt-1 block">
              {totalActiveVolume.toLocaleString('fr-FR')} €
            </span>
            <span className="text-xs font-bold text-[#E12B7B] mt-0.5 block">
              Honoraires prévisionnels : {totalActiveFees.toLocaleString('fr-FR')} € TTC
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold">
            <FileSignature className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              Honoraires Encaissés ({closedDeals.length})
            </span>
            <span className="text-2xl font-serif font-black text-emerald-700 mt-1 block">
              {totalEarnedFees.toLocaleString('fr-FR')} €
            </span>
            <span className="text-xs text-gray-500 mt-0.5 block">
              100% encaissés chez notaire (Loi Hoguet)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Euro className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              Échéances Clés & Alertes
            </span>
            <span className="text-sm font-bold text-gray-800 mt-1 block">
              Prêt Maison Viougues
            </span>
            <span className="text-xs font-semibold text-amber-600 mt-0.5 block">
              Accord de prêt attendu sous 12 jours
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((col) => {
          const colDeals = filteredDeals.filter(t => {
            if (col.id === 'compromis_signe') {
              return t.status === 'compromis_signe' || t.status === 'delai_sru_en_cours' || t.status === 'sru_purgee';
            }
            return t.status === col.id;
          });

          return (
            <div key={col.id} className="bg-gray-50/80 rounded-2xl p-3 border border-gray-200/80 min-w-[240px] flex flex-col">
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color.split(' ')[1]}`}>
                  {col.label}
                </span>
                <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-600">
                  {colDeals.length}
                </span>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colDeals.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-xs italic">
                    Aucun dossier
                  </div>
                ) : (
                  colDeals.map((deal) => {
                    const prop = properties.find(p => p.id === deal.property_id);
                    const daysToLoan = getDaysRemaining(deal.loan_approval_deadline);
                    const daysToClosing = getDaysRemaining(deal.final_deed_target_date);

                    return (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-[#E12B7B] transition cursor-pointer space-y-2.5 text-left group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59A45]">
                            Réf. {prop?.mandate_number || '2026'}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-serif">
                            {deal.offer_price_fai?.toLocaleString('fr-FR')} €
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#E12B7B] transition">
                          {prop?.title || 'Bien en cours de vente'}
                        </h4>

                        <div className="text-[11px] text-gray-500 space-y-0.5">
                          <p><span className="font-semibold text-gray-700">Acq:</span> {deal.buyer_name}</p>
                          <p><span className="font-semibold text-gray-700">Notaire:</span> {deal.seller_notary_name}</p>
                        </div>

                        {/* Badges and Deadlines */}
                        {col.id === 'attente_pret' && daysToLoan !== null && (
                          <div className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                            daysToLoan <= 15 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-purple-50 text-purple-700'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>Prêt J-{daysToLoan} ({new Date(deal.loan_approval_deadline!).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })})</span>
                          </div>
                        )}

                        {col.id === 'acte_planifie' && daysToClosing !== null && (
                          <div className="p-1.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Signature le {new Date(deal.final_deed_target_date!).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}

                        {col.id === 'acte_signe' && (
                          <div className="p-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center justify-between">
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Honoraires reçus</span>
                            {deal.google_review_requested && (
                              <span className="text-[9px] text-amber-600 font-black">★ Avis demandé</span>
                            )}
                          </div>
                        )}

                        <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                          <span>Com: {deal.agency_fees_amount?.toLocaleString('fr-FR')} €</span>
                          <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DEAL DETAIL MODAL */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#E12B7B]/10 text-[#E12B7B] rounded-lg text-[10px] font-black uppercase tracking-wider">
                    Dossier Transaction
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    ID: {selectedDeal.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
                  {properties.find(p => p.id === selectedDeal.property_id)?.title || 'Transaction Immobilière'}
                </h2>
                <p className="text-xs text-gray-500">
                  {properties.find(p => p.id === selectedDeal.property_id)?.city || 'Pélissanne'} — Mandat N° {properties.find(p => p.id === selectedDeal.property_id)?.mandate_number}
                </p>
              </div>

              <button
                onClick={() => setSelectedDeal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Workflow Progression Buttons */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-xs font-bold uppercase text-gray-700 block tracking-wider">
                Avancement de l&apos;Étape Notariale
              </span>
              <div className="flex flex-wrap gap-2">
                {STATUS_COLUMNS.map((col) => {
                  const isActive = selectedDeal.status === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        updateTransaction(selectedDeal.id, { status: col.id });
                        setSelectedDeal({ ...selectedDeal, status: col.id });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#E12B7B] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5" />}
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF5F8] rounded-2xl border border-[#F3E8EE]">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Prix Offre FAI</span>
                <span className="text-base font-bold text-gray-900 font-serif">
                  {selectedDeal.offer_price_fai?.toLocaleString('fr-FR')} €
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Net Vendeur</span>
                <span className="text-base font-bold text-gray-900 font-serif">
                  {selectedDeal.offer_price_net?.toLocaleString('fr-FR')} €
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">Honoraires Nell&apos;Immo</span>
                <span className="text-base font-bold text-[#E12B7B] font-serif">
                  {selectedDeal.agency_fees_amount?.toLocaleString('fr-FR')} € TTC
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Séquestre Notaire</span>
                <span className="text-base font-bold text-gray-900 font-serif">
                  {selectedDeal.deposit_amount?.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>

            {/* Parties & Notaires */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Acquéreur */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold uppercase text-purple-700 block tracking-wider">
                  Acquéreur (Acheteur)
                </span>
                <p className="text-sm font-bold text-gray-900">{selectedDeal.buyer_name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <a href={`tel:${selectedDeal.buyer_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedDeal.buyer_phone}</span>
                  </a>
                  {selectedDeal.buyer_email && (
                    <a href={`mailto:${selectedDeal.buyer_email}`} className="flex items-center gap-1 text-gray-500 hover:underline">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedDeal.buyer_email}</span>
                    </a>
                  )}
                </div>
                {selectedDeal.loan_bank_name && (
                  <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                    <span className="font-semibold">Banque :</span> {selectedDeal.loan_bank_name} {selectedDeal.broker_name && `(Courtier : ${selectedDeal.broker_name})`}
                  </p>
                )}
              </div>

              {/* Étude Notariale */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold uppercase text-blue-700 block tracking-wider">
                  Notaire Instrumentaire
                </span>
                <p className="text-sm font-bold text-gray-900">{selectedDeal.seller_notary_name}</p>
                <p className="text-xs text-gray-600">{selectedDeal.seller_notary_office}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                  <a href={`tel:${selectedDeal.seller_notary_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedDeal.seller_notary_phone}</span>
                  </a>
                  <a href={`mailto:${selectedDeal.seller_notary_email}`} className="flex items-center gap-1 text-gray-500 hover:underline">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedDeal.seller_notary_email}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Checklist Pièces Dossier Notaire (Loi ALUR) */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-800 tracking-wider block">
                  Checklist des Pièces du Dossier de Vente (Loi ALUR)
                </span>
                <span className="text-[11px] text-gray-400">
                  Toutes les pièces requises pour purger les délais
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedDeal.checklist_documents).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => {
                        const updatedDocs = { ...selectedDeal.checklist_documents, [key]: e.target.checked };
                        updateTransaction(selectedDeal.id, { checklist_documents: updatedDocs });
                        setSelectedDeal({ ...selectedDeal, checklist_documents: updatedDocs });
                      }}
                      className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                    />
                    <span className="capitalize text-gray-700 font-medium">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
              
              <div className="flex items-center gap-2">
                {/* Send Loan Reminder WhatsApp */}
                <button
                  type="button"
                  onClick={() => sendWhatsAppLoanReminder(selectedDeal)}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-purple-600" />
                  Relancer Prêt (WhatsApp)
                </button>

                {/* Google Review Button */}
                <button
                  type="button"
                  onClick={() => sendGoogleReviewRequest(selectedDeal)}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {selectedDeal.google_review_requested ? 'Avis Déjà Demandé' : 'Demander Avis Google'}
                </button>
              </div>

              {/* Generate Official Notary Fee Invoice */}
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C59A45]" />
                Note d&apos;Honoraires Notaire (PDF)
              </button>

            </div>

          </div>
        </div>
      )}

      {/* INVOICE OFFICIAL PRINT MODAL */}
      {isInvoiceModalOpen && selectedDeal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-8 space-y-6 shadow-2xl border border-gray-200 print:p-0 print:border-none">
            
            {/* Top Bar print/close */}
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                Aperçu Officiel de la Note d&apos;Honoraires
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer / Exporter PDF
                </button>
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Document Body */}
            <div className="border border-gray-300 p-8 rounded-2xl bg-white space-y-6 text-gray-900 font-sans">
              
              {/* Agency Header */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                  <h1 className="text-xl font-serif font-black tracking-tight text-[#131B26]">
                    {settings.agency_name || "SASU NELL'IMMO"}
                  </h1>
                  <p className="text-xs text-gray-600 mt-1">{settings.address || '26 avenue des Enjouvènes'}</p>
                  <p className="text-xs text-gray-600">{settings.postal_code} {settings.city}</p>
                  <p className="text-xs text-gray-600">Tél : {settings.phone} | {settings.email}</p>
                  <p className="text-[10px] text-gray-500 mt-2">
                    SIREN : {settings.siren || '853 807 006'} RCS {settings.rcs_city || 'Salon-de-Provence'} — Capital : {settings.capital_social || '2 000 €'}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Carte Pro CPI : {settings.card_t_number} ({settings.cci_card_t || 'CCI Marseille Provence'})
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Garantie Financière : {settings.guarantee_fund_name || 'GALIAN Assurances (120 000 €)'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-right">
                    <span className="text-[10px] font-bold uppercase text-gray-500 block">Destinataire (Notaire)</span>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{selectedDeal.seller_notary_name}</p>
                    <p className="text-xs text-gray-700">{selectedDeal.seller_notary_office}</p>
                    <p className="text-[11px] text-gray-500">{selectedDeal.seller_notary_email}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Document</span>
                  <span className="text-sm font-bold text-gray-900">
                    NOTE D&apos;HONORAIRES N° {selectedDeal.invoice_number || 'FACT-2026-004'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Date d&apos;Émission</span>
                  <span className="text-xs font-bold text-gray-900">
                    {selectedDeal.invoice_date || new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Transaction Target Description */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold uppercase text-gray-500 block">Objet de la Transaction</span>
                <p className="font-bold text-gray-900">
                  {properties.find(p => p.id === selectedDeal.property_id)?.title}
                </p>
                <p className="text-gray-600">
                  Mandat N° {properties.find(p => p.id === selectedDeal.property_id)?.mandate_number} enregistré au Registre Légal des Mandats.
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Vendeur(s) :</span> {selectedDeal.seller_name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Acquéreur(s) :</span> {selectedDeal.buyer_name}
                </p>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 text-left">Désignation</th>
                    <th className="p-2.5 text-right">Prix Net Vendeur</th>
                    <th className="p-2.5 text-right">Montant Honoraires TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2.5">
                      Honoraires de transaction immobilière et de négociation conformément au barème d&apos;agence affiché.
                    </td>
                    <td className="p-2.5 text-right font-medium">
                      {selectedDeal.offer_price_net?.toLocaleString('fr-FR')} €
                    </td>
                    <td className="p-2.5 text-right font-bold text-[#E12B7B]">
                      {selectedDeal.agency_fees_amount?.toLocaleString('fr-FR')} €
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Total & Bank Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1 flex-1">
                  <span className="font-bold text-gray-800 block text-[11px]">Règlement par Virement Notarié :</span>
                  <p className="font-mono text-[11px] text-gray-700">IBAN : {settings.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}</p>
                  <p className="font-mono text-[11px] text-gray-700">BIC : {settings.agency_rib_bic || 'BNPAFRPP'}</p>
                  <p className="text-[10px] text-gray-500 italic mt-1">
                    Conformément à la Loi Hoguet (Art. 6), aucun versement ne peut être exigé avant la conclusion effective de l&apos;acte authentique.
                  </p>
                </div>

                <div className="text-right p-3 bg-[#FAF5F8] border border-[#F3E8EE] rounded-xl shrink-0 min-w-[200px]">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Net à Verser</span>
                  <span className="text-2xl font-serif font-black text-[#E12B7B] block mt-0.5">
                    {selectedDeal.agency_fees_amount?.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-[10px] text-gray-500 block">TVA incluse au taux en vigueur</span>
                </div>
              </div>

              {/* Signature */}
              <div className="pt-4 flex justify-end">
                <div className="text-center">
                  <span className="text-xs font-bold text-gray-900 block">{settings.agent_name || 'Nelly Fernandez'}</span>
                  <span className="text-[10px] text-gray-500 block">Présidente SASU Nell&apos;Immo</span>
                  <div className="h-10 flex items-center justify-center italic text-gray-400 text-xs mt-1">
                    Pour valoir ce que de droit
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* NEW DEAL MODAL */}
      {isNewDealModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-100">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-[#131B26]">
                Créer un Nouveau Dossier de Vente
              </h3>
              <button
                onClick={() => setIsNewDealModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const propId = (form.elements.namedItem('property_id') as HTMLSelectElement).value;
                const prop = properties.find(p => p.id === propId);
                const offerPrice = Number((form.elements.namedItem('offer_price_fai') as HTMLInputElement).value);
                const feesAmount = Number((form.elements.namedItem('agency_fees_amount') as HTMLInputElement).value);
                const buyerName = (form.elements.namedItem('buyer_name') as HTMLInputElement).value;
                const buyerPhone = (form.elements.namedItem('buyer_phone') as HTMLInputElement).value;
                const notaryName = (form.elements.namedItem('seller_notary_name') as HTMLInputElement).value;

                createTransaction({
                  property_id: propId,
                  status: 'offre_acceptee',
                  offer_price_fai: offerPrice,
                  offer_price_net: offerPrice - feesAmount,
                  agency_fees_amount: feesAmount,
                  deposit_amount: Math.round(offerPrice * 0.05),
                  deposit_holder: notaryName || 'Étude Notariale',
                  seller_name: prop?.seller_name || 'Vendeur Mandant',
                  seller_phone: prop?.seller_phone || '07 55 68 61 09',
                  buyer_name: buyerName,
                  buyer_phone: buyerPhone,
                  seller_notary_name: notaryName,
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
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Bien en Vente Associé
                </label>
                <select
                  name="property_id"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      Réf. {p.mandate_number} — {p.title} ({p.price_fai.toLocaleString('fr-FR')} €)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Prix de l&apos;Offre Acceptée FAI (€)
                  </label>
                  <input
                    type="number"
                    name="offer_price_fai"
                    defaultValue={450000}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Honoraires d&apos;Agence TTC (€)
                  </label>
                  <input
                    type="number"
                    name="agency_fees_amount"
                    defaultValue={18000}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#E12B7B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Nom de l&apos;Acquéreur
                  </label>
                  <input
                    type="text"
                    name="buyer_name"
                    placeholder="M. et Mme Dupont"
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Téléphone Acquéreur
                  </label>
                  <input
                    type="text"
                    name="buyer_phone"
                    placeholder="06 12 34 56 78"
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Nom du Notaire Instrumentaire
                </label>
                <input
                  type="text"
                  name="seller_notary_name"
                  placeholder="Me Bertrand VIDAL (Pélissanne)"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Créer le Dossier
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
