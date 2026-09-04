'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, MessageCircle, Phone } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyFastContactBarProps {
    property: Property;
    mandateRef: string;
    currentPhoto: string;
}

/**
 * Barre de contact rapide flottante (mobile & desktop) : photo courante, prix,
 * CTA téléphone / WhatsApp / demande de visite.
 */
export function PropertyFastContactBar({ property, mandateRef, currentPhoto }: PropertyFastContactBarProps) {
    return (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto bg-[#131B26]/95 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 hidden sm:block">
                    <Image src={currentPhoto} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate">{property.title}</span>
                    <span className="text-sm font-black text-[#E12B7B]">
                        {property.price_fai.toLocaleString('fr-FR')} € <span className="text-[10px] text-gray-400 font-normal">FAI</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <a
                    href="tel:0755686109"
                    className="p-2.5 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    title="Appeler Nelly"
                >
                    <Phone className="w-4 h-4 text-[#E12B7B]" />
                    <span className="hidden sm:inline">07 55 68 61 09</span>
                </a>

                <a
                    href={`https://wa.me/33755686109?text=${encodeURIComponent(`Bonjour Nelly, je vous contacte au sujet du bien réf. ${mandateRef} à ${property.city}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    title="WhatsApp Nelly"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                </a>

                <a
                    href="#visite-form"
                    className="px-3 py-2.5 sm:px-4 sm:py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
                >
                    <Calendar className="w-4 h-4" />
                    <span>Visiter</span>
                </a>
            </div>
        </div>
    );
}
