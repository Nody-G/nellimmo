'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Users,
  PenTool,
  Landmark,
  Radar,
  BookUser,
  KeyRound,
  Flag,
  FileCheck2,
  FileSignature,
  Inbox,
  TrendingUp,
  ShieldCheck,
  Handshake,
  Database,
  Sparkles,
} from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { getCustomFieldDefinitions } from '@/lib/custom-fields';
import { downloadDataset } from '@/lib/database-security';
import { saveCallLog } from '@/lib/deepseek/telemetry';
import { exportMasterBackup } from '@/components/cockpit/parametres/parametres-types';
import { DatabaseStudioHeader } from '@/components/cockpit/database/DatabaseStudioHeader';
import { DatabaseCollectionSelector, CollectionMeta } from '@/components/cockpit/database/DatabaseCollectionSelector';
import { DeepSeekDataQueryBox, QueryPlanResult } from '@/components/cockpit/database/DeepSeekDataQueryBox';
import { UniversalDataGrid } from '@/components/cockpit/database/UniversalDataGrid';
import { CustomFieldsManagerModal } from '@/components/cockpit/database/CustomFieldsManagerModal';
import { DeepSeekTelemetryDashboard } from '@/components/cockpit/deepseek/DeepSeekTelemetryDashboard';

export default function DatabaseStudioPage() {
  const store = useNellimoStore();
  const [activeTab, setActiveTab] = useState<'explorer' | 'telemetry'>('explorer');
  const [selectedCollectionKey, setSelectedCollectionKey] = useState<string>('properties');
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldsVersion, setCustomFieldsVersion] = useState(0);
  const [activePlan, setActivePlan] = useState<QueryPlanResult | null>(null);

  // Définition des 15+ collections avec icônes et compteurs en temps réel
  const collections: CollectionMeta[] = useMemo(
    () => [
      { key: 'properties', name: 'Biens & Mandats', count: store.properties.length, icon: FileText },
      { key: 'buyers', name: 'Acquéreurs & Critères', count: store.buyers.length, icon: Users },
      { key: 'visits', name: 'Bons de Visite', count: store.visits.length, icon: PenTool },
      { key: 'transactions', name: 'Pipeline Notaire', count: store.transactions.length, icon: Landmark },
      { key: 'prospectingLeads', name: 'Pige & Prospection', count: store.prospectingLeads.length, icon: Radar },
      { key: 'contacts', name: 'Carnet de Contacts', count: store.contacts.length, icon: BookUser },
      { key: 'keys', name: 'Trousseaux de Clés', count: store.keys.length, icon: KeyRound },
      { key: 'signboards', name: 'Panneaux Terrain', count: store.signboards.length, icon: Flag },
      { key: 'avenants', name: 'Avenants Mandats', count: store.avenants.length, icon: FileSignature },
      { key: 'proposals', name: 'Offres d’Achat', count: store.proposals.length, icon: Handshake },
      { key: 'vendorReports', name: 'Comptes-Rendus Vendeurs', count: store.vendorReports.length, icon: FileCheck2 },
      { key: 'contactLeads', name: 'Leads Entrants', count: store.contactLeads.length, icon: Inbox },
      { key: 'estimationLeads', name: 'Estimations Web', count: store.estimationLeads.length, icon: TrendingUp },
      { key: 'auditLogs', name: 'Registre ALUR', count: store.auditLogs.length, icon: ShieldCheck },
      { key: 'partners', name: 'Agences Partenaires', count: store.partners.length, icon: Handshake },
    ],
    [store]
  );

  const currentRecords = useMemo(() => {
    const raw = (store as unknown as Record<string, Array<Record<string, unknown>>>)[selectedCollectionKey] || [];
    if (!activePlan || activePlan.targetCollection !== selectedCollectionKey) {
      return raw;
    }
    // Application des filtres retournés par DeepSeek V4 Flash
    return raw.filter((item) => {
      return activePlan.filters.every((f) => {
        const itemVal = item[f.field];
        if (itemVal === undefined || itemVal === null) return false;
        if (f.operator === 'equals') return String(itemVal).toLowerCase() === String(f.value).toLowerCase();
        if (f.operator === 'contains') return String(itemVal).toLowerCase().includes(String(f.value).toLowerCase());
        if (f.operator === 'greater_than') return Number(itemVal) >= Number(f.value);
        if (f.operator === 'less_than') return Number(itemVal) <= Number(f.value);
        return true;
      });
    });
  }, [store, selectedCollectionKey, activePlan]);

  const customFields = useMemo(() => {
    void customFieldsVersion;
    return getCustomFieldDefinitions(selectedCollectionKey);
  }, [selectedCollectionKey, customFieldsVersion]);

  const selectedMeta = collections.find((c) => c.key === selectedCollectionKey) || collections[0];

  const handleExportCurrent = () => {
    downloadDataset(`export-${selectedCollectionKey}-${Date.now()}.json`, currentRecords, 'json');
  };

  return (
    <div className="space-y-6 pb-12">
      <DatabaseStudioHeader
        totalRecords={collections.reduce((acc, c) => acc + c.count, 0)}
        selectedCollectionName={selectedMeta.name}
        onOpenCustomFieldModal={() => setIsCustomFieldModalOpen(true)}
        onExportCurrent={handleExportCurrent}
        onExportMaster={() => exportMasterBackup(store.settings)}
      />

      {/* Commutateur de Mode : Explorateur Universel vs Télémétrie DeepSeek V4 */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'explorer'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database className="w-4 h-4" />
          Explorateur & Requêtes Base de Données
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'telemetry'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Consommation & Télémétrie DeepSeek V4 Flash
        </button>
      </div>

      {activeTab === 'explorer' ? (
        <div className="space-y-4">
          <DatabaseCollectionSelector
            collections={collections}
            selectedKey={selectedCollectionKey}
            onSelect={(k) => {
              setSelectedCollectionKey(k);
              setActivePlan(null);
            }}
          />

          <DeepSeekDataQueryBox
            activePlanSummary={activePlan?.summary}
            onApplyPlan={(plan, log) => {
              if (plan.targetCollection && collections.some((c) => c.key === plan.targetCollection)) {
                setSelectedCollectionKey(plan.targetCollection);
              }
              setActivePlan(plan);
              if (log) saveCallLog(log);
            }}
            onResetPlan={() => setActivePlan(null)}
          />

          <UniversalDataGrid
            collectionKey={selectedCollectionKey}
            records={currentRecords}
            customFields={customFields}
            onRefresh={() => setCustomFieldsVersion((v) => v + 1)}
          />

          <CustomFieldsManagerModal
            isOpen={isCustomFieldModalOpen}
            onClose={() => setIsCustomFieldModalOpen(false)}
            collectionKey={selectedCollectionKey}
            collectionName={selectedMeta.name}
            fields={customFields}
            onFieldsChanged={() => setCustomFieldsVersion((v) => v + 1)}
          />
        </div>
      ) : (
        <DeepSeekTelemetryDashboard />
      )}
    </div>
  );
}
