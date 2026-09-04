'use client';

import React from 'react';
import type { DelegationAgreement, Property, PartnerAgency } from '@/lib/types';

interface InterAgencesStatsProps {
  delegations: DelegationAgreement[];
  partners: PartnerAgency[];
  properties: Property[];
}

export function InterAgencesStats({
  delegations,
  partners,
  properties,
}: InterAgencesStatsProps) {
  const getProperty = (id: string) => properties.find((p) => p.id === id) || properties[0];

  const activeDelegationsCount = delegations.filter((d) => d.status === 'active').length;
  const potentialSharedFees = delegations.reduce((sum, d) => {
    const p = getProperty(d.property_id);
    return sum + (p ? Math.round(p.agency_fees_amount / 2) : 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-1">
        <span className="text-[10px] uppercase font-bold text-gray-400 block">Délégations Actives</span>
        <div className="text-2xl font-black text-gray-900">
          {activeDelegationsCount} mandats
        </div>
        <span className="text-[11px] text-emerald-600 font-semibold">Partage 50/50 en cours</span>
      </div>

      <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-1">
        <span className="text-[10px] uppercase font-bold text-gray-400 block">Confrères Partenaires Agréés</span>
        <div className="text-2xl font-black text-gray-900">
          {partners.length} agences
        </div>
        <span className="text-[11px] text-gray-500">Salon, Aix, Lambesc, Luberon</span>
      </div>

      <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-1">
        <span className="text-[10px] uppercase font-bold text-gray-400 block">Honoraires Partagés Potentiels</span>
        <div className="text-2xl font-black text-[#E12B7B]">
          {potentialSharedFees.toLocaleString('fr-FR')} €
        </div>
        <span className="text-[11px] text-gray-500">Part Nell’Immo sécurisée</span>
      </div>
    </div>
  );
}
