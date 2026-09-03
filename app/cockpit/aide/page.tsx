'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  HELP_CATEGORIES,
  HELP_GUIDES,
  HelpGuide,
  ReadyToUseScript
} from '@/lib/help-content';
import { useToast } from '@/components/ui/Toast';
import {
  BookOpen,
  Search,
  AlertTriangle,
  ShieldAlert,
  Info,
  Clock,
  Copy,
  Check,
  Printer,
  Sparkles,
  MapPin,
  MessageSquare,
  HelpCircle,
  Calculator,
  ChevronRight,
  ArrowRight,
  Layers,
  FileText,
  BadgeCheck,
  CheckCircle2,
  Scale
} from 'lucide-react';

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
  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return HELP_GUIDES.filter((guide) => {
      const matchCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;

      const inTitle = guide.title.toLowerCase().includes(q);
      const inSummary = guide.summary.toLowerCase().includes(q);
      const inTags = guide.tags.some((t) => t.toLowerCase().includes(q));
      const inExample = guide.concreteExample.context.toLowerCase().includes(q) ||
        guide.concreteExample.location.toLowerCase().includes(q);
      const inSteps = guide.steps.some(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );

      return inTitle || inSummary || inTags || inExample || inSteps;
    });
  }, [searchQuery, selectedCategory]);

  // Active guide
  const activeGuide: HelpGuide = useMemo(() => {
    return HELP_GUIDES.find((g) => g.id === currentGuideId) || filteredGuides[0] || HELP_GUIDES[0];
  }, [currentGuideId, filteredGuides]);

  // Toggle step completion
  const toggleStep = (stepNumber: number) => {
    if (!activeGuide) return;
    const key = `${activeGuide.id}-step-${stepNumber}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copy script text
  const handleCopyScript = (script: ReadyToUseScript) => {
    navigator.clipboard.writeText(script.text);
    setCopiedScriptId(script.id);
    showToast(`Le modèle "${script.title}" est copié dans le presse-papier !`, 'success');
    setTimeout(() => setCopiedScriptId(null), 2500);
  };

  // Calculate SRU, loan, closing dates
  const calculatedDates = useMemo(() => {
    if (!calcDate) return null;
    const base = new Date(calcDate);

    // SRU 10 days (starting next day)
    const sruDate = new Date(base);
    sruDate.setDate(sruDate.getDate() + 11);

    // If lands on Sunday, report to Monday
    if (sruDate.getDay() === 0) sruDate.setDate(sruDate.getDate() + 1);
    // If lands on Saturday, report to Monday
    if (sruDate.getDay() === 6) sruDate.setDate(sruDate.getDate() + 2);

    // Loan filing J+30
    const loanAppDate = new Date(base);
    loanAppDate.setDate(loanAppDate.getDate() + 30);

    // Loan approval J+60
    const loanApprovalDate = new Date(base);
    loanApprovalDate.setDate(loanApprovalDate.getDate() + 60);

    // Target final deed J+90
    const finalDeedDate = new Date(base);
    finalDeedDate.setDate(finalDeedDate.getDate() + 90);

    const fmt = (d: Date) =>
      d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' });

    return {
      sru: fmt(sruDate),
      loanApp: fmt(loanAppDate),
      loanApproval: fmt(loanApprovalDate),
      finalDeed: fmt(finalDeedDate)
    };
  }, [calcDate]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#131B26] via-[#1F2937] to-[#131B26] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-gray-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E12B7B]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#C59A45]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F44293] border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
              <span>COCKPIT ACADEMY • SASU NELL&apos;IMMO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Centre d&apos;Aide &amp; Guides Pratiques
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Tutoriels méticuleux, protocoles juridiques (Loi Hoguet / ALUR), cas réels du Pays Salonais et scripts prêts à l&apos;emploi pour piloter votre agence en parfaite autonomie.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/15 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#C59A45]" />
              <span>Calculateur Délais Légaux</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              title="Imprimer ce guide au format A4"
            >
              <Printer className="w-4 h-4" />
              <span>Fiche Mémo Bureau A4</span>
            </button>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="mt-6 pt-5 border-t border-gray-800/80 flex flex-wrap gap-4 sm:gap-6 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>12 Guides Complets</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#C59A45]" />
            <span>Conformité Loi Hoguet &amp; DGCCRF</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E12B7B]" />
            <span>Ancré en Pays Salonais (Pélissanne &amp; Alentours)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>100% Autonome Sans Abonnement Tiers</span>
          </div>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#F3E8EE] space-y-4">
        
        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé (ex: SRU, DVF, mandat exclusif, pige, bon de visite, SHA-256, baisse de prix)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20 focus:border-[#E12B7B] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded bg-gray-200 cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {HELP_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? HELP_GUIDES.length
                : HELP_GUIDES.filter((g) => g.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#E12B7B] text-white shadow-xs font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column : Guides List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Guides Disponibles ({filteredGuides.length})
            </span>
            {searchQuery && (
              <span className="text-[11px] text-gray-400">Filtré par &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>

          <div className="space-y-2 max-h-[800px] overflow-y-auto pr-1">
            {filteredGuides.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-500 space-y-2">
                <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-700">Aucun guide ne correspond à votre recherche</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-[#E12B7B] hover:underline font-bold cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredGuides.map((guide) => {
                const isActive = activeGuide?.id === guide.id;

                return (
                  <div
                    key={guide.id}
                    onClick={() => setGuideOverride(guide.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-white border-[#E12B7B] shadow-md ring-2 ring-[#E12B7B]/10'
                        : 'bg-white hover:bg-gray-50/80 border-gray-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {guide.categoryLabel}
                      </span>
                      {guide.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          guide.badge === 'Légal & Vital'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : guide.badge === 'Conquête Terrain'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-[#FDF2F8] text-[#E12B7B] border border-pink-100'
                        }`}>
                          {guide.badge}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xs font-bold leading-snug ${
                      isActive ? 'text-[#E12B7B]' : 'text-gray-900'
                    }`}>
                      {guide.title}
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {guide.summary}
                    </p>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {guide.readTimeMinutes} min de lecture
                      </span>
                      <span className="font-bold flex items-center gap-0.5 text-[#E12B7B]">
                        Voir le guide <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column : Active Guide Detail (8 cols) */}
        <div className="lg:col-span-8">
          {activeGuide ? (
            <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0">
              
              {/* Guide Header */}
              <div className="space-y-3 border-b border-gray-100 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF5F8] text-[#E12B7B] text-[11px] font-bold uppercase tracking-wider">
                      {activeGuide.categoryLabel}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {activeGuide.readTimeMinutes} minutes
                    </span>
                  </div>

                  {/* Direct Link to Tool */}
                  <Link
                    href={activeGuide.toolRoute}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold shadow-xs transition"
                  >
                    <span>Accéder à : {activeGuide.toolLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                  {activeGuide.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activeGuide.summary}
                </p>
              </div>

              {/* Objective Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5F8] to-white border border-[#F3E8EE] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E12B7B] block">
                    Objectif Stratégique pour Nelly
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {activeGuide.objective}
                  </p>
                </div>
              </div>

              {/* Prerequisites */}
              {activeGuide.prerequisites && activeGuide.prerequisites.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>Prérequis &amp; Documents Indispensables</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeGuide.prerequisites.map((prereq, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E12B7B] mt-1.5 shrink-0" />
                        <span className="leading-snug">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Procedure */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E12B7B]" />
                    <span>Procédure Pas-à-Pas (À Cocher)</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    Cochez les étapes au fur et à mesure de votre progression
                  </span>
                </div>

                <div className="space-y-3">
                  {activeGuide.steps.map((step) => {
                    const stepKey = `${activeGuide.id}-step-${step.number}`;
                    const isDone = !!completedSteps[stepKey];

                    return (
                      <div
                        key={step.number}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDone
                            ? 'bg-emerald-50/40 border-emerald-200/80'
                            : 'bg-white border-gray-200/80 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <button
                            onClick={() => toggleStep(step.number)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
                            }`}
                            title={isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
                          </button>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`text-xs sm:text-sm font-bold ${
                                isDone ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {step.title}
                              </h4>
                              {isDone && (
                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                  Validé ✓
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed">
                              {step.description}
                            </p>

                            {step.tips && (
                              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2 mt-2">
                                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{step.tips}</span>
                              </div>
                            )}

                            {step.proTip && (
                              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-950 flex items-start gap-2 mt-2">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                  <strong>Conseil Pro :</strong> {step.proTip}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Concrete Example in Pays Salonais */}
              <div className="p-6 rounded-3xl bg-[#0E141D] text-white border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C59A45] text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#E12B7B]" />
                    <span>Cas Concret Vécut en Pays Salonais</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {activeGuide.concreteExample.location}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-white">
                  {activeGuide.concreteExample.title}
                </h4>

                <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                      Le Contexte :
                    </span>
                    <p>{activeGuide.concreteExample.context}</p>
                  </div>

                  <div>
                    <span className="text-[#C59A45] font-bold uppercase tracking-wider text-[10px] block mb-1">
                      L&apos;Action de Nelly avec le Cockpit :
                    </span>
                    <p>{activeGuide.concreteExample.solution}</p>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                      Le Résultat Obtenu :
                    </span>
                    <p className="text-emerald-200 font-semibold">{activeGuide.concreteExample.outcome}</p>
                  </div>
                </div>

                {activeGuide.concreteExample.keyFigures && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-800">
                    {activeGuide.concreteExample.keyFigures.map((fig, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                        <span className="text-[10px] text-gray-400 block truncate">{fig.label}</span>
                        <span className="text-xs sm:text-sm font-bold text-[#F44293] block mt-0.5">
                          {fig.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Legal Alerts & Traps to Avoid */}
              {activeGuide.legalAlerts && activeGuide.legalAlerts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Points de Vigilance Juridique &amp; Risques Évités</span>
                  </h3>

                  <div className="space-y-3">
                    {activeGuide.legalAlerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border ${
                          alert.type === 'danger'
                            ? 'bg-red-50/70 border-red-200 text-red-950'
                            : 'bg-amber-50/70 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {alert.type === 'danger' ? (
                            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm leading-snug">{alert.title}</span>
                              {alert.lawReference && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 font-mono font-bold text-gray-600 border border-gray-200">
                                  {alert.lawReference}
                                </span>
                              )}
                            </div>
                            <p className="leading-relaxed opacity-90">{alert.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ready-to-Use Scripts */}
              {activeGuide.scripts && activeGuide.scripts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#E12B7B]" />
                    <span>Modèles de Messages &amp; Scripts Prêts à Copier</span>
                  </h3>

                  <div className="space-y-3">
                    {activeGuide.scripts.map((script) => {
                      const isCopied = copiedScriptId === script.id;

                      return (
                        <div
                          key={script.id}
                          className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900">{script.title}</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-white border border-gray-200 text-gray-600">
                                {script.channel}
                              </span>
                            </div>

                            <button
                              onClick={() => handleCopyScript(script)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-2xs'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copier le texte</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-200 font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {script.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FAQs Accordion */}
              {activeGuide.faqs && activeGuide.faqs.length > 0 && (
                <div className="space-y-3 border-t border-gray-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    <span>Questions Fréquentes sur cette Fonctionnalité</span>
                  </h3>

                  <div className="space-y-2">
                    {activeGuide.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 space-y-1">
                        <span className="text-xs font-bold text-gray-900 block">{faq.question}</span>
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA to Tool */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Besoin d&apos;aide supplémentaire ? Contactez Niels ou ouvrez le <strong>Nell&apos;IA Infinite Lab</strong>.
                </div>
                <Link
                  href={activeGuide.toolRoute}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Lancer : {activeGuide.toolLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-700">Sélectionnez un guide dans la liste</p>
            </div>
          )}
        </div>

      </div>

      {/* Legal Calculator Modal */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Calculateur de Délais Légaux</h3>
                  <span className="text-[11px] text-gray-400">SRU 10j, Accord Prêt J+60, Acte J+90</span>
                </div>
              </div>
              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="text-xs font-bold px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">
                Date de Notification du Compromis (LRAR / AR24) :
              </label>
              <input
                type="date"
                value={calcDate}
                onChange={(e) => setCalcDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20"
              />
            </div>

            {calculatedDates && (
              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-pink-50 border border-pink-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 block">
                      Purge Délai SRU (10 jours)
                    </span>
                    <span className="text-xs font-bold text-gray-900">{calculatedDates.sru} à 24h00</span>
                  </div>
                  <span className="text-[10px] bg-pink-200 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                    J+10 Ouvré
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      Dépôt Dossier Prêt Acquéreur
                    </span>
                    <span className="text-xs font-bold text-gray-900">{calculatedDates.loanApp}</span>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    J+30
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Accord de Prêt Définitif
                    </span>
                    <span className="text-xs font-bold text-gray-900">{calculatedDates.loanApproval}</span>
                  </div>
                  <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    J+60
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      Date Cible Acte Authentique
                    </span>
                    <span className="text-xs font-bold text-gray-900">{calculatedDates.finalDeed}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    J+90
                  </span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-gray-400 italic">
              Rappel : Si le 10e jour de la rétractation SRU expire un samedi, dimanche ou jour férié, l&apos;échéance est automatiquement reportée au premier jour ouvrable suivant à 24h00.
            </p>
          </div>
        </div>
      )}

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
