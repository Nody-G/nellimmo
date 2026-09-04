'use client';

import { Printer } from 'lucide-react';
import type { DVFTransaction } from '@/lib/types';
import { formatFr } from './avis-de-valeur-types';

interface ExpertiseDossierProps {
    ownerName: string;
    addressSearch: string;
    surfaceInput: number;
    landInput: number;
    roomsInput: number;
    transactions: DVFTransaction[];
    baseDvfM2: number;
    priceTarget: number;
    initialCity: string;
}

/** Full 8-page prestige dossier preview & print (conditional on isDossierGenerated). */
export function ExpertiseDossier({
    ownerName,
    addressSearch,
    surfaceInput,
    landInput,
    roomsInput,
    transactions,
    baseDvfM2,
    priceTarget,
    initialCity,
}: ExpertiseDossierProps) {
    return (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#E12B7B] shadow-2xl space-y-8 animate-fade-in print-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-gray-200 pb-4">
                <div>
                    <span className="text-xs font-bold uppercase text-[#E12B7B]">Dossier d{"\u2019"}Expertise & Avis de Valeur Officiel</span>
                    <h2 className="text-2xl font-serif font-black text-[#131B26]">
                        Étude Comparative de Marché DVF & Avis de Valeur
                    </h2>
                    <span className="text-xs text-gray-500">Préparé pour {ownerName} • {addressSearch}</span>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer shrink-0"
                >
                    <Printer className="w-4 h-4 text-[#C59A45]" />
                    <span>Imprimer le Livret Relié</span>
                </button>
            </div>

            {/* Dossier Structure: 8 Complete Chapters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 1</span>
                    <strong className="block text-sm text-[#131B26]">Couverture & Synthèse</strong>
                    <p className="text-[11px] text-gray-600">Fiche d{"\u2019"}identité du bien, mandant et cachet de l{"\u2019"}agence.</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 2</span>
                    <strong className="block text-sm text-[#131B26]">Démarche Déontologique</strong>
                    <p className="text-[11px] text-gray-600">Engagement SASU Nell{"\u2019"}Immo, carte pro CPI et garantie Galian.</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 3</span>
                    <strong className="block text-sm text-[#131B26]">Caractéristiques & Cadastre</strong>
                    <p className="text-[11px] text-gray-600">Surface {surfaceInput} m², terrain {landInput} m², {roomsInput} pièces.</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 4</span>
                    <strong className="block text-sm text-[#131B26]">Micromarché DVF Réel</strong>
                    <p className="text-[11px] text-gray-600">{transactions.length} références comparables à 500m ({formatFr(baseDvfM2)} €/m² pondéré).</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 5</span>
                    <strong className="block text-sm text-[#131B26]">Triple Méthode Croisée</strong>
                    <p className="text-[11px] text-gray-600">DVF pondéré, rendement locatif et coût de remplacement.</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 6</span>
                    <strong className="block text-sm text-[#131B26]">Matrice SWOT & Atouts</strong>
                    <p className="text-[11px] text-gray-600">Valorisation des points forts et leviers de négociation.</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 7</span>
                    <strong className="block text-sm text-[#131B26]">Triangulation des 3 Prix</strong>
                    <p className="text-[11px] text-gray-600">Cible d{"\u2019"}équilibre certifié : <strong>{formatFr(priceTarget)} €</strong>.</p>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="font-bold text-[#E12B7B] block text-[10px] uppercase">Chapitre 8</span>
                    <strong className="block text-sm text-[#131B26]">Stratégie & Mandat Exclusif</strong>
                    <p className="text-[11px] text-gray-600">Plan de commercialisation 360° et espace vendeur temps réel.</p>
                </div>
            </div>

            {/* SWOT Matrix */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#131B26]">
                    Matrice d{"\u2019"}Évaluation Stratégique du Bien (Forces / Faiblesses)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                        <span className="font-bold text-emerald-800 block">🟢 Points Forts Majeurs Relevés</span>
                        <ul className="list-disc list-inside text-[11px] text-emerald-900 space-y-0.5">
                            <li>Emplacement résidentiel au calme, très recherché sur {initialCity}</li>
                            <li>Parcelle de {landInput} m² sans vis-à-vis gênant</li>
                            <li>Distribution fonctionnelle des pièces adaptée aux familles ({roomsInput} pièces)</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="font-bold text-amber-800 block">🟡 Points d{"\u2019"}Attention & Optimisation</span>
                        <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-0.5">
                            <li>Mise en valeur visuelle et photos HDR professionnelles indispensables</li>
                            <li>DDT technique (DPE, conformité assainissement) à finaliser pour le dossier notaire</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Data source disclaimer */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] leading-relaxed text-amber-900">
                <strong className="font-bold">Note méthodologique — source des données.</strong>{' '}
                Les références DVF présentées dans ce dossier proviennent d{"\u2019"}un jeu de données local de
                démonstration (simulation) et sont pondérées par distance et ancienneté pour refléter le micromarché.
                Elles seront automatiquement remplacées par les ventes réelles de l{"\u2019"}API DGFiP / data.gouv dès
                son raccordement. Ce document est un support d{"\u2019"}aide à la décision et ne vaut pas expertise
                notariale.
            </div>

            {/* Agency Signature */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-500">
                <span>Dossier officiel établi par Nelly FERNANDEZ • Carte CPI 1310 2019 000 042 974</span>
                <span className="font-bold text-[#E12B7B]">SASU Nell{"\u2019"}Immo — Pélissanne & Pays Salonais</span>
            </div>
        </div>
    );
}
