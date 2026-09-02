'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { Settings, Save, Radio, Award, RotateCcw, CheckCircle2, Cpu, Users, Shield, PlusCircle } from 'lucide-react';

export default function AgencySettingsPage() {
  const { settings, updateSettings, resetToDemoData } = useNellimoStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemo = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données vers le jeu de démonstration Provence (Pélissanne, Salon, Lambesc) ?')) {
      resetToDemoData();
      alert('Données réinitialisées avec succès !');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Settings className="w-4 h-4" />
            <span>Configuration Système & Connexions Directes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Paramètres de l&apos;Agence & Passerelles
          </h1>
          <p className="text-xs text-gray-500">
            Personnalisez vos mentions légales, connexions IA DeepSeek, clés SFTP et gestion des accès.
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

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Agence & Carte T */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Award className="w-5 h-5 text-[#E12B7B]" />
            <span>1. Identité Commerciale & Mentions Légales</span>
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
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nom de l&apos;Agent Immobilier / Dirigeante</label>
              <input
                type="text"
                value={formData.agent_name}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Numéro de Carte Professionnelle (Carte T)
            </label>
            <input
              type="text"
              value={formData.card_t_number}
              onChange={(e) => setFormData({ ...formData, card_t_number: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Ville & Code Postal</label>
              <input
                type="text"
                value={`${formData.city} (${formData.postal_code})`}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              />
            </div>
          </div>
        </div>

        {/* 2. Intelligence Artificielle */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Cpu className="w-5 h-5 text-[#E12B7B]" />
            <span>2. Intelligence Artificielle</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Clé API
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={formData.deepseek_api_key || ''}
                onChange={(e) => setFormData({ ...formData, deepseek_api_key: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Utilisée par le Studio de Rédaction pour générer automatiquement vos textes.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Paramètres Portails Directs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Radio className="w-5 h-5 text-[#E12B7B]" />
            <span>3. Passerelles & Multidiffusion</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Code Agence</label>
              <input
                type="text"
                value={formData.seloger_agency_code}
                onChange={(e) => setFormData({ ...formData, seloger_agency_code: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E12B7B] focus:outline-[#E12B7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Serveur SFTP SeLoger</label>
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

        {/* 4. Gestion des Utilisateurs & Rôles */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26]">
              <Users className="w-5 h-5 text-[#E12B7B]" />
              <span>4. Utilisateurs & Permissions d&apos;Accès</span>
            </div>
            <button
              type="button"
              onClick={() => alert('Option prête : vous pourrez inviter un commercial mandataire avec accès restreint à ses propres mandats.')}
              className="text-xs font-bold text-[#E12B7B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Ajouter un commercial
            </button>
          </div>

          <div className="space-y-3">
            {/* Nelly Fernandez */}
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E12B7B] text-white flex items-center justify-center font-bold text-xs">
                  NF
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-900 block">Nelly Fernandez</span>
                  <span className="text-[11px] text-gray-500">nellimmo.acte@gmail.com</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-rose-50 text-[#E12B7B] border border-rose-200 rounded-full text-[10px] font-bold uppercase">
                Présidente / Agent Principal
              </span>
            </div>

            {/* Administrateur Technique */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#131B26] text-white flex items-center justify-center font-bold text-xs">
                  <Shield className="w-4 h-4 text-[#C59A45]" />
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-900 block">Administrateur Technique</span>
                  <span className="text-[11px] text-gray-500">admin@nellimmo.fr</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-[10px] font-bold uppercase">
                Admin Système & Base
              </span>
            </div>
          </div>
        </div>

        {/* 5. Sauvegarde & Restauration de la Base de Données */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#131B26] border-b border-[#FAF5F8] pb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>5. Sauvegarde & Portabilité des Données</span>
          </div>

          <p className="text-xs text-gray-600">
            Téléchargez une copie intégrale de sécurité de votre agence (mandats, acquéreurs, visites, leads, logs scellés SHA-256) ou restaurez un fichier de sauvegarde.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                const backupData = {
                  version: '2.0.0',
                  exported_at: new Date().toISOString(),
                  agency: formData.agency_name,
                  data: {
                    properties: JSON.parse(localStorage.getItem('nellimo_properties_v5') || localStorage.getItem('nellimo_properties_v4') || '[]'),
                    buyers: JSON.parse(localStorage.getItem('nellimo_buyers_v4') || '[]'),
                    visits: JSON.parse(localStorage.getItem('nellimo_visits_v4') || '[]'),
                    auditLogs: JSON.parse(localStorage.getItem('nellimo_audit_v4') || '[]'),
                    settings: formData,
                    contactLeads: JSON.parse(localStorage.getItem('nellimo_contact_leads_v4') || '[]'),
                    estimationLeads: JSON.parse(localStorage.getItem('nellimo_estimation_leads_v4') || '[]'),
                  }
                };

                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `nellimmo_backup_${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="p-4 bg-[#FCFAF7] hover:bg-emerald-50 border border-[#F3E8EE] hover:border-emerald-200 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div>
                <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block">
                  Exporter la Sauvegarde JSON
                </span>
                <span className="text-[11px] text-gray-500">Télécharger toutes les données de l&apos;agence</span>
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
              Paramètres enregistrés avec succès !
            </span>
          ) : (
            <span className="text-xs text-gray-400">Toutes les modifications sont immédiatement actives.</span>
          )}

          <button
            type="submit"
            className="px-6 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Enregistrer les Paramètres
          </button>
        </div>

      </form>
    </div>
  );
}
