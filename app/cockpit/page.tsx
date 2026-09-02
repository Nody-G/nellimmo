'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef, isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import {
  FileText,
  TrendingUp,
  Users,
  PenTool,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  Check,
  Landmark
} from 'lucide-react';

export default function CockpitDashboard() {
  const {
    properties,
    buyers,
    visits,
    transactions,
    contactLeads,
    estimationLeads,
    updateContactLeadStatus,
    deleteContactLead,
    updateEstimationLeadStatus,
    deleteEstimationLead
  } = useNellimoStore();

  const [activeLeadsTab, setActiveLeadsTab] = useState<'contacts' | 'estimations'>('contacts');

  const activeProperties = properties.filter((p) => p.status === 'actif');
  const totalFai = activeProperties.reduce((sum, p) => sum + p.price_fai, 0);
  const totalFees = activeProperties.reduce((sum, p) => sum + p.agency_fees_amount, 0);
  const exclusiveCount = activeProperties.filter((p) => p.mandate_type === 'exclusif').length;

  const activeTransactions = transactions.filter(t => t.status !== 'acte_signe' && t.status !== 'annule');
  const pendingClosingFees = activeTransactions.reduce((sum, t) => sum + (t.agency_fees_amount || 0), 0);

  const newContactsCount = contactLeads.filter((l) => l.status === 'nouveau').length;
  const newEstimationsCount = estimationLeads.filter((l) => l.status === 'nouveau').length;

  // Alerts
  const energyAuditProperties = activeProperties.filter((p) => isAuditEnergetiqueObligatoire(p.dpe_letter));
  const expiringProperties = activeProperties.filter((p) => {
    const end = new Date(p.mandate_end_date);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays >= 0;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Tableau de Bord & Supervision
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26]">
            Bonjour Nelly, voici l&apos;état de votre agence
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pélissanne & Provence • Système d&apos;exploitation transactionnelle autonome
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cockpit/transactions"
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
          >
            <Landmark className="w-4 h-4 text-blue-600" />
            Ventes ({activeTransactions.length})
          </Link>
          <Link
            href="/cockpit/mandats/nouveau"
            className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Mandat
          </Link>
          <Link
            href="/cockpit/avis-de-valeur"
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <TrendingUp className="w-4 h-4 text-[#C59A45]" />
            Avis DVF
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1 : Portefeuille Actif */}
        <div className="bg-white rounded-2xl p-5 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">Portefeuille Actif</span>
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">
              {totalFai.toLocaleString('fr-FR')} €
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-[#E12B7B]">{activeProperties.length} mandats</span>
              <span>• dont {exclusiveCount} exclusifs</span>
            </div>
          </div>
        </div>

        {/* Card 2 : Honoraires Potentiels */}
        <div className="bg-white rounded-2xl p-5 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">Honoraires Attendus</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF3EF] text-[#3D4E41] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#3D4E41]">
              {totalFees.toLocaleString('fr-FR')} €
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Pipeline total TTC
            </div>
          </div>
        </div>

        {/* Card 3 : Ventes & Notaire */}
        <Link
          href="/cockpit/transactions"
          className="bg-white rounded-2xl p-5 border border-[#F3E8EE] shadow-xs space-y-3 hover:border-blue-400 hover:shadow-md transition block group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500 group-hover:text-blue-600 transition">Ventes Notaire</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-950">
              {pendingClosingFees.toLocaleString('fr-FR')} €
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
              <span>{activeTransactions.length} dossiers en cours</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        {/* Card 4 : Acquéreurs CRM */}
        <div className="bg-white rounded-2xl p-5 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">Acquéreurs Actifs</span>
            <div className="w-8 h-8 rounded-lg bg-[#FBF6E9] text-[#C59A45] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">
              {buyers.filter((b) => b.status === 'actif').length} contacts
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Rapprochements CRM
            </div>
          </div>
        </div>

        {/* Card 5 : Bons de Visite */}
        <div className="bg-white rounded-2xl p-5 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">Bons Signés</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">
              {visits.length} visites
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Signatures horodatées
            </div>
          </div>
        </div>

      </div>

      {/* Alerts & Vigilance Section */}
      {(energyAuditProperties.length > 0 || expiringProperties.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Energy audit alert */}
          {energyAuditProperties.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-amber-900 block text-sm">
                  Vigilance Audit Énergétique ({energyAuditProperties.length} bien(s))
                </span>
                <p className="text-amber-800">
                  Les mandats classés F ou G nécessitent un audit énergétique conforme avant toute promesse de vente.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  {energyAuditProperties.map((p) => (
                    <Link
                      key={p.id}
                      href={`/cockpit/mandats/${p.id}`}
                      className="px-2 py-0.5 bg-amber-200 text-amber-900 font-semibold rounded hover:bg-amber-300 transition"
                    >
                      {formatMandateRef(p.mandate_number)} ({p.city})
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expiring mandates alert */}
          {expiringProperties.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
              <Clock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-blue-900 block text-sm">
                  Échéances de Mandats Proches ({expiringProperties.length})
                </span>
                <p className="text-blue-800">
                  Pensez à renouveler ou faire le point sur la stratégie de prix avant la fin de période irrévocable.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  {expiringProperties.map((p) => (
                    <Link
                      key={p.id}
                      href={`/cockpit/mandats/${p.id}`}
                      className="px-2 py-0.5 bg-blue-200 text-blue-900 font-semibold rounded hover:bg-blue-300 transition"
                    >
                      {formatMandateRef(p.mandate_number)} - Fin: {p.mandate_end_date}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Leads & Demandes Entrantes (Site Vitrine) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                Leads Entrants Site Vitrine
              </span>
              {(newContactsCount > 0 || newEstimationsCount > 0) && (
                <span className="px-2 py-0.5 rounded-full bg-[#FDF2F8] text-[#E12B7B] text-[10px] font-black animate-pulse">
                  {newContactsCount + newEstimationsCount} nouveau(x)
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-xl text-[#131B26] mt-0.5">
              Demandes de Contact & Estimations en Ligne
            </h3>
            <p className="text-xs text-gray-500">
              Traitement rapide en 1 clic : appel téléphonique ou message WhatsApp immédiat.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveLeadsTab('contacts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeLeadsTab === 'contacts'
                  ? 'bg-[#131B26] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contacts & Visites ({contactLeads.length})</span>
            </button>
            <button
              onClick={() => setActiveLeadsTab('estimations')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeLeadsTab === 'estimations'
                  ? 'bg-[#131B26] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#C59A45]" />
              <span>Demandes d&apos;Estimation ({estimationLeads.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1 : Contacts & Visites */}
        {activeLeadsTab === 'contacts' && (
          <div className="space-y-3">
            {contactLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Aucun message de contact pour le moment.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {contactLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 p-3 rounded-2xl transition"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{lead.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          lead.status === 'nouveau'
                            ? 'bg-[#FDF2F8] text-[#E12B7B]'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.status}
                        </span>
                        {lead.subject && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 capitalize">
                            {lead.subject}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {lead.property_title && (
                        <Link
                          href={lead.property_id ? `/cockpit/mandats/${lead.property_id}` : '/cockpit/mandats'}
                          className="text-xs font-semibold text-[#E12B7B] hover:underline flex items-center gap-1 block"
                        >
                          <span>Bien concerné : {lead.property_title}</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}

                      <p className="text-xs text-gray-600 leading-relaxed bg-[#FCFAF7] p-2.5 rounded-xl border border-[#F3E8EE]">
                        « {lead.message} »
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-[#E12B7B] font-mono font-bold">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </a>
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-[#E12B7B]">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${lead.name}, Nelly Fernandez de l'agence Nell'Immo. J'ai bien reçu votre message concernant votre projet immobilier. Êtes-vous disponible pour en discuter ?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {lead.status === 'nouveau' ? (
                        <button
                          onClick={() => updateContactLeadStatus(lead.id, 'traite')}
                          className="p-2 bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-xl transition cursor-pointer"
                          title="Marquer comme traité"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateContactLeadStatus(lead.id, 'nouveau')}
                          className="p-2 bg-emerald-50 text-emerald-700 rounded-xl transition cursor-pointer"
                          title="Remettre en nouveau"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteContactLead(lead.id)}
                        className="p-2 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2 : Estimations */}
        {activeLeadsTab === 'estimations' && (
          <div className="space-y-3">
            {estimationLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Aucune demande d&apos;estimation en attente.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {estimationLeads.map((est) => (
                  <div
                    key={est.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 p-3 rounded-2xl transition"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{est.first_name} {est.last_name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          est.status === 'nouveau'
                            ? 'bg-[#FDF2F8] text-[#E12B7B]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {est.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(est.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <div className="text-xs text-gray-700 font-medium">
                        🏡 {est.property_type === 'maison' ? 'Maison/Villa' : est.property_type} de <strong>{est.living_area} m²</strong> {est.land_area ? `sur ${est.land_area} m² de terrain` : ''} • {est.city} ({est.address}) {est.has_pool ? '🏊 Piscine' : ''}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                        <a href={`tel:${est.phone}`} className="flex items-center gap-1 hover:text-[#E12B7B] font-mono font-bold">
                          <Phone className="w-3 h-3" />
                          {est.phone}
                        </a>
                        <a href={`mailto:${est.email}`} className="flex items-center gap-1 hover:text-[#E12B7B]">
                          <Mail className="w-3 h-3" />
                          {est.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link
                        href={`/cockpit/avis-de-valeur?city=${encodeURIComponent(est.city)}&surface=${est.living_area}&owner=${encodeURIComponent(`${est.first_name} ${est.last_name}`)}`}
                        className="px-3 py-1.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-[#C59A45]" />
                        <span>Avis DVF</span>
                      </Link>

                      <a
                        href={`https://wa.me/${est.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${est.first_name}, Nelly Fernandez de l'agence Nell'Immo à Pélissanne. J'ai bien reçu votre demande d'avis de valeur pour votre bien situé à ${est.city}. J'ai préparé une première étude comparative DVF. Souhaitez-vous que nous en parlions de vive voix ?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {est.status === 'nouveau' ? (
                        <button
                          onClick={() => updateEstimationLeadStatus(est.id, 'avis_envoye')}
                          className="p-2 bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-xl transition cursor-pointer"
                          title="Marquer comme avis envoyé"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateEstimationLeadStatus(est.id, 'nouveau')}
                          className="p-2 bg-emerald-50 text-emerald-700 rounded-xl transition cursor-pointer"
                          title="Remettre en nouveau"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteEstimationLead(est.id)}
                        className="p-2 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Split Grid : Recent Mandates & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols : Active Mandates Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#131B26]">
                Derniers Mandats Enregistrés
              </h3>
              <p className="text-xs text-gray-500">Gestion active du portefeuille</p>
            </div>
            <Link
              href="/cockpit/mandats"
              className="text-xs font-bold uppercase text-[#E12B7B] hover:text-[#C71B62] flex items-center gap-1"
            >
              <span>Voir tout le registre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">N° Mandat</th>
                  <th className="pb-3">Bien / Ville</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Prix FAI</th>
                  <th className="pb-3">DPE</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.slice(0, 8).map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-3 font-mono font-bold">
                      <Link
                        href={`/cockpit/mandats/${property.id}`}
                        className="text-[#E12B7B] group-hover:underline block"
                      >
                        {formatMandateRef(property.mandate_number)}
                      </Link>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/cockpit/mandats/${property.id}`}
                        className="flex items-center gap-2.5 block"
                      >
                        <img
                          src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
                          alt=""
                          className="w-10 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="font-bold text-gray-900 group-hover:text-[#E12B7B] transition truncate block max-w-[200px]">
                            {property.title}
                          </span>
                          <span className="text-[11px] text-gray-500">{property.city} ({property.living_area} m²)</span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        property.mandate_type === 'exclusif'
                          ? 'bg-[#FDF2F8] text-[#E12B7B]'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {property.mandate_type}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-gray-900">
                      {property.price_fai.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 font-bold text-[10px]">
                        {property.dpe_letter || '-'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        property.status === 'actif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : property.status === 'sous_compromis'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/cockpit/mandats/${property.id}`}
                        className="px-2.5 py-1 bg-gray-100 group-hover:bg-[#131B26] group-hover:text-white rounded-lg transition text-xs font-bold inline-flex items-center gap-1"
                        title="Ouvrir le mandat"
                      >
                        <span>Ouvrir</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col : Fast Action Box & Direct Multidiffusion */}
        <div className="space-y-6">
          
          {/* Direct Tools Card */}
          <div className="bg-[#131B26] text-white rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-[#C59A45] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Actions Rapides Transaction
            </div>
            
            <div className="space-y-2.5">
              <Link
                href="/cockpit/avis-de-valeur"
                className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C59A45]" />
                  <span>Avis de Valeur & Estimation</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/cockpit/visites"
                className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-blue-400" />
                  <span>Bons de Visite</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/cockpit/fiches-vitrine"
                className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Fiches Vitrine & Affiches</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/cockpit/diffusion"
                className="w-full p-3 bg-[#E12B7B] hover:bg-[#C71B62] rounded-xl text-xs font-bold flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  <span>Multidiffusion Portails</span>
                </div>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">Actif</span>
              </Link>
            </div>
          </div>

          {/* Audit trail summary */}
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Registre & Traçabilité
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Toutes les créations et modifications de mandats sont archivées et traçables en temps réel.
            </p>
            <div className="pt-1">
              <Link
                href="/cockpit/registre-dgccrf"
                className="text-xs font-bold text-[#E12B7B] hover:underline"
              >
                Consulter le registre →
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
