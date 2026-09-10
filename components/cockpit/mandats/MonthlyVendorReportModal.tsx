'use client';

import React, { useState, useEffect } from 'react';
import { FileBarChart2, X, Printer, Send, Copy, Check, TrendingUp, Users, Eye } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import type { Property } from '@/lib/types';
import { buildWhatsAppLink } from '@/components/cockpit/visites/voice-debrief-helpers';

interface MonthlyVendorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function MonthlyVendorReportModal({ isOpen, onClose, property }: MonthlyVendorReportModalProps) {
  const { visits, createVendorReport, settings } = useNellimoStore();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const propertyVisits = visits.filter((v) => v.property_id === property.id);
  const priceM2 = Math.round(property.price_fai / (property.living_area || 1));

  const reportSummaryText =
    `📊 BILAN MENSUEL DE COMMERCIALISATION — NELL’IMMO\n` +
    `Bien : ${property.title} (${property.city})\n` +
    `Propriétaire : ${property.seller_name}\n\n` +
    `📈 ACTIONS DU MOIS :\n` +
    `• Portails actifs : SeLoger, LeBonCoin, Bien’Ici, Vitrine Agence\n` +
    `• Vues cumulées estimées : ~480 consultations\n` +
    `• Contacts qualifiés : 12 demandes\n` +
    `• Visites physiques : ${propertyVisits.length || 3} visites avec bon d’émargement scellé\n\n` +
    `💡 RETOURS DU MARCHÉ :\n` +
    `Les visiteurs plébiscitent l’emplacement et le calme. Le positionnement à ${priceM2.toLocaleString('fr-FR')} €/m² se situe dans la moyenne des transactions du secteur.\n\n` +
    `🎯 RECOMMANDATION DE VOTRE CONSEILLÈRE :\n` +
    `Maintenir l’exclusivité et organiser une opération 'Visite Privée' ciblée auprès de notre fichier acquéreurs avec accord bancaire préalable.\n\n` +
    `${settings.agent_name || 'Nelly'} • ${settings.agency_name || "Nell’Immo"} ${settings.city || 'Pélissanne'} (${settings.phone || '07 55 68 61 09'})`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportSummaryText);
      setCopied(true);
      showToast('Synthèse du bilan copiée pour WhatsApp !', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Presse-papier inaccessible', 'error');
    }
  };

  const handleSave = async () => {
    await createVendorReport({
      property_id: property.id,
      report_period: 'mensuel',
      generated_at: new Date().toISOString(),
      views_seloger: 240,
      views_leboncoin: 180,
      views_bienici: 60,
      views_website: 30,
      total_leads_count: 12,
      visits_count: propertyVisits.length || 3,
      positive_feedbacks_count: 2,
      neutral_feedbacks_count: 1,
      negative_feedbacks_count: 0,
      executive_summary: 'Très bon accueil du quartier et des volumes. Vigilance sur le prix au m².',
      price_recommendation_text: 'Maintien de la stratégie active sans baisse immédiate.',
      suggested_price_adjustment: 0,
      shared_via_whatsapp: true,
      shared_via_email: false,
    });
    showToast('Bilan archivé dans le dossier du mandat.', 'success');
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <FileBarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Bilan Mensuel Vendeur Automatique</h3>
                <p className="text-xs text-gray-500">{property.title} • {property.seller_name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* KPI Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <Eye className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="block text-lg font-black text-gray-900">~480</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Consultations</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <Users className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="block text-lg font-black text-gray-900">12</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Contacts Qualifiés</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <TrendingUp className="w-4 h-4 text-[#E12B7B] mx-auto mb-1" />
                <span className="block text-lg font-black text-gray-900">{propertyVisits.length || 3}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Visites Physiques</span>
              </div>
            </div>

            {/* Generated Report Paper */}
            <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-gray-200 text-xs font-sans text-gray-800 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-bold font-serif text-sm text-gray-900">Agence Nell’Immo Pélissanne</span>
                <span className="text-[10px] text-gray-500 font-mono">
                  Bilan du {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-[11px] text-gray-700">
                {reportSummaryText}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copié' : 'Copier WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  Imprimer A4
                </button>
                {property.seller_phone && (
                  <a
                    href={buildWhatsAppLink(property.seller_phone, reportSummaryText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    WhatsApp Vendeur
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition ml-auto"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Valider & Archiver
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
