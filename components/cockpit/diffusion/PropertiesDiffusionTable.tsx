'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import type { Property } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { auditPropertyCompliance } from '@/lib/compliance';
import { DiffusionTableRow } from './DiffusionTableRow';
import { ComplianceAuditModal } from './ComplianceAuditModal';

type FilterType = 'all' | 'seloger' | 'leboncoin' | 'bienici' | 'figaro' | 'greenacres' | 'facebook' | 'alerts';

interface PropertiesDiffusionTableProps {
  properties: Property[];
}

export function PropertiesDiffusionTable({ properties }: PropertiesDiffusionTableProps) {
  const { updateProperty } = useNellimoStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [inspectingProperty, setInspectingProperty] = useState<Property | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        String(p.mandate_number).includes(q);

      if (!matchSearch) return false;

      if (filter === 'seloger') return p.publish_seloger;
      if (filter === 'leboncoin') return p.publish_leboncoin;
      if (filter === 'bienici') return p.publish_bienici;
      if (filter === 'figaro') return Boolean(p.publish_figaro);
      if (filter === 'greenacres') return Boolean(p.publish_greenacres);
      if (filter === 'facebook') return Boolean(p.publish_facebook);
      if (filter === 'alerts') {
        const report = auditPropertyCompliance(p);
        return !report.readyForPortals || report.score < 90;
      }
      return true;
    });
  }, [properties, search, filter]);

  const handleToggle = async (
    propertyId: string,
    channel:
      | 'publish_website'
      | 'publish_seloger'
      | 'publish_leboncoin'
      | 'publish_bienici'
      | 'publish_figaro'
      | 'publish_greenacres'
      | 'publish_facebook'
  ) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;
    const currentVal = Boolean(prop[channel]);
    await updateProperty(propertyId, { [channel]: !currentVal });
  };

  const handleBulkActivate = async (
    channel: 'publish_seloger' | 'publish_leboncoin' | 'publish_bienici' | 'publish_figaro'
  ) => {
    for (const p of filteredProperties) {
      if (!p[channel]) {
        await updateProperty(p.id, { [channel]: true });
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
              Pilotage Dynamique
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Toggles 1-Clic Directs</span>
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
            Tableau de Multidiffusion ({properties.length} biens actifs)
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par mandat, ville..."
            className="w-full pl-9 pr-4 py-2 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl text-xs focus:outline-[#E12B7B]"
          />
        </div>
      </div>

      {/* Filter Tabs & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-gray-400 text-[10px] font-bold uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filtre :</span>
          </span>
          {[
            { id: 'all', label: 'Tous' },
            { id: 'seloger', label: 'SeLoger' },
            { id: 'leboncoin', label: 'LeBonCoin' },
            { id: 'bienici', label: 'Bien’ici' },
            { id: 'figaro', label: 'Figaro' },
            { id: 'greenacres', label: 'Green-Acres' },
            { id: 'facebook', label: 'Facebook' },
            { id: 'alerts', label: '⚠️ Alertes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#131B26] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Bulk Activate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBulkActivate('publish_seloger')}
            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
            title="Activer la sélection sur SeLoger"
          >
            + Tout SeLoger
          </button>
          <button
            onClick={() => handleBulkActivate('publish_leboncoin')}
            className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition cursor-pointer"
            title="Activer la sélection sur LeBonCoin"
          >
            + Tout LeBonCoin
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
              <th className="pb-3 px-3">Mandat</th>
              <th className="pb-3 px-3">Annonce</th>
              <th className="pb-3 px-3">Prix FAI</th>
              <th className="pb-3 px-3 text-center">Conformité</th>
              <th className="pb-3 px-1.5 text-center">Site</th>
              <th className="pb-3 px-1.5 text-center">SeLoger</th>
              <th className="pb-3 px-1.5 text-center">LBC</th>
              <th className="pb-3 px-1.5 text-center">Bien’ici</th>
              <th className="pb-3 px-1.5 text-center">Figaro</th>
              <th className="pb-3 px-1.5 text-center">Green-Acres</th>
              <th className="pb-3 px-1.5 text-center">Meta Shop</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProperties.map((p) => (
              <DiffusionTableRow
                key={p.id}
                property={p}
                onToggle={handleToggle}
                onInspectCompliance={(prop) => setInspectingProperty(prop)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance Inspection Modal */}
      {inspectingProperty && (
        <ComplianceAuditModal
          property={inspectingProperty}
          onClose={() => setInspectingProperty(null)}
        />
      )}
    </div>
  );
}
