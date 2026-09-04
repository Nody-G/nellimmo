'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import type { Property } from '@/lib/types';
import { auditPropertyCompliance } from '@/lib/compliance';

type PortalChannelKey =
  | 'publish_website'
  | 'publish_seloger'
  | 'publish_leboncoin'
  | 'publish_bienici'
  | 'publish_figaro'
  | 'publish_greenacres'
  | 'publish_facebook';

interface DiffusionTableRowProps {
  property: Property;
  onToggle: (propertyId: string, channel: PortalChannelKey) => void;
  onInspectCompliance: (property: Property) => void;
}

export function DiffusionTableRow({
  property,
  onToggle,
  onInspectCompliance,
}: DiffusionTableRowProps) {
  const compliance = auditPropertyCompliance(property);

  const channels: { key: PortalChannelKey; label: string; active: boolean; activeColor: string }[] = [
    {
      key: 'publish_website',
      label: 'Site',
      active: property.publish_website,
      activeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      key: 'publish_seloger',
      label: 'SeLoger',
      active: property.publish_seloger,
      activeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      key: 'publish_leboncoin',
      label: 'LBC',
      active: property.publish_leboncoin,
      activeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      key: 'publish_bienici',
      label: 'Bien’ici',
      active: property.publish_bienici,
      activeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      key: 'publish_figaro',
      label: 'Figaro',
      active: Boolean(property.publish_figaro),
      activeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      key: 'publish_greenacres',
      label: 'Green-Acres',
      active: Boolean(property.publish_greenacres),
      activeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      key: 'publish_facebook',
      label: 'Facebook',
      active: Boolean(property.publish_facebook),
      activeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
  ];

  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      <td className="py-3.5 px-3 font-mono font-bold text-xs">
        <Link
          href={`/cockpit/mandats/${property.id}`}
          className="text-[#E12B7B] group-hover:underline block"
        >
          #{property.mandate_number}
        </Link>
      </td>

      <td className="py-3.5 px-3">
        <Link href={`/cockpit/mandats/${property.id}`} className="flex items-center gap-2.5">
          <div className="relative w-10 h-7 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={
                property.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'
              }
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <span className="font-bold text-gray-900 group-hover:text-[#E12B7B] transition truncate block max-w-[200px] text-xs">
              {property.title}
            </span>
            <span className="text-[10px] text-gray-500">
              {property.city} • {property.living_area} m²
            </span>
          </div>
        </Link>
      </td>

      <td className="py-3.5 px-3 font-bold text-gray-900 text-xs whitespace-nowrap">
        {property.price_fai.toLocaleString('fr-FR')} €
      </td>

      {/* Compliance Badge */}
      <td className="py-3.5 px-3 text-center">
        <button
          type="button"
          onClick={() => onInspectCompliance(property)}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border transition hover:opacity-80 cursor-pointer ${
            compliance.status === 'compliant'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : compliance.status === 'warning'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
          title="Cliquez pour auditer la conformité ALUR"
        >
          {compliance.status === 'compliant' ? (
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
          ) : compliance.status === 'warning' ? (
            <AlertTriangle className="w-3 h-3 text-amber-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-rose-600" />
          )}
          <span>{compliance.score}%</span>
        </button>
      </td>

      {/* Interactive Portal Toggles */}
      {channels.map((ch) => (
        <td key={ch.key} className="py-3.5 px-1.5 text-center">
          <button
            type="button"
            onClick={() => onToggle(property.id, ch.key)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold border transition cursor-pointer ${
              ch.active
                ? ch.activeColor
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
            title={`Basculer ${ch.label}`}
          >
            {ch.active ? 'Diffusé' : 'Non'}
          </button>
        </td>
      ))}
    </tr>
  );
}
