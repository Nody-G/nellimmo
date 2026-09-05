'use client';

import React from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import {
  PlusCircle,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { DashboardKpis } from '@/components/cockpit/dashboard/DashboardKpis';
import { UrgentAlertsWidget } from '@/components/cockpit/dashboard/UrgentAlertsWidget';
import { RecentTransactionsWidget } from '@/components/cockpit/dashboard/RecentTransactionsWidget';
import { QuickActionsGrid } from '@/components/cockpit/dashboard/QuickActionsGrid';
import { LeadsInboxWidget } from '@/components/cockpit/dashboard/LeadsInboxWidget';
import { AssistantPanel } from '@/components/cockpit/assistant/AssistantPanel';
import { useToast } from '@/components/ui/Toast';

export default function CockpitDashboard() {
  const {
    properties,
    buyers,
    visits,
    transactions,
    contactLeads,
    estimationLeads,
    keys,
    signboards,
    updateContactLeadStatus,
    deleteContactLead,
    updateEstimationLeadStatus,
    deleteEstimationLead
  } = useNellimoStore();

  const { showToast } = useToast();

  const activeTransactions = transactions.filter(
    (t) => t.status !== 'acte_signe' && t.status !== 'annule'
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Tableau de Bord & Supervision
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Bonjour Nelly, voici l&apos;état de votre agence
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pélissanne & Provence • Système d&apos;exploitation transactionnelle autonome
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cockpit/transactions"
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
          >
            <Landmark className="w-4 h-4 text-blue-600" />
            Ventes ({activeTransactions.length})
          </Link>
          <Link
            href="/cockpit/mandats/nouveau"
            className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Mandat
          </Link>
          <Link
            href="/cockpit/avis-de-valeur"
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <TrendingUp className="w-4 h-4 text-[#C59A45]" />
            Avis DVF
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <DashboardKpis
        properties={properties}
        transactions={transactions}
        buyers={buyers}
        visits={visits}
      />

      {/* Urgent Alerts Widget */}
      <UrgentAlertsWidget
        properties={properties}
        transactions={transactions}
        keys={keys}
        signboards={signboards}
      />

      {/* Main Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsWidget
          transactions={transactions}
          properties={properties}
        />
        <QuickActionsGrid />
      </div>

      {/* Leads Inbox Widget */}
      <LeadsInboxWidget
        contactLeads={contactLeads}
        estimationLeads={estimationLeads}
        onUpdateContactStatus={async (id, status) => {
          await updateContactLeadStatus(id, status);
          showToast('Statut du contact actualisé.', 'success');
        }}
        onDeleteContact={async (id) => {
          await deleteContactLead(id);
          showToast('Demande de contact supprimée.', 'info');
        }}
        onUpdateEstimationStatus={async (id, status) => {
          await updateEstimationLeadStatus(id, status);
          showToast('Statut de l\'estimation actualisé.', 'success');
        }}
        onDeleteEstimation={async (id) => {
          await deleteEstimationLead(id);
          showToast('Demande d\'estimation supprimée.', 'info');
        }}
      />

      {/* Assistant IA — Qualification des leads entrants */}
      <AssistantPanel />
    </div>
  );
}
