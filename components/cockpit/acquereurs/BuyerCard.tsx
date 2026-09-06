'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, Sparkles, MapPin, Maximize2, Euro } from 'lucide-react';
import type { Buyer, Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { financingBadge, financingLabel, buildBuyerContactMessage, toWhatsAppNumber } from './acquereurs-types';

interface BuyerCardProps {
  buyer: Buyer;
  matchingProperties: { property: Property; score: number }[];
  rankIndex?: number;
  onOpenSelection: (buyer: Buyer) => void;
}

/** A single buyer card with criteria, matching mandates and quick actions. */
export function BuyerCard({
  buyer,
  matchingProperties,
  rankIndex,
  onOpenSelection,
}: BuyerCardProps) {
  const contactMessage = buildBuyerContactMessage(buyer);
  const waNumber = toWhatsAppNumber(buyer.phone);
  const initials = `${buyer.first_name?.[0] || ''}${buyer.last_name?.[0] || ''}`.toUpperCase();

  // Rank badge styling
  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 ring-1 ring-amber-300 shadow-xs font-black';
    }
    if (rank === 2) {
      return 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 shadow-xs font-black';
    }
    if (rank === 3) {
      return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-xs font-black';
    }
    return 'bg-slate-100 text-slate-700 font-bold border border-slate-200';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] hover:border-[#E12B7B]/40 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between group relative">
      <div className="space-y-3.5">
        {/* Header with Initials, Name, Rank & Financing status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-[#FCFAF7] border-2 border-[#F3E8EE] flex items-center justify-center font-bold text-sm text-[#131B26] group-hover:scale-105 transition-transform shadow-2xs">
                {initials}
              </div>
              {rankIndex !== undefined && (
                <span
                  className={`absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-md text-[9px] ${getRankBadgeClass(
                    rankIndex
                  )}`}
                  title={`Rang n°${rankIndex}`}
                >
                  #{rankIndex}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#131B26] group-hover:text-[#E12B7B] transition-colors">
                {buyer.first_name} {buyer.last_name}
              </h3>
              <a
                href={`tel:${buyer.phone}`}
                className="flex items-center gap-1 font-mono text-xs text-gray-500 hover:text-[#E12B7B] transition-colors mt-0.5"
              >
                <Phone className="w-3 h-3 text-[#E12B7B]" />
                {buyer.phone}
              </a>
            </div>
          </div>

          <span
            className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full text-center shrink-0 ${financingBadge(
              buyer.financing_status
            )}`}
          >
            {financingLabel(buyer.financing_status)}
          </span>
        </div>

        {/* Criteria highlights */}
        <div className="bg-[#FCFAF7] p-3.5 rounded-2xl border border-[#F3E8EE] text-xs space-y-2 text-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <Euro className="w-3.5 h-3.5 text-gray-400" />
              Budget max :
            </span>
            <span className="font-black text-sm text-[#E12B7B]">
              {buyer.budget_max.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              Surface min :
            </span>
            <span className="font-bold text-gray-900">
              {buyer.min_surface ? `${buyer.min_surface} m²` : 'Indifférente'}
              {buyer.min_rooms ? ` • ${buyer.min_rooms}p.` : ''}
              {buyer.min_bedrooms ? ` • ${buyer.min_bedrooms}ch.` : ''}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500 font-medium flex items-center gap-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Secteurs :
            </span>
            <span className="font-semibold text-gray-900 text-right truncate">
              {buyer.target_cities.length > 0 ? buyer.target_cities.join(', ') : 'Toute zone'}
            </span>
          </div>

          {(buyer.must_have_garden || buyer.must_have_garage) && (
            <div className="flex gap-1.5 text-[10px] font-bold text-gray-600 pt-1 border-t border-gray-200/60">
              {buyer.must_have_garden && (
                <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  🌳 Jardin
                </span>
              )}
              {buyer.must_have_garage && (
                <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  🚗 Garage
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mandate Matches */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-bold uppercase text-gray-400 flex items-center justify-between">
            <span>Rapprochement Mandats</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                matchingProperties.length > 0
                  ? 'bg-pink-100 text-[#E12B7B]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {matchingProperties.length} match{matchingProperties.length > 1 ? 's' : ''}
            </span>
          </div>

          {matchingProperties.length > 0 ? (
            <div className="space-y-1.5">
              {matchingProperties.slice(0, 2).map(({ property: p, score }) => (
                <div
                  key={p.id}
                  className="p-2 bg-gray-50 hover:bg-[#FDF2F8] rounded-xl text-xs flex items-center justify-between transition border border-gray-100"
                >
                  <Link
                    href={`/cockpit/mandats/${p.id}`}
                    className="font-semibold text-gray-900 truncate hover:text-[#E12B7B]"
                  >
                    {formatMandateRef(p.mandate_number)} - {p.title}
                  </Link>
                  <span className="text-[10px] font-black text-white bg-[#E12B7B] px-1.5 py-0.5 rounded-md ml-2 shrink-0">
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 italic py-1">
              Aucun mandat actif ne correspond à 100% actuellement.
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onOpenSelection(buyer)}
          className="w-full py-2 bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#E12B7B] border border-[#F3E8EE] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sélection & Dossier VIP ({matchingProperties.length})</span>
        </button>

        <div className="flex items-center gap-2">
          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(contactMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
          <a
            href={`tel:${buyer.phone}`}
            className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-gray-500" />
            <span>Appeler</span>
          </a>
        </div>
      </div>
    </div>
  );
}
