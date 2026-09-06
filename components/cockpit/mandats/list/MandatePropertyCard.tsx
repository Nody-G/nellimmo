'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import {
  MapPin,
  Maximize2,
  DoorClosed,
  Bed,
  Eye,
  Edit,
  Share2,
  Printer,
  Sparkles,
  Camera,
} from 'lucide-react';
import { DpeBadge } from '@/components/ui/DpeBadge';

interface MandatePropertyCardProps {
  property: Property;
  rankIndex?: number;
  onShare?: (property: Property) => void;
}

export function MandatePropertyCard({
  property,
  rankIndex,
  onShare,
}: MandatePropertyCardProps) {
  const mandateRef = formatMandateRef(property.mandate_number);
  const sqmPrice =
    property.living_area > 0
      ? Math.round(property.price_fai / property.living_area)
      : null;

  const imagesCount = property.images?.length || 0;
  const primaryImage =
    property.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  // Status visual configuration
  const statusConfig = {
    brouillon: {
      label: 'Brouillon',
      bg: 'bg-slate-500/90 text-white',
      dot: 'bg-slate-300',
    },
    actif: {
      label: 'Actif en vente',
      bg: 'bg-emerald-500/90 text-white',
      dot: 'bg-emerald-300',
    },
    sous_compromis: {
      label: 'Sous compromis',
      bg: 'bg-amber-500/90 text-white',
      dot: 'bg-amber-200',
    },
    vendu: {
      label: 'Vendu',
      bg: 'bg-blue-600/90 text-white',
      dot: 'bg-blue-300',
    },
    archive: {
      label: 'Archivé',
      bg: 'bg-gray-600/90 text-white',
      dot: 'bg-gray-300',
    },
    resilie: {
      label: 'Résilié',
      bg: 'bg-rose-600/90 text-white',
      dot: 'bg-rose-300',
    },
  }[property.status] || {
    label: property.status,
    bg: 'bg-gray-700/90 text-white',
    dot: 'bg-gray-300',
  };

  // Rank badge styling
  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 ring-2 ring-amber-300 shadow-md font-black';
    }
    if (rank === 2) {
      return 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 ring-1 ring-white/60 shadow-sm font-black';
    }
    if (rank === 3) {
      return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white ring-1 ring-white/40 shadow-sm font-black';
    }
    return 'bg-slate-900/80 backdrop-blur-md text-white font-bold ring-1 ring-white/20';
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#F3E8EE] hover:border-[#E12B7B]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Media Area */}
      <div className="relative aspect-16/10 w-full bg-gray-100 overflow-hidden">
        <Link href={`/cockpit/mandats/${property.id}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Gradient Overlay for Top Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Rank Badge */}
          {rankIndex !== undefined && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs pointer-events-auto ${getRankBadgeClass(
                rankIndex
              )}`}
              title={`Classé n°${rankIndex}`}
            >
              <span>#{rankIndex}</span>
            </div>
          )}

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ml-auto pointer-events-auto ${statusConfig.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig.dot}`} />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Bottom Floating Badges over Photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Mandate Type Badge */}
          <div className="pointer-events-auto">
            {property.mandate_type === 'exclusif' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#E12B7B] border border-pink-200 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#E12B7B]" />
                Exclusivité
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-800 shadow-xs">
                {property.mandate_type}
              </span>
            )}
          </div>

          {/* Photo Count */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
            <Camera className="w-3 h-3 text-white/80" />
            <span>{imagesCount}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Ref & Location */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <Link
              href={`/cockpit/mandats/${property.id}`}
              className="font-mono font-black text-[#E12B7B] hover:underline"
            >
              {mandateRef}
            </Link>
            <div className="flex items-center gap-1 text-gray-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {property.city} ({property.postal_code})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/cockpit/mandats/${property.id}`} className="block">
            <h3 className="font-serif font-bold text-base text-[#131B26] group-hover:text-[#E12B7B] transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Price & m² valuation */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between gap-2">
            <div>
              <div className="text-xl font-black text-[#131B26] tracking-tight">
                {property.price_fai.toLocaleString('fr-FR')} €{' '}
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-normal">FAI</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                Net vendeur : {property.price_net_seller.toLocaleString('fr-FR')} € ({property.agency_fees_percentage}%)
              </div>
            </div>

            {sqmPrice && (
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-mono font-bold text-xs">
                  {sqmPrice.toLocaleString('fr-FR')} €/m²
                </span>
              </div>
            )}
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 uppercase font-semibold">
                <Maximize2 className="w-3 h-3 text-gray-400" />
                <span>Surface</span>
              </div>
              <div className="text-xs font-black text-gray-900 mt-0.5">
                {property.living_area} m²
              </div>
            </div>

            <div className="bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 uppercase font-semibold">
                <DoorClosed className="w-3 h-3 text-gray-400" />
                <span>Pièces</span>
              </div>
              <div className="text-xs font-black text-gray-900 mt-0.5">
                {property.rooms_count} p.
              </div>
            </div>

            <div className="bg-[#FCFAF7] p-2 rounded-xl border border-[#F3E8EE]">
              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 uppercase font-semibold">
                <Bed className="w-3 h-3 text-gray-400" />
                <span>Chambres</span>
              </div>
              <div className="text-xs font-black text-gray-900 mt-0.5">
                {property.bedrooms_count || 1} ch.
              </div>
            </div>
          </div>

          {/* DPE / GES preview & Seller info */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="shrink-0">
              <DpeBadge
                compact
                dpeLetter={property.dpe_letter}
                dpeValue={property.dpe_value}
                gesLetter={property.ges_letter}
                gesValue={property.ges_value}
              />
            </div>

            <div className="text-right overflow-hidden">
              <span className="text-[10px] text-gray-400 block truncate">Mandant</span>
              <span className="text-xs font-semibold text-gray-800 truncate block">
                {property.seller_name}
              </span>
            </div>
          </div>

          {/* Diffusion Indicators */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                property.publish_website
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              Web
            </span>
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                property.publish_leboncoin
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              LBC
            </span>
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                property.publish_seloger
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              SeLoger
            </span>
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                property.publish_bienici
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              Bien’ici
            </span>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5">
          <Link
            href={`/cockpit/mandats/${property.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#131B26] hover:bg-[#E12B7B] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fiche</span>
          </Link>

          <Link
            href={`/cockpit/fiches-vitrine?propertyId=${property.id}`}
            title="Générer l’affiche vitrine A4"
            className="p-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-[#FDF2F8] hover:text-[#E12B7B] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </Link>

          {onShare && (
            <button
              type="button"
              onClick={() => onShare(property)}
              title="Partager le lien du bien"
              className="p-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-[#FDF2F8] hover:text-[#E12B7B] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            href={`/cockpit/mandats/${property.id}/edit`}
            title="Modifier le mandat"
            className="p-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-[#FDF2F8] hover:text-[#E12B7B] transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
