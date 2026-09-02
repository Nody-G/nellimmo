'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import {
  Settings,
  Save,
  Radio,
  Award,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Users,
  Shield,
  PlusCircle,
  Share2,
  Calendar,
  MapPin,
  Star,
  ExternalLink,
  Key,
  Landmark,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';

export default function AgencySettingsPage() {
  const { settings, updateSettings, resetToDemoData } = useNellimoStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleResetDemo = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données vers le jeu de démonstration Provence (Pélissanne, Salon, Lambesc) ?')) {
      resetToDemoData();
      alert('Données réinitialisées avec succès !');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Settings className="w-4 h-4" />
            <span>Tour de Contrôle & Paramètres de l&apos;Agence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Paramètres, Passerelles & Connecteurs API
          </h1>
          <p className="text-xs text-gray-500">
            Configurez vos mentions légales Loi Hoguet, connectez vos réseaux sociaux et synchronisez votre écosystème Google.
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser Démo Provence
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 1. Agence, Carte T & Mentions Légales 2026 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26]">
              <Award className="w-5 h-5 text-[#E12B7B]" />
              <span>1. Identité Commerciale & Conformité Juridique (Loi Hoguet / ALUR)</span>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase">
              Conforme 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Raison Sociale</label>
              <input
                type="text"
                value={formData.agency_name}
                onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom de l&apos;Agent Immobilier (Dirigeante)</label>
              <input
                type="text"
                value={formData.agent_name}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Carte Professionnelle (Carte T)
              </label>
              <input
                type="text"
                value={formData.card_t_number}
                onChange={(e) => setFormData({ ...formData, card_t_number: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">CCI Délivrance</label>
              <input
                type="text"
                value={formData.cci_card_t || 'CCI Marseille Provence'}
                onChange={(e) => setFormData({ ...formData, cci_card_t: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">SIREN & Greffe RCS</label>
              <input
                type="text"
                value={`${formData.siren || '853 807 006'} - RCS ${formData.rcs_city || 'Salon-de-Provence'}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  setFormData({ ...formData, siren: parts[0]?.trim(), rcs_city: parts[1]?.replace('RCS', '').trim() });
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone Direct</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">E-mail Officiel</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Adresse Siège</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Code Postal & Ville</label>
              <input
                type="text"
                value={`${formData.postal_code} ${formData.city}`}
                onChange={(e) => {
                  const parts = e.target.value.split(' ');
                  setFormData({ ...formData, postal_code: parts[0] || '13330', city: parts.slice(1).join(' ') || 'Pélissanne' });
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          {/* Garanties et Notaires */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-4">
            <span className="text-xs font-bold uppercase text-[#C59A45] tracking-wider block">
              Garantie Financière, Médiation & Coordonnées Bancaires Notariales
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Garantie Financière</label>
                <input
                  type="text"
                  value={formData.guarantee_fund_name || 'GALIAN Assurances (120 000 €)'}
                  onChange={(e) => setFormData({ ...formData, guarantee_fund_name: e.target.value })}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Assurance RCP Pro</label>
                <input
                  type="text"
                  value={formData.insurance_name || 'MMA Entreprise (Police n° 114.240.230)'}
                  onChange={(e) => setFormData({ ...formData, insurance_name: e.target.value })}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Médiateur Consommation (DGCCRF)</label>
                <input
                  type="text"
                  value={formData.mediator_name || 'ANM Conso / Médiation FNAIM'}
                  onChange={(e) => setFormData({ ...formData, mediator_name: e.target.value })}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">IBAN Agence (Note d&apos;honoraires Notaires)</label>
                <input
                  type="text"
                  value={formData.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}
                  onChange={(e) => setFormData({ ...formData, agency_rib_iban: e.target.value })}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono text-[#131B26]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Code BIC / SWIFT</label>
                <input
                  type="text"
                  value={formData.agency_rib_bic || 'BNPAFRPP'}
                  onChange={(e) => setFormData({ ...formData, agency_rib_bic: e.target.value })}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Réseaux Sociaux & Auto-Publication (Meta & LinkedIn) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26]">
              <Share2 className="w-5 h-5 text-[#E12B7B]" />
              <span>2. Réseaux Sociaux & Auto-Publication (Meta Graph API & LinkedIn)</span>
            </div>
            <span className="px-3 py-1 bg-pink-50 text-[#E12B7B] border border-pink-200 rounded-full text-[10px] font-bold uppercase">
              Instagram / Facebook
            </span>
          </div>

          <p className="text-xs text-gray-600">
            Connectez votre compte Meta Business (Facebook Page & Instagram Professionnel). Lorsque vous rentrez un nouveau mandat exclusif, que vous baissez un prix ou vendez un bien, Cockpit génère et diffuse automatiquement vos publications.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Identifiant de Page Facebook (Page ID)
              </label>
              <input
                type="text"
                placeholder="Ex: nellimmo.immobilier"
                value={formData.facebook_page_id || ''}
                onChange={(e) => setFormData({ ...formData, facebook_page_id: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Compte Instagram Professionnel (ID / Handle)
              </label>
              <input
                type="text"
                placeholder="@nellimmo_provence"
                value={formData.instagram_business_id || ''}
                onChange={(e) => setFormData({ ...formData, instagram_business_id: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center justify-between">
              <span>Jeton d&apos;accès Meta Graph API (Page Access Token)</span>
              <span className="text-[11px] text-gray-400 font-normal">Chiffré & stocké en toute sécurité</span>
            </label>
            <input
              type="password"
              placeholder="EAAG... (Token longue durée Meta Graph API)"
              value={formData.facebook_page_access_token || ''}
              onChange={(e) => setFormData({ ...formData, facebook_page_access_token: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
            />
          </div>

          {/* Toggles d'Auto-publication */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
            <span className="text-xs font-bold uppercase text-[#131B26] tracking-wider block">
              Déclencheurs d&apos;Auto-Publication en 1 Clic
            </span>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.social_autopost_new_mandate ?? true}
                  onChange={(e) => setFormData({ ...formData, social_autopost_new_mandate: e.target.checked })}
                  className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                />
                <span className="text-xs text-gray-700 font-semibold">
                  Proposer la publication carrousel Instagram & Facebook dès l&apos;activation d&apos;un nouveau mandat exclusif
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.social_autopost_price_drop ?? true}
                  onChange={(e) => setFormData({ ...formData, social_autopost_price_drop: e.target.checked })}
                  className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                />
                <span className="text-xs text-gray-700 font-semibold">
                  Générer automatiquement un visuel & post &quot;Baisse de Prix&quot; lors d&apos;un avenant de mandat
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.social_autopost_sold ?? true}
                  onChange={(e) => setFormData({ ...formData, social_autopost_sold: e.target.checked })}
                  className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                />
                <span className="text-xs text-gray-700 font-semibold">
                  Publier la story &quot;Vendu par Nell&apos;Immo&quot; le jour de la réitération de l&apos;acte authentique
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Écosystème Google (Agenda, Maps, My Business, Contacts) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26]">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>3. Hub Écosystème Google (Mobile & Terrain de Nelly)</span>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase">
              Google Workspace
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Calendar ID (Synchronisation Visites)</span>
              </label>
              <input
                type="text"
                placeholder="nellimmo.acte@gmail.com"
                value={formData.google_calendar_id || ''}
                onChange={(e) => setFormData({ ...formData, google_calendar_id: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Permet d&apos;ajouter vos rendez-vous de visite en 1 clic directement dans votre agenda mobile avec alertes de départ.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Lien Direct d&apos;Avis Google My Business</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://g.page/r/nellimmo/review"
                  value={formData.google_my_business_url || ''}
                  onChange={(e) => setFormData({ ...formData, google_my_business_url: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
                {formData.google_my_business_url && (
                  <button
                    type="button"
                    onClick={() => handleCopy(formData.google_my_business_url || '', 'google_review')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1 shrink-0"
                  >
                    {copiedLink === 'google_review' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Envoyé automatiquement aux acquéreurs et vendeurs le jour de la signature de l&apos;acte notarié pour collecter les 5 étoiles.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Clé API Google Maps & Places (Optionnelle)</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={formData.google_maps_api_key || ''}
                onChange={(e) => setFormData({ ...formData, google_maps_api_key: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Pour le géocodage précis des commodités locales (écoles, gares, commerces).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Synchronisation Google Contacts</span>
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Carnet d&apos;adresses Téléphone</span>
                  <span className="text-[11px] text-gray-500">Ajoute les acheteurs/vendeurs au répertoire mobile</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.google_contacts_sync_enabled ?? true}
                  onChange={(e) => setFormData({ ...formData, google_contacts_sync_enabled: e.target.checked })}
                  className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Intelligence Artificielle (DeepSeek) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Cpu className="w-5 h-5 text-[#E12B7B]" />
            <span>4. Intelligence Artificielle & Studio de Rédaction</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Clé API DeepSeek
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={formData.deepseek_api_key || ''}
                onChange={(e) => setFormData({ ...formData, deepseek_api_key: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Utilisée par le Studio de Rédaction pour générer instantanément vos textes d&apos;annonces au style signature de Nelly (ou fallback local élégant sans frais).
              </span>
            </div>
          </div>
        </div>

        {/* 5. Paramètres Portails Directs (SFTP Poliris / SeLoger & LeBonCoin) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Radio className="w-5 h-5 text-[#E12B7B]" />
            <span>5. Passerelles & Multidiffusion Portails</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Code Agence Poliris</label>
              <input
                type="text"
                value={formData.seloger_agency_code}
                onChange={(e) => setFormData({ ...formData, seloger_agency_code: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E12B7B] focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Serveur SFTP SeLoger / Poliris</label>
              <input
                type="text"
                value={formData.seloger_sftp_host}
                onChange={(e) => setFormData({ ...formData, seloger_sftp_host: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Serveur SFTP LeBonCoin</label>
              <input
                type="text"
                value={formData.leboncoin_sftp_host}
                onChange={(e) => setFormData({ ...formData, leboncoin_sftp_host: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Jeton d&apos;API Flux XML Bien&apos;ici</label>
            <input
              type="text"
              value={formData.bienici_feed_token}
              onChange={(e) => setFormData({ ...formData, bienici_feed_token: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
            />
          </div>
        </div>

        {/* 6. Sauvegarde & Restauration Intégrale */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>6. Sauvegarde & Portabilité des Données de l&apos;Agence</span>
          </div>

          <p className="text-xs text-gray-600">
            Téléchargez une copie intégrale de sécurité de toute votre activité (mandats, acquéreurs, visites, transactions notaires, audit scellé SHA-256) ou restaurez un fichier JSON.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                const backupData = {
                  version: '2.5.0',
                  exported_at: new Date().toISOString(),
                  agency: formData.agency_name,
                  data: {
                    properties: JSON.parse(localStorage.getItem('nellimo_properties_v5') || '[]'),
                    buyers: JSON.parse(localStorage.getItem('nellimo_buyers_v4') || '[]'),
                    visits: JSON.parse(localStorage.getItem('nellimo_visits_v4') || '[]'),
                    auditLogs: JSON.parse(localStorage.getItem('nellimo_audit_v4') || '[]'),
                    transactions: JSON.parse(localStorage.getItem('nellimo_transactions_v1') || '[]'),
                    settings: formData,
                    contactLeads: JSON.parse(localStorage.getItem('nellimo_contact_leads_v4') || '[]'),
                    estimationLeads: JSON.parse(localStorage.getItem('nellimo_estimation_leads_v4') || '[]'),
                  }
                };

                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `nellimmo_master_backup_${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="p-4 bg-[#FCFAF7] hover:bg-emerald-50 border border-[#F3E8EE] hover:border-emerald-200 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div>
                <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block">
                  Exporter la Sauvegarde Master (JSON)
                </span>
                <span className="text-[11px] text-gray-500">Toutes les données de l&apos;agence en 1 clic</span>
              </div>
              <span className="text-xs font-black text-emerald-600">↓ Export</span>
            </button>

            <label className="p-4 bg-[#FCFAF7] hover:bg-amber-50 border border-[#F3E8EE] hover:border-amber-200 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group">
              <div>
                <span className="font-bold text-xs text-gray-900 group-hover:text-amber-800 block">
                  Restaurer depuis un Fichier JSON
                </span>
                <span className="text-[11px] text-gray-500">Charger une sauvegarde précédente</span>
              </div>
              <span className="text-xs font-black text-amber-600">↑ Importer</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const json = JSON.parse(event.target?.result as string);
                      if (json.data) {
                        if (json.data.properties) localStorage.setItem('nellimo_properties_v5', JSON.stringify(json.data.properties));
                        if (json.data.buyers) localStorage.setItem('nellimo_buyers_v4', JSON.stringify(json.data.buyers));
                        if (json.data.visits) localStorage.setItem('nellimo_visits_v4', JSON.stringify(json.data.visits));
                        if (json.data.auditLogs) localStorage.setItem('nellimo_audit_v4', JSON.stringify(json.data.auditLogs));
                        if (json.data.transactions) localStorage.setItem('nellimo_transactions_v1', JSON.stringify(json.data.transactions));
                        if (json.data.settings) localStorage.setItem('nellimo_settings_v4', JSON.stringify(json.data.settings));
                        if (json.data.contactLeads) localStorage.setItem('nellimo_contact_leads_v4', JSON.stringify(json.data.contactLeads));
                        if (json.data.estimationLeads) localStorage.setItem('nellimo_estimation_leads_v4', JSON.stringify(json.data.estimationLeads));
                        alert('Sauvegarde restaurée avec succès ! La page va se recharger.');
                        window.location.reload();
                      } else {
                        alert('Format de sauvegarde invalide.');
                      }
                    } catch (err) {
                      alert('Erreur lors de la lecture du fichier JSON.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tous les paramètres et connexions sont enregistrés !
            </span>
          ) : (
            <span className="text-xs text-gray-400">Toutes les modifications sont immédiatement actives sur votre cockpit.</span>
          )}

          <button
            type="submit"
            className="px-6 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Enregistrer les Paramètres
          </button>
        </div>

      </form>
    </div>
  );
}
