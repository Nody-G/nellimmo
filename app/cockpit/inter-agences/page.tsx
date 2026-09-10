'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore, useInterAgency } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import type { DelegationAgreement } from '@/lib/types';
import {
  InterAgencesHeader,
  InterAgencesStats,
  DelegationsTable,
  PartnersDirectory,
  NewDelegationModal,
  NewPartnerModal,
  DelegationContractModal,
} from '@/components/cockpit/inter-agences';

function InterAgencesContent() {
  const searchParams = useSearchParams();
  const deepLinkPartnerId = searchParams.get('partnerId') || '';
  const deepLinkDelegationId = searchParams.get('delegationId') || '';

  const { properties } = useNellimoStore();
  const {
    partners,
    delegations,
    createDelegation,
    addPartner,
    deletePartner,
  } = useInterAgency();
  const { showToast } = useToast();

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState<DelegationAgreement | null>(null);
  const [isNewDelegationModalOpen, setIsNewDelegationModalOpen] = useState(false);
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);

  const activeProperties = properties.filter((p) => p.status === 'actif');

  // Deep-link : ouverture automatique de la convention de délégation via ?delegationId=
  useEffect(() => {
    if (!deepLinkDelegationId) return;
    const target = delegations.find((d) => d.id === deepLinkDelegationId);
    if (target) {
      setSelectedDelegation(target);
      setIsContractModalOpen(true);
    }
  }, [deepLinkDelegationId, delegations]);

  const handleSelectDelegation = (d: DelegationAgreement) => {
    setSelectedDelegation(d);
    setIsContractModalOpen(true);
  };

  const handleDelegationCreated = (newDelegation: DelegationAgreement) => {
    setIsNewDelegationModalOpen(false);
    setSelectedDelegation(newDelegation);
    setIsContractModalOpen(true);
    showToast('Convention de délégation générée avec succès.', 'success');
  };

  const selectedProperty = selectedDelegation
    ? properties.find((p) => p.id === selectedDelegation.property_id) || properties[0]
    : undefined;

  const selectedPartner = selectedDelegation
    ? partners.find((p) => p.id === selectedDelegation.partner_id) || partners[0]
    : undefined;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <InterAgencesHeader
        onOpenNewDelegation={() => setIsNewDelegationModalOpen(true)}
      />

      {/* Stats Cards */}
      <InterAgencesStats
        delegations={delegations}
        partners={partners}
        properties={properties}
      />

      {/* Active Delegations Table */}
      <DelegationsTable
        delegations={delegations}
        properties={properties}
        partners={partners}
        onSelectDelegation={handleSelectDelegation}
      />

      {/* Partner Agencies Directory with CRUD */}
      <PartnersDirectory
        partners={partners}
        onOpenNewPartner={() => setIsNewPartnerModalOpen(true)}
        onDeletePartner={deletePartner}
        showToast={showToast}
        highlightPartnerId={deepLinkPartnerId || undefined}
      />

      {/* Modal New Delegation */}
      <NewDelegationModal
        isOpen={isNewDelegationModalOpen}
        onClose={() => setIsNewDelegationModalOpen(false)}
        activeProperties={activeProperties}
        partners={partners}
        onCreateDelegation={createDelegation}
        onSuccess={handleDelegationCreated}
      />

      {/* Modal Add Partner Agency */}
      <NewPartnerModal
        isOpen={isNewPartnerModalOpen}
        onClose={() => setIsNewPartnerModalOpen(false)}
        onAddPartner={addPartner}
        showToast={showToast}
      />

      {/* Modal Contract Preview & Print */}
      <DelegationContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        delegation={selectedDelegation}
        property={selectedProperty}
        partner={selectedPartner}
      />
    </div>
  );
}

export default function InterAgencesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-400">
          Chargement du réseau inter-agences...
        </div>
      }
    >
      <InterAgencesContent />
    </Suspense>
  );
}
