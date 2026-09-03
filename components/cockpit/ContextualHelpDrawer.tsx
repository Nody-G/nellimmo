'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HELP_GUIDES, HelpGuide, ReadyToUseScript } from '@/lib/help-content';
import { useToast } from '@/components/ui/Toast';
import {
  HelpCircle,
  X,
  BookOpen,
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export function ContextualHelpDrawer() {
  const pathname = usePathname();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  // Pathname mapping to guide categories or IDs
  const recommendedGuide = useMemo(() => {
    if (!pathname) return HELP_GUIDES[0];

    if (pathname.includes('/mandats')) return HELP_GUIDES.find((g) => g.id === 'guide-mandats') || HELP_GUIDES[0];
    if (pathname.includes('/avis-de-valeur')) return HELP_GUIDES.find((g) => g.id === 'guide-dvf') || HELP_GUIDES[0];
    if (pathname.includes('/pige')) return HELP_GUIDES.find((g) => g.id === 'guide-pige') || HELP_GUIDES[0];
    if (pathname.includes('/acquereurs')) return HELP_GUIDES.find((g) => g.id === 'guide-acquereurs') || HELP_GUIDES[0];
    if (pathname.includes('/visites')) return HELP_GUIDES.find((g) => g.id === 'guide-visites') || HELP_GUIDES[0];
    if (pathname.includes('/comptes-rendus')) return HELP_GUIDES.find((g) => g.id === 'guide-vendeurs') || HELP_GUIDES[0];
    if (pathname.includes('/transactions')) return HELP_GUIDES.find((g) => g.id === 'guide-transactions') || HELP_GUIDES[0];
    if (pathname.includes('/fiches-vitrine')) return HELP_GUIDES.find((g) => g.id === 'guide-vitrine') || HELP_GUIDES[0];
    if (pathname.includes('/redacteur')) return HELP_GUIDES.find((g) => g.id === 'guide-redacteur') || HELP_GUIDES[0];
    if (pathname.includes('/diffusion')) return HELP_GUIDES.find((g) => g.id === 'guide-diffusion') || HELP_GUIDES[0];
    if (pathname.includes('/cles-panneaux') || pathname.includes('/inter-agences'))
      return HELP_GUIDES.find((g) => g.id === 'guide-organisation') || HELP_GUIDES[0];
    if (pathname.includes('/import-hektor')) return HELP_GUIDES.find((g) => g.id === 'guide-hektor') || HELP_GUIDES[0];

    return HELP_GUIDES[0];
  }, [pathname]);

  // Listen for custom event 'open-cockpit-help'
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ guideId?: string }>;
      if (customEvent.detail?.guideId) {
        setSelectedGuideId(customEvent.detail.guideId);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-cockpit-help', handleOpen);
    return () => window.removeEventListener('open-cockpit-help', handleOpen);
  }, []);

  // Filtered guides for drawer
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return HELP_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const activeGuide: HelpGuide = useMemo(() => {
    if (selectedGuideId) {
      const found = HELP_GUIDES.find((g) => g.id === selectedGuideId);
      if (found) return found;
    }
    return recommendedGuide;
  }, [selectedGuideId, recommendedGuide]);

  const handleCopyScript = (script: ReadyToUseScript) => {
    navigator.clipboard.writeText(script.text);
    setCopiedScriptId(script.id);
    showToast(`Le message "${script.title}" est copié dans le presse-papier !`, 'success');
    setTimeout(() => setCopiedScriptId(null), 2500);
  };

  return (
    <>
      {/* Floating or Header Trigger Button */}
      <button
        onClick={() => {
          setSelectedGuideId(recommendedGuide.id);
          setIsOpen(true);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-[#FDF2F8] hover:from-pink-100 hover:to-[#FCE7F3] text-[#E12B7B] border border-pink-200/80 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
        title="Ouvrir les tutoriels et l'aide sur cette fonctionnalité"
      >
        <HelpCircle className="w-3.5 h-3.5 text-[#E12B7B]" />
        <span className="hidden sm:inline">Guide &amp; Tutos</span>
      </button>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-overlay"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-slide-drawer">
              
              {/* Drawer Header */}
              <div className="p-4 bg-[#131B26] text-white flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E12B7B] flex items-center justify-center text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-serif font-bold text-white tracking-tight">
                      Aide Contextuelle Cockpit
                    </h3>
                    <span className="text-[10px] text-[#C59A45] font-semibold block">
                      Guides &amp; Bonnes Pratiques Nell&apos;Immo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/cockpit/aide"
                    onClick={() => setIsOpen(false)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    <span>Toute l&apos;Academy</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar in Drawer */}
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Chercher un tuto, une règle légale, un script..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20"
                  />
                </div>

                {/* Instant search results dropdown if typing */}
                {searchResults.length > 0 && (
                  <div className="mt-2 p-1 bg-white border border-gray-200 rounded-xl shadow-md space-y-1 max-h-48 overflow-y-auto">
                    {searchResults.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setSelectedGuideId(g.id);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-pink-50 text-xs flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-gray-800 truncate">{g.title}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">
                          {g.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                <div className="space-y-5">
                  {/* Active Guide Title */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E12B7B] bg-pink-50 px-2 py-0.5 rounded">
                        {activeGuide.categoryLabel}
                      </span>
                      {activeGuide.id === recommendedGuide?.id && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Recommandé pour cette page
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-gray-900 leading-snug">
                      {activeGuide.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {activeGuide.summary}
                    </p>
                  </div>

                  {/* Objective Box */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{activeGuide.objective}</span>
                  </div>

                  {/* Step-by-Step Mini Checklist */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Étapes Clés :
                    </span>
                    <div className="space-y-2">
                      {activeGuide.steps.map((step) => (
                        <div
                          key={step.number}
                          className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1"
                        >
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-4 h-4 rounded-full bg-[#E12B7B] text-white flex items-center justify-center text-[10px]">
                              {step.number}
                            </span>
                            <span>{step.title}</span>
                          </div>
                          <p className="text-gray-600 pl-6 leading-relaxed">
                            {step.description}
                          </p>
                          {step.tips && (
                            <p className="text-amber-800 pl-6 italic text-[11px]">
                              💡 {step.tips}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concrete Example Snippet */}
                  <div className="p-3.5 rounded-2xl bg-gray-900 text-white text-xs space-y-2">
                    <div className="flex items-center justify-between text-[#C59A45] font-bold text-[10px] uppercase">
                      <span>Cas Réel : {activeGuide.concreteExample.title}</span>
                      <span>{activeGuide.concreteExample.location}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {activeGuide.concreteExample.context}
                    </p>
                    <p className="text-emerald-300 text-[11px] font-semibold">
                      ✓ Résultat : {activeGuide.concreteExample.outcome}
                    </p>
                  </div>

                  {/* Scripts if present */}
                  {activeGuide.scripts.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                        Modèle de Message Rapide :
                      </span>
                      {activeGuide.scripts.slice(0, 1).map((script) => (
                        <div
                          key={script.id}
                          className="p-3 rounded-xl bg-pink-50/60 border border-pink-200/80 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{script.title}</span>
                            <button
                              onClick={() => handleCopyScript(script)}
                              className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 text-[#E12B7B] font-bold text-[10px] border border-pink-200 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedScriptId === script.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copié</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {script.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Legal Alert Snippet */}
                  {activeGuide.legalAlerts.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-red-900">{activeGuide.legalAlerts[0].title}</strong>
                        <p className="text-[11px] text-red-800 leading-relaxed mt-0.5">
                          {activeGuide.legalAlerts[0].content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <Link
                  href={`/cockpit/aide?guide=${activeGuide.id}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <span>Ouvrir la fiche complète dans l&apos;Academy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
