'use client';

import { Phone, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import type { ProspectingLead, ProspectingStatus } from '@/lib/types';
import {
    computeDvfGap,
    buildWhatsAppMessage,
    cleanPhone,
    statusBadgeClass,
    STATUS_OPTIONS,
} from './pige-types';

interface LeadCardProps {
    lead: ProspectingLead;
    onConvertToMandate: (lead: ProspectingLead) => void;
    onStatusChange?: (leadId: string, newStatus: ProspectingStatus) => void;
}

/** A single prospecting lead card with DVF gap analyzer and action buttons. */
export function LeadCard({ lead, onConvertToMandate, onStatusChange }: LeadCardProps) {
    const { priceM2, benchmarkDvf, diffPct } = computeDvfGap(lead);
    const whatsappMessage = buildWhatsAppMessage(lead);
    const cleanPhoneNumber = cleanPhone(lead.seller_phone);

    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                {lead.source.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            {lead.neighborhood && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2F8] text-[#E12B7B] border border-[#F3E8EE]">
                                    📍 {lead.neighborhood}
                                </span>
                            )}
                            <span className="text-xs text-gray-400">
                                {new Date(lead.created_at).toLocaleDateString('fr-FR')} • {lead.days_online}j en ligne
                            </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#131B26] mt-1">
                            {lead.title}
                        </h3>
                    </div>

                    <div className="shrink-0">
                        {onStatusChange ? (
                            <select
                                value={lead.status}
                                onChange={(e) => onStatusChange(lead.id, e.target.value as ProspectingStatus)}
                                className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-xl border border-transparent focus:outline-none cursor-pointer transition shadow-2xs ${statusBadgeClass(lead.status)}`}
                                title="Changer le statut du prospect"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-white text-gray-900 font-semibold normal-case">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shrink-0 ${statusBadgeClass(lead.status)}`}>
                                {lead.status.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Metrics Pill */}
                <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F3E8EE] text-xs space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Vendeur :</span>
                        <span className="font-bold text-gray-900">{lead.seller_name} ({lead.seller_phone})</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Localisation :</span>
                        <span className="font-bold text-gray-900">
                            {lead.city} {lead.neighborhood ? `(${lead.neighborhood})` : ''} • {lead.living_area} m²
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Prix demandé :</span>
                        <span className="font-bold text-[#E12B7B]">{lead.price_asked.toLocaleString('fr-FR')} € ({priceM2} €/m²)</span>
                    </div>
                </div>

                {/* DVF Gap Analyzer */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${diffPct > 5
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                    <div className="space-y-0.5">
                        <span className="font-bold block text-[11px]">
                            Écart avec le Marché Notaires DVF (~{benchmarkDvf} €/m²)
                        </span>
                        <span className="text-[10px] text-gray-600 block">
                            {diffPct > 0 ? `Surévalué de +${diffPct}% par rapport aux actes réels` : `Prix cohérent avec les ventes réelles`}
                        </span>
                    </div>
                    <div className="text-right font-black text-sm">
                        {diffPct > 0 ? `+${diffPct}%` : `${diffPct}%`}
                    </div>
                </div>

                {lead.notes && (
                    <p className="text-[11px] text-gray-600 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        « {lead.notes} »
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <a
                        href={`tel:${lead.seller_phone}`}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                    </a>

                    <a
                        href={`https://wa.me/${cleanPhoneNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                    </a>

                    {lead.source_url && (
                        <a
                            href={lead.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center transition"
                            title="Voir annonce"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {/* 1-Click Mandate Conversion */}
                {lead.status !== 'mandat_obtenu' && (
                    <button
                        type="button"
                        onClick={() => onConvertToMandate(lead)}
                        className="w-full py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
                        <span>Transformer en Mandat Officiel (1 Clic)</span>
                    </button>
                )}
            </div>
        </div>
    );
}
