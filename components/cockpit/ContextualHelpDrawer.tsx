'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HELP_GUIDES, HelpGuide, ReadyToUseScript } from '@/lib/help-content';
import { useToast } from '@/components/ui/Toast';
import { BookOpen, Search, ExternalLink, X, ArrowRight } from 'lucide-react';
import {
  HelpDrawerTrigger,
  HelpSearchResultsList,
  HelpGuideDetailView,
} from './help-drawer';

export function ContextualHelpDrawer() {
  const pathname = usePathname();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  const recommendedGuide = useMemo(() => {
    if (!pathname) return HELP_GUIDES[0];

    if (pathname.includes('/mandats'))
      return HELP_GUIDES.find((g) => g.id === 'guide-mandats') || HELP_GUIDES[0];
    if (pathname.includes('/avis-de-valeur'))
      return HELP_GUIDES.find((g) => g.id === 'guide-dvf') || HELP_GUIDES[0];
    if (pathname.includes('/pige'))
      return HELP_GUIDES.find((g) => g.id === 'guide-pige') || HELP_GUIDES[0];
    if (pathname.includes('/acquereurs'))
      return HELP_GUIDES.find((g) => g.id === 'guide-acquereurs') || HELP_GUIDES[0];
    if (pathname.includes('/visites'))
      return HELP_GUIDES.find((g) => g.id === 'guide-visites') || HELP_GUIDES[0];
    if (pathname.includes('/comptes-rendus'))
      return HELP_GUIDES.find((g) => g.id === 'guide-vendeurs') || HELP_GUIDES[0];
    if (pathname.includes('/transactions'))
      return HELP_GUIDES.find((g) => g.id === 'guide-transactions') || HELP_GUIDES[0];
    if (pathname.includes('/fiches-vitrine'))
      return HELP_GUIDES.find((g) => g.id === 'guide-vitrine') || HELP_GUIDES[0];
    if (pathname.includes('/redacteur'))
      return HELP_GUIDES.find((g) => g.id === 'guide-redacteur') || HELP_GUIDES[0];
    if (pathname.includes('/diffusion'))
      return HELP_GUIDES.find((g) => g.id === 'guide-diffusion') || HELP_GUIDES[0];
    if (pathname.includes('/cles-panneaux') || pathname.includes('/inter-agences'))
      return HELP_GUIDES.find((g) => g.id === 'guide-organisation') || HELP_GUIDES[0];
    if (pathname.includes('/import-hektor'))
      return HELP_GUIDES.find((g) => g.id === 'guide-hektor') || HELP_GUIDES[0];

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
      <HelpDrawerTrigger
        onOpen={() => {
          setSelectedGuideId(recommendedGuide.id);
          setIsOpen(true);
        }}
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-overlay"
          />

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
                    type="button"
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

                <HelpSearchResultsList
                  searchResults={searchResults}
                  onSelect={(id) => {
                    setSelectedGuideId(id);
                    setSearchQuery('');
                  }}
                />
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                <HelpGuideDetailView
                  activeGuide={activeGuide}
                  isRecommended={activeGuide.id === recommendedGuide?.id}
                  copiedScriptId={copiedScriptId}
                  onCopyScript={handleCopyScript}
                />
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
