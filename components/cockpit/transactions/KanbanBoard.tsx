'use client';

import { Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Property, TransactionDeal, TransactionStatus } from '@/lib/types';
import { STATUS_COLUMNS } from './transactions-types';

interface KanbanBoardProps {
    filteredDeals: TransactionDeal[];
    properties: Property[];
    getDaysRemaining: (targetDateStr?: string) => number | null;
    onQuickAdvance: (e: React.MouseEvent, deal: TransactionDeal, nextStatus: TransactionStatus, stageLabel: string) => void;
    onSelectDeal: (deal: TransactionDeal) => void;
}

export function KanbanBoard({
    filteredDeals,
    properties,
    getDaysRemaining,
    onQuickAdvance,
    onSelectDeal
}: KanbanBoardProps) {
    return (
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
                                            onClick={() => onSelectDeal(deal)}
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
                                                <div className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${daysToLoan <= 15 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-purple-50 text-purple-700'
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

                                            {/* Quick Advance Button */}
                                            {col.id !== 'acte_signe' && (
                                                <div className="pt-1 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            if (col.id === 'offre_acceptee') {
                                                                onQuickAdvance(e, deal, 'compromis_signe', 'Compromis & SRU');
                                                            } else if (col.id === 'compromis_signe') {
                                                                onQuickAdvance(e, deal, 'attente_pret', 'Attente accord prêt');
                                                            } else if (col.id === 'attente_pret') {
                                                                onQuickAdvance(e, deal, 'acte_planifie', 'Acte notarié planifié');
                                                            } else if (col.id === 'acte_planifie') {
                                                                onQuickAdvance(e, deal, 'acte_signe', 'Acte authentique signé');
                                                            }
                                                        }}
                                                        className="w-full py-1 px-2 bg-gray-50 hover:bg-pink-50 hover:text-[#E12B7B] border border-gray-200 hover:border-pink-300 rounded-lg text-[10px] font-bold text-gray-600 flex items-center justify-center gap-1 transition cursor-pointer"
                                                    >
                                                        <span>
                                                            {col.id === 'offre_acceptee' && '→ Passer au compromis'}
                                                            {col.id === 'compromis_signe' && '→ Valider SRU & prêt'}
                                                            {col.id === 'attente_pret' && '→ Prêt OK, fixer acte'}
                                                            {col.id === 'acte_planifie' && '★ Clôturer vente'}
                                                        </span>
                                                    </button>
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
    );
}
