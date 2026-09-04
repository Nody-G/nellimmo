'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/lib/types';

interface PropertiesDiffusionTableProps {
  properties: Property[];
}

export function PropertiesDiffusionTable({ properties }: PropertiesDiffusionTableProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            État de Diffusion par Annonce ({properties.length} biens actifs)
          </h3>
          <p className="text-xs text-gray-500">
            Cliquez sur une annonce pour modifier son contenu ou gérez directement ses passerelles ci-dessous.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
              <th className="pb-3">Mandat</th>
              <th className="pb-3">Annonce</th>
              <th className="pb-3">Prix FAI</th>
              <th className="pb-3 text-center">Site Nell&apos;Immo</th>
              <th className="pb-3 text-center">SeLoger</th>
              <th className="pb-3 text-center">LeBonCoin</th>
              <th className="pb-3 text-center">Bien&apos;ici</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="py-3.5 font-mono font-bold">
                  <Link
                    href={`/cockpit/mandats/${p.id}`}
                    className="text-[#E12B7B] group-hover:underline block"
                  >
                    #{p.mandate_number}
                  </Link>
                </td>
                <td className="py-3.5">
                  <Link
                    href={`/cockpit/mandats/${p.id}`}
                    className="flex items-center gap-3 block"
                  >
                    <div className="relative w-11 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-gray-900 group-hover:text-[#E12B7B] transition truncate block max-w-[240px]">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-gray-500">{p.city} ({p.living_area} m²)</span>
                    </div>
                  </Link>
                </td>
                <td className="py-3.5 font-bold text-gray-900">
                  {p.price_fai.toLocaleString('fr-FR')} €
                </td>
                <td className="py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.publish_website ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {p.publish_website ? 'Actif' : 'Non'}
                  </span>
                </td>
                <td className="py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.publish_seloger ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                    {p.publish_seloger ? 'Diffusé' : 'Non'}
                  </span>
                </td>
                <td className="py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.publish_leboncoin ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
                    {p.publish_leboncoin ? 'Diffusé' : 'Non'}
                  </span>
                </td>
                <td className="py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.publish_bienici ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                    {p.publish_bienici ? 'Diffusé' : 'Non'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
