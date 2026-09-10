'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import type { Buyer } from '@/lib/types';
import {
  filterBuyers,
  AcquereursHeader,
  AcquereursFilterBar,
  AcquereursSortOption,
  BuyersGrid,
  BuyersTable,
  NewBuyerModal,
  BroadcastCampaignModal,
  BuyerSelectionModal,
  useNewBuyerForm,
} from '@/components/cockpit/acquereurs';
import { sortBuyers } from '@/components/cockpit/acquereurs/buyers-sort';

function BuyersCrmContent() {
  const searchParams = useSearchParams();
  const prefillName = searchParams.get('prefillName') || '';
  const prefillEmail = searchParams.get('prefillEmail') || '';
  const prefillPhone = searchParams.get('prefillPhone') || '';
  const prefillNotes = searchParams.get('prefillNotes') || '';

  const { buyers, properties } = useNellimoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<AcquereursSortOption>('matching_desc');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedBuyerForSelection, setSelectedBuyerForSelection] = useState<Buyer | null>(null);
  const [broadcastPropertyId, setBroadcastPropertyId] = useState<string>(properties[0]?.id || '');

  const {
    isNewModalOpen,
    setIsNewModalOpen,
    form,
    handleFieldChange,
    handleCreateBuyer,
  } = useNewBuyerForm({
    prefillName,
    prefillEmail,
    prefillPhone,
    prefillNotes,
  });

  const activeProperties = useMemo(
    () => properties.filter((p) => p.status === 'actif'),
    [properties]
  );

  const filteredAndSortedBuyers = useMemo(() => {
    const filtered = filterBuyers(buyers, searchQuery, statusFilter);
    return sortBuyers(filtered, sortBy, activeProperties);
  }, [buyers, searchQuery, statusFilter, sortBy, activeProperties]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <AcquereursHeader
        buyerCount={buyers.length}
        onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
        onOpenNewBuyer={() => setIsNewModalOpen(true)}
      />

      <AcquereursFilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={buyers.length}
        filteredCount={filteredAndSortedBuyers.length}
      />

      {viewMode === 'grid' ? (
        <BuyersGrid
          buyers={filteredAndSortedBuyers}
          activeProperties={activeProperties}
          onOpenSelection={setSelectedBuyerForSelection}
        />
      ) : (
        <BuyersTable
          buyers={filteredAndSortedBuyers}
          activeProperties={activeProperties}
          onOpenSelection={setSelectedBuyerForSelection}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      <NewBuyerModal
        isOpen={isNewModalOpen}
        form={form}
        onFieldChange={handleFieldChange}
        onSubmit={handleCreateBuyer}
        onClose={() => setIsNewModalOpen(false)}
      />

      <BroadcastCampaignModal
        isOpen={isBroadcastModalOpen}
        buyers={buyers}
        properties={properties}
        activeProperties={activeProperties}
        broadcastPropertyId={broadcastPropertyId}
        onPropertyChange={setBroadcastPropertyId}
        onClose={() => setIsBroadcastModalOpen(false)}
      />

      {selectedBuyerForSelection && (
        <BuyerSelectionModal
          buyer={selectedBuyerForSelection}
          activeProperties={activeProperties}
          onClose={() => setSelectedBuyerForSelection(null)}
        />
      )}
    </div>
  );
}

export default function BuyersCrmPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-400">
          Chargement du CRM acquéreurs...
        </div>
      }
    >
      <BuyersCrmContent />
    </Suspense>
  );
}
