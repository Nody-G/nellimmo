'use client';

import { Phone, Mail, Send, Star, Printer, Check } from 'lucide-react';
import type { Property, TransactionDeal } from '@/lib/types';
import { STATUS_COLUMNS } from './transactions-types';

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
    const prop = properties.find(p => p.id === deal.property_id);

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
                            <span className="text-xs font-bold text-gray-400">
                                ID: {deal.id}
                            </span>
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

                {/* Workflow Progression Buttons */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="text-xs font-bold uppercase text-gray-700 block tracking-wider">
                        Avancement de l&rsquo;Étape Notariale
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_COLUMNS.map((col) => {
                            const isActive = deal.status === col.id;
                            return (
                                <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => {
                                        onUpdateStatus(deal.id, col.id);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${isActive
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
                            {deal.offer_price_fai?.toLocaleString('fr-FR')} €
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Net Vendeur</span>
                        <span className="text-base font-bold text-gray-900 font-serif">
                            {deal.offer_price_net?.toLocaleString('fr-FR')} €
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">Honoraires Nell&rsquo;Immo</span>
                        <span className="text-base font-bold text-[#E12B7B] font-serif">
                            {deal.agency_fees_amount?.toLocaleString('fr-FR')} € TTC
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Séquestre Notaire</span>
                        <span className="text-base font-bold text-gray-900 font-serif">
                            {deal.deposit_amount?.toLocaleString('fr-FR')} €
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
                        <p className="text-sm font-bold text-gray-900">{deal.buyer_name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <a href={`tel:${deal.buyer_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{deal.buyer_phone}</span>
                            </a>
                            {deal.buyer_email && (
                                <a href={`mailto:${deal.buyer_email}`} className="flex items-center gap-1 text-gray-500 hover:underline">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{deal.buyer_email}</span>
                                </a>
                            )}
                        </div>
                        {deal.loan_bank_name && (
                            <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                                <span className="font-semibold">Banque :</span> {deal.loan_bank_name} {deal.broker_name && `(Courtier : ${deal.broker_name})`}
                            </p>
                        )}
                    </div>

                    {/* Étude Notariale */}
                    <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
                        <span className="text-xs font-bold uppercase text-blue-700 block tracking-wider">
                            Notaire Instrumentaire
                        </span>
                        <p className="text-sm font-bold text-gray-900">{deal.seller_notary_name}</p>
                        <p className="text-xs text-gray-600">{deal.seller_notary_office}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                            <a href={`tel:${deal.seller_notary_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{deal.seller_notary_phone}</span>
                            </a>
                            <a href={`mailto:${deal.seller_notary_email}`} className="flex items-center gap-1 text-gray-500 hover:underline">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{deal.seller_notary_email}</span>
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
                        {Object.entries(deal.checklist_documents).map(([key, val]) => (
                            <label key={key} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={val}
                                    onChange={(e) => {
                                        const updatedDocs = { ...deal.checklist_documents, [key]: e.target.checked };
                                        onUpdateChecklist(deal.id, updatedDocs);
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
                        Note d&rsquo;Honoraires Notaire (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}
