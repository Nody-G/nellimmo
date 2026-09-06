'use client';

import React, { useState, useMemo } from 'react';
import { useNellimoStore } from '@/lib/store';
import { filterLeads, computeDvfGap } from '@/components/cockpit/pige/pige-types';
import { PigeHeader } from '@/components/cockpit/pige/PigeHeader';
import { SparringPartnerPanel } from '@/components/cockpit/pige/SparringPartnerPanel';
import { PigeFilterBar, PigeSortOption } from '@/components/cockpit/pige/PigeFilterBar';
import { LeadCard } from '@/components/cockpit/pige/LeadCard';
import { PigeTable } from '@/components/cockpit/pige/PigeTable';
import { NewLeadModal } from '@/components/cockpit/pige/NewLeadModal';
import { PigeImportModal } from '@/components/cockpit/pige/PigeImportModal';
import { usePigeActions } from '@/components/cockpit/pige/usePigeActions';

export default function ProspectingPage() {
  const { prospectingLeads } = useNellimoStore();

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<PigeSortOption>('recent');

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

  const filteredAndSortedLeads = useMemo(() => {
    const filtered = filterLeads(
      prospectingLeads,
      selectedSourceFilter,
      selectedStatusFilter,
      searchKeyword
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent': {
          const dateA = new Date(a.created_at).getTime() || 0;
          const dateB = new Date(b.created_at).getTime() || 0;
          return dateB - dateA;
        }
        case 'dvf_opportunity': {
          const gapA = computeDvfGap(a).diffPct;
          const gapB = computeDvfGap(b).diffPct;
          return gapA - gapB; // Le plus bas / sous-coté par rapport au marché en premier
        }
        case 'price_desc':
          return b.price_asked - a.price_asked;
        case 'price_asc':
          return a.price_asked - b.price_asked;
        case 'surface_desc':
          return b.living_area - a.living_area;
        case 'days_online':
          return b.days_online - a.days_online;
        default:
          return 0;
      }
    });
  }, [prospectingLeads, selectedSourceFilter, selectedStatusFilter, searchKeyword, sortBy]);

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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={prospectingLeads.length}
        filteredCount={filteredAndSortedLeads.length}
      />

      {/* Leads Main View: Modern Grid or CRM Table */}
      {viewMode === 'grid' ? (
        filteredAndSortedLeads.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#F3E8EE] p-12 text-center text-gray-400 text-xs">
            Aucune annonce de pige ne correspond à votre recherche ou filtre.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedLeads.map((lead, idx) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                rankIndex={idx + 1}
                onConvertToMandate={handleConvertToMandate}
                onStatusChange={handleUpdateStatus}
              />
            ))}
          </div>
        )
      ) : (
        <PigeTable
          leads={filteredAndSortedLeads}
          onConvertToMandate={handleConvertToMandate}
          onStatusChange={handleUpdateStatus}
        />
      )}

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
