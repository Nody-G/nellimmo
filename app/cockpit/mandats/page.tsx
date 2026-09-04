'use client';

import React, { useState, useMemo } from 'react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { formatMandateRef } from '@/lib/hoguet';
import {
  MandatesListHeader,
  MandatesFilterBar,
  MandatesCardsGrid,
} from '@/components/cockpit/mandats/list';

export default function MandatesListPage() {
  const { properties } = useNellimoStore();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('tous');
  const [selectedType, setSelectedType] = useState<string>('tous');

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatMandateRef(p.mandate_number).toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'tous' || p.status === selectedStatus;
      const matchType = selectedType === 'tous' || p.mandate_type === selectedType;

      return matchSearch && matchStatus && matchType;
    });
  }, [properties, searchQuery, selectedStatus, selectedType]);

  const handleExportCsv = () => {
    const headers = [
      'Ref_Mandat',
      'Titre',
      'Type_Bien',
      'Ville',
      'Prix_FAI',
      'Net_Vendeur',
      'Honoraires',
      'Vendeur',
      'Statut',
      'Date_Debut',
      'Date_Fin',
    ];
    const rows = filteredProperties.map((p) => [
      formatMandateRef(p.mandate_number),
      `"${p.title.replace(/"/g, '""')}"`,
      p.property_type,
      p.city,
      p.price_fai,
      p.price_net_seller,
      p.agency_fees_amount,
      `"${p.seller_name.replace(/"/g, '""')}"`,
      p.status,
      p.mandate_date,
      p.mandate_end_date,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mandats_nellimmo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Fichier CSV des mandats téléchargé !', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <MandatesListHeader onExportCsv={handleExportCsv} />

      {/* Filter & Search Bar */}
      <MandatesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Main Table */}
      <MandatesCardsGrid properties={filteredProperties} />
    </div>
  );
}
