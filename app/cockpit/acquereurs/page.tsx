'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import type { Buyer } from '@/lib/types';
import { NotaryFinanceCalculator } from '@/components/cockpit/NotaryFinanceCalculator';
import {
  filterBuyers,
  AcquereursHeader,
  LoanSimulator,
  AcquereursFilterBar,
  BuyersGrid,
  NewBuyerModal,
  BroadcastCampaignModal,
  BuyerSelectionModal,
  useNewBuyerForm,
} from '@/components/cockpit/acquereurs';

function BuyersCrmContent() {
  const searchParams = useSearchParams();
  const prefillName = searchParams.get('prefillName') || '';
  const prefillEmail = searchParams.get('prefillEmail') || '';
  const prefillPhone = searchParams.get('prefillPhone') || '';
  const prefillNotes = searchParams.get('prefillNotes') || '';

  const { buyers, properties } = useNellimoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoanSimulatorOpen, setIsLoanSimulatorOpen] = useState(false);
  const [isNotaryCalcOpen, setIsNotaryCalcOpen] = useState(false);
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

  const activeProperties = properties.filter((p) => p.status === 'actif');
  const filteredBuyers = useMemo(
    () => filterBuyers(buyers, searchQuery, statusFilter),
    [buyers, searchQuery, statusFilter]
  );

  const toggleNotaryCalc = () => {
    setIsNotaryCalcOpen((open) => {
      if (!open) setIsLoanSimulatorOpen(false);
      return !open;
    });
  };

  const toggleLoanSimulator = () => {
    setIsLoanSimulatorOpen((open) => {
      if (!open) setIsNotaryCalcOpen(false);
      return !open;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <AcquereursHeader
        buyerCount={buyers.length}
        isNotaryCalcOpen={isNotaryCalcOpen}
        isLoanSimulatorOpen={isLoanSimulatorOpen}
        onToggleNotaryCalc={toggleNotaryCalc}
        onToggleLoanSimulator={toggleLoanSimulator}
        onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
        onOpenNewBuyer={() => setIsNewModalOpen(true)}
      />

      {isLoanSimulatorOpen && <LoanSimulator isOpen onClose={() => setIsLoanSimulatorOpen(false)} />}

      {isNotaryCalcOpen && (
        <div className="animate-fade-in">
          <NotaryFinanceCalculator />
        </div>
      )}

      <AcquereursFilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
      />

      <BuyersGrid
        buyers={filteredBuyers}
        activeProperties={activeProperties}
        onOpenSelection={setSelectedBuyerForSelection}
      />

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
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Chargement de la base acquéreurs...</div>}>
      <BuyersCrmContent />
    </Suspense>
  );
}
