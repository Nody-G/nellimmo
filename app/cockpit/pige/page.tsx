'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import { filterLeads, computeDvfGap } from '@/components/cockpit/pige/pige-types';
import { PigeHeader } from '@/components/cockpit/pige/PigeHeader';
import { PigeFilterBar, PigeSortOption } from '@/components/cockpit/pige/PigeFilterBar';
import { LeadCard } from '@/components/cockpit/pige/LeadCard';
import { PigeTable } from '@/components/cockpit/pige/PigeTable';
import { NewLeadModal } from '@/components/cockpit/pige/NewLeadModal';
import { PigeImportModal } from '@/components/cockpit/pige/PigeImportModal';
import { PigeScannerModal } from '@/components/cockpit/pige/PigeScannerModal';
import { usePigeActions } from '@/components/cockpit/pige/usePigeActions';

function ProspectingContent() {
  const { prospectingLeads } = useNellimoStore();
  const searchParams = useSearchParams();
  const deepLinkLeadId = searchParams.get('leadId') || '';

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<PigeSortOption>('recent');
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [highlightLeadId, setHighlightLeadId] = useState<string>('');

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

  // Deep-link : mise en évidence du lead ciblé via ?leadId=
  useEffect(() => {
    if (!deepLinkLeadId) return;
    const target = prospectingLeads.find((l) => l.id === deepLinkLeadId);
    if (!target) return;
    setHighlightLeadId(deepLinkLeadId);
    // On s'assure que le lead ciblé est visible (réinitialise les filtres si besoin)
    setSelectedSourceFilter('all');
    setSelectedStatusFilter('all');
    setSearchKeyword('');
    const timer = setTimeout(() => setHighlightLeadId(''), 4000);
    return () => clearTimeout(timer);
  }, [deepLinkLeadId, prospectingLeads]);

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
        case 'oldest': {
          const dateA = new Date(a.created_at).getTime() || 0;
          const dateB = new Date(b.created_at).getTime() || 0;
          return dateA - dateB;
        }
        case 'dvf_opportunity': {
          const gapA = computeDvfGap(a).diffPct;
          const gapB = computeDvfGap(b).diffPct;
          return gapA - gapB; // Le plus bas / sous-coté par rapport au marché en premier
        }
        case 'dvf_gap_desc': {
          const gapA = computeDvfGap(a).diffPct;
          const gapB = computeDvfGap(b).diffPct;
          return gapB - gapA;
        }
        case 'price_desc':
          return b.price_asked - a.price_asked;
        case 'price_asc':
          return a.price_asked - b.price_asked;
        case 'surface_desc':
          return b.living_area - a.living_area;
        case 'surface_asc':
          return a.living_area - b.living_area;
        case 'days_online':
          return b.days_online - a.days_online;
        case 'seller_asc':
          return a.seller_name.localeCompare(b.seller_name, 'fr', { sensitivity: 'base' });
        case 'seller_desc':
          return b.seller_name.localeCompare(a.seller_name, 'fr', { sensitivity: 'base' });
        case 'source_asc':
          return a.source.localeCompare(b.source, 'fr');
        case 'source_desc':
          return b.source.localeCompare(a.source, 'fr');
        default:
          return 0;
      }
    });
  }, [prospectingLeads, selectedSourceFilter, selectedStatusFilter, searchKeyword, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <PigeHeader
        onNewLead={() => setIsNewLeadModalOpen(true)}
        onImport={() => setIsImportModalOpen(true)}
        onScanner={() => setIsScannerModalOpen(true)}
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
                isHighlighted={highlightLeadId === lead.id}
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
          sortBy={sortBy}
          onSortChange={setSortBy}
          highlightLeadId={highlightLeadId}
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

      <PigeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
      />
    </div>
  );
}

export default function ProspectingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-gray-400">
          Chargement de la pige…
        </div>
      }
    >
      <ProspectingContent />
    </Suspense>
  );
}
