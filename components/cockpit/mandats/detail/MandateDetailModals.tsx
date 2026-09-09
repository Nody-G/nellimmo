'use client';

import React from 'react';
import type { Property, AgencySettings, SignatureCertificate } from '@/lib/types';
import { ElectronicSignatureModal } from '@/components/cockpit/ElectronicSignatureModal';
import { MandateAvenantModal } from '@/components/cockpit/MandateAvenantModal';
import { MandateLegalContractModal } from './MandateLegalContractModal';
import { PropertyShareModal } from '@/components/cockpit/mandats/PropertyShareModal';
import { VendorWeeklyDigestModal } from '@/components/cockpit/mandats/VendorWeeklyDigestModal';
import { MandateLaunchPackModal } from '@/components/cockpit/mandats/MandateLaunchPackModal';
import { MonthlyVendorReportModal } from '@/components/cockpit/mandats/MonthlyVendorReportModal';

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

  isShareModalOpen: boolean;
  onCloseShareModal: () => void;

  isWeeklyDigestOpen: boolean;
  onCloseWeeklyDigest: () => void;

  isLaunchPackOpen?: boolean;
  onCloseLaunchPack?: () => void;

  isMonthlyReportOpen?: boolean;
  onCloseMonthlyReport?: () => void;
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
  isShareModalOpen,
  onCloseShareModal,
  isWeeklyDigestOpen,
  onCloseWeeklyDigest,
  isLaunchPackOpen = false,
  onCloseLaunchPack = () => {},
  isMonthlyReportOpen = false,
  onCloseMonthlyReport = () => {},
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

      <PropertyShareModal
        isOpen={isShareModalOpen}
        onClose={onCloseShareModal}
        property={property}
      />

      <VendorWeeklyDigestModal
        isOpen={isWeeklyDigestOpen}
        onClose={onCloseWeeklyDigest}
        property={property}
      />

      <MandateLaunchPackModal
        isOpen={isLaunchPackOpen}
        onClose={onCloseLaunchPack}
        property={property}
      />

      <MonthlyVendorReportModal
        isOpen={isMonthlyReportOpen}
        onClose={onCloseMonthlyReport}
        property={property}
      />
    </>
  );
}
