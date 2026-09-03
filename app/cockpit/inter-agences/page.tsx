'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  Users2,
  FileSignature,
  Printer,
  ShieldCheck,
  Building2,
  Handshake,
  Percent,
  Calendar,
  CheckCircle2,
  PlusCircle,
  FileText,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Phone,
  Mail,
  AlertTriangle,
  X
} from 'lucide-react';

interface PartnerAgency {
  id: string;
  agency_name: string;
  director_name: string;
  cpi_number: string;
  city: string;
  phone: string;
  email: string;
  financial_guarantee: string;
}

interface DelegationAgreement {
  id: string;
  property_id: string;
  partner_id: string;
  fee_share_ratio: '50_50' | '60_40' | '70_30';
  delegation_type: 'co_exclusivite' | 'simple_delegation';
  start_date: string;
  end_date: string;
  status: 'active' | 'en_attente_signature' | 'terminee' | 'vendu_partage';
  special_clauses?: string;
}

const INITIAL_PARTNERS: PartnerAgency[] = [
  {
    id: 'part-1',
    agency_name: 'Agence Provençale de Salon',
    director_name: 'Jean-Marc Bertrand',
    cpi_number: 'CPI 1310 2021 000 012 345',
    city: 'Salon-de-Provence',
    phone: '04 90 56 12 34',
    email: 'contact@agenceprovencale-salon.fr',
    financial_guarantee: 'Galian (140 000 €)'
  },
  {
    id: 'part-2',
    agency_name: 'Immobilier du Pays d\'Aix & Luberon',
    director_name: 'Stéphanie Martin',
    cpi_number: 'CPI 1310 2018 000 034 567',
    city: 'Aix-en-Provence',
    phone: '04 42 20 55 66',
    email: 'direction@immo-paysdaix.com',
    financial_guarantee: 'SNPI (120 000 €)'
  },
  {
    id: 'part-3',
    agency_name: 'Lambesc Prestige & Propriétés',
    director_name: 'Laurent Mercier',
    cpi_number: 'CPI 1310 2020 000 023 890',
    city: 'Lambesc',
    phone: '04 42 92 88 10',
    email: 'contact@lambesc-prestige.fr',
    financial_guarantee: 'QBE Europe (120 000 €)'
  }
];

const INITIAL_DELEGATIONS: DelegationAgreement[] = [
  {
    id: 'del-101',
    property_id: 'prop-227',
    partner_id: 'part-1',
    fee_share_ratio: '50_50',
    delegation_type: 'co_exclusivite',
    start_date: '2026-02-01',
    end_date: '2026-05-01',
    status: 'active',
    special_clauses: 'Visites accompagnées obligatoires par Nell\'Immo lors des 2 premières semaines.'
  }
];

