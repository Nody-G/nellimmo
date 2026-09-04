'use client';

import React from 'react';
import { Handshake, FileSignature } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';
import type { DelegationAgreement, Property, PartnerAgency } from '@/lib/types';

interface DelegationsTableProps {
  delegations: DelegationAgreement[];
  properties: Property[];
  partners: PartnerAgency[];
  onSelectDelegation: (delegation: DelegationAgreement) => void;
}

export function DelegationsTable({
  delegations,
  properties,
  partners,
  onSelectDelegation,
}: DelegationsTableProps) {
  const getPartner = (id: string) => partners.find((p) => p.id === id) || partners[0];
  const getProperty = (id: string) => properties.find((p) => p.id === id) || properties[0];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
          <Handshake className="w-4 h-4 text-[#E12B7B]" />
          <span>Mandats Actuellement Délégués à des Confrères</span>
        </h3>
      </div>

      {delegations.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-500">
          Aucun mandat n’est actuellement en cours de délégation.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Bien / Mandat</th>
                <th className="pb-3">Agence Confrère Déléguée</th>
                <th className="pb-3">Type Délégation</th>
                <th className="pb-3">Clé Répartition</th>
                <th className="pb-3">Échéance</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3 text-right">Convention Légale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {delegations.map((d) => {
                const prop = getProperty(d.property_id);
                const partner = getPartner(d.partner_id);

                if (!prop || !partner) return null;

                return (
                  <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5">
                      <span className="font-bold text-gray-900 block truncate max-w-xs">
                        {prop.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formatMandateRef(prop.mandate_number)} • {prop.city} • {prop.price_fai.toLocaleString('fr-FR')} €
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#131B26] block">{partner.agency_name}</span>
                      <span className="text-[10px] text-gray-500">{partner.director_name} ({partner.city})</span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {d.delegation_type === 'co_exclusivite' ? 'Co-Exclusivité' : 'Simple Délégation'}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-800">
                      {d.fee_share_ratio.replace('_', ' / ')}
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(d.end_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectDelegation(d)}
                        className="px-3 py-1.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FileSignature className="w-3.5 h-3.5 text-[#C59A45]" />
                        <span>Voir Convention</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
