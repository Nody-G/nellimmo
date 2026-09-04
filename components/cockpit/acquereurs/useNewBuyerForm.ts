'use client';

import { useState } from 'react';
import type { FinancingStatus } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';

export interface NewBuyerFormState {
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

export const INITIAL_BUYER_FORM: NewBuyerFormState = {
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

interface UseNewBuyerFormProps {
  prefillName: string;
  prefillEmail: string;
  prefillPhone: string;
  prefillNotes: string;
}

export function useNewBuyerForm({
  prefillName,
  prefillEmail,
  prefillPhone,
  prefillNotes,
}: UseNewBuyerFormProps) {
  const { createBuyer } = useNellimoStore();
  const [isNewModalOpen, setIsNewModalOpen] = useState(() => Boolean(prefillName || prefillPhone));

  const [form, setForm] = useState<NewBuyerFormState>(() => {
    const nameParts = prefillName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return {
      ...INITIAL_BUYER_FORM,
      firstName,
      lastName,
      email: prefillEmail,
      phone: prefillPhone,
      notes: prefillNotes ? `Demande initiale : ${prefillNotes}` : '',
    };
  });

  const handleFieldChange = <K extends keyof NewBuyerFormState>(
    field: K,
    value: NewBuyerFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      target_property_types: ['maison', 'appartement'],
      target_cities: citiesList.length > 0 ? citiesList : ['Pélissanne'],
      must_have_garden: form.mustHaveGarden,
      must_have_garage: form.mustHaveGarage,
      financing_status: form.financingStatus,
      notes: form.notes,
    });

    setIsNewModalOpen(false);
    setForm(INITIAL_BUYER_FORM);
  };

  return {
    isNewModalOpen,
    setIsNewModalOpen,
    form,
    handleFieldChange,
    handleCreateBuyer,
  };
}
