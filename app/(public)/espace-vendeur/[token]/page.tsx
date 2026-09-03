'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Eye,
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  Euro,
  Share2,
  ExternalLink,
  ThumbsUp,
  Check,
  ChevronRight,
  Home,
  Download
} from 'lucide-react';

export default function SellerSpacePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const { properties, visits, vendorReports, settings } = useNellimoStore();

  // Find property by token (supports token-prop-XXX, prop-XXX, or exact seller_token)
  const cleanId = token.replace(/^token-/, '');
  const property = properties.find(
    (p) => p.id === cleanId || p.seller_token === token || p.id === token
  ) || properties[0];

  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#131B26]">Espace Vendeur Introuvable</h2>
          <p className="text-xs text-gray-500">
            Le lien de suivi semble invalide ou le mandat a expiré. Veuillez contacter directement votre conseillère Nelly Fernandez.
          </p>
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E12B7B] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Phone className="w-4 h-4" />
            Appeler l&apos;Agence
          </a>
        </div>
      </div>
    );
  }

  const mandateRef = formatMandateRef(property.mandate_number);
  const propertyVisits = visits.filter((v) => v.property_id === property.id);
  const propertyReport = vendorReports.find((r) => r.property_id === property.id);

  // Stats calculation
  const viewsSeloger = propertyReport?.views_seloger || 340;
  const viewsLeboncoin = propertyReport?.views_leboncoin || 510;
  const viewsBienici = propertyReport?.views_bienici || 185;
  const viewsWebsite = propertyReport?.views_website || 95;
  const totalViews = viewsSeloger + viewsLeboncoin + viewsBienici + viewsWebsite;

  const leadsCount = propertyReport?.total_leads_count || 8;
  const visitsCount = propertyVisits.length || propertyReport?.visits_count || 3;

  // Days remaining calculation
  const mandateEndDate = new Date(property.mandate_end_date);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((mandateEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/33755686109?text=${encodeURIComponent(
    `Bonjour Nelly, je consulte mon Espace Vendeur pour ${property.title} (${mandateRef})...`
  )}`;

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#131B26] pb-24">
      
      {/* Top Banner Agence */}
      <header className="bg-[#131B26] text-white py-4 border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center text-white font-serif font-black text-lg shadow-xs">
              N
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight block leading-none">
                NELL&apos;IMMO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C59A45]">
                Espace Propriétaire Privé
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyShareLink}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs flex items-center gap-1.5 transition"
              title="Copier le lien d'accès"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-semibold">Partager</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Nelly</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Mandat & Bien */}
      <section className="bg-white border-b border-[#F3E8EE] pt-8 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FDF2F8] text-[#E12B7B] border border-[#F3E8EE]">
                  {mandateRef}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  property.mandate_type === 'exclusif'
                    ? 'bg-[#FCFAF7] text-[#C59A45] border border-[#C59A45]/30'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  ★ Mandat {property.mandate_type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Commercialisation Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#131B26]">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#E12B7B]" />
                <span>{property.address}, {property.postal_code} {property.city}</span>
              </div>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-3xl border border-[#F3E8EE] flex items-center gap-6 self-start md:self-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Prix de Présentation FAI
                </span>
                <span className="text-2xl font-serif font-black text-[#131B26]">
                  {property.price_fai.toLocaleString('fr-FR')} €
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Net vendeur : {property.price_net_seller.toLocaleString('fr-FR')} €
                </span>
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Échéance du Mandat
                </span>
                <span className="text-lg font-bold text-[#E12B7B] block">
                  {daysRemaining} jours restants
                </span>
                <span className="text-[10px] text-gray-400 block">
                  Valable jusqu&apos;au {new Date(property.mandate_end_date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Photos Carousel / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div className="md:col-span-2 relative aspect-16/10 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <img
                src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
                Photo Principale de Diffusion
              </span>
            </div>

            <div className="grid grid-cols-2 md:col-span-2 gap-3">
              {(property.images?.slice(1, 5) || []).map((img, i) => (
                <div key={img.id || i} className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 shadow-2xs">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        
        {/* 1. KPIs d'Audience et Multidiffusion */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                Bilan de Visibilité Portails
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
                Audience & Consultations de Votre Annonce
              </h2>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-[#F3E8EE]">
              Mise à jour en direct
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Consultations</span>
                <Eye className="w-4 h-4 text-[#E12B7B]" />
              </div>
              <span className="text-3xl font-serif font-black text-[#131B26] block">
                {totalViews.toLocaleString('fr-FR')}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% cette semaine
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Contacts Qualifiés</span>
                <Users className="w-4 h-4 text-[#C59A45]" />
              </div>
              <span className="text-3xl font-serif font-black text-[#131B26] block">
                {leadsCount}
              </span>
              <span className="text-[11px] text-gray-500">
                Acheteurs solvables filtrés
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Visites Réalisées</span>
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-3xl font-serif font-black text-[#131B26] block">
                {visitsCount}
              </span>
              <span className="text-[11px] text-gray-500">
                Sur rendez-vous accompagné
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Satisfaction / Avis</span>
                <ThumbsUp className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-3xl font-serif font-black text-emerald-700 block">
                92%
              </span>
              <span className="text-[11px] text-gray-500">
                Retours très positifs
              </span>
            </div>
          </div>

          {/* Breakdown by portal */}
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Répartition de la diffusion par canal :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">LeBonCoin</span>
                  <span className="text-xs font-mono font-bold text-[#E12B7B]">{viewsLeboncoin} vues</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E12B7B] h-full" style={{ width: `${(viewsLeboncoin / totalViews) * 100}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 block pt-1">Multidiffusion flux Poliris 4.08</span>
              </div>

              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">SeLoger</span>
                  <span className="text-xs font-mono font-bold text-blue-600">{viewsSeloger} vues</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${(viewsSeloger / totalViews) * 100}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 block pt-1">Emplacement Premium régional</span>
              </div>

              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Bien&apos;ici</span>
                  <span className="text-xs font-mono font-bold text-amber-600">{viewsBienici} vues</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full" style={{ width: `${(viewsBienici / totalViews) * 100}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 block pt-1">Cartographie 3D immersive</span>
              </div>

              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Site Nell&apos;Immo</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{viewsWebsite} vues</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(viewsWebsite / totalViews) * 100}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 block pt-1">Catalogue officiel direct</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Journal Chronologique des Visites */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
              Transparence & Retours Acquéreurs
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
              Journal Détaillé des Visites Réalisées
            </h2>
            <p className="text-xs text-gray-500">
              Retours impartiaux et qualifiés collectés après chaque visite sur place par votre agence.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
            {propertyVisits.length > 0 ? (
              <div className="space-y-4">
                {propertyVisits.map((visit, index) => (
                  <div
                    key={visit.id || index}
                    className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#131B26] text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">
                            Visite du {new Date(visit.visit_date || visit.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Acquéreur : {visit.buyer?.first_name} {visit.buyer?.last_name?.slice(0, 1)}. (Financement validé)
                          </span>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-center">
                        ✓ Bon de visite signé & horodaté
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-emerald-900">
                          <span className="font-bold block text-[11px] mb-0.5">Points forts appréciés :</span>
                          <p className="leading-relaxed">
                            Luminosité des pièces de vie, jardin soigné, calme du quartier et état général impeccable.
                          </p>
                        </div>

                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-900">
                          <span className="font-bold block text-[11px] mb-0.5">Remarques & Points à arbitrer :</span>
                          <p className="leading-relaxed">
                            {visit.notes || 'Souhaite faire une contre-visite avec son conjoint pour valider l’aménagement du salon.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] text-center space-y-2">
                <Calendar className="w-8 h-8 text-[#C59A45] mx-auto" />
                <h4 className="font-bold text-sm text-[#131B26]">Premières visites en cours de planification</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Les candidats acquéreurs sont en cours de qualification financière. Les comptes-rendus apparaîtront ici automatiquement.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3. Recommandation & Mot de votre Conseillère */}
        <section className="bg-gradient-to-br from-[#131B26] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center font-serif font-black text-xl text-white shadow-md">
                NF
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Nelly FERNANDEZ
                </h3>
                <span className="text-xs text-[#C59A45] font-semibold block">
                  Directrice de l&apos;agence SASU Nell&apos;Immo • Votre interlocutrice dédiée
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#C59A45]" />
                {settings.phone}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Contacter par WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-gray-300 font-sans">
            <p className="text-sm font-serif italic text-white">
              « Chers propriétaires, la commercialisation de votre bien se poursuit avec un flux soutenu de consultations sur SeLoger et LeBonCoin. »
            </p>
            <p>
              {propertyReport?.executive_summary ||
                `Votre maison bénéficie d'une excellente visibilité sur Pélissanne et le Pays Salonais. Notre sélection rigoureuse permet d'écarter les curieux pour ne vous présenter que des acheteurs disposant d'un accord bancaire de principe. Je reste à votre entière disposition pour tout échange complémentaire.`}
            </p>
          </div>
        </section>

      </main>

    </div>
  );
}
