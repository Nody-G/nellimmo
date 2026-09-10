'use client';

import React from 'react';
import { Phone, MessageCircle, Sparkles, ExternalLink, Target } from 'lucide-react';
import type { ProspectingLead, ProspectingStatus } from '@/lib/types';
import { EntityLink } from '@/components/ui/EntityLink';
import {
  computeDvfGap,
  buildWhatsAppMessage,
  cleanPhone,
  statusBadgeClass,
  STATUS_OPTIONS,
} from './pige-types';

import { SortableColumnHeader } from '../common/SortableColumnHeader';
import type { PigeSortOption } from './PigeFilterBar';

interface PigeTableProps {
  leads: ProspectingLead[];
  onConvertToMandate: (lead: ProspectingLead) => void;
  onStatusChange?: (leadId: string, newStatus: ProspectingStatus) => void;
  sortBy?: PigeSortOption;
  onSortChange?: (newSort: PigeSortOption) => void;
  highlightLeadId?: string;
}

export function PigeTable({
  leads,
  onConvertToMandate,
  onStatusChange,
  sortBy = 'recent',
  onSortChange,
  highlightLeadId,
}: PigeTableProps) {
  const handleSort = (option: PigeSortOption) => {
    if (onSortChange) onSortChange(option);
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs p-12 text-center text-gray-500 space-y-3">
        <Target className="w-10 h-10 text-gray-300 mx-auto" />
        <h3 className="font-bold text-gray-700">Aucune annonce trouvée</h3>
        <p className="text-xs text-gray-400">
          Modifiez vos filtres de recherche ou importez de nouvelles annonces de pige.
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
              <th className="p-4 w-14 text-center">
                <SortableColumnHeader
                  label="Rang"
                  active={sortBy === 'recent' || sortBy === 'oldest'}
                  direction={sortBy === 'oldest' ? 'asc' : 'desc'}
                  align="center"
                  onClick={() => handleSort(sortBy === 'recent' ? 'oldest' : 'recent')}
                />
              </th>
              <th className="p-4">
                <SortableColumnHeader
                  label="Annonce / Bien"
                  active={sortBy === 'surface_desc' || sortBy === 'surface_asc'}
                  direction={sortBy === 'surface_asc' ? 'asc' : 'desc'}
                  onClick={() => handleSort(sortBy === 'surface_desc' ? 'surface_asc' : 'surface_desc')}
                />
              </th>
              <th className="p-4">
                <SortableColumnHeader
                  label="Vendeur & Contact"
                  active={sortBy === 'seller_asc' || sortBy === 'seller_desc'}
                  direction={sortBy === 'seller_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'seller_asc' ? 'seller_desc' : 'seller_asc')}
                />
              </th>
              <th className="p-4">
                <SortableColumnHeader
                  label="Source"
                  active={sortBy === 'source_asc' || sortBy === 'source_desc'}
                  direction={sortBy === 'source_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'source_asc' ? 'source_desc' : 'source_asc')}
                />
              </th>
              <th className="p-4">
                <SortableColumnHeader
                  label="Prix Demandé"
                  active={sortBy === 'price_desc' || sortBy === 'price_asc'}
                  direction={sortBy === 'price_asc' ? 'asc' : 'desc'}
                  onClick={() => handleSort(sortBy === 'price_desc' ? 'price_asc' : 'price_desc')}
                />
              </th>
              <th className="p-4">
                <SortableColumnHeader
                  label="Écart DVF Notaires"
                  active={sortBy === 'dvf_opportunity' || sortBy === 'dvf_gap_desc'}
                  direction={sortBy === 'dvf_gap_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'dvf_opportunity' ? 'dvf_gap_desc' : 'dvf_opportunity')}
                />
              </th>
              <th className="p-4">
                <SortableColumnHeader
                  label="Statut Prospection"
                  active={sortBy === 'days_online'}
                  direction="desc"
                  onClick={() => handleSort('days_online')}
                />
              </th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead, idx) => {
              const { priceM2, diffPct } = computeDvfGap(lead);
              const cleanPhoneNumber = cleanPhone(lead.seller_phone);
              const whatsappMessage = buildWhatsAppMessage(lead);
              const rank = idx + 1;

              return (
                <tr
                  key={lead.id}
                  id={`lead-${lead.id}`}
                  className={`transition-colors ${highlightLeadId === lead.id
                      ? 'bg-[#FDF2F8] ring-2 ring-inset ring-[#E12B7B]/30'
                      : 'hover:bg-gray-50/80'
                    }`}
                >
                  {/* Rang */}
                  <td className="p-4 text-center font-bold text-gray-500">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] ${rank === 1
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

                  {/* Title & City */}
                  <td className="p-4">
                    <span className="font-bold text-gray-900 text-sm block">
                      <EntityLink kind="lead" id={lead.id} withIcon title="Voir la fiche du prospect">
                        {lead.title}
                      </EntityLink>
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {lead.city} {lead.neighborhood ? `(${lead.neighborhood})` : ''} • {lead.living_area} m² ({lead.rooms_count}p)
                    </span>
                  </td>

                  {/* Seller */}
                  <td className="p-4">
                    <span className="font-semibold text-gray-800 block">
                      <EntityLink kind="contact" id={lead.contact_id} title="Voir la fiche contact">
                        {lead.seller_name}
                      </EntityLink>
                    </span>
                    <a
                      href={`tel:${lead.seller_phone}`}
                      className="font-mono text-[11px] text-gray-500 hover:text-[#E12B7B]"
                    >
                      {lead.seller_phone}
                    </a>
                  </td>

                  {/* Source */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-gray-100 text-gray-700">
                      {lead.source.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-4">
                    <span className="font-black text-sm text-gray-900 block">
                      {lead.price_asked.toLocaleString('fr-FR')} €
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {priceM2.toLocaleString('fr-FR')} €/m²
                    </span>
                  </td>

                  {/* DVF Gap */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold inline-block ${diffPct > 5
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : diffPct < -5
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {diffPct > 0 ? `+${diffPct}%` : `${diffPct}%`} vs DVF
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    {onStatusChange ? (
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value as ProspectingStatus)}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg border border-transparent focus:outline-none cursor-pointer transition ${statusBadgeClass(
                          lead.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-white text-gray-900 normal-case">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onConvertToMandate(lead)}
                        title="Créer le mandat Nell'Immo"
                        className="p-1.5 rounded-lg bg-[#FDF2F8] text-[#E12B7B] hover:bg-[#FCE7F3] transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      {cleanPhoneNumber && (
                        <a
                          href={`https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp direct"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <a
                        href={`tel:${lead.seller_phone}`}
                        title="Appeler"
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {lead.source_url && (
                        <a
                          href={lead.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Voir l’annonce source"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
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
