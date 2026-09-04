'use client';

import {
    FileCheck2,
    MessageCircle,
    PlusCircle,
    ShieldCheck,
} from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import type { AlurDocumentCategory } from '@/lib/types';

interface AlurGedHeaderProps {
    property: Property;
    applicableCount: number;
    validCount: number;
    totalMandatory: number;
    completionPercent: number;
    missingCount: number;
    isApartment: boolean;
    activeCategory: AlurDocumentCategory | 'all';
    onCategoryChange: (category: AlurDocumentCategory | 'all') => void;
    onOpenNotarySlip: () => void;
    onSendReminder: () => void;
    onAddDocument: () => void;
}

/** Top completion banner with gauge, actions and category filter bar. */
export function AlurGedHeader({
    property,
    applicableCount,
    validCount,
    totalMandatory,
    completionPercent,
    missingCount,
    isApartment,
    activeCategory,
    onCategoryChange,
    onOpenNotarySlip,
    onSendReminder,
    onAddDocument,
}: AlurGedHeaderProps) {
    const categoryButton = (
        category: AlurDocumentCategory | 'all',
        label: string,
        show = true
    ) =>
        show ? (
            <button
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${activeCategory === category
                        ? 'bg-[#131B26] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                {label}
            </button>
        ) : null;

    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B] flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Conformité Loi ALUR & Dossier Notaire
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700">
                            {formatMandateRef(property.mandate_number)}
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
                        Dossier de Vente & Diagnostics Techniques
                    </h2>
                    <p className="text-xs text-gray-500 max-w-xl">
                        Centralisation exhaustive des pièces obligatoires pour la mise en vente et la signature du compromis chez le notaire.
                    </p>
                </div>

                {/* Gauge & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex items-center gap-4">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-200"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className={
                                        completionPercent >= 80
                                            ? 'text-emerald-500'
                                            : completionPercent >= 50
                                                ? 'text-amber-500'
                                                : 'text-rose-500'
                                    }
                                    strokeDasharray={`${completionPercent}, 100`}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <span className="absolute text-xs font-black text-[#131B26]">{completionPercent}%</span>
                        </div>
                        <div className="space-y-0.5 text-xs">
                            <span className="font-bold text-[#131B26] block">
                                {validCount} / {totalMandatory} pièces validées
                            </span>
                            <span
                                className={`text-[11px] font-semibold block ${completionPercent >= 80 ? 'text-emerald-700' : 'text-amber-700'
                                    }`}
                            >
                                {completionPercent >= 80
                                    ? '✓ Dossier prêt pour compromis'
                                    : '⚠️ Pièces manquantes pour le notaire'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onOpenNotarySlip}
                            className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                        >
                            <FileCheck2 className="w-4 h-4 text-[#C59A45]" />
                            Bordereau Notaire
                        </button>

                        {missingCount > 0 && (
                            <button
                                type="button"
                                onClick={onSendReminder}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                                title="Envoyer un rappel WhatsApp au vendeur avec la liste des pièces manquantes"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Relancer Vendeur ({missingCount})
                            </button>
                        )}

                        <button
                            onClick={onAddDocument}
                            className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Ajouter une Pièce
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories Bar */}
            <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-gray-100">
                {categoryButton('all', `Toutes les Pièces (${applicableCount})`)}
                {categoryButton('propriete', 'Titre & Propriété')}
                {categoryButton('diagnostics', 'Diagnostics DDT')}
                {categoryButton('copropriete', 'Copropriété ALUR', isApartment)}
                {categoryButton('identite', 'Identité & Mandants')}
            </div>
        </div>
    );
}
