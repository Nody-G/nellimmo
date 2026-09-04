'use client';

import Link from 'next/link';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewMandateHeaderProps {
    nextMandateNumber: number;
    onOpenAutoFill: () => void;
}

export function NewMandateHeader({ nextMandateNumber, onOpenAutoFill }: NewMandateHeaderProps) {
    return (
        <>
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/cockpit/mandats"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#E12B7B] transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour au registre des mandats
                </Link>

                <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={onOpenAutoFill}
                    leftIcon={<Wand2 className="w-4 h-4" />}
                >
                    Remplissage Express / Import Texte
                </Button>
            </div>

            {/* Header Banner */}
            <div className="border-b border-[#F3E8EE] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                        Créateur d{"\u2019"}Annonce & Mandat
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                        Nouveau Mandat #{nextMandateNumber}
                    </h1>
                    <p className="text-xs text-gray-500">
                        Conforme Loi Hoguet, Loi ALUR et barème DPE 2024. Prêt pour multidiffusion immédiate.
                    </p>
                </div>

                <div className="px-4 py-2 bg-[#FAF5F8] border border-[#F3E8EE] rounded-2xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-700">Registre Loi Hoguet Prêt</span>
                </div>
            </div>
        </>
    );
}
