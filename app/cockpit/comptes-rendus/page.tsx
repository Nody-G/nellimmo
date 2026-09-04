'use client';

import React, { Suspense } from 'react';
import {
  ComptesRendusHeader,
  ReportEditorForm,
  ReportsHistoryList,
  VendorReportPreview,
  useVendorReportState,
} from '@/components/cockpit/comptes-rendus';

function VendorReportsContent() {
  const {
    properties,
    currentProperty,
    selectedPropertyId,
    handleSelectProperty,
    activeReport,
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
  } = useVendorReportState();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <ComptesRendusHeader currentProperty={currentProperty} />

      <ReportEditorForm
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={handleSelectProperty}
        currentProperty={currentProperty}
        reportPeriod={reportPeriod}
        onChangeReportPeriod={setReportPeriod}
        viewsLeboncoin={viewsLeboncoin}
        onChangeViewsLeboncoin={setViewsLeboncoin}
        viewsSeloger={viewsSeloger}
        onChangeViewsSeloger={setViewsSeloger}
        viewsBienici={viewsBienici}
        onChangeViewsBienici={setViewsBienici}
        viewsWebsite={viewsWebsite}
        onChangeViewsWebsite={setViewsWebsite}
        leadsCount={leadsCount}
        onChangeLeadsCount={setLeadsCount}
        visitsCount={visitsCount}
        onChangeVisitsCount={setVisitsCount}
        positiveFeedbacks={positiveFeedbacks}
        onChangePositiveFeedbacks={setPositiveFeedbacks}
        neutralFeedbacks={neutralFeedbacks}
        onChangeNeutralFeedbacks={setNeutralFeedbacks}
        negativeFeedbacks={negativeFeedbacks}
        onChangeNegativeFeedbacks={setNegativeFeedbacks}
        suggestedAdjustment={suggestedAdjustment}
        onChangeSuggestedAdjustment={setSuggestedAdjustment}
        verbatimInput={verbatimInput}
        onChangeVerbatimInput={setVerbatimInput}
        onGenerateReport={handleGenerateReport}
        isGenerating={isGenerating}
      />

      <ReportsHistoryList
        reports={propertyReports}
        selectedReportId={activeReport?.id}
        onSelectReport={(r) => {
          setActiveReportId(r.id);
          populateFormWithReport(r);
        }}
      />

      {activeReport && currentProperty && (
        <VendorReportPreview
          report={activeReport}
          property={currentProperty}
          whatsappDigest={getWhatsappDigest(activeReport, currentProperty)}
          copiedWhatsapp={copiedWhatsapp}
          onCopyWhatsapp={() => handleCopyWhatsapp(activeReport)}
          onSendWhatsapp={() => handleSendWhatsapp(activeReport)}
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
