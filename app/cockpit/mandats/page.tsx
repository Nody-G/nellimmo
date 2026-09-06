'use client';

import React, { useState, useMemo } from 'react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { formatMandateRef } from '@/lib/hoguet';
import {
  MandatesListHeader,
  MandatesFilterBar,
  MandatesModernGrid,
  MandatesTableView,
  MandatesSortOption,
} from '@/components/cockpit/mandats/list';

export default function MandatesListPage() {
  const { properties } = useNellimoStore();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('tous');
  const [selectedType, setSelectedType] = useState<string>('tous');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<MandatesSortOption>('recent');

  const filteredAndSortedProperties = useMemo(() => {
    // 1. Filtering
    const filtered = properties.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatMandateRef(p.mandate_number).toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'tous' || p.status === selectedStatus;
      const matchType = selectedType === 'tous' || p.mandate_type === selectedType;

      return matchSearch && matchStatus && matchType;
    });

    // 2. Sorting & Ranking
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent': {
          const dateA = new Date(a.mandate_date).getTime() || 0;
          const dateB = new Date(b.mandate_date).getTime() || 0;
          return dateB - dateA;
        }
        case 'oldest': {
          const dateA = new Date(a.mandate_date).getTime() || 0;
          const dateB = new Date(b.mandate_date).getTime() || 0;
          return dateA - dateB;
        }
        case 'price_desc':
          return b.price_fai - a.price_fai;
        case 'price_asc':
          return a.price_fai - b.price_fai;
        case 'area_desc':
          return b.living_area - a.living_area;
        case 'area_asc':
          return a.living_area - b.living_area;
        case 'sqm_desc': {
          const sqmA = a.living_area > 0 ? a.price_fai / a.living_area : 0;
          const sqmB = b.living_area > 0 ? b.price_fai / b.living_area : 0;
          return sqmB - sqmA;
        }
        case 'sqm_asc': {
          const sqmA = a.living_area > 0 ? a.price_fai / a.living_area : 0;
          const sqmB = b.living_area > 0 ? b.price_fai / b.living_area : 0;
          return sqmA - sqmB;
        }
        case 'city_asc':
          return a.city.localeCompare(b.city, 'fr', { sensitivity: 'base' });
        case 'ref_desc':
          return b.mandate_number - a.mandate_number;
        default:
          return 0;
      }
    });
  }, [properties, searchQuery, selectedStatus, selectedType, sortBy]);

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
    const rows = filteredAndSortedProperties.map((p) => [
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
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <MandatesListHeader onExportCsv={handleExportCsv} />

      {/* Filter & Search Bar with View Mode & Sort Controls */}
      <MandatesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={properties.length}
        filteredCount={filteredAndSortedProperties.length}
      />

      {/* Main View Display: Modern Grid or CRM Table */}
      {viewMode === 'grid' ? (
        <MandatesModernGrid properties={filteredAndSortedProperties} />
      ) : (
        <MandatesTableView properties={filteredAndSortedProperties} />
      )}
    </div>
  );
}
