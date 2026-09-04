'use client';

import React, { useState } from 'react';
import { X, Handshake } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';
import type { Property, PartnerAgency, DelegationAgreement, FeeShareRatio } from '@/lib/types';

interface NewDelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProperties: Property[];
  partners: PartnerAgency[];
  onCreateDelegation: (data: {
    property_id: string;
    partner_id: string;
    fee_share_ratio: FeeShareRatio;
    delegation_type: 'co_exclusivite' | 'simple_delegation';
    start_date: string;
    end_date: string;
    status: 'active';
    special_clauses?: string;
  }) => Promise<DelegationAgreement>;
  onSuccess: (newDelegation: DelegationAgreement) => void;
}

export function NewDelegationModal({
  isOpen,
  onClose,
  activeProperties,
  partners,
  onCreateDelegation,
  onSuccess,
}: NewDelegationModalProps) {
  const [formPropertyId, setFormPropertyId] = useState(activeProperties[0]?.id || '');
  const [formPartnerId, setFormPartnerId] = useState(partners[0]?.id || '');
  const [formShareRatio, setFormShareRatio] = useState<FeeShareRatio>('50_50');
  const [formDurationDays, setFormDurationDays] = useState(90);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPropertyId || !formPartnerId) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const endDate = new Date(now.getTime() + formDurationDays * 24 * 3600 * 1000);

      const newDelegation = await onCreateDelegation({
        property_id: formPropertyId,
        partner_id: formPartnerId,
        fee_share_ratio: formShareRatio,
        delegation_type: 'co_exclusivite',
        start_date: now.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        special_clauses: 'Partage d’honoraires à 50/50 sous condition de communication du bon de visite dans les 24h.',
      });

      onSuccess(newDelegation);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-5 animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Établir une Délégation de Mandat
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Mandat à Déléguer</label>
            <select
              value={formPropertyId}
              onChange={(e) => setFormPropertyId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            >
              {activeProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  [{formatMandateRef(p.mandate_number)}] {p.title} — {p.city} ({p.price_fai.toLocaleString('fr-FR')} € FAI)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Agence Confrère Déléguée</label>
            <select
              value={formPartnerId}
              onChange={(e) => setFormPartnerId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
            >
              {partners.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.agency_name} — {pt.director_name} ({pt.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Partage Honoraires</label>
              <select
                value={formShareRatio}
                onChange={(e) => setFormShareRatio(e.target.value as FeeShareRatio)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
              >
                <option value="50_50">50% / 50% (Standard équilibré)</option>
                <option value="60_40">60% Nell’Immo / 40% Confrère</option>
                <option value="70_30">70% Nell’Immo / 30% Confrère</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Durée (Jours)</label>
              <input
                type="number"
                value={formDurationDays}
                onChange={(e) => setFormDurationDays(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer disabled:opacity-50"
          >
            Générer la Convention Conforme Loi Hoguet
          </button>
        </form>
      </div>
    </div>
  );
}