export default function InterAgencesPage() {
  const { properties } = useNellimoStore();
  const [partners, setPartners] = useState<PartnerAgency[]>(INITIAL_PARTNERS);
  const [delegations, setDelegations] = useState<DelegationAgreement[]>(INITIAL_DELEGATIONS);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState<DelegationAgreement | null>(null);

  // New Delegation Form State
  const [isNewDelegationModalOpen, setIsNewDelegationModalOpen] = useState(false);
  const [formPropertyId, setFormPropertyId] = useState(properties[0]?.id || '');
  const [formPartnerId, setFormPartnerId] = useState(INITIAL_PARTNERS[0].id);
  const [formShareRatio, setFormShareRatio] = useState<'50_50' | '60_40' | '70_30'>('50_50');
  const [formDelegationType, setFormDelegationType] = useState<'co_exclusivite' | 'simple_delegation'>('co_exclusivite');
  const [formDurationDays, setFormDurationDays] = useState(90);

  const activeProperties = properties.filter((p) => p.status === 'actif');

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const endDate = new Date(now.getTime() + formDurationDays * 24 * 3600 * 1000);

    const newDelegation: DelegationAgreement = {
      id: `del-${Date.now()}`,
      property_id: formPropertyId,
      partner_id: formPartnerId,
      fee_share_ratio: formShareRatio,
      delegation_type: formDelegationType,
      start_date: now.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
      special_clauses: 'Partage d\'honoraires à 50/50 sous condition de communication du bon de visite dans les 24h.'
    };

    setDelegations([newDelegation, ...delegations]);
    setIsNewDelegationModalOpen(false);
    setSelectedDelegation(newDelegation);
    setIsContractModalOpen(true);
  };

  const getPartner = (id: string) => partners.find((p) => p.id === id) || partners[0];
  const getProperty = (id: string) => properties.find((p) => p.id === id) || properties[0];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Handshake className="w-4 h-4" />
            <span>Fichier Commun & Partage Confrères (L&apos;Alternative Supérieure à Interkab)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Bourse Inter-Agences & Délégations de Mandats
          </h1>
          <p className="text-xs text-gray-500">
            Déléguez vos mandats exclusifs en toute sécurité juridique (Loi Hoguet Art. 65 & 77) avec répartition claire des honoraires 50/50.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsNewDelegationModalOpen(true)}
            className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle Convention de Délégation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Délégations Actives</span>
          <div className="text-2xl font-black text-gray-900">
            {delegations.filter((d) => d.status === 'active').length} mandats
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Partage 50/50 en cours</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Confrères Partenaires Agréés</span>
          <div className="text-2xl font-black text-gray-900">
            {partners.length} agences
          </div>
          <span className="text-[11px] text-gray-500">Salon, Aix, Lambesc, Luberon</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Honoraires Partagés Potentiels</span>
          <div className="text-2xl font-black text-[#E12B7B]">
            {delegations.reduce((sum, d) => {
              const p = getProperty(d.property_id);
              return sum + (p ? Math.round(p.agency_fees_amount / 2) : 0);
            }, 0).toLocaleString('fr-FR')} €
          </div>
          <span className="text-[11px] text-gray-500">Part Nell&apos;Immo sécurisée</span>
        </div>
      </div>

      {/* Active Delegations Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
            <Handshake className="w-4 h-4 text-[#E12B7B]" />
            <span>Mandats Actuellement Délégués à des Confrères</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Bien / Mandat</th>
                <th className="pb-3">Agence Confrère Déléguée</th>
                <th className="pb-3">Type Délégation</th>
                <th className="pb-3">Clé Répartition</th>
                <th className="pb-3">Échéance</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3 text-right">Convention Légale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {delegations.map((d) => {
                const prop = getProperty(d.property_id);
                const partner = getPartner(d.partner_id);

                return (
                  <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5">
                      <span className="font-bold text-gray-900 block truncate max-w-xs">
                        {prop.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formatMandateRef(prop.mandate_number)} • {prop.city} • {prop.price_fai.toLocaleString('fr-FR')} €
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#131B26] block">{partner.agency_name}</span>
                      <span className="text-[10px] text-gray-500">{partner.director_name} ({partner.city})</span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {d.delegation_type === 'co_exclusivite' ? 'Co-Exclusivité' : 'Simple Délégation'}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-800">
                      {d.fee_share_ratio.replace('_', ' / ')}
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(d.end_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedDelegation(d);
                          setIsContractModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FileSignature className="w-3.5 h-3.5 text-[#C59A45]" />
                        <span>Voir Convention</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner Agencies Directory */}
      <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#C59A45]" />
          <span>Annuaire des Confrères Partenaires du Réseau Local</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {partners.map((p) => (
            <div key={p.id} className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
              <span className="font-bold text-gray-900 block text-sm">{p.agency_name}</span>
              <span className="text-[11px] text-gray-500 block">Dirigeant : {p.director_name}</span>
              <span className="text-[10px] font-mono text-gray-400 block">{p.cpi_number}</span>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-600">
                <span>📞 {p.phone}</span>
                <span className="text-[#E12B7B] font-semibold">{p.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal New Delegation */}
      {isNewDelegationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Établir une Délégation de Mandat
              </h3>
              <button onClick={() => setIsNewDelegationModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDelegation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Mandat à Déléguer</label>
                <select
                  value={formPropertyId}
                  onChange={(e) => setFormPropertyId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  {activeProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{formatMandateRef(p.mandate_number)}] {p.title} — {p.city} ({p.price_fai.toLocaleString('fr-FR')} € FAI)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Agence Confrère Déléguée</label>
                <select
                  value={formPartnerId}
                  onChange={(e) => setFormPartnerId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                >
                  {partners.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.agency_name} — {pt.director_name} ({pt.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Partage Honoraires</label>
                  <select
                    value={formShareRatio}
                    onChange={(e) => setFormShareRatio(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  >
                    <option value="50_50">50% / 50% (Standard équilibré)</option>
                    <option value="60_40">60% Nell&apos;Immo / 40% Confrère</option>
                    <option value="70_30">70% Nell&apos;Immo / 30% Confrère</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Durée (Jours)</label>
                  <input
                    type="number"
                    value={formDurationDays}
                    onChange={(e) => setFormDurationDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                Générer la Convention Conforme Loi Hoguet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Contract Preview & Print */}
      {isContractModalOpen && selectedDelegation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-[#E12B7B]" />
                <h3 className="font-serif font-bold text-lg text-[#131B26]">
                  Convention Officielle de Délégation de Mandat de Vente
                </h3>
              </div>
              <button onClick={() => setIsContractModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Legal Contract Text */}
            <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-gray-200 font-mono text-xs text-gray-800 space-y-4 leading-relaxed">
              <div className="text-center font-bold pb-2 border-b border-gray-200">
                <span className="text-sm block text-gray-900">CONVENTION DE DÉLÉGATION DE MANDAT DE VENTE</span>
                <span className="text-[10px] text-gray-500 font-normal">Conforme aux articles 65 et 77 du Décret n° 72-678 du 20 juillet 1972 (Loi Hoguet)</span>
              </div>

              <div>
                <strong>ENTRE LES SOUSSIGNÉS :</strong><br />
                <strong>1. LE DÉLÉGANT :</strong> SASU NELL&apos;IMMO, Capital 1 000 €, siège 145 Chemin des Oliviers, 13330 Pélissanne, représentée par Mme Nelly FERNANDEZ, titulaire de la Carte Professionnelle CPI 1310 2019 000 042 974 délivrée par la CCI d&apos;Aix-Marseille-Provence, garantie financière GALIAN (120 000 €).<br /><br />
                <strong>2. LE DÉLÉGUÉ :</strong> {getPartner(selectedDelegation.partner_id).agency_name}, représentée par {getPartner(selectedDelegation.partner_id).director_name}, titulaire de la Carte Professionnelle {getPartner(selectedDelegation.partner_id).cpi_number}, garantie {getPartner(selectedDelegation.partner_id).financial_guarantee}.
              </div>

              <div>
                <strong>ARTICLE 1 - OBJET DE LA DÉLÉGATION :</strong><br />
                Le Délégant, titulaire du Mandat N° {getProperty(selectedDelegation.property_id).mandate_number} portant sur le bien situé à {getProperty(selectedDelegation.property_id).address}, {getProperty(selectedDelegation.property_id).city}, au prix de {getProperty(selectedDelegation.property_id).price_fai.toLocaleString('fr-FR')} € FAI, délègue par les présentes au Délégué le pouvoir de présenter le bien à ses acquéreurs en portefeuille.
              </div>

              <div>
                <strong>ARTICLE 2 - ACCORD DU MANDANT :</strong><br />
                Le Délégant certifie détenir l&apos;accord exprès et écrit du mandant vendeur pour confier le bien en délégation à des confrères partenaires.
              </div>

              <div>
                <strong>ARTICLE 3 - RÉPARTITION DES HONORAIRES :</strong><br />
                En cas de vente conclue avec un acquéreur présenté par le Délégué, les honoraires d&apos;agence de {getProperty(selectedDelegation.property_id).agency_fees_amount.toLocaleString('fr-FR')} € TTC seront partagés selon la clé convenue de : <strong>{selectedDelegation.fee_share_ratio.replace('_', ' % / ')} %</strong>.
              </div>

              <div>
                <strong>ARTICLE 4 - NON-CONTOURNEMENT & DÉONTOLOGIE :</strong><br />
                Le Délégué s&apos;interdit formellement de démarcher directement le vendeur mandant sans l&apos;accord écrit préalable du Délégant pendant toute la durée du mandat et pendant 24 mois suivant son terme.
              </div>

              <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-4 text-center">
                <div>
                  <span>Pour le Délégant :</span><br />
                  <strong className="text-gray-900">Nelly FERNANDEZ (Nell&apos;Immo)</strong>
                </div>
                <div>
                  <span>Pour le Délégué :</span><br />
                  <strong className="text-gray-900">{getPartner(selectedDelegation.partner_id).director_name}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C59A45]" />
                <span>Imprimer la Convention</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
