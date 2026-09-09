'use client';

import React from 'react';
import { Sun, CheckCircle2 } from 'lucide-react';
import type { Property, TransactionDeal, VisitSheet, ContactLead, Buyer } from '@/lib/types';
import { BriefingUrgentTasks } from './briefing/BriefingUrgentTasks';
import { BriefingDayVisits } from './briefing/BriefingDayVisits';

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
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F3E8EE] shadow-xs space-y-5">
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

      {/* Two balanced columns: Urgent Notary Tasks & Day Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BriefingUrgentTasks transactions={transactions} properties={properties} />
        <BriefingDayVisits visits={visits} properties={properties} buyers={buyers} />
      </div>
    </div>
  );
}
