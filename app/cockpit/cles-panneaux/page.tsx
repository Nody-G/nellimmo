'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { AgencyKey, KeyLoanRecord } from '@/lib/types';
import {
  KeyRound,
  ShieldCheck,
  Plus,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Building,
  FileText
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { KeyInventoryTable } from '@/components/cockpit/cles-panneaux/KeyInventoryTable';
import { KeyLoanModal } from '@/components/cockpit/cles-panneaux/KeyLoanModal';
import { KeyFormModal } from '@/components/cockpit/cles-panneaux/KeyFormModal';
import { SignboardGrid } from '@/components/cockpit/cles-panneaux/SignboardGrid';
import { SignboardFormModal } from '@/components/cockpit/cles-panneaux/SignboardFormModal';
import { DischargePrintModal } from '@/components/cockpit/cles-panneaux/DischargePrintModal';
import { KeyLoanHistoryTable } from '@/components/cockpit/cles-panneaux/KeyLoanHistoryTable';

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
    updateSignboard
  } = useNellimoStore();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'armoire' | 'panneaux' | 'historique'>('armoire');
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

  // Key stats
  const totalKeys = keys.length;
  const availableKeys = keys.filter((k) => k.status === 'disponible').length;
  const borrowedKeys = keys.filter((k) => k.status === 'prete').length;
  const installedSignboards = signboards.filter((s) => s.status === 'pose').length;
  const toRemoveSignboards = signboards.filter((s) => s.status === 'a_deposer').length;
  const inStockSignboards = signboards.filter((s) => s.status === 'en_stock').length;

  const handleReturnKey = async (key: AgencyKey) => {
    await returnKey(key.id);
    showToast(`Trousseau #${key.keyring_number} restitué à l'agence avec succès !`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <KeyRound className="w-4 h-4" />
            <span>Sécurité & Logistique Agence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Registre des Clés & Parc de Panneaux
          </h1>
          <p className="text-xs text-gray-500">
            Armoire à clés officielle, émargement tactile des décharges de prêts et suivi de dépose légale Loi Grenelle II.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewKeyModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouveau Trousseau
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsNewSignboardModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-[#C59A45]" />}
          >
            Nouveau Panneau
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              En Armoire à l&apos;Agence
            </span>
            <span className="text-2xl font-serif font-black text-emerald-700 mt-1 block">
              {availableKeys} <span className="text-xs font-sans font-medium text-gray-400">/ {totalKeys} clés</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Prêtes pour visites
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              Trousseaux Sortis (Prêtés)
            </span>
            <span className="text-2xl font-serif font-black text-amber-700 mt-1 block">
              {borrowedKeys}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Artisans & diagnostiqueurs
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              Panneaux Posés
            </span>
            <span className="text-2xl font-serif font-black text-[#131B26] mt-1 block">
              {installedSignboards} <span className="text-xs font-sans font-medium text-gray-400">sur le terrain</span>
            </span>
            <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
              {inStockSignboards} panneaux disponibles en réserve
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E12B7B] flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F3E8EE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block tracking-wider">
              Déposes Légales Requises
            </span>
            <span className="text-2xl font-serif font-black text-rose-600 mt-1 block">
              {toRemoveSignboards}
            </span>
            <span className="text-[11px] text-rose-500 font-bold mt-0.5 block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Loi Grenelle II (3 mois max)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('armoire')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'armoire'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Armoire à Clés Virtuelle ({keys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('panneaux')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'panneaux'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Parc de Panneaux ({signboards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('historique')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'historique'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Registre & Décharges de Prêt</span>
        </button>
      </div>

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

      {/* Modal Emprunt Clé avec Signature Tactile */}
      <KeyLoanModal
        isOpen={isBorrowModalOpen}
        onClose={() => {
          setIsBorrowModalOpen(false);
          setSelectedKeyForBorrow(null);
        }}
        selectedKey={selectedKeyForBorrow}
        properties={properties}
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
            discharged: true
          });
          showToast(`Trousseau #${selectedKeyForBorrow.keyring_number} confié à ${borrowData.borrowerName}`, 'success');
        }}
      />

      {/* Modal Nouveau Trousseau */}
      <KeyFormModal
        isOpen={isNewKeyModalOpen}
        onClose={() => setIsNewKeyModalOpen(false)}
        properties={properties}
        keys={keys}
        onCreateKey={async (data) => {
          await createKey(data);
          showToast(`Trousseau #${data.keyring_number} enregistré dans l'armoire !`, 'success');
        }}
      />

      {/* Modal Nouveau Panneau */}
      <SignboardFormModal
        isOpen={isNewSignboardModalOpen}
        onClose={() => setIsNewSignboardModalOpen(false)}
        properties={properties}
        onCreateSignboard={async (data) => {
          await createSignboard(data);
          showToast('Panneau ajouté au parc d\'agence !', 'success');
        }}
      />

      {/* Modal Récépissé Imprimable de Décharge */}
      <DischargePrintModal
        isOpen={isDischargePrintModalOpen}
        onClose={() => {
          setIsDischargePrintModalOpen(false);
          setSelectedLoanForPrint(null);
        }}
        selectedRecord={selectedLoanForPrint}
        properties={properties}
        settings={settings}
      />
    </div>
  );
}
