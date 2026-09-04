'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { AgencyKey, KeyLoanRecord } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import {
  ClesPanneauxHeader,
  ClesPanneauxStats,
  ClesPanneauxTabs,
  ClesPanneauxTab,
  ClesPanneauxModals,
  KeyInventoryTable,
  SignboardGrid,
  KeyLoanHistoryTable,
} from '@/components/cockpit/cles-panneaux';

export default function KeysAndSignboardsPage() {
  const {
    keys,
    signboards,
    properties,
    settings,
    createKey,
    borrowKey,
    returnKey,
    createSignboard,
    updateSignboard,
  } = useNellimoStore();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ClesPanneauxTab>('armoire');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');

  // Modals state
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedKeyForBorrow, setSelectedKeyForBorrow] = useState<AgencyKey | null>(null);
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [isNewSignboardModalOpen, setIsNewSignboardModalOpen] = useState(false);
  const [isDischargePrintModalOpen, setIsDischargePrintModalOpen] = useState(false);
  const [selectedLoanForPrint, setSelectedLoanForPrint] = useState<{
    key: AgencyKey;
    loan: KeyLoanRecord;
  } | null>(null);

  const handleReturnKey = async (key: AgencyKey) => {
    await returnKey(key.id);
    showToast(`Trousseau #${key.keyring_number} restitué à l’agence avec succès !`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Header */}
      <ClesPanneauxHeader
        onNewKey={() => setIsNewKeyModalOpen(true)}
        onNewSignboard={() => setIsNewSignboardModalOpen(true)}
      />

      {/* KPI Cards */}
      <ClesPanneauxStats
        totalKeys={keys.length}
        availableKeys={keys.filter((k) => k.status === 'disponible').length}
        borrowedKeys={keys.filter((k) => k.status === 'prete').length}
        installedSignboards={signboards.filter((s) => s.status === 'pose').length}
        inStockSignboards={signboards.filter((s) => s.status === 'en_stock').length}
        toRemoveSignboards={signboards.filter((s) => s.status === 'a_deposer').length}
      />

      {/* Tabs */}
      <ClesPanneauxTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        keysCount={keys.length}
        signboardsCount={signboards.length}
      />

      {/* Tab 1 : Armoire à clés */}
      {activeTab === 'armoire' && (
        <KeyInventoryTable
          keys={keys}
          properties={properties}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onBorrowKey={(key) => {
            setSelectedKeyForBorrow(key);
            setIsBorrowModalOpen(true);
          }}
          onReturnKey={handleReturnKey}
          onPrintDischarge={(key) => {
            if (key.current_borrower) {
              setSelectedLoanForPrint({ key, loan: key.current_borrower });
              setIsDischargePrintModalOpen(true);
            }
          }}
        />
      )}

      {/* Tab 2 : Parc de panneaux */}
      {activeTab === 'panneaux' && (
        <SignboardGrid
          signboards={signboards}
          properties={properties}
          onUpdateStatus={async (id, updates) => {
            await updateSignboard(id, updates);
            showToast('Statut du panneau mis à jour avec succès.', 'success');
          }}
        />
      )}

      {/* Tab 3 : Registre & Historique */}
      {activeTab === 'historique' && (
        <KeyLoanHistoryTable
          keys={keys}
          properties={properties}
          onPrintDischarge={(key, loan) => {
            setSelectedLoanForPrint({ key, loan });
            setIsDischargePrintModalOpen(true);
          }}
        />
      )}

      {/* Modals Container */}
      <ClesPanneauxModals
        isBorrowModalOpen={isBorrowModalOpen}
        onCloseBorrowModal={() => {
          setIsBorrowModalOpen(false);
          setSelectedKeyForBorrow(null);
        }}
        selectedKeyForBorrow={selectedKeyForBorrow}
        onConfirmBorrow={async (borrowData) => {
          if (!selectedKeyForBorrow) return;
          await borrowKey(selectedKeyForBorrow.id, {
            key_id: selectedKeyForBorrow.id,
            borrower_name: borrowData.borrowerName,
            borrower_phone: borrowData.borrowerPhone,
            borrower_company: borrowData.borrowerCompany,
            borrower_role: borrowData.borrowerRole,
            borrowed_at: new Date().toISOString(),
            expected_return_at: new Date(borrowData.expectedReturnDate).toISOString(),
            purpose: borrowData.loanPurpose,
            signature_data_url: borrowData.signatureUrl,
            discharged: true,
          });
          showToast(`Trousseau #${selectedKeyForBorrow.keyring_number} confié à ${borrowData.borrowerName}`, 'success');
        }}
        isNewKeyModalOpen={isNewKeyModalOpen}
        onCloseNewKeyModal={() => setIsNewKeyModalOpen(false)}
        onCreateKey={async (data) => {
          await createKey(data);
          showToast(`Trousseau #${data.keyring_number} enregistré dans l’armoire !`, 'success');
        }}
        isNewSignboardModalOpen={isNewSignboardModalOpen}
        onCloseNewSignboardModal={() => setIsNewSignboardModalOpen(false)}
        onCreateSignboard={async (data) => {
          await createSignboard(data);
          showToast('Panneau ajouté au parc d’agence !', 'success');
        }}
        isDischargePrintModalOpen={isDischargePrintModalOpen}
        onCloseDischargePrintModal={() => {
          setIsDischargePrintModalOpen(false);
          setSelectedLoanForPrint(null);
        }}
        selectedLoanForPrint={selectedLoanForPrint}
        properties={properties}
        keys={keys}
        settings={settings}
      />
    </div>
  );
}
