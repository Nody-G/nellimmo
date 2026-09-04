'use client';

import React from 'react';
import type { Property, AgencySettings, SignatureCertificate } from '@/lib/types';
import { ElectronicSignatureModal } from '@/components/cockpit/ElectronicSignatureModal';
import { MandateAvenantModal } from '@/components/cockpit/MandateAvenantModal';
import { MandateLegalContractModal } from './MandateLegalContractModal';

interface MandateDetailModalsProps {
  property: Property;
  settings: AgencySettings;
  isSignatureModalOpen: boolean;
  onCloseSignatureModal: () => void;
  onSigned: (signatureCert: SignatureCertificate) => Promise<void>;

  isAvenantModalOpen: boolean;
  onCloseAvenantModal: () => void;

  isContractModalOpen: boolean;
  onCloseContractModal: () => void;
}

export function MandateDetailModals({
  property,
  settings,
  isSignatureModalOpen,
  onCloseSignatureModal,
  onSigned,
  isAvenantModalOpen,
  onCloseAvenantModal,
  isContractModalOpen,
  onCloseContractModal,
}: MandateDetailModalsProps) {
  return (
    <>
      <ElectronicSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={onCloseSignatureModal}
        property={property}
        settings={settings}
        onSigned={onSigned}
      />

      <MandateAvenantModal
        isOpen={isAvenantModalOpen}
        onClose={onCloseAvenantModal}
        property={property}
      />

      {isContractModalOpen && (
        <MandateLegalContractModal
          property={property}
          onClose={onCloseContractModal}
        />
      )}
    </>
  );
}
