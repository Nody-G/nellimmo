'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Printer, Share2 } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyTopBarProps {
    property: Property;
    mandateRef: string;
    isFav: boolean;
    onToggleFavorite: () => void;
    onShare: () => void;
}

/**
 * Barre supérieure : fil d'Ariane + contrôles (favori, partage, impression).
 */
export function PropertyTopBar({ property, mandateRef, isFav, onToggleFavorite, onShare }: PropertyTopBarProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
                <Link href="/" className="hover:text-[#E12B7B] transition">Accueil</Link>
                <span>/</span>
                <Link href="/biens" className="hover:text-[#E12B7B] transition">Catalogue</Link>
                <span>/</span>
                <span className="text-gray-900 font-semibold">{property.city}</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono bg-[#FCFAF7] text-gray-700 px-3 py-1 rounded-full border border-[#F3E8EE] font-bold">
                    Réf. {mandateRef}
                </span>

                <button
                    onClick={onToggleFavorite}
                    className={`p-2 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${isFav
                        ? 'bg-[#FDF2F8] border-[#E12B7B] text-[#E12B7B]'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E12B7B]' : ''}`} />
                </button>

                <button
                    onClick={onShare}
                    className="p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-[#E12B7B] hover:bg-gray-50 transition cursor-pointer"
                    title="Partager ce bien (WhatsApp, QR Code, Email)"
                >
                    <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                    onClick={() => window.print()}
                    className="hidden sm:flex p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-[#E12B7B] hover:bg-gray-50 transition cursor-pointer items-center gap-1 text-xs font-semibold px-3"
                    title="Imprimer la brochure du bien"
                >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Imprimer la fiche</span>
                </button>
            </div>
        </div>
    );
}
