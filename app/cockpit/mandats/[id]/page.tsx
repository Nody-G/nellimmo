'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { PropertyStatus } from '@/lib/types';
import { calculateMatchingScore } from '@/lib/hoguet';
import { AlurGedManager } from '@/components/cockpit/AlurGedManager';
import { MandateDetailHeader } from '@/components/cockpit/mandats/detail/MandateDetailHeader';
import { MandateOverviewTab } from '@/components/cockpit/mandats/detail/MandateOverviewTab';
import { MandateAuditTab } from '@/components/cockpit/mandats/detail/MandateAuditTab';
import { MandatePortalsTab } from '@/components/cockpit/mandats/detail/MandatePortalsTab';
import { MandateMatchingTab } from '@/components/cockpit/mandats/detail/MandateMatchingTab';
import { MandateCopywritingTab } from '@/components/cockpit/mandats/detail/MandateCopywritingTab';
import { MandateDetailTabs, MandateTabId } from '@/components/cockpit/mandats/detail/MandateDetailTabs';
import { MandateDetailModals } from '@/components/cockpit/mandats/detail/MandateDetailModals';
import { useToast } from '@/components/ui/Toast';

export default function MandateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {
    properties,
    buyers,
    auditLogs,
    settings,
    updateProperty,
    proposals,
    createProposal,
    updateProposalStatus,
  } = useNellimoStore();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<MandateTabId>('details');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isAvenantModalOpen, setIsAvenantModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const property = properties.find((p) => p.id === resolvedParams.id);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Mandat introuvable</h2>
        <Link href="/cockpit/mandats" className="text-xs font-bold text-[#E12B7B] underline">
          Retour au registre des mandats
        </Link>
      </div>
    );
  }

  const mandateLogs = auditLogs.filter((log) => log.mandate_number === property.mandate_number);

  // CRM Matching calculation
  const matchedBuyers = buyers
    .map((buyer) => {
      const match = calculateMatchingScore(property, buyer);
      return { buyer, ...match };
    })
    .sort((a, b) => b.score - a.score);

  const handleStatusChange = async (newStatus: PropertyStatus) => {
    await updateProperty(property.id, { status: newStatus });
    showToast(`Statut du mandat mis à jour : ${newStatus}`, 'success');
  };

  const handleApplyDescription = async (newDesc: string) => {
    await updateProperty(property.id, { description: newDesc });
    showToast('Descriptif de l\'annonce mis à jour avec succès.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Quick Actions */}
      <MandateDetailHeader
        property={property}
        onStatusChange={handleStatusChange}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onOpenAvenantModal={() => setIsAvenantModalOpen(true)}
        onOpenContractModal={() => setIsContractModalOpen(true)}
      />

      {/* Tabs Navigation */}
      <MandateDetailTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        documentsCount={property.documents?.length}
        buyersCount={matchedBuyers.length}
        logsCount={mandateLogs.length}
      />

      {/* Tab 1 : Vue d'ensemble */}
      {activeTab === 'details' && <MandateOverviewTab property={property} />}

      {/* Tab 2 : Documents ALUR & GED */}
      {activeTab === 'alur_ged' && (
        <AlurGedManager
          property={property}
          onUpdateProperty={updateProperty}
        />
      )}

      {/* Tab 3 : CRM Matching Acquéreurs */}
      {activeTab === 'crm' && (
        <MandateMatchingTab
          property={property}
          matchedBuyers={matchedBuyers}
          proposals={proposals}
          onCreateProposal={async (buyerId, channel) => {
            await createProposal({
              property_id: property.id,
              buyer_id: buyerId,
              channel,
              status: 'propose',
              proposed_at: new Date().toISOString(),
            });
            showToast('Proposition enregistrée dans le suivi CRM.', 'success');
          }}
          onUpdateProposalStatus={async (proposalId, status) => {
            await updateProposalStatus(proposalId, status);
            showToast('Statut de la proposition actualisé.', 'success');
          }}
        />
      )}

      {/* Tab 4 : Studio IA Copywriting */}
      {activeTab === 'copywriting' && (
        <MandateCopywritingTab
          property={property}
          onApplyDescription={handleApplyDescription}
        />
      )}

      {/* Tab 5 : Multidiffusion Portails */}
      {activeTab === 'poliris' && (
        <MandatePortalsTab property={property} settings={settings} />
      )}

      {/* Tab 6 : Registre DGCCRF & Audit Log */}
      {activeTab === 'audit' && (
        <MandateAuditTab property={property} logs={mandateLogs} />
      )}

      {/* Modales Container */}
      <MandateDetailModals
        property={property}
        settings={settings}
        isSignatureModalOpen={isSignatureModalOpen}
        onCloseSignatureModal={() => setIsSignatureModalOpen(false)}
        onSigned={async (signatureCert) => {
          await updateProperty(property.id, {
            electronic_signature: signatureCert,
          });
          showToast('Mandat signé électroniquement avec succès !', 'success');
        }}
        isAvenantModalOpen={isAvenantModalOpen}
        onCloseAvenantModal={() => setIsAvenantModalOpen(false)}
        isContractModalOpen={isContractModalOpen}
        onCloseContractModal={() => setIsContractModalOpen(false)}
      />
    </div>
  );
}
