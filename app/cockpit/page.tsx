'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';
import { ArrowUpRight } from 'lucide-react';
import { DailyBriefingWidget } from '@/components/cockpit/dashboard/DailyBriefingWidget';
import { DashboardKpis } from '@/components/cockpit/dashboard/DashboardKpis';
import { UrgentAlertsWidget } from '@/components/cockpit/dashboard/UrgentAlertsWidget';
import { RecentTransactionsWidget } from '@/components/cockpit/dashboard/RecentTransactionsWidget';
import { LeadsInboxWidget } from '@/components/cockpit/dashboard/LeadsInboxWidget';
import { QuickCockpitActionsBar } from '@/components/cockpit/dashboard/QuickCockpitActionsBar';
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
    deleteEstimationLead,
    syncContactsFromActivity,
  } = useNellimoStore();

  const { showToast } = useToast();
  const currentUser = getSessionUser();
  const greetingName = currentUser?.first_name || '';

  // Interconnexion : une seule synchronisation du carnet de contacts par session
  // (évite tout polling et toute surcharge, conformément aux garde-fous).
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const SESSION_FLAG = 'nellimo_contacts_synced_session';
    try {
      if (sessionStorage.getItem(SESSION_FLAG)) return;
      sessionStorage.setItem(SESSION_FLAG, '1');
    } catch {
      // sessionStorage indisponible : on continue sans bloquer.
    }

    syncContactsFromActivity()
      .then((count) => {
        if (count > 0) {
          showToast(`${count} contact(s) synchronisé(s) depuis votre activité.`, 'success');
        }
      })
      .catch((e) => console.error('Error syncing contacts from activity:', e));
  }, [syncContactsFromActivity, showToast]);

  const activeTransactions = transactions.filter(
    (t) => t.status !== 'acte_signe' && t.status !== 'annule'
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Refined Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E12B7B]">
              Cockpit Exécutif Nell’Immo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] tracking-tight">
            Bonjour{greetingName ? ` ${greetingName}` : ''}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pélissanne & Pays Salonais • Agence autonome • {activeTransactions.length} vente(s) en cours
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cockpit/transactions"
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            Pipeline Notaires ({activeTransactions.length})
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
          <Link
            href="/cockpit/avis-de-valeur"
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            Avis DVF
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Quick Productivity Action Bar (7 Automations Access) */}
      <QuickCockpitActionsBar />

      {/* High-Impact Executive KPIs */}
      <DashboardKpis
        properties={properties}
        transactions={transactions}
        buyers={buyers}
        visits={visits}
      />

      {/* Nerve Center: Daily Briefing */}
      <DailyBriefingWidget
        properties={properties}
        transactions={transactions}
        visits={visits}
        buyers={buyers}
        contactLeads={contactLeads}
      />

      {/* Main Dual Balanced Grid: Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Deals & Leads */}
        <div className="lg:col-span-7 space-y-6">
          <RecentTransactionsWidget
            transactions={transactions}
            properties={properties}
          />
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
              showToast('Statut de l’estimation actualisé.', 'success');
            }}
            onDeleteEstimation={async (id) => {
              await deleteEstimationLead(id);
              showToast('Demande d’estimation supprimée.', 'info');
            }}
          />
        </div>

        {/* Right Column: Alerts, Keys, Signboards */}
        <div className="lg:col-span-5 space-y-6">
          <UrgentAlertsWidget
            properties={properties}
            keys={keys}
            signboards={signboards}
          />
        </div>
      </div>
    </div>
  );
}
