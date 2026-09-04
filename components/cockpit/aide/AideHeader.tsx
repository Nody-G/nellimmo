'use client';

import { BadgeCheck, Calculator, CheckCircle2, MapPin, Scale, Sparkles } from 'lucide-react';

interface AideHeaderProps {
    onOpenCalculator: () => void;
}

/** Dark hero banner for the Cockpit Academy help centre. */
export function AideHeader({ onOpenCalculator }: AideHeaderProps) {
    return (
        <div className="bg-gradient-to-br from-[#131B26] via-[#1F2937] to-[#131B26] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-gray-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E12B7B]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#C59A45]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F44293] border border-white/10 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
                        <span>COCKPIT ACADEMY • SASU NELL{"\u2019"}IMMO</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                        Centre d{"\u2019"}Aide & Guides Pratiques
                    </h1>
                    <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                        Tutoriels méticuleux, protocoles juridiques (Loi Hoguet / ALUR), cas réels du Pays Salonais et scripts prêts à l{"\u2019"}emploi pour piloter votre agence en parfaite autonomie.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={onOpenCalculator}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/15 cursor-pointer"
                    >
                        <Calculator className="w-4 h-4 text-[#C59A45]" />
                        <span>Calculateur Délais Légaux</span>
                    </button>
                </div>
            </div>

            {/* Badges Strip */}
            <div className="mt-6 pt-5 border-t border-gray-800/80 flex flex-wrap gap-4 sm:gap-6 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <span>12 Guides Complets</span>
                </div>
                <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#C59A45]" />
                    <span>Conformité Loi Hoguet & DGCCRF</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E12B7B]" />
                    <span>Ancré en Pays Salonais (Pélissanne & Alentours)</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>100% Autonome Sans Abonnement Tiers</span>
                </div>
            </div>
        </div>
    );
}
