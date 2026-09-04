'use client';

import { MessageCircle, Send, X } from 'lucide-react';
import type { Buyer, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { buildBroadcastTeaser, rankBuyersForProperty, toWhatsAppNumber } from './acquereurs-types';

interface BroadcastCampaignModalProps {
    isOpen: boolean;
    buyers: Buyer[];
    properties: Property[];
    activeProperties: Property[];
    broadcastPropertyId: string;
    onPropertyChange: (id: string) => void;
    onClose: () => void;
}

/** Consolidated broadcast campaign modal (auto-matching alert diffusion). */
export function BroadcastCampaignModal({
    isOpen,
    buyers,
    properties,
    activeProperties,
    broadcastPropertyId,
    onPropertyChange,
    onClose,
}: BroadcastCampaignModalProps) {
    if (!isOpen) return null;

    const targetProp =
        properties.find((p) => p.id === broadcastPropertyId) || activeProperties[0];

    const matched = targetProp ? rankBuyersForProperty(buyers, targetProp) : [];
    const highMatches = matched.filter((m) => m.score >= 70);
    const teaserText = targetProp ? buildBroadcastTeaser(targetProp) : '';

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-[#E12B7B]" />
                        <div>
                            <h3 className="font-serif font-bold text-lg text-[#131B26]">
                                Campagne d{"\u2019"}Alerte Rapprochement Automatique
                            </h3>
                            <span className="text-[10px] text-gray-400 block">
                                Diffusion ciblée en 1 clic aux acquéreurs solvables en portefeuille
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Property Selector */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-700 block">
                        Sélectionner le Bien à Rapprocher :
                    </label>
                    <select
                        value={broadcastPropertyId}
                        onChange={(e) => onPropertyChange(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-[#E12B7B]"
                    >
                        {activeProperties.map((p) => (
                            <option key={p.id} value={p.id}>
                                [{formatMandateRef(p.mandate_number)}] {p.title} — {p.city} ({p.price_fai.toLocaleString('fr-FR')} € FAI)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Matched Buyers List */}
                {targetProp && (
                    <div className="space-y-4 text-xs">
                        <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex items-center justify-between">
                            <div>
                                <span className="font-bold text-[#131B26] block text-sm">
                                    {matched.length} Acquéreurs Compatibles Détectés
                                </span>
                                <span className="text-gray-500 text-[11px]">
                                    dont <strong className="text-emerald-700">{highMatches.length} acquéreurs chauds</strong> (matching ≥ 70%)
                                </span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                Ciblage Actif
                            </span>
                        </div>

                        {/* Buyers Items */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {matched.map(({ buyer, score }) => (
                                <div
                                    key={buyer.id}
                                    className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <span className="font-bold text-gray-900 block">
                                            {buyer.first_name} {buyer.last_name} ({buyer.phone})
                                        </span>
                                        <span className="text-[11px] text-gray-500">
                                            Budget max : {buyer.budget_max.toLocaleString('fr-FR')} € • {buyer.target_cities.join(', ')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${score >= 80
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : score >= 70
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {score}% Match
                                        </span>

                                        <a
                                            href={`https://wa.me/${toWhatsAppNumber(buyer.phone)}?text=${encodeURIComponent(
                                                teaserText.replace('[Prénom]', buyer.first_name)
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                                            title="Envoyer le message WhatsApp"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Preview */}
                        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 font-mono text-[11px]">
                            <span className="font-bold uppercase text-gray-500 block text-[10px]">
                                Message Type Personnalisé :
                            </span>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {teaserText}
                            </p>
                        </div>
                    </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
