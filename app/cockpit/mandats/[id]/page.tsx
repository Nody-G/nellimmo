'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { PropertyStatus } from '@/lib/types';
import { calculateMatchingScore } from '@/lib/hoguet';
import {
  FileText,
  FileCheck2,
  Users,
  Radio,
  Sparkles,
  Lock
} from 'lucide-react';
import { AlurGedManager } from '@/components/cockpit/AlurGedManager';
import { ElectronicSignatureModal } from '@/components/cockpit/ElectronicSignatureModal';
import { MandateAvenantModal } from '@/components/cockpit/MandateAvenantModal';
import { MandateLegalContractModal } from '@/components/cockpit/mandats/detail/MandateLegalContractModal';
import { MandateDetailHeader } from '@/components/cockpit/mandats/detail/MandateDetailHeader';
import { MandateOverviewTab } from '@/components/cockpit/mandats/detail/MandateOverviewTab';
import { MandateAuditTab } from '@/components/cockpit/mandats/detail/MandateAuditTab';
import { MandatePortalsTab } from '@/components/cockpit/mandats/detail/MandatePortalsTab';
import { MandateMatchingTab } from '@/components/cockpit/mandats/detail/MandateMatchingTab';
import { MandateCopywritingTab } from '@/components/cockpit/mandats/detail/MandateCopywritingTab';
import { useToast } from '@/components/ui/Toast';

export default function MandateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {
    properties,
    buyers,
    auditLogs,
    settings,
    updateProperty,
    proposals,
    createProposal,
    updateProposalStatus
  } = useNellimoStore();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'details' | 'alur_ged' | 'signature' | 'crm' | 'copywriting' | 'poliris' | 'audit'
  >('details');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isAvenantModalOpen, setIsAvenantModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const property = properties.find((p) => p.id === resolvedParams.id);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Mandat introuvable</h2>
        <Link href="/cockpit/mandats" className="text-xs font-bold text-[#E12B7B] underline">
          Retour au registre des mandats
        </Link>
      </div>
    );
  }

  const mandateLogs = auditLogs.filter((log) => log.mandate_number === property.mandate_number);

  // CRM Matching calculation
  const matchedBuyers = buyers
    .map((buyer) => {
      const match = calculateMatchingScore(property, buyer);
      return { buyer, ...match };
    })
    .sort((a, b) => b.score - a.score);

  const handleStatusChange = async (newStatus: PropertyStatus) => {
    await updateProperty(property.id, { status: newStatus });
    showToast(`Statut du mandat mis à jour : ${newStatus}`, 'success');
  };

  const handleApplyDescription = async (newDesc: string) => {
    await updateProperty(property.id, { description: newDesc });
    showToast('Descriptif de l\'annonce mis à jour avec succès.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Quick Actions */}
      <MandateDetailHeader
        property={property}
        onStatusChange={handleStatusChange}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onOpenAvenantModal={() => setIsAvenantModalOpen(true)}
        onOpenContractModal={() => setIsContractModalOpen(true)}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-px">
        {[
          { id: 'details', label: 'Vue d\'ensemble', icon: <FileText className="w-4 h-4" /> },
          {
            id: 'alur_ged',
            label: 'Documents ALUR & GED',
            icon: <FileCheck2 className="w-4 h-4" />,
            count: property.documents?.length
          },
          {
            id: 'crm',
            label: 'Matching Acquéreurs',
            icon: <Users className="w-4 h-4" />,
            count: matchedBuyers.length
          },
          { id: 'copywriting', label: 'Studio IA Copywriting', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'poliris', label: 'Multidiffusion & Portails', icon: <Radio className="w-4 h-4" /> },
          {
            id: 'audit',
            label: 'Registre DGCCRF SHA-256',
            icon: <Lock className="w-4 h-4" />,
            count: mandateLogs.length
          }
        ].map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${activeTab === t.id
                ? 'border-[#E12B7B] text-[#E12B7B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="px-1.5 py-0.2 bg-gray-100 rounded-full text-[10px] text-gray-700">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1 : Vue d'ensemble */}
      {activeTab === 'details' && <MandateOverviewTab property={property} />}

      {/* Tab 2 : Documents ALUR & GED */}
      {activeTab === 'alur_ged' && (
        <AlurGedManager
          property={property}
          onUpdateProperty={updateProperty}
        />
      )}

      {/* Tab 3 : CRM Matching Acquéreurs */}
      {activeTab === 'crm' && (
        <MandateMatchingTab
          property={property}
          matchedBuyers={matchedBuyers}
          proposals={proposals}
          onCreateProposal={async (buyerId, channel) => {
            await createProposal({
              property_id: property.id,
              buyer_id: buyerId,
              channel,
              status: 'propose',
              proposed_at: new Date().toISOString()
            });
            showToast('Proposition enregistrée dans le suivi CRM.', 'success');
          }}
          onUpdateProposalStatus={async (proposalId, status) => {
            await updateProposalStatus(proposalId, status);
            showToast('Statut de la proposition actualisé.', 'success');
          }}
        />
      )}

      {/* Tab 4 : Studio IA Copywriting */}
      {activeTab === 'copywriting' && (
        <MandateCopywritingTab
          property={property}
          onApplyDescription={handleApplyDescription}
        />
      )}

      {/* Tab 5 : Multidiffusion Portails */}
      {activeTab === 'poliris' && (
        <MandatePortalsTab property={property} settings={settings} />
      )}

      {/* Tab 6 : Registre DGCCRF & Audit Log */}
      {activeTab === 'audit' && (
        <MandateAuditTab property={property} logs={mandateLogs} />
      )}

      {/* Modale Signature Électronique */}
      <ElectronicSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        property={property}
        settings={settings}
        onSigned={async (signatureCert) => {
          await updateProperty(property.id, {
            electronic_signature: signatureCert
          });
          showToast('Mandat signé électroniquement avec succès !', 'success');
        }}
      />

      {/* Modale Avenant de Prix */}
      <MandateAvenantModal
        isOpen={isAvenantModalOpen}
        onClose={() => setIsAvenantModalOpen(false)}
        property={property}
      />

      {/* Modale Contrat Officiel Mandat Loi Hoguet A4 */}
      {isContractModalOpen && (
        <MandateLegalContractModal
          property={property}
          onClose={() => setIsContractModalOpen(false)}
        />
      )}
    </div>
  );
}
