'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { formatMandateRef } from '@/lib/hoguet';
import {
  FileText,
  PlusCircle,
  Search,
  Download,
  Eye,
  Edit,
  FileSpreadsheet
} from 'lucide-react';

export default function MandatesListPage() {
  const { properties } = useNellimoStore();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('tous');
  const [selectedType, setSelectedType] = useState<string>('tous');

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatMandateRef(p.mandate_number).toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'tous' || p.status === selectedStatus;
      const matchType = selectedType === 'tous' || p.mandate_type === selectedType;

      return matchSearch && matchStatus && matchType;
    });
  }, [properties, searchQuery, selectedStatus, selectedType]);

  const handleExportCsv = () => {
    const headers = ['Ref_Mandat', 'Titre', 'Type_Bien', 'Ville', 'Prix_FAI', 'Net_Vendeur', 'Honoraires', 'Vendeur', 'Statut', 'Date_Debut', 'Date_Fin'];
    const rows = filteredProperties.map(p => [
      formatMandateRef(p.mandate_number),
      `"${p.title.replace(/"/g, '""')}"`,
      p.property_type,
      p.city,
      p.price_fai,
      p.price_net_seller,
      p.agency_fees_amount,
      `"${p.seller_name.replace(/"/g, '""')}"`,
      p.status,
      p.mandate_date,
      p.mandate_end_date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mandats_nellimmo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Fichier CSV des mandats téléchargé !', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <FileText className="w-4 h-4" />
            <span>Registre des Mandats</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Gestion des Mandats & Biens
          </h1>
          <p className="text-xs text-gray-500">
            Consultez et gérez l&apos;ensemble de vos mandats en cours et archivés.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            title="Exporter la sélection en CSV Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/cockpit/registre-dgccrf"
            className="px-3.5 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>DGCCRF</span>
          </Link>
          <Link
            href="/cockpit/mandats/nouveau"
            className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Mandat</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F3E8EE] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">

        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par réf., titre, ville ou vendeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
          />
        </div>

        {/* Filter selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-[#E12B7B]"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actif en vente</option>
            <option value="sous_compromis">Sous compromis</option>
            <option value="vendu">Vendu</option>
            <option value="archive">Archivé</option>
            <option value="resilie">Résilié</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-[#E12B7B]"
          >
            <option value="tous">Tous les types de mandat</option>
            <option value="exclusif">Mandat Exclusif</option>
            <option value="simple">Mandat Simple</option>
            <option value="semi-exclusif">Mandat Semi-Exclusif</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FCFAF7] border-b border-[#F3E8EE] text-gray-600 font-bold uppercase text-[10px]">
                <th className="p-4">N° Mandat</th>
                <th className="p-4">Bien & Titre</th>
                <th className="p-4">Vendeur (Mandant)</th>
                <th className="p-4">Prix FAI (Loi ALUR)</th>
                <th className="p-4">Type / Dates</th>
                <th className="p-4">Diagnostics</th>
                <th className="p-4">Canaux</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map((property) => {
                const mandateRef = formatMandateRef(property.mandate_number);

                return (
                  <tr key={property.id} className="hover:bg-gray-50/80 transition-colors">

                    {/* Mandate Number */}
                    <td className="p-4 font-mono font-black text-sm">
                      <Link
                        href={`/cockpit/mandats/${property.id}`}
                        className="text-[#E12B7B] hover:underline block"
                      >
                        {mandateRef}
                      </Link>
                      <span className="text-[10px] text-gray-400">N° d&apos;ordre #{property.mandate_number}</span>
                    </td>

                    {/* Title & City */}
                    <td className="p-4">
                      <Link
                        href={`/cockpit/mandats/${property.id}`}
                        className="flex items-center gap-3 group"
                      >
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mb-1 ${property.mandate_type === 'exclusif'
                        ? 'bg-[#FDF2F8] text-[#E12B7B]'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
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
                        <span className={`px-1.5 py-0.5 rounded ${property.publish_website ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-300'}`} title="Site Web">
                          Web
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${property.publish_seloger ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-300'}`} title="SeLoger">
                          SL
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${property.publish_leboncoin ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-300'}`} title="LeBonCoin">
                          LBC
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${property.status === 'actif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : property.status === 'sous_compromis'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : property.status === 'vendu'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1">
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
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
