'use client';

import React, { useState } from 'react';
import { Sun, CheckCircle2 } from 'lucide-react';
import type { Property, TransactionDeal, VisitSheet, ContactLead, Buyer } from '@/lib/types';
import { BriefingUrgentTasks } from './briefing/BriefingUrgentTasks';
import { BriefingDayVisits } from './briefing/BriefingDayVisits';
import { BriefingQuickActionBar } from './briefing/BriefingQuickActionBar';
import { QuickCallModal } from './QuickCallModal';
import { QuickLeadParserModal } from './leads/QuickLeadParserModal';
import { LocalMobileSyncModal } from '@/components/cockpit/sync/LocalMobileSyncModal';
import { QuickFinanceModal } from '@/components/cockpit/simulateurs/QuickFinanceModal';
import { SellerDiscoveryModal } from '@/components/cockpit/pige/SellerDiscoveryModal';

interface DailyBriefingWidgetProps {
  properties: Property[];
  transactions: TransactionDeal[];
  visits: VisitSheet[];
  buyers: Buyer[];
  contactLeads: ContactLead[];
}

export function DailyBriefingWidget({
  properties,
  transactions,
  visits,
  buyers,
  contactLeads,
}: DailyBriefingWidgetProps) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isLeadParserOpen, setIsLeadParserOpen] = useState(false);
  const [isMobileSyncOpen, setIsMobileSyncOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isSellerDiscoveryOpen, setIsSellerDiscoveryOpen] = useState(false);

  // Date du jour en français
  const todayDateStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const capitalizedDate = todayDateStr.charAt(0).toUpperCase() + todayDateStr.slice(1);

  const activeDeals = transactions.filter((t) => t.status !== 'acte_signe' && t.status !== 'annule');
  const newLeadsCount = contactLeads.filter((l) => l.status === 'nouveau').length;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F3E8EE] shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#131B26] text-[#C59A45] flex items-center justify-center shadow-xs shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                Briefing Opérationnel Quotidien
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Agence Active
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
              {capitalizedDate}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium">
            <strong className="text-gray-900 font-bold">{activeDeals.length}</strong> vente(s) en cours
          </div>
          {newLeadsCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-bold">
              {newLeadsCount} lead(s) à traiter
            </div>
          )}
        </div>
      </div>

      {/* Two columns: Urgent Notary Tasks & Day Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BriefingUrgentTasks transactions={transactions} properties={properties} />
        <BriefingDayVisits visits={visits} properties={properties} buyers={buyers} />
      </div>

      {/* Quick Action Bar */}
      <BriefingQuickActionBar
        onOpenQuickCall={() => setIsCallModalOpen(true)}
        onOpenLeadParser={() => setIsLeadParserOpen(true)}
        onOpenMobileSync={() => setIsMobileSyncOpen(true)}
        onOpenFinance={() => setIsFinanceOpen(true)}
        onOpenSellerDiscovery={() => setIsSellerDiscoveryOpen(true)}
      />

      {/* Modals */}
      <QuickCallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
      <QuickLeadParserModal isOpen={isLeadParserOpen} onClose={() => setIsLeadParserOpen(false)} />
      <LocalMobileSyncModal isOpen={isMobileSyncOpen} onClose={() => setIsMobileSyncOpen(false)} />
      <QuickFinanceModal isOpen={isFinanceOpen} onClose={() => setIsFinanceOpen(false)} />
      <SellerDiscoveryModal isOpen={isSellerDiscoveryOpen} onClose={() => setIsSellerDiscoveryOpen(false)} />
    </div>
  );
}
