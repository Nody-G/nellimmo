'use client';

import React, { useState, useMemo } from 'react';
import { useNellimoStore } from '@/lib/store';
import { filterLeads } from '@/components/cockpit/pige/pige-types';
import { PigeHeader } from '@/components/cockpit/pige/PigeHeader';
import { SparringPartnerPanel } from '@/components/cockpit/pige/SparringPartnerPanel';
import { PigeFilterBar } from '@/components/cockpit/pige/PigeFilterBar';
import { LeadCard } from '@/components/cockpit/pige/LeadCard';
import { NewLeadModal } from '@/components/cockpit/pige/NewLeadModal';
import { PigeImportModal } from '@/components/cockpit/pige/PigeImportModal';
import { usePigeActions } from '@/components/cockpit/pige/usePigeActions';

export default function ProspectingPage() {
  const { prospectingLeads } = useNellimoStore();

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Sparring partner modal / active script
  const [activeObjectionIndex, setActiveObjectionIndex] = useState<number>(0);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const {
    isNewLeadModalOpen,
    setIsNewLeadModalOpen,
    newLeadForm,
    handleNewLeadFieldChange,
    handleCreateLead,
    isImportModalOpen,
    setIsImportModalOpen,
    handleImportLeads,
    handleUpdateStatus,
    handleConvertToMandate,
  } = usePigeActions();

  const filteredLeads = useMemo(
    () => filterLeads(prospectingLeads, selectedSourceFilter, selectedStatusFilter, searchKeyword),
    [prospectingLeads, selectedSourceFilter, selectedStatusFilter, searchKeyword]
  );

  const copyPitchText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PigeHeader
        onNewLead={() => setIsNewLeadModalOpen(true)}
        onImport={() => setIsImportModalOpen(true)}
      />

      <SparringPartnerPanel
        activeObjectionIndex={activeObjectionIndex}
        copiedPitch={copiedPitch}
        onSelectObjection={setActiveObjectionIndex}
        onCopyPitch={copyPitchText}
      />

      <PigeFilterBar
        searchKeyword={searchKeyword}
        selectedSourceFilter={selectedSourceFilter}
        selectedStatusFilter={selectedStatusFilter}
        onSearchChange={setSearchKeyword}
        onSourceChange={setSelectedSourceFilter}
        onStatusChange={setSelectedStatusFilter}
      />

      {/* Leads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onConvertToMandate={handleConvertToMandate}
            onStatusChange={handleUpdateStatus}
          />
        ))}
      </div>

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        form={newLeadForm}
        onChange={handleNewLeadFieldChange}
        onSubmit={handleCreateLead}
        onClose={() => setIsNewLeadModalOpen(false)}
      />

      <PigeImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLeads}
      />
    </div>
  );
}
