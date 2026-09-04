'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calculator,
  Coins,
  TrendingUp,
  Scale,
  Building,
  Sparkles,
} from 'lucide-react';
import { LoanCreditSimulator } from '@/components/cockpit/simulateurs/LoanCreditSimulator';
import { RentalYieldSimulator } from '@/components/cockpit/simulateurs/RentalYieldSimulator';
import { LegalDeadlinesSimulator } from '@/components/cockpit/simulateurs/LegalDeadlinesSimulator';
import { NotaryFinanceCalculator } from '@/components/cockpit/NotaryFinanceCalculator';

type SimulatorTab = 'credit' | 'notary' | 'capital_gains' | 'sru' | 'rentabilite';

const TABS: {
  id: SimulatorTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}[] = [
  {
    id: 'credit',
    label: 'Crédit & Capacité HCSF',
    shortLabel: 'Crédit & HCSF',
    icon: Calculator,
    badge: '35% Endettement',
  },
  {
    id: 'notary',
    label: 'Frais de Notaire & Débours',
    shortLabel: 'Frais Notaire',
    icon: Coins,
    badge: 'Barème Décret 2020',
  },
  {
    id: 'capital_gains',
    label: 'Plus-Value Immobilière Vendeur',
    shortLabel: 'Plus-Value',
    icon: TrendingUp,
    badge: 'Abattements 22/30 ans',
  },
  {
    id: 'sru',
    label: 'Délais Légaux & Purge SRU',
    shortLabel: 'Délais SRU',
    icon: Scale,
    badge: 'Art. L271-1 CCH',
  },
  {
    id: 'rentabilite',
    label: 'Rentabilité Locative & Cash-Flow',
    shortLabel: 'Rentabilité',
    icon: Building,
    badge: 'LMNP & Investisseur',
  },
];

function SimulateursContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as SimulatorTab | null;
  const [userTab, setUserTab] = useState<SimulatorTab | null>(null);

  const activeTab: SimulatorTab = (tabParam && TABS.some((t) => t.id === tabParam))
    ? tabParam
    : (userTab ?? 'credit');

  const handleTabChange = (tab: SimulatorTab) => {
    setUserTab(tab);
    router.replace(`/cockpit/simulateurs?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Calculator className="w-4 h-4" />
            <span>Ingénierie Financière & Juridique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Simulateurs & Outils Financiers
          </h1>
          <p className="text-xs text-gray-500 max-w-3xl mt-1">
            Boîte à outils certifiée pour vos rendez-vous clients : calcul de mensualités et stress-test HCSF, frais de notaire avec déduction mobilier, plus-value vendeur, délais légaux de compromis et rentabilité investisseur.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-[#FAF6EE] px-3 py-2 rounded-2xl border border-[#E9DFD3] text-xs">
          <Sparkles className="w-4 h-4 text-[#C59A45] shrink-0" />
          <span className="text-[#8C6D23] font-bold text-[11px]">
            Conforme Décrets 2024 / 2026 & Barèmes Notariaux PACA
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#131B26] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C59A45]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Simulator View */}
      <div className="mt-4">
        {activeTab === 'credit' && <LoanCreditSimulator />}

        {activeTab === 'notary' && (
          <NotaryFinanceCalculator initialTab="notary" />
        )}

        {activeTab === 'capital_gains' && (
          <NotaryFinanceCalculator initialTab="capital_gains" />
        )}

        {activeTab === 'sru' && <LegalDeadlinesSimulator />}

        {activeTab === 'rentabilite' && <RentalYieldSimulator />}
      </div>
    </div>
  );
}

export default function SimulateursPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
          Chargement des simulateurs financiers...
        </div>
      }
    >
      <SimulateursContent />
    </Suspense>
  );
}
