'use client';

import React, { use, useState } from 'react';
import { useNellimoStore } from '@/lib/public-store';
import { formatMandateRef } from '@/lib/hoguet';
import { Phone, Home } from 'lucide-react';
import { DvfPositioningSection } from '@/components/cockpit/comptes-rendus/DvfPositioningSection';
import {
  SellerHeader,
  SellerStatsCards,
  SellerVisitsJournal,
  SellerFeedbackSynthesis,
  SellerAdvisorMessage,
} from '@/components/public/espace-vendeur';

export default function SellerSpacePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const { properties, visits, vendorReports, settings } = useNellimoStore();

  // Sécurité & flexibilité : l'accès à l'Espace Vendeur est vérifié prioritairement
  // via le token d'accès unique (seller_token), avec repli sur l'ID du bien.
  const property = properties.find((p) => p.seller_token === token || p.id === token);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#131B26]">Espace Vendeur Introuvable</h2>
          <p className="text-xs text-gray-500">
            Le lien de suivi semble invalide ou le mandat a expiré. Veuillez contacter directement votre conseillère Nelly Fernandez.
          </p>
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E12B7B] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler l’Agence</span>
          </a>
        </div>
      </div>
    );
  }

  const mandateRef = formatMandateRef(property.mandate_number);
  const propertyVisits = visits.filter((v) => v.property_id === property.id);
  const propertyReport = vendorReports.find((r) => r.property_id === property.id);

  // Audience & feedback : on ne présente QUE des données réelles issues du
  // rapport de commercialisation (propertyReport) et des visites enregistrées.
  // Aucune valeur n'est inventée en l'absence de rapport : l'interface affiche
  // alors des indicateurs "à venir" plutôt que des chiffres fictifs.
  const hasReport = Boolean(propertyReport);

  const viewsSeloger = propertyReport?.views_seloger ?? null;
  const viewsLeboncoin = propertyReport?.views_leboncoin ?? null;
  const viewsBienici = propertyReport?.views_bienici ?? null;
  const viewsWebsite = propertyReport?.views_website ?? null;
  const totalViews = hasReport
    ? (viewsSeloger ?? 0) + (viewsLeboncoin ?? 0) + (viewsBienici ?? 0) + (viewsWebsite ?? 0)
    : null;

  const leadsCount = propertyReport?.total_leads_count ?? null;
  const visitsCount = propertyVisits.length > 0 ? propertyVisits.length : (propertyReport?.visits_count ?? null);

  const positiveFeedbacks = propertyReport?.positive_feedbacks_count ?? null;
  const neutralFeedbacks = propertyReport?.neutral_feedbacks_count ?? null;
  const negativeFeedbacks = propertyReport?.negative_feedbacks_count ?? null;
  const totalFeedbacks =
    positiveFeedbacks !== null && neutralFeedbacks !== null && negativeFeedbacks !== null
      ? positiveFeedbacks + neutralFeedbacks + negativeFeedbacks
      : 0;
  const satisfactionPct =
    totalFeedbacks > 0
      ? Math.round(((positiveFeedbacks! + neutralFeedbacks! * 0.5) / totalFeedbacks) * 100)
      : null;

  const verbatims = propertyReport?.anonymized_verbatims ?? [];

  // Days remaining
  const mandateEndDate = new Date(property.mandate_end_date);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((mandateEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/33755686109?text=${encodeURIComponent(
    `Bonjour Nelly, je consulte mon Espace Vendeur pour ${property.title} (${mandateRef})...`
  )}`;

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#131B26] pb-24">
      {/* 1. Header and Hero Section */}
      <SellerHeader
        property={property}
        mandateRef={mandateRef}
        daysRemaining={daysRemaining}
        copiedLink={copiedLink}
        onCopyShareLink={handleCopyShareLink}
        whatsappUrl={whatsappUrl}
      />

      {/* 2. Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* Audience KPIs */}
        <SellerStatsCards
          hasReport={hasReport}
          totalViews={totalViews}
          viewsLeboncoin={viewsLeboncoin}
          viewsSeloger={viewsSeloger}
          viewsBienici={viewsBienici}
          viewsWebsite={viewsWebsite}
          leadsCount={leadsCount}
          visitsCount={visitsCount}
          satisfactionPct={satisfactionPct}
        />

        {/* Visits Journal */}
        <SellerVisitsJournal visits={propertyVisits} />

        {/* Feedback & Verbatim */}
        <SellerFeedbackSynthesis
          hasReport={hasReport}
          positiveFeedbacks={positiveFeedbacks}
          neutralFeedbacks={neutralFeedbacks}
          negativeFeedbacks={negativeFeedbacks}
          verbatims={verbatims}
        />

        {/* DVF Notarial Market Positioning */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
              Observatoire du Marché Immobilier
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
              Positionnement Concurrentiel & Ventes Récentes
            </h2>
            <p className="text-xs text-gray-500">
              Comparatif du prix au m² de votre bien avec les références de ventes du secteur sur {property.city}.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs">
            <DvfPositioningSection key={property.id} property={property} />
          </div>
        </section>

        {/* Advisor Message */}
        <SellerAdvisorMessage
          settings={settings}
          propertyReport={propertyReport}
          whatsappUrl={whatsappUrl}
        />
      </main>
    </div>
  );
}
