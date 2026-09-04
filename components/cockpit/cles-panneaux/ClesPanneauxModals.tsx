'use client';

import React from 'react';
import {
  AgencyKey,
  KeyLoanRecord,
  Property,
  AgencySettings,
  AgencySignboard,
  KeyBorrowerRole,
} from '@/lib/types';
import { KeyLoanModal } from './KeyLoanModal';
import { KeyFormModal } from './KeyFormModal';
import { SignboardFormModal } from './SignboardFormModal';
import { DischargePrintModal } from './DischargePrintModal';

interface ClesPanneauxModalsProps {
  isBorrowModalOpen: boolean;
  onCloseBorrowModal: () => void;
  selectedKeyForBorrow: AgencyKey | null;
  onConfirmBorrow: (data: {
    borrowerName: string;
    borrowerPhone: string;
    borrowerCompany?: string;
    borrowerRole: KeyBorrowerRole;
    loanPurpose: string;
    expectedReturnDate: string;
    signatureUrl?: string;
  }) => Promise<void>;

  isNewKeyModalOpen: boolean;
  onCloseNewKeyModal: () => void;
  onCreateKey: (data: Omit<AgencyKey, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;

  isNewSignboardModalOpen: boolean;
  onCloseNewSignboardModal: () => void;
  onCreateSignboard: (data: Omit<AgencySignboard, 'id' | 'created_at'>) => Promise<void>;

  isDischargePrintModalOpen: boolean;
  onCloseDischargePrintModal: () => void;
  selectedLoanForPrint: { key: AgencyKey; loan: KeyLoanRecord } | null;

  properties: Property[];
  keys: AgencyKey[];
  settings: AgencySettings;
}

export function ClesPanneauxModals({
  isBorrowModalOpen,
  onCloseBorrowModal,
  selectedKeyForBorrow,
  onConfirmBorrow,
  isNewKeyModalOpen,
  onCloseNewKeyModal,
  onCreateKey,
  isNewSignboardModalOpen,
  onCloseNewSignboardModal,
  onCreateSignboard,
  isDischargePrintModalOpen,
  onCloseDischargePrintModal,
  selectedLoanForPrint,
  properties,
  keys,
  settings,
}: ClesPanneauxModalsProps) {
  return (
    <>
      <KeyLoanModal
        isOpen={isBorrowModalOpen}
        onClose={onCloseBorrowModal}
        selectedKey={selectedKeyForBorrow}
        properties={properties}
        onConfirmBorrow={onConfirmBorrow}
      />

      <KeyFormModal
        isOpen={isNewKeyModalOpen}
        onClose={onCloseNewKeyModal}
        properties={properties}
        keys={keys}
        onCreateKey={onCreateKey}
      />

      <SignboardFormModal
        isOpen={isNewSignboardModalOpen}
        onClose={onCloseNewSignboardModal}
        properties={properties}
        onCreateSignboard={onCreateSignboard}
      />

      <DischargePrintModal
        isOpen={isDischargePrintModalOpen}
        onClose={onCloseDischargePrintModal}
        selectedRecord={selectedLoanForPrint}
        properties={properties}
        settings={settings}
      />
    </>
  );
}
