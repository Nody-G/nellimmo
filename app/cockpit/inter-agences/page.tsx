'use client';

import React, { useState } from 'react';
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

export default function InterAgencesPage() {
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
