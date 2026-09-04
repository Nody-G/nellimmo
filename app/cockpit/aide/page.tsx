'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { HELP_GUIDES, ReadyToUseScript } from '@/lib/help-content';
import { useToast } from '@/components/ui/Toast';
import { filterGuides } from '@/components/cockpit/aide/aide-types';
import { AideHeader } from '@/components/cockpit/aide/AideHeader';
import { AideSearchBar } from '@/components/cockpit/aide/AideSearchBar';
import { GuideList } from '@/components/cockpit/aide/GuideList';
import { GuideDetail } from '@/components/cockpit/aide/GuideDetail';
import { LegalCalculatorModal } from '@/components/cockpit/aide/LegalCalculatorModal';

function HelpAcademyContent() {
  const searchParams = useSearchParams();
  const initialGuideId = searchParams.get('guide');
  const initialCategory = searchParams.get('cat');

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [guideOverride, setGuideOverride] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Calculator modal state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calcDate, setCalcDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Determine current active guide ID without setState inside useEffect
  const currentGuideId = guideOverride || initialGuideId || HELP_GUIDES[0].id;

  // Filtered guides
  const filteredGuides = useMemo(
    () => filterGuides(HELP_GUIDES, searchQuery, selectedCategory),
    [searchQuery, selectedCategory]
  );

  // Active guide
  const activeGuide = useMemo(() => {
    return (
      HELP_GUIDES.find((g) => g.id === currentGuideId) ||
      filteredGuides[0] ||
      HELP_GUIDES[0]
    );
  }, [currentGuideId, filteredGuides]);

  // Toggle step completion
  const toggleStep = (stepNumber: number) => {
    if (!activeGuide) return;
    const key = `${activeGuide.id}-step-${stepNumber}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Copy script text
  const handleCopyScript = (script: ReadyToUseScript) => {
    navigator.clipboard.writeText(script.text);
    setCopiedScriptId(script.id);
    showToast(`Le modèle "${script.title}" est copié dans le presse-papier !`, 'success');
    setTimeout(() => setCopiedScriptId(null), 2500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-6 w-full pb-16 animate-fade-in">
      <AideHeader onOpenCalculator={() => setIsCalculatorOpen(true)} />

      <AideSearchBar
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column : Guides List (4 cols) */}
        <div className="lg:col-span-4">
          <GuideList
            guides={filteredGuides}
            activeGuideId={activeGuide.id}
            searchQuery={searchQuery}
            onSelectGuide={setGuideOverride}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Column : Active Guide Detail (8 cols) */}
        <div className="lg:col-span-8">
          <GuideDetail
            guide={activeGuide}
            completedSteps={completedSteps}
            copiedScriptId={copiedScriptId}
            onToggleStep={toggleStep}
            onCopyScript={handleCopyScript}
          />
        </div>
      </div>

      <LegalCalculatorModal
        isOpen={isCalculatorOpen}
        calcDate={calcDate}
        onDateChange={setCalcDate}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}

export default function HelpAcademyPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 animate-pulse text-[#E12B7B]" />
          <span>Chargement de la Cockpit Academy...</span>
        </div>
      }
    >
      <HelpAcademyContent />
    </Suspense>
  );
}
