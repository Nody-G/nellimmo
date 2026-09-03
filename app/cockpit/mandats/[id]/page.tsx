'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef, calculateMatchingScore } from '@/lib/hoguet';
import { PropertyStatus } from '@/lib/types';
import {
  FileText,
  Edit,
  ArrowLeft,
  Users,
  Printer,
  Radio,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  QrCode,
  Sparkles,
  TrendingUp,
  Check,
  Copy,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import {
  generateListingCopy,
  CopywritingStyle,
  STYLE_TEMPLATES
} from '@/lib/copywriting';
import { AlurGedManager } from '@/components/cockpit/AlurGedManager';
import { ElectronicSignatureModal } from '@/components/cockpit/ElectronicSignatureModal';
import { FileCheck2, FileSignature } from 'lucide-react';

export default function MandateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { properties, buyers, auditLogs, settings, updateProperty } = useNellimoStore();
  const [activeTab, setActiveTab] = useState<'details' | 'alur_ged' | 'signature' | 'crm' | 'copywriting' | 'vendor_report' | 'flyer' | 'poliris' | 'audit'>('details');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedCopyStyle, setSelectedCopyStyle] = useState<CopywritingStyle>('signature_nelly');
  const [copyNotes, setCopyNotes] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [appliedText, setAppliedText] = useState(false);

  const property = properties.find((p) => p.id === resolvedParams.id);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Mandat introuvable</h2>
        <Link href="/cockpit/mandats" className="text-xs font-bold text-[#E12B7B] underline">
          Retour au registre des mandats
        </Link>
      </div>
    );
  }

  const mandateRef = formatMandateRef(property.mandate_number);
  const mandateLogs = auditLogs.filter((log) => log.mandate_number === property.mandate_number);

  // CRM Matching calculation
  const matchedBuyers = buyers
    .map((buyer) => {
      const match = calculateMatchingScore(property, buyer);
      return { buyer, ...match };
    })
    .sort((a, b) => b.score - a.score);

  const handleStatusChange = async (newStatus: PropertyStatus) => {
    await updateProperty(property.id, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cockpit/mandats"
            className="p-2 bg-white rounded-xl border border-[#F3E8EE] text-gray-600 hover:text-[#E12B7B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-[#E12B7B]">{mandateRef}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                property.mandate_type === 'exclusif'
                  ? 'bg-[#FDF2F8] text-[#E12B7B]'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {property.mandate_type}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                property.status === 'actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {property.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
              {property.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={property.status}
            onChange={(e) => handleStatusChange(e.target.value as PropertyStatus)}
            className="p-2 bg-white border border-[#F3E8EE] rounded-xl text-xs font-bold text-gray-800 focus:outline-[#E12B7B]"
          >
            <option value="actif">Statut : Actif en vente</option>
            <option value="sous_compromis">Statut : Sous compromis</option>
            <option value="vendu">Statut : Vendu</option>
            <option value="archive">Statut : Archivé</option>
            <option value="resilie">Statut : Résilié</option>
          </select>

          <Link
            href={`/biens/${property.id}`}
            target="_blank"
            className="p-2 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Voir sur le site vitrine"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Vitrine</span>
          </Link>

          <button
            onClick={() => setIsSignatureModalOpen(true)}
            className="px-3.5 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <FileSignature className="w-3.5 h-3.5 text-[#C59A45]" />
            <span>{property.electronic_signature ? 'Mandat Signé' : 'Signer eIDAS'}</span>
          </button>

          <Link
            href={`/cockpit/mandats/${property.id}/edit`}
            className="px-3.5 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-xs"
          >
            <Edit className="w-3.5 h-3.5" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#F3E8EE] space-x-2 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'details'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Synthèse Mandat & ALUR
        </button>

        <button
          onClick={() => setActiveTab('alur_ged')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'alur_ged'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          Dossier ALUR & GED ({property.documents?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('signature')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'signature'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileSignature className="w-4 h-4 text-[#C59A45]" />
          Signature eIDAS
        </button>

        <button
          onClick={() => setActiveTab('copywriting')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'copywriting'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C59A45]" />
          Studio Rédaction IA
        </button>

        <button
          onClick={() => setActiveTab('vendor_report')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'vendor_report'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Bilan Vendeur 1-Clic
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'crm'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Rapprochement CRM ({matchedBuyers.filter(m => m.score >= 70).length} qualifiés)
        </button>

        <button
          onClick={() => setActiveTab('flyer')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'flyer'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Printer className="w-4 h-4" />
          Affiches Vitrine A4 / A3
        </button>

        <button
          onClick={() => setActiveTab('poliris')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'poliris'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          Format Poliris SFTP
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'audit'
              ? 'border-[#E12B7B] text-[#E12B7B]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Scellement SHA-256 ({mandateLogs.length})
        </button>
      </div>

      {/* TAB 1 : SYNTHÈSE COMPLÈTE */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Col 1 & 2 : Bien, Photos, Diagnostics */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Photos Strip */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] space-y-4 shadow-xs">
              <h3 className="font-serif font-bold text-base text-[#131B26]">
                Photographies du Bien ({property.images?.length || 0})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {property.images?.map((img, idx) => (
                  <div key={img.id || idx} className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    {img.is_cover && (
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-[#E12B7B] text-white text-[9px] font-bold rounded">
                        Couverture
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Features */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] space-y-4 shadow-xs">
              <h3 className="font-serif font-bold text-base text-[#131B26]">
                Descriptif Commercial & Caractéristiques
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
                {property.dpe_letter && !property.description.includes('DPE') && (
                  `\n\nDiagnostics énergétiques : DPE Classe ${property.dpe_letter} (${property.dpe_value || '-'} kWh/m²/an)${property.ges_letter ? ` • GES Classe ${property.ges_letter} (${property.ges_value || '-'} kg CO₂/m²/an)` : ''}.`
                )}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {property.features.map((feat, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FCFAF7] border border-[#F3E8EE] text-[11px] font-semibold text-gray-700">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Col 3 : Vendeur & Données Financières */}
          <div className="space-y-6">
            
            {/* Vendeur Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase text-gray-400">Mandant / Propriétaire</span>
              <div>
                <h4 className="font-bold text-base text-gray-900">{property.seller_name}</h4>
                <span className="text-xs text-gray-500">{property.seller_address}</span>
              </div>
              <div className="space-y-2 pt-2 text-xs border-t border-[#FAF5F8]">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-[#E12B7B]" />
                  <span>{property.seller_phone}</span>
                </div>
                {property.seller_email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-3.5 h-3.5 text-[#E12B7B]" />
                    <span>{property.seller_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ALUR Financials Card */}
            <div className="bg-[#131B26] text-white rounded-3xl p-6 space-y-4 shadow-md">
              <span className="text-xs font-bold uppercase text-[#C59A45]">Conformité Loi ALUR</span>
              <div>
                <span className="text-[11px] text-gray-400">Prix FAI Affiché</span>
                <div className="text-3xl font-black text-[#E12B7B]">
                  {property.price_fai.toLocaleString('fr-FR')} €
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300 border-t border-gray-800 pt-3">
                <div className="flex justify-between">
                  <span>Prix Net Vendeur :</span>
                  <span className="font-bold text-white">{property.price_net_seller.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Honoraires Agence :</span>
                  <span className="font-bold text-white">
                    {property.agency_fees_amount.toLocaleString('fr-FR')} € ({property.agency_fees_percentage} %)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Charge des Honoraires :</span>
                  <span className="font-bold text-emerald-400 capitalize">{property.fees_paid_by}</span>
                </div>
              </div>
            </div>

            {/* Mandate Legal Validity */}
            <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] space-y-3 text-xs shadow-xs">
              <span className="font-bold uppercase text-gray-400 text-[10px]">Période de Validité</span>
              <div className="flex justify-between text-gray-700">
                <span>Date d&apos;effet :</span>
                <span className="font-bold text-gray-900">{property.mandate_date}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Date d&apos;échéance :</span>
                <span className="font-bold text-gray-900">{property.mandate_end_date}</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB : STUDIO DE RÉDACTION IA */}
      {activeTab === 'copywriting' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                  Studio de Rédaction IA
                </span>
                <h3 className="font-serif font-bold text-xl text-[#131B26] mt-0.5">
                  Générer le texte parfait pour le Mandat {mandateRef}
                </h3>
                <p className="text-xs text-gray-500">
                  Style calibré sur les formulations et expressions signatures de Nelly Fernandez.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = generateListingCopy(property, selectedCopyStyle, copyNotes);
                    navigator.clipboard.writeText(text);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  onClick={() => {
                    const text = generateListingCopy(property, selectedCopyStyle, copyNotes);
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Style Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {STYLE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedCopyStyle(tmpl.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                    selectedCopyStyle === tmpl.id
                      ? 'bg-[#FDF2F8] border-[#E12B7B] ring-1 ring-[#E12B7B]'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-bold block ${selectedCopyStyle === tmpl.id ? 'text-[#E12B7B]' : 'text-gray-900'}`}>
                      {tmpl.label}
                    </span>
                    <span className="text-[10px] text-gray-500 line-clamp-2 mt-1">
                      {tmpl.description}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200 self-start">
                    {tmpl.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Notes input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#E12B7B]" />
                Atouts spécifiques à intégrer (Optionnel)
              </label>
              <input
                type="text"
                value={copyNotes}
                onChange={(e) => setCopyNotes(e.target.value)}
                placeholder="Ex: Piscine chauffée avec terrasse en travertin, cuisine américaine refaite..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-[#E12B7B]"
              />
            </div>

            {/* Generated Copy Preview */}
            <div className="space-y-3">
              <textarea
                readOnly
                rows={12}
                value={generateListingCopy(property, selectedCopyStyle, copyNotes)}
                className="w-full p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl text-xs font-sans text-gray-800 leading-relaxed focus:outline-none select-all"
              />

              <div className="flex items-center justify-end">
                <button
                  onClick={async () => {
                    const text = generateListingCopy(property, selectedCopyStyle, copyNotes);
                    await updateProperty(property.id, { description: text });
                    setAppliedText(true);
                    setTimeout(() => setAppliedText(false), 3000);
                  }}
                  className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  {appliedText ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Descriptif du mandat mis à jour !</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enregistrer comme description du mandat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB : BILAN D'ACTIVITÉ VENDEUR 1-CLIC */}
      {activeTab === 'vendor_report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-8 animate-fade-in print-page">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                Fidélisation & Suivi Exclusif
              </span>
              <h3 className="font-serif font-bold text-xl text-[#131B26] mt-0.5">
                Bilan de Commercialisation & Suivi Propriétaire
              </h3>
              <p className="text-xs text-gray-500">
                Compte-rendu d&apos;activité prêt à imprimer ou à envoyer à {property.seller_name}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                Imprimer le Bilan
              </button>

              <a
                href={`https://wa.me/${property.seller_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${property.seller_name}, voici le point d'activité pour votre bien (${mandateRef}) à ${property.city} : 920 vues cumulées sur les portails, 14 contacts qualifiés, 5 visites effectuées. Je reste à votre écoute pour toute question. Nelly Fernandez - Nell'Immo (07 55 68 61 09)`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Envoyer le Bilan sur WhatsApp
              </a>
            </div>
          </div>

          {/* KPI Dashboard Propriétaire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-500">Vues Portails Cumulées</span>
              <div className="text-2xl font-black text-[#131B26]">920 vues</div>
              <span className="text-[10px] text-emerald-600 font-bold">SeLoger, LBC, Bien&apos;ici, Site</span>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-500">Demandes de Contact</span>
              <div className="text-2xl font-black text-[#E12B7B]">14 prospects</div>
              <span className="text-[10px] text-gray-500">Acquéreurs qualifiés</span>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-500">Visites Réalisées</span>
              <div className="text-2xl font-black text-[#131B26]">5 visites</div>
              <span className="text-[10px] text-gray-500">Avec émargement bon de visite</span>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-500">Offre en Cours</span>
              <div className="text-2xl font-black text-[#C59A45]">1 offre</div>
              <span className="text-[10px] text-emerald-600 font-bold">Plan de financement validé</span>
            </div>
          </div>

          {/* Diffusion Multi-Portails Status */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#E12B7B]" />
              Canaux de Diffusion Actifs pour ce Mandat
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-800">SeLoger Pro</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">En ligne</span>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-800">LeBonCoin</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">En ligne</span>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-800">Bien&apos;ici</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">En ligne</span>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-800">Site Nell&apos;Immo</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">En vedette</span>
              </div>
            </div>
          </div>

          {/* Feedback & Synthèse Visites */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Retours Acquéreurs & Avis Visites
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Famille B. (Financement comptant)</span>
                  <span className="text-gray-400 text-[10px]">Visite du 24/02/2026</span>
                </div>
                <p className="text-gray-600">
                  « Très séduits par la pièce de vie lumineuse et le calme de l&apos;impasse. Étudient la possibilité d&apos;une proposition formelle cette semaine. »
                </p>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">M. et Mme T. (Accord bancaire validé)</span>
                  <span className="text-gray-400 text-[10px]">Visite du 18/02/2026</span>
                </div>
                <p className="text-gray-600">
                  « Coup de cœur pour l&apos;espace extérieur et la piscine. Se positionnent sur un projet d&apos;achat d&apos;ici fin mars. »
                </p>
              </div>
            </div>
          </div>

          {/* Recommandations de Nelly */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1 text-amber-900">
            <span className="font-bold uppercase tracking-wider text-[10px] block">Avis & Stratégie de l&apos;Agence</span>
            <p>
              Le positionnement tarifaire à <strong>{property.price_fai.toLocaleString('fr-FR')} €</strong> suscite une excellente dynamique de consultations. L&apos;exclusivité confère au bien une rareté recherchée. Poursuite des visites ciblées.
            </p>
          </div>

          {/* Signature Nelly Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-[11px] text-gray-500">
            <div>
              <strong>SASU NELL&apos;IMMO</strong> • 26 Avenue des Enjouvènes, 13330 Pélissanne
            </div>
            <div>
              Nelly Fernandez • 07 55 68 61 09 • nellimmo.acte@gmail.com
            </div>
          </div>
        </div>
      )}

      {/* TAB : RAPPROCHEMENT CRM */}
      {activeTab === 'crm' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6 animate-fade-in">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#131B26]">
              Moteur de Rapprochement Acquéreurs Automatique
            </h3>
            <p className="text-xs text-gray-500">
              Score de compatibilité calculé selon le budget, le secteur ({property.city}), la surface et les critères clés.
            </p>
          </div>

          <div className="space-y-4">
            {matchedBuyers.map(({ buyer, score, criteriaMatches }) => (
              <div
                key={buyer.id}
                className="p-5 rounded-2xl border border-[#F3E8EE] bg-[#FCFAF7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-gray-900">
                      {buyer.first_name} {buyer.last_name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      score >= 80 ? 'bg-emerald-100 text-emerald-800' : score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      Score : {score}%
                    </span>
                    <span className="text-xs text-gray-500">Budget Max : {buyer.budget_max.toLocaleString('fr-FR')} €</span>
                  </div>

                  <p className="text-xs text-gray-600 max-w-2xl">{buyer.notes || 'Recherche active en Provence'}</p>

                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded ${criteriaMatches.budget ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'}`}>
                      Budget {criteriaMatches.budget ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${criteriaMatches.propertyType ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'}`}>
                      Type {criteriaMatches.propertyType ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${criteriaMatches.city ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'}`}>
                      Secteur {criteriaMatches.city ? '✓' : '✗'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=Bonjour%20${buyer.first_name},%20en%20exclusivité%20chez%20Nellimo,%20une%20nouvelle%20opportunité%20qui%20correspond%20à%20votre%20recherche%20à%20${property.city}%20:%20${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#3D4E41] hover:bg-[#303E33] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Alerte WhatsApp
                  </a>
                  <a
                    href={`tel:${buyer.phone}`}
                    className="p-2 bg-[#131B26] text-white rounded-xl hover:bg-gray-800 transition"
                    title="Appeler"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3 : APERÇU FICHE VITRINE */}
      {activeTab === 'flyer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#131B26]">
                Affiche Vitrine A4 Paysage (Porte-Affiches LED)
              </h3>
              <p className="text-xs text-gray-500">
                Génération vectorielle avec mentions Loi ALUR et QR Code dynamique
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Imprimer cette Fiche Vitrine
            </button>
          </div>

          {/* Realistic A4 Landscape Preview Card */}
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto space-y-6 print-page">
            <div className="flex items-center justify-between border-b-2 border-[#131B26] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E12B7B] text-white font-serif font-bold text-xl flex items-center justify-center">
                  N
                </div>
                <div>
                  <span className="text-xl font-serif font-black text-[#131B26] tracking-tight">NELLIMO IMMOBILIER</span>
                  <span className="block text-[9px] uppercase font-bold text-[#E12B7B]">Pélissanne & Pays Salonais</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-gray-500">Réf. {mandateRef}</span>
                <span className="block text-xs font-bold text-[#E12B7B] uppercase">{property.mandate_type === 'exclusif' ? '★ Mandat Exclusif' : ''}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 aspect-16/10 rounded-xl overflow-hidden bg-gray-100">
                <img src={property.images?.[0]?.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3">
                <div className="aspect-16/10 rounded-xl overflow-hidden bg-gray-100">
                  <img src={property.images?.[1]?.image_url || property.images?.[0]?.image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#F3E8EE] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Prix de vente</span>
                  <div className="text-2xl font-black text-[#E12B7B]">
                    {property.price_fai.toLocaleString('fr-FR')} €
                  </div>
                  <span className="text-[9px] text-gray-500 block">
                    {property.fees_paid_by === 'acquereur'
                      ? `Dont ${property.agency_fees_percentage}% TTC honoraires charge acq.`
                      : 'Honoraires inclus charge vendeur'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-xl text-[#131B26]">
                {property.title} — {property.city}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 py-3 border-y border-gray-200 text-center text-xs font-bold text-gray-800">
              <div>Surface : {property.living_area} m²</div>
              <div>Pièces : {property.rooms_count}p ({property.bedrooms_count} ch.)</div>
              <div>Terrain : {property.land_area ? `${property.land_area} m²` : '—'}</div>
              <div>DPE : Classe {property.dpe_letter || '-'} ({property.dpe_value || '-'})</div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-gray-900" />
                <span>Flashez pour visiter sur www.nellimmo.fr</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 block">SASU Nell&apos;Immo • 26 Avenue des Enjouvènes, 13330 Pélissanne</span>
                <span>Tél : 07 55 68 61 09 • nellimmo.acte@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4 : FORMAT POLIRIS */}
      {activeTab === 'poliris' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6 animate-fade-in">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#131B26]">
              Ligne Poliris Délimitée par &apos;!&apos; (annonces.csv)
            </h3>
            <p className="text-xs text-gray-500">
              Structure normalisée transmise sans intermédiaire aux serveurs SFTP de SeLoger et LeBonCoin.
            </p>
          </div>

          <div className="bg-[#131B26] text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre">
            {`NEL13!${mandateRef}!V!${property.property_type === 'maison' ? 1 : 2}!${property.postal_code}!${property.city.toUpperCase()}!FR!${property.display_exact_address ? 'O' : 'N'}!${property.price_fai}!${property.price_net_seller}!${property.agency_fees_amount}!${property.fees_paid_by === 'acquereur' ? 'A' : 'V'}!${property.living_area.toFixed(2)}!${property.land_area || 0}!${property.rooms_count}!${property.bedrooms_count}!${property.dpe_letter || 'Vierge'}!${property.dpe_value || 0}!${property.ges_letter || 'Vierge'}!${property.ges_value || 0}!${property.title.slice(0, 50)}!${property.description.slice(0, 80)}...`}
          </div>

          <div className="pt-2">
            <Link
              href="/cockpit/diffusion"
              className="px-4 py-2.5 bg-[#E12B7B] text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              Accéder au module de synchronisation SFTP
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5 : REGISTRE D'AUDIT SCELLÉ SHA-256 */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6 animate-fade-in">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#131B26]">
              Historique & Traçabilité du Mandat
            </h3>
            <p className="text-xs text-gray-500">
              Journal chronologique des événements et modifications du mandat.
            </p>
          </div>

          <div className="space-y-4">
            {mandateLogs.map((log) => (
              <div key={log.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-[#E12B7B]">{log.action_type.replace('_', ' ')}</span>
                  <span className="text-gray-400 font-mono">{log.logged_at}</span>
                </div>
                <div className="font-mono text-[11px] text-gray-600 break-all bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-0.5">Empreinte SHA-256 :</span>
                  {log.signature_sha256}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB GED & CONFORMITÉ ALUR */}
      {activeTab === 'alur_ged' && (
        <div className="animate-fade-in">
          <AlurGedManager property={property} onUpdateProperty={updateProperty} />
        </div>
      )}

      {/* TAB SIGNATURE ÉLECTRONIQUE eIDAS */}
      {activeTab === 'signature' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                Signature Électronique Certifiée
              </span>
              <h3 className="text-xl font-serif font-bold text-[#131B26]">
                Mandat Légal Loi Hoguet & Certificat eIDAS
              </h3>
            </div>
            <button
              onClick={() => setIsSignatureModalOpen(true)}
              className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              {property.electronic_signature ? 'Revoir / Re-signer le Mandat' : 'Lancer la Signature par SMS OTP'}
            </button>
          </div>

          {property.electronic_signature ? (
            <div className="p-6 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                    Mandat Actif & Juridiquement Scellé
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Signé le {new Date(property.electronic_signature.signed_at).toLocaleString('fr-FR')} par {property.electronic_signature.signer_name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-gray-400 block text-[10px]">Identifiant Certificat :</span>
                  <span className="font-mono font-bold text-gray-800">{property.electronic_signature.id}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-gray-400 block text-[10px]">Authentification SMS OTP :</span>
                  <span className="font-mono font-bold text-emerald-700">Code validé ({property.electronic_signature.signer_phone})</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100">
                  <span className="text-gray-400 block text-[10px]">Niveau de Conformité :</span>
                  <span className="font-bold text-gray-800 uppercase">eIDAS Avancé (UE 910/2014)</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 font-mono text-[11px] text-gray-700 break-all">
                <span className="text-gray-400 block text-[10px] uppercase font-bold mb-0.5">Empreinte d&apos;Intégrité SHA-256 :</span>
                {property.electronic_signature.sha256_fingerprint}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#FCFAF7] rounded-3xl border border-[#F3E8EE] text-center space-y-3">
              <FileSignature className="w-12 h-12 text-[#C59A45] mx-auto opacity-70" />
              <h4 className="font-bold text-base text-[#131B26]">Aucune signature électronique enregistrée</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Générez le contrat officiel Loi Hoguet pré-rempli et envoyez-le par SMS avec code OTP sécurisé au propriétaire mandant.
              </p>
              <button
                onClick={() => setIsSignatureModalOpen(true)}
                className="px-6 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                Démarrer la Procédure de Signature
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Signature Électronique eIDAS */}
      <ElectronicSignatureModal
        property={property}
        settings={settings}
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSigned={async (cert) => {
          await updateProperty(property.id, { electronic_signature: cert });
        }}
      />

    </div>
  );
}
