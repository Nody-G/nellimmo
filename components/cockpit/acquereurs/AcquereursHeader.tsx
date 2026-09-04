'use client';

import Link from 'next/link';
import { Calculator, Coins, PlusCircle, Send, Users, ArrowUpRight } from 'lucide-react';

interface AcquereursHeaderProps {
    buyerCount: number;
    onOpenBroadcast: () => void;
    onOpenNewBuyer: () => void;
}

/** Page header with title and main action buttons. */
export function AcquereursHeader({
    buyerCount,
    onOpenBroadcast,
    onOpenNewBuyer,
}: AcquereursHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <Users className="w-4 h-4" />
                    <span>CRM Acquéreurs & Intelligence Financière</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Fichier Acquéreurs Qualifiés & Matching
                </h1>
                <p className="text-xs text-gray-500">
                    {buyerCount} contacts en portefeuille, stress-test financier HCSF et campagnes de diffusion instantanées.
                </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <Link
                    href="/cockpit/simulateurs?tab=notary"
                    className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-2xs group"
                    title="Ouvrir le simulateur de frais de notaire & plus-value"
                >
                    <Coins className="w-4 h-4 text-[#C59A45]" />
                    <span>Frais de Notaire</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition" />
                </Link>

                <Link
                    href="/cockpit/simulateurs?tab=credit"
                    className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-2xs group"
                    title="Ouvrir le simulateur de crédit & règle HCSF 35%"
                >
                    <Calculator className="w-4 h-4 text-[#C59A45]" />
                    <span>Simulateur Crédit & HCSF</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition" />
                </Link>

                <button
                    onClick={onOpenBroadcast}
                    className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
                >
                    <Send className="w-4 h-4 text-[#E12B7B]" />
                    <span>Campagne WhatsApp Ciblée</span>
                </button>

                <button
                    onClick={onOpenNewBuyer}
                    className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Nouvel Acquéreur</span>
                </button>
            </div>
        </div>
    );
}
