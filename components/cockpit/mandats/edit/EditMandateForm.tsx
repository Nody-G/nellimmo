'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateFinancials, getDpeLetterFromValue, getGesLetterFromValue } from '@/lib/hoguet';
import { Property, MandateType, FeesPaidBy, PropertyStatus, PropertyImage } from '@/lib/types';
import { Save } from 'lucide-react';
import {
  EditGeneralSection,
  EditPricingSection,
  EditSpecsSection,
  EditDpeMediaSection,
} from '@/components/cockpit/mandats/edit';

interface EditMandateFormProps {
  property: Property;
  onSave: (updates: Partial<Property>) => Promise<void>;
}

export function EditMandateForm({ property, onSave }: EditMandateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(property.title);
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [mandateType, setMandateType] = useState<MandateType>(property.mandate_type);
  const [priceNetSeller, setPriceNetSeller] = useState<number>(property.price_net_seller);
  const [agencyFeesPercentage, setAgencyFeesPercentage] = useState<number>(property.agency_fees_percentage);
  const [agencyFeesAmount, setAgencyFeesAmount] = useState<number>(property.agency_fees_amount);
  const [feesPaidBy, setFeesPaidBy] = useState<FeesPaidBy>(property.fees_paid_by);
  const [livingArea, setLivingArea] = useState<number>(property.living_area);
  const [carrezArea, setCarrezArea] = useState<number>(property.carrez_area || property.living_area);
  const [landArea, setLandArea] = useState<number>(property.land_area || 0);
  const [roomsCount, setRoomsCount] = useState<number>(property.rooms_count);
  const [bedroomsCount, setBedroomsCount] = useState<number>(property.bedrooms_count);
  const [dpeValue, setDpeValue] = useState<number>(property.dpe_value || 0);
  const [gesValue, setGesValue] = useState<number>(property.ges_value || 0);
  const [description, setDescription] = useState(property.description);
  const [featuresInput, setFeaturesInput] = useState(property.features.join(', '));
  const [videoUrl, setVideoUrl] = useState(property.video_url || '');
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtual_tour_url || '');
  const [images] = useState<PropertyImage[]>(property.images || []);

  const financials = calculateFinancials({
    priceNetSeller,
    agencyFeesPercentage,
    agencyFeesAmount,
    feesPaidBy,
  });

  const handlePriceNetChange = (val: number) => {
    setPriceNetSeller(val);
    const amount = Math.round((val * agencyFeesPercentage) / 100);
    setAgencyFeesAmount(amount);
  };

  const handleFeesPercentChange = (val: number) => {
    setAgencyFeesPercentage(val);
    const amount = Math.round((priceNetSeller * val) / 100);
    setAgencyFeesAmount(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const featuresList = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      await onSave({
        title,
        status,
        mandate_type: mandateType,
        price_fai: financials.priceFai,
        price_net_seller: priceNetSeller,
        agency_fees_amount: financials.agencyFeesAmount,
        agency_fees_percentage: financials.agencyFeesPercentage,
        fees_paid_by: feesPaidBy,
        living_area: livingArea,
        carrez_area: carrezArea,
        land_area: landArea,
        rooms_count: roomsCount,
        bedrooms_count: bedroomsCount,
        dpe_value: dpeValue,
        dpe_letter: getDpeLetterFromValue(dpeValue),
        ges_value: gesValue,
        ges_letter: getGesLetterFromValue(gesValue),
        description,
        features: featuresList,
        video_url: videoUrl || undefined,
        virtual_tour_url: virtualTourUrl || undefined,
        images,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EditGeneralSection
        title={title}
        onTitleChange={setTitle}
        mandateType={mandateType}
        onMandateTypeChange={setMandateType}
        status={status}
        onStatusChange={setStatus}
      />

      <EditPricingSection
        priceNetSeller={priceNetSeller}
        onPriceNetChange={handlePriceNetChange}
        agencyFeesPercentage={agencyFeesPercentage}
        onFeesPercentChange={handleFeesPercentChange}
        feesPaidBy={feesPaidBy}
        onFeesPaidByChange={setFeesPaidBy}
        financials={financials}
      />

      <EditSpecsSection
        livingArea={livingArea}
        onLivingAreaChange={setLivingArea}
        carrezArea={carrezArea}
        onCarrezAreaChange={setCarrezArea}
        landArea={landArea}
        onLandAreaChange={setLandArea}
        roomsCount={roomsCount}
        onRoomsCountChange={setRoomsCount}
        bedroomsCount={bedroomsCount}
        onBedroomsCountChange={setBedroomsCount}
        featuresInput={featuresInput}
        onFeaturesInputChange={setFeaturesInput}
      />

      <EditDpeMediaSection
        dpeValue={dpeValue}
        onDpeValueChange={setDpeValue}
        gesValue={gesValue}
        onGesValueChange={setGesValue}
        description={description}
        onDescriptionChange={setDescription}
        videoUrl={videoUrl}
        onVideoUrlChange={setVideoUrl}
        virtualTourUrl={virtualTourUrl}
        onVirtualTourUrlChange={setVirtualTourUrl}
      />

      <div className="flex justify-between items-center pt-4">
        <Link
          href={`/cockpit/mandats/${property.id}`}
          className="px-5 py-3 bg-gray-100 rounded-xl text-xs font-bold uppercase text-gray-700 hover:bg-gray-200 transition"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les Modifications'}
        </button>
      </div>
    </form>
  );
}
