'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import type { VendorReport, Property } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export function useVendorReportState() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId');
  const { properties, vendorReports, createVendorReport, updateVendorReport } = useNellimoStore();
  const { showToast } = useToast();

  const initialProperty = (initialPropertyId && properties.find((p) => p.id === initialPropertyId)) || properties[0];
  const initialReport = initialProperty ? vendorReports.find((r) => r.property_id === initialProperty.id) : undefined;

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => initialProperty?.id || '');
  const [activeReportId, setActiveReportId] = useState<string | undefined>(() => initialReport?.id);
  const [reportPeriod, setReportPeriod] = useState<'hebdomadaire' | 'mensuel' | 'bilan_30_jours'>('hebdomadaire');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  // Form metrics
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
  const [verbatimInput, setVerbatimInput] = useState<string>(() =>
    initialReport?.anonymized_verbatims ? initialReport.anonymized_verbatims.join('\n') : ''
  );

  const currentProperty: Property | undefined = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const propertyReports = vendorReports.filter((r) => r.property_id === currentProperty?.id);
  const activeReport: VendorReport | undefined = propertyReports.find((r) => r.id === activeReportId) || propertyReports[0];

  const populateFormWithReport = (report: VendorReport) => {
    setViewsSeloger(report.views_seloger);
    setViewsLeboncoin(report.views_leboncoin);
    setViewsBienici(report.views_bienici);
    setViewsWebsite(report.views_website);
    setLeadsCount(report.total_leads_count);
    setVisitsCount(report.visits_count);
    setPositiveFeedbacks(report.positive_feedbacks_count);
    setNeutralFeedbacks(report.neutral_feedbacks_count);
    setNegativeFeedbacks(report.negative_feedbacks_count ?? 0);
    setSuggestedAdjustment(report.suggested_price_adjustment ?? 0);
    setVerbatimInput(report.anonymized_verbatims ? report.anonymized_verbatims.join('\n') : '');
  };

  const handleSelectProperty = (newPropertyId: string) => {
    setSelectedPropertyId(newPropertyId);
    const existing = vendorReports.find((r) => r.property_id === newPropertyId);
    if (existing) {
      setActiveReportId(existing.id);
      populateFormWithReport(existing);
    } else {
      setActiveReportId(undefined);
    }
  };

  const totalViews = viewsSeloger + viewsLeboncoin + viewsBienici + viewsWebsite;

  const handleGenerateReport = async () => {
    if (!currentProperty) return;
    setIsGenerating(true);

    const periodLabel = reportPeriod === 'hebdomadaire'
      ? 'cette semaine'
      : reportPeriod === 'mensuel'
      ? 'ce mois-ci'
      : 'sur les 30 premiers jours';

    const summary = `Votre bien bénéficie d'une visibilité optimale avec ${totalViews.toLocaleString('fr-FR')} consultations cumulées ${periodLabel} (dont ${viewsLeboncoin} sur LeBonCoin et ${viewsSeloger} sur SeLoger). Nous avons qualifié ${leadsCount} contacts acquéreurs sérieux et organisé ${visitsCount} visites sur place. Les retours soulignent unanimement la luminosité et l'emplacement recherché.`;

    const priceRec = suggestedAdjustment < 0
      ? `Compte tenu des 3 biens concurrents arrivés sur ${currentProperty.city}, un ajustement technique de ${Math.abs(suggestedAdjustment).toLocaleString('fr-FR')} € permettrait de franchir le seuil psychologique et de déclencher les alertes automatiques des acquéreurs en veille.`
      : `Le positionnement prix actuel est parfaitement en phase avec le micromarché notarial DVF de ${currentProperty.city}. La stratégie exclusive porte ses fruits, nous maintenons le cap.`;

    const verbatims = verbatimInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newReport = await createVendorReport({
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

    if (newReport?.id) {
      setActiveReportId(newReport.id);
    }
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

  return {
    properties,
    currentProperty,
    selectedPropertyId,
    handleSelectProperty,
    activeReport,
    activeReportId,
    setActiveReportId,
    populateFormWithReport,
    propertyReports,
    reportPeriod,
    setReportPeriod,
    viewsLeboncoin,
    setViewsLeboncoin,
    viewsSeloger,
    setViewsSeloger,
    viewsBienici,
    setViewsBienici,
    viewsWebsite,
    setViewsWebsite,
    leadsCount,
    setLeadsCount,
    visitsCount,
    setVisitsCount,
    positiveFeedbacks,
    setPositiveFeedbacks,
    neutralFeedbacks,
    setNeutralFeedbacks,
    negativeFeedbacks,
    setNegativeFeedbacks,
    suggestedAdjustment,
    setSuggestedAdjustment,
    verbatimInput,
    setVerbatimInput,
    handleGenerateReport,
    isGenerating,
    getWhatsappDigest,
    copiedWhatsapp,
    handleCopyWhatsapp,
    handleSendWhatsapp,
  };
}
