'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import type { Buyer, FinancingStatus } from '@/lib/types';
import { NotaryFinanceCalculator } from '@/components/cockpit/NotaryFinanceCalculator';
import { filterBuyers } from '@/components/cockpit/acquereurs/acquereurs-types';
import { AcquereursHeader } from '@/components/cockpit/acquereurs/AcquereursHeader';
import { LoanSimulator } from '@/components/cockpit/acquereurs/LoanSimulator';
import { AcquereursFilterBar } from '@/components/cockpit/acquereurs/AcquereursFilterBar';
import { BuyersGrid } from '@/components/cockpit/acquereurs/BuyersGrid';
import { NewBuyerModal } from '@/components/cockpit/acquereurs/NewBuyerModal';
import { BroadcastCampaignModal } from '@/components/cockpit/acquereurs/BroadcastCampaignModal';
import { BuyerSelectionModal } from '@/components/cockpit/acquereurs/BuyerSelectionModal';

interface NewBuyerFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  budgetMax: number;
  minSurface: number;
  minRooms: number;
  minBedrooms: number;
  targetCities: string;
  mustHaveGarden: boolean;
  mustHaveGarage: boolean;
  financingStatus: FinancingStatus;
  notes: string;
}

const INITIAL_FORM: NewBuyerFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  budgetMax: 550000,
  minSurface: 120,
  minRooms: 4,
  minBedrooms: 3,
  targetCities: 'Pélissanne, Lambesc',
  mustHaveGarden: true,
  mustHaveGarage: false,
  financingStatus: 'accord_bancaire_valide',
  notes: '',
};

export default function BuyersCrmPage() {
  const { buyers, properties, createBuyer } = useNellimoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoanSimulatorOpen, setIsLoanSimulatorOpen] = useState(false);
  const [isNotaryCalcOpen, setIsNotaryCalcOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedBuyerForSelection, setSelectedBuyerForSelection] = useState<Buyer | null>(null);
  const [form, setForm] = useState<NewBuyerFormState>(INITIAL_FORM);
  const [broadcastPropertyId, setBroadcastPropertyId] = useState<string>(properties[0]?.id || '');

  const activeProperties = properties.filter((p) => p.status === 'actif');
  const filteredBuyers = filterBuyers(buyers, searchQuery, statusFilter);

  const handleFieldChange = <K extends keyof NewBuyerFormState>(
    field: K,
    value: NewBuyerFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    const citiesList = form.targetCities
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    createBuyer({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      status: 'actif',
      budget_max: form.budgetMax,
      min_surface: form.minSurface,
      min_rooms: form.minRooms,
      min_bedrooms: form.minBedrooms,
      target_property_types: ['maison'],
      target_cities: citiesList,
      must_have_garden: form.mustHaveGarden,
      must_have_garage: form.mustHaveGarage,
      financing_status: form.financingStatus,
      notes: form.notes,
    });

    setIsNewModalOpen(false);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
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
