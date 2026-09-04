'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/public-store';
import { PropertyType } from '@/lib/types';
import {
  EstimationHeader,
  EstimationStepSpecs,
  EstimationStepContact,
  EstimationBenefitsSidebar,
  EstimationSuccessScreen,
} from '@/components/public/estimation';

export default function PublicEstimationPage() {
  const { addEstimationLead } = useNellimoStore();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: 'maison' as PropertyType,
    city: 'Pélissanne',
    address: '',
    livingArea: '',
    landArea: '',
    roomsCount: '',
    hasPool: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEstimationLead({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      property_type: formData.propertyType,
      city: formData.city,
      address: formData.address,
      living_area: Number(formData.livingArea) || 0,
      land_area: formData.landArea ? Number(formData.landArea) : undefined,
      rooms_count: formData.roomsCount ? Number(formData.roomsCount) : undefined,
      has_pool: formData.hasPool,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <EstimationHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-[#F3E8EE] shadow-xl space-y-6">
          {isSubmitted ? (
            <EstimationSuccessScreen
              firstName={formData.firstName}
              lastName={formData.lastName}
              city={formData.city}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-4 text-xs font-bold">
                <span className={step === 1 ? 'text-[#E12B7B]' : 'text-gray-400'}>
                  1. Caractéristiques du Bien
                </span>
                <span>→</span>
                <span className={step === 2 ? 'text-[#E12B7B]' : 'text-gray-400'}>
                  2. Vos Coordonnées
                </span>
              </div>

              {step === 1 ? (
                <EstimationStepSpecs
                  formData={formData}
                  onChange={updateField}
                  onNext={() => setStep(2)}
                />
              ) : (
                <EstimationStepContact
                  formData={formData}
                  onChange={updateField}
                  onBack={() => setStep(1)}
                />
              )}
            </form>
          )}
        </div>

        <EstimationBenefitsSidebar />
      </div>
    </div>
  );
}
