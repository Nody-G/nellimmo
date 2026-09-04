'use client';

import Link from 'next/link';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import type { Buyer, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { financingBadge, financingLabel, buildBuyerContactMessage, toWhatsAppNumber } from './acquereurs-types';

interface BuyerCardProps {
    buyer: Buyer;
    matchingProperties: { property: Property; score: number }[];
    onOpenSelection: (buyer: Buyer) => void;
}

/** A single buyer card with criteria, matching mandates and quick actions. */
export function BuyerCard({ buyer, matchingProperties, onOpenSelection }: BuyerCardProps) {
    const contactMessage = buildBuyerContactMessage(buyer);
    const waNumber = toWhatsAppNumber(buyer.phone);

    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-serif font-bold text-base text-[#131B26]">
                            {buyer.first_name} {buyer.last_name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-[#E12B7B]" />
                                {buyer.phone}
                            </span>
                        </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${financingBadge(buyer.financing_status)}`}>
                        {financingLabel(buyer.financing_status)}
                    </span>
                </div>

                {/* Criteria highlights */}
                <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F3E8EE] text-xs space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Budget max :</span>
                        <span className="font-bold text-[#E12B7B]">{buyer.budget_max.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Surface min :</span>
                        <span className="font-bold text-gray-900">{buyer.min_surface} m² ({buyer.min_rooms}p / {buyer.min_bedrooms}ch)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Secteurs :</span>
                        <span className="font-bold text-gray-900">{buyer.target_cities.join(', ')}</span>
                    </div>
                    <div className="flex gap-2 text-[10px] font-bold text-gray-600 pt-1">
                        {buyer.must_have_garden && <span className="bg-white px-2 py-0.5 rounded border border-gray-200">🌳 Jardin exigé</span>}
                        {buyer.must_have_garage && <span className="bg-white px-2 py-0.5 rounded border border-gray-200">🚗 Garage exigé</span>}
                    </div>
                </div>

                {/* Mandate Matches */}
                <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase text-gray-400 block flex items-center justify-between">
                        <span>Biens Correspondants</span>
                        <span className="text-[#E12B7B]">{matchingProperties.length} match(s)</span>
                    </span>

                    {matchingProperties.length > 0 ? (
                        <div className="space-y-1">
                            {matchingProperties.slice(0, 2).map(({ property: p, score }) => (
                                <div
                                    key={p.id}
                                    className="p-2 bg-gray-50 hover:bg-[#FDF2F8] rounded-xl text-xs flex items-center justify-between transition border border-gray-100"
                                >
                                    <Link href={`/cockpit/mandats/${p.id}`} className="font-semibold text-gray-900 truncate hover:text-[#E12B7B]">
                                        {formatMandateRef(p.mandate_number)} - {p.title}
                                    </Link>
                                    <span className="text-[10px] font-black text-white bg-[#E12B7B] px-1.5 py-0.5 rounded ml-2 shrink-0">
                                        {score}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-[11px] text-gray-400 italic">Aucun mandat actif ne correspond à 100% actuellement.</span>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => onOpenSelection(buyer)}
                    className="w-full py-2 bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#E12B7B] border border-[#F3E8EE] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sélection & Dossier VIP ({matchingProperties.length})</span>
                </button>

                <div className="flex items-center gap-2">
                    <a
                        href={`tel:${buyer.phone}`}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                    </a>
                    <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(contactMessage)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
