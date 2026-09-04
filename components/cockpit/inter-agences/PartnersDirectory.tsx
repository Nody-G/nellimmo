'use client';

import React from 'react';
import { Building2, PlusCircle, Trash2, Phone, Mail } from 'lucide-react';
import type { PartnerAgency } from '@/lib/types';

interface PartnersDirectoryProps {
  partners: PartnerAgency[];
  onOpenNewPartner: () => void;
  onDeletePartner: (id: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function PartnersDirectory({
  partners,
  onOpenNewPartner,
  onDeletePartner,
  showToast,
}: PartnersDirectoryProps) {
  const handleDelete = async (partner: PartnerAgency) => {
    if (confirm(`Confirmez-vous le retrait de l'agence "${partner.agency_name}" du réseau partenaire ?`)) {
      try {
        await onDeletePartner(partner.id);
        showToast(`Agence ${partner.agency_name} retirée du réseau.`, 'info');
      } catch {
        showToast('Erreur lors du retrait du partenaire.', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#C59A45]" />
          <span>Annuaire des Confrères Partenaires du Réseau Local ({partners.length})</span>
        </h3>

        <button
          type="button"
          onClick={onOpenNewPartner}
          className="px-3.5 py-1.5 bg-[#FCFAF7] hover:bg-[#F3E8EE] text-[#E12B7B] border border-[#F3E8EE] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Agréer un Confrère</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {partners.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2 relative group hover:shadow-xs transition"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-gray-900 block text-sm">{p.agency_name}</span>
              <button
                type="button"
                onClick={() => handleDelete(p)}
                title="Retirer ce confrère"
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition cursor-pointer rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[11px] text-gray-500 block">
              Dirigeant : <strong className="text-gray-700">{p.director_name}</strong>
            </span>
            <span className="text-[10px] font-mono text-gray-400 block truncate">
              {p.cpi_number}
            </span>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${p.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1 text-gray-700 hover:text-[#E12B7B] transition font-medium"
                >
                  <Phone className="w-3 h-3 text-[#E12B7B]" />
                  <span>{p.phone}</span>
                </a>
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    title={p.email}
                    className="text-gray-400 hover:text-[#E12B7B] transition"
                  >
                    <Mail className="w-3 h-3" />
                  </a>
                )}
              </div>
              <span className="text-[#E12B7B] font-semibold bg-pink-50 px-2 py-0.5 rounded-md">
                {p.city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
