'use client';

import React, { useState } from 'react';
import { Property, AvenantType } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { AvenantHeader } from './mandate-avenant/AvenantHeader';
import { AvenantForm } from './mandate-avenant/AvenantForm';
import { AvenantPreviewActe } from './mandate-avenant/AvenantPreviewActe';
import {
  computeAvenantDefaults,
  computeFeesFromPrice,
  computeNetSeller,
  computeFeesPercentage,
  buildAvenantPayload,
} from './mandate-avenant/avenant-types';

interface MandateAvenantModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function MandateAvenantModal({ property, isOpen, onClose }: MandateAvenantModalProps) {
  const { settings, avenants, createMandateAvenant } = useNellimoStore();
  const { showToast } = useToast();

  const currentMandateAvenants = avenants.filter((a) => a.mandate_number === property.mandate_number);
  const nextAvenantNumber = currentMandateAvenants.length + 1;

  const defaults = computeAvenantDefaults(property);

  const [avenantType, setAvenantType] = useState<AvenantType>('baisse_prix');
  const [newPriceFai, setNewPriceFai] = useState<number>(defaults.newPriceFai);
  const [newFeesAmount, setNewFeesAmount] = useState<number>(defaults.newFeesAmount);
  const [newEndDate, setNewEndDate] = useState<string>(defaults.newEndDate);
  const [reason, setReason] = useState(
    'Repositionnement stratégique face à la concurrence et dynamisation des offres suite aux bilans de visites.'
  );
  const [previewMode, setPreviewMode] = useState(false);

  if (!isOpen) return null;

  const newNetSeller = computeNetSeller(newPriceFai, newFeesAmount);
  const newFeesPercentage = computeFeesPercentage(newFeesAmount, newPriceFai);

  const handlePriceChange = (val: number) => {
    setNewPriceFai(val);
    // Recalcul automatique des honoraires selon le barème d'agence
    setNewFeesAmount(computeFeesFromPrice(val, property.agency_fees_percentage));
  };

  const handleSaveAvenant = async () => {
    if (newPriceFai <= 0 && avenantType === 'baisse_prix') {
      showToast('Le nouveau prix doit être supérieur à zéro.', 'error');
      return;
    }

    const payload = buildAvenantPayload({
      property,
      avenantType,
      newPriceFai,
      newFeesAmount,
      newNetSeller,
      newEndDate,
      reason,
      avenantNumber: nextAvenantNumber,
    });

    await createMandateAvenant(payload);

    showToast(`Avenant N°${nextAvenantNumber} scellé et enregistré avec succès !`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
        <AvenantHeader property={property} onClose={onClose} />

        {!previewMode ? (
          <AvenantForm
            property={property}
            avenantType={avenantType}
            newPriceFai={newPriceFai}
            newFeesAmount={newFeesAmount}
            newNetSeller={newNetSeller}
            newFeesPercentage={newFeesPercentage}
            newEndDate={newEndDate}
            reason={reason}
            onTypeChange={setAvenantType}
            onPriceChange={handlePriceChange}
            onFeesChange={setNewFeesAmount}
            onEndDateChange={setNewEndDate}
            onReasonChange={setReason}
            onPreview={() => setPreviewMode(true)}
            onSave={handleSaveAvenant}
          />
        ) : (
          <AvenantPreviewActe
            property={property}
            avenantType={avenantType}
            newPriceFai={newPriceFai}
            newFeesAmount={newFeesAmount}
            newNetSeller={newNetSeller}
            newFeesPercentage={newFeesPercentage}
            newEndDate={newEndDate}
            reason={reason}
            avenantNumber={nextAvenantNumber}
            agentName={settings.agent_name}
            onBack={() => setPreviewMode(false)}
            onSave={handleSaveAvenant}
          />
        )}
      </div>
    </div>
  );
}
