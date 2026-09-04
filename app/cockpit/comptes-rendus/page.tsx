'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import { VendorReport, Property } from '@/lib/types';
import { VendorReportPreview } from '@/components/cockpit/comptes-rendus/VendorReportPreview';
import {
  FileCheck2,
  Printer,
  Sparkles,
  Home,
  BarChart3,
  ExternalLink,
  TrendingDown
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

function VendorReportsContent() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId');
  const { properties, vendorReports, createVendorReport, updateVendorReport } = useNellimoStore();
  const { showToast } = useToast();

  const initialProperty = (initialPropertyId && properties.find((p) => p.id === initialPropertyId)) || properties[0];
  const initialReport = initialProperty ? vendorReports.find((r) => r.property_id === initialProperty.id) : undefined;

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => initialProperty?.id || '');
  const [reportPeriod, setReportPeriod] = useState<'hebdomadaire' | 'mensuel' | 'bilan_30_jours'>('hebdomadaire');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  // New report inputs — initialisés avec le bilan existant ou les valeurs types
  const [viewsSeloger, setViewsSeloger] = useState<number>(() => initialReport?.views_seloger ?? 340);
  const [viewsLeboncoin, setViewsLeboncoin] = useState<number>(() => initialReport?.views_leboncoin ?? 510);
  const [viewsBienici, setViewsBienici] = useState<number>(() => initialReport?.views_bienici ?? 185);
  const [viewsWebsite, setViewsWebsite] = useState<number>(() => initialReport?.views_website ?? 95);
  const [leadsCount, setLeadsCount] = useState<number>(() => initialReport?.total_leads_count ?? 8);
  const [visitsCount, setVisitsCount] = useState<number>(() => initialReport?.visits_count ?? 3);
  const [positiveFeedbacks, setPositiveFeedbacks] = useState<number>(() => initialReport?.positive_feedbacks_count ?? 2);
  const [neutralFeedbacks, setNeutralFeedbacks] = useState<number>(() => initialReport?.neutral_feedbacks_count ?? 1);
  const [negativeFeedbacks, setNegativeFeedbacks] = useState<number>(() => initialReport?.negative_feedbacks_count ?? 0);
  const [suggestedAdjustment, setSuggestedAdjustment] = useState<number>(() => initialReport?.suggested_price_adjustment ?? 0);
  // Verbatim anonymisés des visiteurs (retours libres, un par ligne)
  const [verbatimInput, setVerbatimInput] = useState<string>(() =>
    initialReport?.anonymized_verbatims ? initialReport.anonymized_verbatims.join('\n') : ''
  );

  const currentProperty: Property | undefined = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const propertyReports = vendorReports.filter((r) => r.property_id === currentProperty?.id);
  const latestReport: VendorReport | undefined = propertyReports[0];

  // Gestionnaire de sélection de mandat : met à jour le formulaire sans setState dans un effet
  const handleSelectProperty = (newPropertyId: string) => {
    setSelectedPropertyId(newPropertyId);
    const existing = vendorReports.find((r) => r.property_id === newPropertyId);
    if (existing) {
      setViewsSeloger(existing.views_seloger);
      setViewsLeboncoin(existing.views_leboncoin);
      setViewsBienici(existing.views_bienici);
      setViewsWebsite(existing.views_website);
      setLeadsCount(existing.total_leads_count);
      setVisitsCount(existing.visits_count);
      setPositiveFeedbacks(existing.positive_feedbacks_count);
      setNeutralFeedbacks(existing.neutral_feedbacks_count);
      setNegativeFeedbacks(existing.negative_feedbacks_count ?? 0);
      setSuggestedAdjustment(existing.suggested_price_adjustment ?? 0);
      setVerbatimInput(existing.anonymized_verbatims ? existing.anonymized_verbatims.join('\n') : '');
    }
  };

  const totalViews = viewsSeloger + viewsLeboncoin + viewsBienici + viewsWebsite;

  const handleGenerateReport = () => {
    if (!currentProperty) return;
    setIsGenerating(true);

    const periodLabel = reportPeriod === 'hebdomadaire' ? 'cette semaine' : reportPeriod === 'mensuel' ? 'ce mois-ci' : 'sur les 30 premiers jours';

    const summary = `Votre bien bénéficie d'une visibilité optimale avec ${totalViews.toLocaleString('fr-FR')} consultations cumulées ${periodLabel} (dont ${viewsLeboncoin} sur LeBonCoin et ${viewsSeloger} sur SeLoger). Nous avons qualifié ${leadsCount} contacts acquéreurs sérieux et organisé ${visitsCount} visites sur place. Les retours soulignent unanimement la luminosité et l'emplacement recherché.`;

    const priceRec = suggestedAdjustment < 0
      ? `Compte tenu des 3 biens concurrents arrivés sur ${currentProperty.city}, un ajustement technique de ${Math.abs(suggestedAdjustment).toLocaleString('fr-FR')} € permettrait de franchir le seuil psychologique et de déclencher les alertes automatiques des acquéreurs en veille.`
      : `Le positionnement prix actuel est parfaitement en phase avec le micromarché notarial DVF de ${currentProperty.city}. La stratégie exclusive porte ses fruits, nous maintenons le cap.`;

    // Verbatim anonymisés : un retour libre par ligne, lignes vides ignorées
    const verbatims = verbatimInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    createVendorReport({
      property_id: currentProperty.id,
      report_period: reportPeriod,
      generated_at: new Date().toISOString(),
      views_seloger: viewsSeloger,
      views_leboncoin: viewsLeboncoin,
      views_bienici: viewsBienici,
      views_website: viewsWebsite,
      total_leads_count: leadsCount,
      visits_count: visitsCount,
      positive_feedbacks_count: positiveFeedbacks,
      neutral_feedbacks_count: neutralFeedbacks,
      negative_feedbacks_count: negativeFeedbacks,
      executive_summary: summary,
      price_recommendation_text: priceRec,
      suggested_price_adjustment: suggestedAdjustment,
      anonymized_verbatims: verbatims,
      shared_via_whatsapp: false,
      shared_via_email: false,
    });

    setIsGenerating(false);
    showToast('Compte-rendu vendeur généré avec succès !', 'success');
  };

  const getWhatsappDigest = (report: VendorReport, prop: Property) => {
    const periodLabel = report.report_period === 'hebdomadaire' ? 'Hebdomadaire' : report.report_period === 'mensuel' ? 'Mensuel' : 'Bilan 30 Jours';
    const verbatims = report.anonymized_verbatims ?? [];
    const verbatimBlock = verbatims.length > 0
      ? `\n💬 *Retours anonymisés des visiteurs :*\n${verbatims.map((v) => `• « ${v} »`).join('\n')}\n`
      : '';
    return `📊 *COMPTE-RENDU VENDEUR NELL'IMMO — ${periodLabel.toUpperCase()}*
Bien : ${prop.title} (${prop.city})
Mandat Réf. ${formatMandateRef(prop.mandate_number)}

Bonjour ${prop.seller_name}, voici le point d'activité sur votre bien pour cette période :

👀 *Visibilité & Audiences :*
• Consultations totales : ${(report.views_seloger + report.views_leboncoin + report.views_bienici + report.views_website).toLocaleString('fr-FR')} vues
  - LeBonCoin : ${report.views_leboncoin}
  - SeLoger : ${report.views_seloger}
  - Bien'Ici & Site Agence : ${report.views_bienici + report.views_website}

🎯 *Actions Terrain :*
• Demandes de contact qualifiées : ${report.total_leads_count}
• Visites physiques effectuées : ${report.visits_count}
• Retours visiteurs positifs : ${report.positive_feedbacks_count} / ${report.visits_count}
${verbatimBlock}
💡 *Avis & Stratégie de votre conseillère :*
${report.executive_summary}

Je reste à votre entière disposition pour en discuter de vive voix !
Bien à vous,
Nelly FERNANDEZ — SASU Nell'Immo (07 55 68 61 09)`;
  };

  const handleSendWhatsapp = (report: VendorReport) => {
    if (!currentProperty) return;
    const text = getWhatsappDigest(report, currentProperty);
    const cleanPhone = currentProperty.seller_phone.replace(/\s+/g, '').replace(/^0/, '33');
    updateVendorReport(report.id, { shared_via_whatsapp: true });
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyWhatsapp = (report: VendorReport) => {
    if (!currentProperty) return;
    const text = getWhatsappDigest(report, currentProperty);
    navigator.clipboard.writeText(text);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <FileCheck2 className="w-4 h-4" />
            <span>Module 02 • Transparence Totale & Fidélisation Vendeur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Comptes-Rendus Vendeurs & Bilan d’Activité
          </h1>
          <p className="text-xs text-gray-500">
            Rapports de visibilité portails, synthèses des visites et transmission directe sur WhatsApp pour verrouiller l’exclusivité.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/espace-vendeur/${currentProperty?.seller_token || currentProperty?.id || 'prop-227'}`}
            target="_blank"
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
          >
            <ExternalLink className="w-4 h-4 text-[#C59A45]" />
            <span>Ouvrir l’Espace Vendeur en Ligne</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#C59A45]" />
            <span>Imprimer le Bilan</span>
          </button>
        </div>
      </div>

      {/* Property Selector & Metric Setup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-base text-[#131B26]">
              1. Sélection du Mandat Vendeur & Paramètres d’Activité
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setReportPeriod('hebdomadaire')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${reportPeriod === 'hebdomadaire' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600'
                }`}
            >
              Hebdomadaire
            </button>
            <button
              type="button"
              onClick={() => setReportPeriod('mensuel')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${reportPeriod === 'mensuel' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600'
                }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setReportPeriod('bilan_30_jours')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${reportPeriod === 'bilan_30_jours' ? 'bg-white text-[#E12B7B] shadow-2xs' : 'text-gray-600'
                }`}
            >
              Bilan 30 Jours
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-bold uppercase text-gray-700 mb-1">Mandat Actif en Portefeuille</label>
            <select
              value={selectedPropertyId}
              onChange={(e) => handleSelectProperty(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-[#E12B7B]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatMandateRef(p.mandate_number)} - {p.title} ({p.city}) — Vendeur: {p.seller_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Téléphone Vendeur WhatsApp</label>
            <input
              type="text"
              readOnly
              value={currentProperty?.seller_phone || ''}
              className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl font-mono font-bold text-gray-700"
            />
          </div>
        </div>

        {/* Portal Views Counters */}
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <span className="text-xs font-bold uppercase text-gray-700 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#E12B7B]" />
              Audiences des Portails Immobiliers (Cumul Période)
            </span>
            <span className="text-[#E12B7B] font-black">{totalViews.toLocaleString('fr-FR')} vues totales</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-600 mb-1">Vues LeBonCoin</label>
              <input
                type="number"
                value={viewsLeboncoin}
                onChange={(e) => setViewsLeboncoin(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1">Vues SeLoger</label>
              <input
                type="number"
                value={viewsSeloger}
                onChange={(e) => setViewsSeloger(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1">Vues Bien’Ici</label>
              <input
                type="number"
                value={viewsBienici}
                onChange={(e) => setViewsBienici(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1">Vues Site Nell’Immo</label>
              <input
                type="number"
                value={viewsWebsite}
                onChange={(e) => setViewsWebsite(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          {/* Visits and Feedbacks */}
          <div className="pt-2 border-t border-gray-200 space-y-3">
            <span className="text-[11px] font-bold uppercase text-gray-600 block">
              Retours Visiteurs & Qualification
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Contacts Reçus</label>
                <input
                  type="number"
                  min={0}
                  value={leadsCount}
                  onChange={(e) => setLeadsCount(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1">Visites Réalisées</label>
                <input
                  type="number"
                  min={0}
                  value={visitsCount}
                  onChange={(e) => setVisitsCount(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-gray-200 rounded-xl font-bold text-center"
                />
              </div>
              <div>
                <label className="block font-bold text-emerald-700 mb-1">Coup de cœur (Positifs)</label>
                <input
                  type="number"
                  min={0}
                  value={positiveFeedbacks}
                  onChange={(e) => setPositiveFeedbacks(Number(e.target.value))}
                  className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-center text-emerald-800"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-700 mb-1">Hésitants (Neutres)</label>
                <input
                  type="number"
                  min={0}
                  value={neutralFeedbacks}
                  onChange={(e) => setNeutralFeedbacks(Number(e.target.value))}
                  className="w-full p-2 bg-amber-50 border border-amber-200 rounded-xl font-bold text-center text-amber-800"
                />
              </div>
              <div>
                <label className="block font-bold text-rose-700 mb-1">Réservés (Négatifs)</label>
                <input
                  type="number"
                  min={0}
                  value={negativeFeedbacks}
                  onChange={(e) => setNegativeFeedbacks(Number(e.target.value))}
                  className="w-full p-2 bg-rose-50 border border-rose-200 rounded-xl font-bold text-center text-rose-800"
                />
              </div>
            </div>
          </div>

          {/* Ajustement Prix Stratégique */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <label className="block font-bold uppercase text-gray-700 text-xs flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-[#E12B7B]" />
                Recommandation d&apos;Ajustement de Prix (€)
              </label>
              <span className="text-[11px] text-gray-400">
                Laissez 0 pour maintenir le prix actuel, ou saisissez un montant négatif (ex: -10000)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step={1000}
                value={suggestedAdjustment}
                onChange={(e) => setSuggestedAdjustment(Number(e.target.value))}
                placeholder="Ex: -5000"
                className="w-48 p-2 bg-white border border-gray-200 rounded-xl font-bold text-sm text-[#131B26] focus:outline-[#E12B7B]"
              />
              <span className="text-xs text-gray-500">
                {suggestedAdjustment < 0 ? (
                  <span className="text-amber-700 font-semibold">
                    Recommandation de baisse de {Math.abs(suggestedAdjustment).toLocaleString('fr-FR')} € intégrée dans la synthèse
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    Maintien du prix de commercialisation actuel validé
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Verbatim anonymisés des visiteurs */}
          <div className="pt-2 border-t border-gray-200">
            <label className="block font-bold uppercase text-gray-700 mb-1">
              Verbatim Anonymisés des Visiteurs (retours libres — un par ligne)
            </label>
            <textarea
              value={verbatimInput}
              onChange={(e) => setVerbatimInput(e.target.value)}
              rows={3}
              placeholder={'Ex. : « Très belle luminosité, cuisine à rafraîchir »\n« Emplacement calme et recherché, coup de cœur sur le jardin »'}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs leading-relaxed focus:outline-[#E12B7B] resize-y"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Ces retours sont transmis au vendeur de façon strictement anonyme (aucune identité de visiteur).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Générer le Compte-Rendu Vendeur Officiel</span>
        </button>
      </div>

      {/* Latest Report Preview & Dispatch */}
      {latestReport && currentProperty && (
        <VendorReportPreview
          report={latestReport}
          property={currentProperty}
          whatsappDigest={getWhatsappDigest(latestReport, currentProperty)}
          copiedWhatsapp={copiedWhatsapp}
          onCopyWhatsapp={() => handleCopyWhatsapp(latestReport)}
          onSendWhatsapp={() => handleSendWhatsapp(latestReport)}
        />
      )}

    </div>
  );
}

export default function VendorReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500 font-semibold">Chargement des comptes-rendus...</div>}>
      <VendorReportsContent />
    </Suspense>
  );
}
