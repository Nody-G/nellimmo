'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import type { HelpGuide, ReadyToUseScript } from '@/lib/help-content';
import {
  GuideHeader,
  ObjectiveCard,
  PrerequisitesList,
  StepsSection,
  ConcreteExampleCard,
  LegalAlertsSection,
  ScriptsSection,
  FaqsSection,
  BottomCta,
} from './detail';

interface GuideDetailProps {
  guide: HelpGuide | null;
  completedSteps: Record<string, boolean>;
  copiedScriptId: string | null;
  onToggleStep: (stepNumber: number) => void;
  onCopyScript: (script: ReadyToUseScript) => void;
}

/** Right column: full detail of the active guide. */
export function GuideDetail({
  guide,
  completedSteps,
  copiedScriptId,
  onToggleStep,
  onCopyScript,
}: GuideDetailProps) {
  if (!guide) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
        <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-gray-700">
          Sélectionnez un guide dans la liste
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0">
      <GuideHeader guide={guide} />

      <ObjectiveCard objective={guide.objective} />

      {guide.prerequisites.length > 0 && <PrerequisitesList items={guide.prerequisites} />}

      <StepsSection
        guide={guide}
        completedSteps={completedSteps}
        onToggleStep={onToggleStep}
      />

      <ConcreteExampleCard example={guide.concreteExample} />

      {guide.legalAlerts.length > 0 && <LegalAlertsSection alerts={guide.legalAlerts} />}

      {guide.scripts.length > 0 && (
        <ScriptsSection
          scripts={guide.scripts}
          copiedScriptId={copiedScriptId}
          onCopyScript={onCopyScript}
        />
      )}

      {guide.faqs.length > 0 && <FaqsSection faqs={guide.faqs} />}

      <BottomCta guide={guide} />
    </div>
  );
}
