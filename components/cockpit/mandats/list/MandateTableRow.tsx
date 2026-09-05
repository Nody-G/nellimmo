'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import { Eye, Edit, Share2 } from 'lucide-react';

interface MandateTableRowProps {
  property: Property;
  onShare?: (property: Property) => void;
}

export function MandateTableRow({ property, onShare }: MandateTableRowProps) {
  const mandateRef = formatMandateRef(property.mandate_number);

  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      {/* Mandate Number */}
      <td className="p-4 font-mono font-black text-sm">
        <Link href={`/cockpit/mandats/${property.id}`} className="text-[#E12B7B] hover:underline block">
          {mandateRef}
        </Link>
        <span className="text-[10px] text-gray-400">N° d’ordre #{property.mandate_number}</span>
      </td>

      {/* Title & City */}
      <td className="p-4">
        <Link href={`/cockpit/mandats/${property.id}`} className="flex items-center gap-3 group">
          <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <span className="font-bold text-gray-900 group-hover:text-[#E12B7B] transition truncate block max-w-[220px]">
              {property.title}
            </span>
            <span className="text-[11px] text-gray-500 block">
              {property.city} ({property.postal_code}) • {property.living_area} m² ({property.rooms_count}p)
            </span>
          </div>
        </Link>
      </td>

      {/* Seller info */}
      <td className="p-4">
        <span className="font-semibold text-gray-900 block">{property.seller_name}</span>
        <span className="text-[10px] text-gray-500 block">{property.seller_phone}</span>
      </td>

      {/* Pricing */}
      <td className="p-4">
        <span className="font-bold text-sm text-gray-900 block">
          {property.price_fai.toLocaleString('fr-FR')} €
        </span>
        <span className="text-[10px] text-gray-400 block">
          Net: {property.price_net_seller.toLocaleString('fr-FR')} € (dont {property.agency_fees_percentage}%)
        </span>
      </td>

      {/* Type & Dates */}
      <td className="p-4">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mb-1 ${
            property.mandate_type === 'exclusif' ? 'bg-[#FDF2F8] text-[#E12B7B]' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {property.mandate_type}
        </span>
        <span className="text-[10px] text-gray-400 block">
          Du {property.mandate_date} au {property.mandate_end_date}
        </span>
      </td>

      {/* DPE */}
      <td className="p-4">
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 font-bold text-[10px]">
            DPE {property.dpe_letter || '-'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 font-bold text-[10px]">
            GES {property.ges_letter || '-'}
          </span>
        </div>
      </td>

      {/* Channels */}
      <td className="p-4">
        <div className="flex items-center gap-1 text-[10px]">
          <span
            className={`px-1.5 py-0.5 rounded ${property.publish_website ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-300'}`}
            title="Site Web"
          >
            Web
          </span>
          <span
            className={`px-1.5 py-0.5 rounded ${property.publish_seloger ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-300'}`}
            title="SeLoger"
          >
            SL
          </span>
          <span
            className={`px-1.5 py-0.5 rounded ${property.publish_leboncoin ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-300'}`}
            title="LeBonCoin"
          >
            LBC
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
            property.status === 'actif'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : property.status === 'sous_compromis'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : property.status === 'vendu'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {property.status.replace('_', ' ')}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4 text-right space-x-1">
        {onShare && (
          <button
            type="button"
            onClick={() => onShare(property)}
            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition inline-flex items-center"
            title="Partager par WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
        <Link
          href={`/cockpit/mandats/${property.id}`}
          className="p-1.5 bg-gray-100 hover:bg-[#131B26] hover:text-white rounded-lg transition inline-flex items-center"
          title="Vue 360°"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/cockpit/mandats/${property.id}/edit`}
          className="p-1.5 bg-gray-100 hover:bg-[#E12B7B] hover:text-white rounded-lg transition inline-flex items-center"
          title="Modifier le mandat"
        >
          <Edit className="w-3.5 h-3.5" />
        </Link>
      </td>
    </tr>
  );
}
