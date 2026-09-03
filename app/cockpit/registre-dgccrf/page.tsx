'use client';

import React from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import { ShieldCheck, Printer } from 'lucide-react';

export default function DgccrfRegisterPage() {
  const { properties, auditLogs, settings } = useNellimoStore();

  const sortedProperties = [...properties].sort((a, b) => a.mandate_number - b.mandate_number);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Registre des Mandats</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Registre Officiel des Mandats
          </h1>
          <p className="text-xs text-gray-500">
            Registre exhaustif des mandats de transaction de l&apos;agence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#C59A45]" />
            Imprimer le Registre
          </button>
        </div>
      </div>

      {/* Legal Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4 print-page">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-[#E12B7B]">REGISTRE DES MANDATS • LOI HOGUET</span>
            <h2 className="font-serif font-black text-xl text-[#131B26]">
              REGISTRE DES MANDATS DE L&apos;AGENCE IMMOBILIÈRE NELLIMO
            </h2>
            <span className="text-xs text-gray-500 block">
              Titulaire de la Carte Professionnelle : {settings.card_t_number}
            </span>
          </div>

          <div className="p-3 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] text-xs text-right space-y-0.5">
            <span className="font-bold text-gray-900 block">Agence Nellimo</span>
            <span className="text-gray-500">{settings.address}, {settings.postal_code} {settings.city}</span>
            <span suppressHydrationWarning className="text-gray-400 block text-[10px]">Horodatage UTC : {new Date().toISOString()}</span>
          </div>
        </div>

        {/* Continuous Inviolable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-y border-gray-300 text-gray-700 font-bold uppercase text-[10px]">
                <th className="p-3">N° Ordre</th>
                <th className="p-3">Date Effet / Fin</th>
                <th className="p-3">Mandant (Vendeur)</th>
                <th className="p-3">Nature Mandat</th>
                <th className="p-3">Désignation du Bien</th>
                <th className="p-3">Prix Net Vendeur</th>
                <th className="p-3">Honoraires TTC & Débiteur</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Scellement SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProperties.map((p) => {
                const mandateRef = formatMandateRef(p.mandate_number);
                const auditLog = auditLogs.find((l) => l.mandate_number === p.mandate_number);

                return (
                  <tr key={p.id} className="hover:bg-gray-50 group">
                    <td className="p-3 font-mono font-bold">
                      <Link
                        href={`/cockpit/mandats/${p.id}`}
                        className="text-[#E12B7B] group-hover:underline block"
                      >
                        #{p.mandate_number}
                      </Link>
                      <span className="text-[10px] text-gray-400 block font-normal">{mandateRef}</span>
                    </td>
                    <td className="p-3 text-[11px]">
                      <span className="font-bold">{p.mandate_date}</span>
                      <span className="text-gray-400 block">au {p.mandate_end_date}</span>
                    </td>
                    <td className="p-3">
                      <strong className="block text-gray-900">{p.seller_name}</strong>
                      <span className="text-[10px] text-gray-500">{p.seller_address}</span>
                    </td>
                    <td className="p-3 font-bold uppercase text-[10px]">
                      {p.mandate_type}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/cockpit/mandats/${p.id}`}
                        className="font-semibold text-gray-900 group-hover:text-[#E12B7B] transition block"
                      >
                        {p.title}
                      </Link>
                      <span className="text-[10px] text-gray-500">{p.city} • {p.living_area} m²</span>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {p.price_net_seller.toLocaleString('fr-FR')} €
                    </td>
                    <td className="p-3 text-[11px]">
                      <span className="font-bold">{p.agency_fees_amount.toLocaleString('fr-FR')} €</span> ({p.agency_fees_percentage}%)
                      <span className="text-gray-400 block capitalize">Charge {p.fees_paid_by}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[9px] text-gray-400 max-w-[120px] truncate" title={auditLog?.signature_sha256}>
                      {auditLog ? `${auditLog.signature_sha256.slice(0, 16)}...` : 'Certifié'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legal Signatures block */}
        <div className="pt-8 border-t border-gray-300 flex justify-between text-xs text-gray-600">
          <div>
            <span>Conformité Décret 72-678 (Art. 6) • Archivage légal 10 ans</span>
          </div>
          <div className="text-right">
            <span>Signature et Cachet du titulaire de la Carte Professionnelle :</span>
            <div className="mt-8 font-serif font-bold text-gray-900">
              Nelly F. — Nellimo Immobilier
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
