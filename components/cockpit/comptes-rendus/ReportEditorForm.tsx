'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Property } from '@/lib/types';
import {
  ReportPropertyPicker,
  ReportPortalViewsSection,
  ReportVisitsFeedbackSection,
  ReportPriceAndVerbatimSection
} from './editor';

interface ReportEditorFormProps {
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (propertyId: string) => void;
  currentProperty: Property | undefined;
  reportPeriod: 'hebdomadaire' | 'mensuel' | 'bilan_30_jours';
  onChangeReportPeriod: (period: 'hebdomadaire' | 'mensuel' | 'bilan_30_jours') => void;
  viewsLeboncoin: number;
  onChangeViewsLeboncoin: (val: number) => void;
  viewsSeloger: number;
  onChangeViewsSeloger: (val: number) => void;
  viewsBienici: number;
  onChangeViewsBienici: (val: number) => void;
  viewsWebsite: number;
  onChangeViewsWebsite: (val: number) => void;
  leadsCount: number;
  onChangeLeadsCount: (val: number) => void;
  visitsCount: number;
  onChangeVisitsCount: (val: number) => void;
  positiveFeedbacks: number;
  onChangePositiveFeedbacks: (val: number) => void;
  neutralFeedbacks: number;
  onChangeNeutralFeedbacks: (val: number) => void;
  negativeFeedbacks: number;
  onChangeNegativeFeedbacks: (val: number) => void;
  suggestedAdjustment: number;
  onChangeSuggestedAdjustment: (val: number) => void;
  verbatimInput: string;
  onChangeVerbatimInput: (val: string) => void;
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export function ReportEditorForm({
  properties,
  selectedPropertyId,
  onSelectProperty,
  currentProperty,
  reportPeriod,
  onChangeReportPeriod,
  viewsLeboncoin,
  onChangeViewsLeboncoin,
  viewsSeloger,
  onChangeViewsSeloger,
  viewsBienici,
  onChangeViewsBienici,
  viewsWebsite,
  onChangeViewsWebsite,
  leadsCount,
  onChangeLeadsCount,
  visitsCount,
  onChangeVisitsCount,
  positiveFeedbacks,
  onChangePositiveFeedbacks,
  neutralFeedbacks,
  onChangeNeutralFeedbacks,
  negativeFeedbacks,
  onChangeNegativeFeedbacks,
  suggestedAdjustment,
  onChangeSuggestedAdjustment,
  verbatimInput,
  onChangeVerbatimInput,
  onGenerateReport,
  isGenerating,
}: ReportEditorFormProps) {
  const totalViews = viewsSeloger + viewsLeboncoin + viewsBienici + viewsWebsite;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6 print:hidden">
      <ReportPropertyPicker
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={onSelectProperty}
        currentProperty={currentProperty}
        reportPeriod={reportPeriod}
        onChangeReportPeriod={onChangeReportPeriod}
      />

      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
        <ReportPortalViewsSection
          viewsLeboncoin={viewsLeboncoin}
          onChangeViewsLeboncoin={onChangeViewsLeboncoin}
          viewsSeloger={viewsSeloger}
          onChangeViewsSeloger={onChangeViewsSeloger}
          viewsBienici={viewsBienici}
          onChangeViewsBienici={onChangeViewsBienici}
          viewsWebsite={viewsWebsite}
          onChangeViewsWebsite={onChangeViewsWebsite}
          totalViews={totalViews}
        />

        <ReportVisitsFeedbackSection
          leadsCount={leadsCount}
          onChangeLeadsCount={onChangeLeadsCount}
          visitsCount={visitsCount}
          onChangeVisitsCount={onChangeVisitsCount}
          positiveFeedbacks={positiveFeedbacks}
          onChangePositiveFeedbacks={onChangePositiveFeedbacks}
          neutralFeedbacks={neutralFeedbacks}
          onChangeNeutralFeedbacks={onChangeNeutralFeedbacks}
          negativeFeedbacks={negativeFeedbacks}
          onChangeNegativeFeedbacks={onChangeNegativeFeedbacks}
        />

        <ReportPriceAndVerbatimSection
          suggestedAdjustment={suggestedAdjustment}
          onChangeSuggestedAdjustment={onChangeSuggestedAdjustment}
          verbatimInput={verbatimInput}
          onChangeVerbatimInput={onChangeVerbatimInput}
        />
      </div>

      <button
        type="button"
        onClick={onGenerateReport}
        disabled={isGenerating}
        className="w-full py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" />
        <span>Générer le Compte-Rendu Vendeur Officiel</span>
      </button>
    </div>
  );
}
