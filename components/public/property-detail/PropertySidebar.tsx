'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import type { Property } from '@/lib/types';
import { PropertyVisitForm } from './PropertyVisitForm';

interface PropertySidebarProps {
    property: Property;
    mandateRef: string;
    addContactLead: (leadData: {
        name: string;
        phone: string;
        email: string;
        subject: string;
        property_id: string;
        property_title: string;
        message: string;
    }) => Promise<unknown>;
}

/**
 * Colonne sticky droite : prix de vente, carte agent, CTA directs (téléphone /
 * WhatsApp) et formulaire de demande de visite.
 */
export function PropertySidebar({ property, mandateRef, addContactLead }: PropertySidebarProps) {
    return (
        <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6">
                {/* Price Header */}
                <div className="border-b border-[#FAF5F8] pb-4">
                    <span className="text-xs uppercase font-bold text-gray-400">Prix de vente FAI</span>
                    <div className="text-3xl sm:text-4xl font-black text-[#E12B7B]">
                        {property.price_fai.toLocaleString('fr-FR')} €
                    </div>
                    <span className="text-[11px] text-gray-400">
                        {property.fees_paid_by === 'acquereur'
                            ? `Dont ${property.agency_fees_percentage}% TTC d'honoraires charge acquéreur`
                            : 'Honoraires inclus charge vendeur'}
                    </span>
                </div>

                {/* Agent Contact Card */}
                <div className="flex items-center gap-4 bg-[#FCFAF7] p-4 rounded-2xl border border-[#F3E8EE]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-serif font-bold text-lg shrink-0 shadow-xs">
                        NF
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-base text-[#131B26]">Nelly Fernandez</h4>
                        <span className="text-[11px] text-gray-500 block">Agent Immobilier Indépendant</span>
                        <span className="text-[10px] text-[#C59A45] font-semibold">CPI 1310 2019 000 042 974</span>
                    </div>
                </div>

                {/* Direct Contact CTAs */}
                <div className="space-y-2.5">
                    <a
                        href="tel:0755686109"
                        className="w-full py-3.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
                    >
                        <Phone className="w-4 h-4 text-[#E12B7B]" />
                        Appeler le 07 55 68 61 09
                    </a>
                    <a
                        href={`https://wa.me/33755686109?text=${encodeURIComponent(`Bonjour Nelly, je souhaite avoir plus d'informations ou visiter la propriété ${property.title} (Réf. ${mandateRef}) à ${property.city}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Échanger sur WhatsApp
                    </a>
                </div>

                {/* Visit Request Form */}
                <PropertyVisitForm
                    property={property}
                    mandateRef={mandateRef}
                    addContactLead={addContactLead}
                />
            </div>
        </div>
    );
}
