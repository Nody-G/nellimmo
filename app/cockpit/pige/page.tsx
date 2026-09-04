'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNellimoStore } from '@/lib/store';
import type { ProspectingLead } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import type { NewLeadFormState } from '@/components/cockpit/pige/pige-types';
import {
  DEFAULT_NEW_LEAD,
  computeDefaultMandateDates,
  filterLeads,
} from '@/components/cockpit/pige/pige-types';
import type { ParsedPigeLead } from '@/components/cockpit/pige/pige-import';
import { parsedLeadToProspectingLead } from '@/components/cockpit/pige/pige-import';
import { PigeHeader } from '@/components/cockpit/pige/PigeHeader';
import { SparringPartnerPanel } from '@/components/cockpit/pige/SparringPartnerPanel';
import { PigeFilterBar } from '@/components/cockpit/pige/PigeFilterBar';
import { LeadCard } from '@/components/cockpit/pige/LeadCard';
import { NewLeadModal } from '@/components/cockpit/pige/NewLeadModal';
import { PigeImportModal } from '@/components/cockpit/pige/PigeImportModal';

export default function ProspectingPage() {
  const router = useRouter();
  const { prospectingLeads, createProspectingLead, updateProspectingLead, createProperty } = useNellimoStore();
  const { showToast } = useToast();

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // New Lead Modal
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState<boolean>(false);
  const [newLeadForm, setNewLeadForm] = useState<NewLeadFormState>(DEFAULT_NEW_LEAD);

  // CSV Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Sparring partner modal / active script
  const [activeObjectionIndex, setActiveObjectionIndex] = useState<number>(0);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const filteredLeads = useMemo(
    () => filterLeads(prospectingLeads, selectedSourceFilter, selectedStatusFilter, searchKeyword),
    [prospectingLeads, selectedSourceFilter, selectedStatusFilter, searchKeyword]
  );

  const handleNewLeadFieldChange = useCallback((patch: Partial<NewLeadFormState>) => {
    setNewLeadForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    createProspectingLead({
      source: newLeadForm.source,
      source_url: newLeadForm.url,
      title: newLeadForm.title,
      property_type: 'maison',
      city: newLeadForm.city,
      postal_code:
        newLeadForm.city === 'Pélissanne'
          ? '13330'
          : newLeadForm.city === 'Salon-de-Provence'
            ? '13300'
            : '13410',
      price_asked: newLeadForm.price,
      price_drops_count: 0,
      living_area: newLeadForm.surface,
      rooms_count: 5,
      neighborhood: newLeadForm.neighborhood ? newLeadForm.neighborhood.trim() : undefined,
      description: newLeadForm.notes || newLeadForm.title,
      photos_urls: [],
      seller_name: newLeadForm.sellerName,
      seller_phone: newLeadForm.phone,
      status: 'nouveau',
      call_attempts_count: 0,
      notes: newLeadForm.notes,
      days_online: 1,
    });

    showToast('Prospect enregistré avec succès dans le radar de pige !', 'success');
    setIsNewLeadModalOpen(false);
    setNewLeadForm(DEFAULT_NEW_LEAD);
  };

  const handleUpdateStatus = (id: string, status: ProspectingLead['status']) => {
    updateProspectingLead(id, { status });
    showToast(`Statut mis à jour : ${status.replace(/_/g, ' ')}`, 'info');
  };

  const handleConvertToMandate = async (lead: ProspectingLead) => {
    try {
      // Create property in portfolio
      const { start: mandateDate, end: mandateEndDate } = computeDefaultMandateDates(90);
      const newProperty = await createProperty({
        mandate_type: 'exclusif',
        mandate_date: mandateDate,
        mandate_end_date: mandateEndDate,
        status: 'brouillon',
        seller_name: lead.seller_name,
        seller_phone: lead.seller_phone,
        seller_email: 'contact@vendeur.fr',
        seller_address: `Quartier ${lead.city}`,
        title: lead.title,
        property_type: 'maison',
        address: `Quartier ${lead.city}`,
        postal_code: lead.postal_code || '13330',
        city: lead.city,
        display_exact_address: false,
        price_fai: lead.price_asked,
        price_net_seller: Math.round(lead.price_asked * 0.95),
        agency_fees_amount: Math.round(lead.price_asked * 0.05),
        agency_fees_percentage: 5,
        fees_paid_by: 'vendeur',
        living_area: lead.living_area,
        rooms_count: lead.rooms_count || 5,
        bedrooms_count: 3,
        description: `Bien issu de la prospection directe. ${lead.notes || ''}`,
        features: ['Jardin', 'Calme'],
        images: [],
        publish_website: true,
        publish_seloger: false,
        publish_leboncoin: false,
        publish_bienici: false,
      });

      // Update lead status
      updateProspectingLead(lead.id, { status: 'mandat_obtenu' });

      showToast(`Mandat N°${newProperty.mandate_number} créé avec succès en mode brouillon ! Redirection...`, 'success');
      router.push(`/cockpit/mandats/${newProperty.id}`);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la création du mandat depuis la pige.', 'error');
    }
  };

  const copyPitchText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleImportLeads = async (leads: ParsedPigeLead[]) => {
    let count = 0;
    for (const lead of leads) {
      await createProspectingLead(parsedLeadToProspectingLead(lead));
      count++;
    }
    setIsImportModalOpen(false);
    showToast(`${count} annonce${count > 1 ? 's' : ''} importée${count > 1 ? 's' : ''} dans le radar de pige.`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <PigeHeader
        onNewLead={() => setIsNewLeadModalOpen(true)}
        onImport={() => setIsImportModalOpen(true)}
      />

      <SparringPartnerPanel
        activeObjectionIndex={activeObjectionIndex}
        copiedPitch={copiedPitch}
        onSelectObjection={setActiveObjectionIndex}
        onCopyPitch={copyPitchText}
      />

      <PigeFilterBar
        searchKeyword={searchKeyword}
        selectedSourceFilter={selectedSourceFilter}
        selectedStatusFilter={selectedStatusFilter}
        onSearchChange={setSearchKeyword}
        onSourceChange={setSelectedSourceFilter}
        onStatusChange={setSelectedStatusFilter}
      />

      {/* Leads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onConvertToMandate={handleConvertToMandate}
            onStatusChange={handleUpdateStatus}
          />
        ))}
      </div>

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        form={newLeadForm}
        onChange={handleNewLeadFieldChange}
        onSubmit={handleCreateLead}
        onClose={() => setIsNewLeadModalOpen(false)}
      />

      <PigeImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLeads}
      />
    </div>
  );
}
