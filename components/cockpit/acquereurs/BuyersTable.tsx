'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone, MessageCircle, Users } from 'lucide-react';
import type { Buyer, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  getMatchingProperties,
  financingBadge,
  financingLabel,
  buildBuyerContactMessage,
  toWhatsAppNumber,
} from './acquereurs-types';

interface BuyersTableProps {
  buyers: Buyer[];
  activeProperties: Property[];
  onOpenSelection: (buyer: Buyer) => void;
}

export function BuyersTable({
  buyers,
  activeProperties,
  onOpenSelection,
}: BuyersTableProps) {
  if (buyers.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-12 text-center text-gray-500 space-y-3">
        <Users className="w-10 h-10 text-gray-300 mx-auto" />
        <h3 className="font-bold text-gray-700">Aucun acquéreur trouvé</h3>
        <p className="text-xs text-gray-400">
          Modifiez vos filtres ou créez une nouvelle fiche acquéreur.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FCFAF7] border-b border-[#F3E8EE] text-gray-600 font-bold uppercase text-[10px]">
              <th className="p-4 w-12 text-center">Rang</th>
              <th className="p-4">Acquéreur</th>
              <th className="p-4">Coordonnées</th>
              <th className="p-4">Financement</th>
              <th className="p-4">Budget Max</th>
              <th className="p-4">Critères Recherchés</th>
              <th className="p-4">Rapprochement Mandats</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {buyers.map((buyer, idx) => {
              const matchingProperties = getMatchingProperties(activeProperties, buyer);
              const waNumber = toWhatsAppNumber(buyer.phone);
              const contactMessage = buildBuyerContactMessage(buyer);
              const rank = idx + 1;

              return (
                <tr key={buyer.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Rang */}
                  <td className="p-4 text-center font-bold text-gray-500">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                        rank === 1
                          ? 'bg-amber-100 text-amber-900 font-black'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-800 font-black'
                          : rank === 3
                          ? 'bg-amber-50 text-amber-800 font-black'
                          : 'text-gray-400'
                      }`}
                    >
                      #{rank}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="p-4">
                    <span className="font-bold text-gray-900 text-sm block">
                      {buyer.first_name} {buyer.last_name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Inscrit le {new Date(buyer.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>

                  {/* Phone & Email */}
                  <td className="p-4">
                    <a
                      href={`tel:${buyer.phone}`}
                      className="font-mono text-gray-800 hover:text-[#E12B7B] block font-semibold"
                    >
                      {buyer.phone}
                    </a>
                    {buyer.email && (
                      <span className="text-[11px] text-gray-500 truncate block max-w-[160px]">
                        {buyer.email}
                      </span>
                    )}
                  </td>

                  {/* Financing Status */}
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${financingBadge(
                        buyer.financing_status
                      )}`}
                    >
                      {financingLabel(buyer.financing_status)}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="p-4 font-black text-sm text-[#E12B7B] whitespace-nowrap">
                    {buyer.budget_max.toLocaleString('fr-FR')} €
                  </td>

                  {/* Criteria */}
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-gray-800 block">
                        {buyer.min_surface ? `${buyer.min_surface} m² min.` : 'Surface indifférente'}
                        {buyer.min_rooms ? ` (${buyer.min_rooms}p.)` : ''}
                      </span>
                      <span className="text-[10px] text-gray-500 block truncate max-w-[180px]">
                        {buyer.target_cities.join(', ') || 'Toutes communes'}
                      </span>
                    </div>
                  </td>

                  {/* Matching Mandates */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-black ${
                          matchingProperties.length > 0
                            ? 'bg-pink-100 text-[#E12B7B]'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {matchingProperties.length} match{matchingProperties.length > 1 ? 's' : ''}
                      </span>
                      {matchingProperties.length > 0 && (
                        <div className="flex items-center gap-1">
                          {matchingProperties.slice(0, 2).map(({ property: p }) => (
                            <Link
                              key={p.id}
                              href={`/cockpit/mandats/${p.id}`}
                              className="text-[10px] bg-gray-100 hover:bg-[#FDF2F8] hover:text-[#E12B7B] px-1.5 py-0.5 rounded font-mono truncate max-w-[90px]"
                              title={p.title}
                            >
                              {formatMandateRef(p.mandate_number)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenSelection(buyer)}
                        title="Dossier de sélection A4"
                        className="p-1.5 rounded-lg bg-[#FDF2F8] text-[#E12B7B] hover:bg-[#FCE7F3] transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(contactMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp direct"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <a
                        href={`tel:${buyer.phone}`}
                        title="Appeler"
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
