'use client';

import { Check, Copy, MessageCircle, Quote, Printer } from 'lucide-react';
import type { VendorReport, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { AvisDonutChart } from './AvisDonutChart';
import { DvfPositioningSection } from './DvfPositioningSection';

interface VendorReportPreviewProps {
    report: VendorReport;
    property: Property;
    whatsappDigest: string;
    copiedWhatsapp: boolean;
    onCopyWhatsapp: () => void;
    onSendWhatsapp: () => void;
}

/**
 * Aperçu du Bilan de Commercialisation généré (Module 02).
 *
 * Affiche les 4 piliers de KPIs, la synthèse de la conseillère, le camembert
 * des avis visiteurs (B2), les verbatim anonymisés (B3) et le positionnement
 * concurrentiel DVF (B4), puis l'aperçu du message WhatsApp à transmettre.
 */
export function VendorReportPreview({
    report,
    property,
    whatsappDigest,
    copiedWhatsapp,
    onCopyWhatsapp,
    onSendWhatsapp,
}: VendorReportPreviewProps) {
    const totalViews =
        report.views_seloger + report.views_leboncoin + report.views_bienici + report.views_website;
    const verbatims = report.anonymized_verbatims ?? [];

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E12B7B] shadow-xl space-y-6 animate-fade-in print:border-none print:shadow-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-gray-100 pb-4">
                <div>
                    <span className="text-[10px] uppercase font-bold text-[#E12B7B] tracking-wider block">
                        Compte-Rendu {report.report_period.toUpperCase()} Certifié
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#131B26]">
                        Bilan de Commercialisation : {property.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                        Généré le {new Date(report.generated_at).toLocaleDateString('fr-FR')} • Réf. Mandat{' '}
                        {formatMandateRef(property.mandate_number)}
                    </span>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        title="Imprimer ou enregistrer au format PDF"
                    >
                        <Printer className="w-3.5 h-3.5 text-[#C59A45]" />
                        <span>Imprimer / PDF</span>
                    </button>

                    <button
                        onClick={onCopyWhatsapp}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                        {copiedWhatsapp ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedWhatsapp ? 'Copié !' : 'Copier'}</span>
                    </button>

                    <button
                        onClick={onSendWhatsapp}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Envoyer au Vendeur (WhatsApp)</span>
                    </button>
                </div>
            </div>

            {/* Key Metrics 4 Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE]">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Consultations Web</span>
                    <span className="text-2xl font-black text-[#131B26]">
                        {totalViews.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-[10px] text-gray-500 block">Portails nationaux</span>
                </div>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE]">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Dossiers Qualifiés</span>
                    <span className="text-2xl font-black text-[#131B26]">{report.total_leads_count}</span>
                    <span className="text-[10px] text-gray-500 block">Filtrage financier</span>
                </div>
                <div className="p-4 bg-[#FDF2F8] rounded-2xl border border-[#F3E8EE]">
                    <span className="text-[10px] font-bold uppercase text-[#E12B7B] block">Visites sur Place</span>
                    <span className="text-2xl font-black text-[#E12B7B]">{report.visits_count}</span>
                    <span className="text-[10px] text-gray-500 block">Bons de visite signés</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Retours Positifs</span>
                    <span className="text-2xl font-black text-emerald-700">
                        {report.positive_feedbacks_count} / {report.visits_count}
                    </span>
                    <span className="text-[10px] text-emerald-800/70 block">Taux d’adhésion fort</span>
                </div>
            </div>

            {/* Synthesis Text */}
            <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200 text-xs leading-relaxed text-gray-800">
                <h4 className="font-serif font-bold text-sm text-[#131B26]">
                    Synthèse Opérationnelle de la Conseillère :
                </h4>
                <p>{report.executive_summary}</p>
                <div className="pt-2 border-t border-gray-200">
                    <strong className="text-[#E12B7B]">Recommandation Stratégique :</strong>{' '}
                    <span>{report.price_recommendation_text}</span>
                </div>
            </div>

            {/* B2 — Camembert des avis + B3 — Verbatim anonymisés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#131B26]">
                        Répartition des Avis Visiteurs
                    </h4>
                    <AvisDonutChart
                        positive={report.positive_feedbacks_count}
                        neutral={report.neutral_feedbacks_count}
                        negative={report.negative_feedbacks_count}
                    />
                </div>

                <div className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#131B26] flex items-center gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-[#E12B7B]" />
                        Verbatim Anonymisés des Visiteurs
                    </h4>
                    {verbatims.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold py-2">
                            Aucun retour libre saisi pour cette période.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {verbatims.map((v, i) => (
                                <li
                                    key={i}
                                    className="text-xs text-gray-700 italic leading-relaxed p-3 bg-white rounded-xl border border-gray-200"
                                >
                                    « {v} »
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* B4 — Positionnement Concurrentiel DVF */}
            <div className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE]">
                <DvfPositioningSection key={property.id} property={property} />
            </div>

            {/* Direct WhatsApp Digest Box */}
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
                <span className="text-xs font-bold uppercase text-[#131B26] block">
                    Aperçu du Message WhatsApp Transmis au Vendeur :
                </span>
                <pre className="text-[11px] font-mono text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto p-3 bg-white rounded-xl border border-gray-200">
                    {whatsappDigest}
                </pre>
            </div>
        </div>
    );
}
