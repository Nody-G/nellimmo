'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { generatePolirisAnnoncesCsv, generatePolirisPhotosCfg, generatePolirisConfigTxt } from '@/lib/poliris';
import {
  Radio,
  Download,
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export default function DiffusionDashboardPage() {
  const { properties, settings, updateSettings } = useNellimoStore();
  const [activeFileTab, setActiveFileTab] = useState<'csv' | 'photos' | 'config'>('csv');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Tokens d'accès des flux (définis côté serveur via les variables d'environnement).
  // En production, ces valeurs NEXT_PUBLIC_ doivent correspondre aux variables
  // serveur BIENICI_FEED_TOKEN / POLIRIS_FEED_TOKEN pour que les liens de
  // téléchargement restent fonctionnels.
  const bieniciFeedToken = process.env.NEXT_PUBLIC_BIENICI_FEED_TOKEN || 'bi_token_nellimmo_live_2026';
  const polirisFeedToken = process.env.NEXT_PUBLIC_POLIRIS_FEED_TOKEN || 'poliris_token_nellimmo_dev';

  const activeProperties = properties.filter((p) => p.status === 'actif' || p.status === 'sous_compromis');
  const selogerProperties = activeProperties.filter((p) => p.publish_seloger);
  const lbcProperties = activeProperties.filter((p) => p.publish_leboncoin);
  const bieniciProperties = activeProperties.filter((p) => p.publish_bienici);

  const csvContent = generatePolirisAnnoncesCsv(activeProperties, settings.seloger_agency_code || 'NEL13');
  const photosCfgContent = generatePolirisPhotosCfg(activeProperties);
  const configTxtContent = generatePolirisConfigTxt(settings.seloger_agency_code || 'NEL13');

  // URL du déclencheur Cron. En production, l'authentification repose sur la
  // variable serveur CRON_SECRET (transmise via l'en-tête `Authorization: Bearer`
  // ou le paramètre `?token=`). Elle n'est volontairement PAS exposée ici côté
  // client : cette URL sert de référence pour configurer la tâche planifiée
  // côté serveur (Vercel Cron, GitHub Actions, crontab).
  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/cron/sync-sftp`
    : '/api/cron/sync-sftp';

  const handleRunSync = async () => {
    setIsSyncing(true);
    setSyncLogs(['[1/2] Génération de l’archive Poliris ZIP et du flux XML Bien’ici...']);

    try {
      const res = await fetch('/api/cron/sync-sftp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: activeProperties,
          settings,
        }),
      });

      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setSyncLogs(data.logs);
      } else {
        setSyncLogs((prev) => [...prev, '[Info] Cycle terminé.']);
      }

      // Statut honnête : le dépôt distant n'est actif que si le backend SFTP est configuré.
      const sftpConfigured = Boolean(data.sftp_configured);
      await updateSettings({
        ...settings,
        last_sftp_sync_at: new Date().toISOString(),
        last_sftp_sync_status: sftpConfigured ? 'success' : 'error',
      });
    } catch (err) {
      console.error(err);
      setSyncLogs((prev) => [
        ...prev,
        '[Erreur] Échec de la génération. Vérifiez vos données.',
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Radio className="w-4 h-4" />
            <span>Multidiffusion Portails</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Diffusion SeLoger, LeBonCoin & Bien&apos;ici
          </h1>
          <p className="text-xs text-gray-500">
            Diffusion automatique de vos annonces vers vos portails partenaires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/feeds/seloger-poliris?token=${polirisFeedToken}`}
            download
            className="px-4 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Télécharger le ZIP
          </a>

          <button
            onClick={handleRunSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 'Synchroniser Maintenant'}
          </button>
        </div>
      </div>

      {/* Syndication Channels Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* SeLoger */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">SeLoger</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">{selogerProperties.length} annonces</div>
            <span className="text-[11px] text-gray-400">Flux SeLoger</span>
          </div>
          <div className="text-[10px] text-gray-600 bg-gray-50 p-2 rounded-lg font-mono">
            Hôte : {settings.seloger_sftp_host}
          </div>
        </div>

        {/* LeBonCoin */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">LeBonCoin</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">{lbcProperties.length} annonces</div>
            <span className="text-[11px] text-gray-400">Flux LeBonCoin</span>
          </div>
          <div className="text-[10px] text-gray-600 bg-gray-50 p-2 rounded-lg font-mono">
            Hôte : {settings.leboncoin_sftp_host}
          </div>
        </div>

        {/* Bien'ici */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">Bien&apos;ici</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">{bieniciProperties.length} annonces</div>
            <span className="text-[11px] text-gray-400">Flux Bien&apos;ici</span>
          </div>
          <a
            href={`/api/feeds/bienici.xml?token=${bieniciFeedToken}`}
            target="_blank"
            className="text-[10px] text-[#E12B7B] font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Voir le flux XML</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Site nellimo.fr */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500">Site nellimo.fr</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#131B26]">{activeProperties.length} annonces</div>
            <span className="text-[11px] text-gray-400">Synchronisation instantanée</span>
          </div>
          <div className="text-[10px] text-gray-500">
            Vidéos & visites virtuelles actives
          </div>
        </div>

      </div>

      {/* Automated Scheduled Sync Box */}
      <div className="bg-gradient-to-br from-[#131B26] to-[#0E141D] text-white rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#C59A45] font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Automatisation Planifiée</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              Synchronisation Automatique
            </h3>
            <p className="text-xs text-gray-400 max-w-2xl">
              Vos flux sont automatiquement mis à jour et synchronisés toutes les 6 heures.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Dernière synchronisation</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {settings.last_sftp_sync_at ? new Date(settings.last_sftp_sync_at).toLocaleString('fr-FR') : 'Prêt pour le premier cycle'}
            </span>
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="truncate w-full text-gray-300">
            <span className="text-[#E12B7B]">GET / POST </span>
            <span>{webhookUrl}</span>
          </div>
          <button
            onClick={copyWebhook}
            className="shrink-0 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWebhook ? 'Copié !' : 'Copier l’URL'}</span>
          </button>
        </div>
      </div>

      {/* SFTP Live Console */}
      {syncLogs.length > 0 && (
        <div className="bg-[#131B26] rounded-3xl p-6 border border-gray-800 shadow-xl space-y-3 text-xs font-mono text-emerald-400 animate-fade-in">
          <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-gray-800">
            <span>Journal d&apos;exécution</span>
            <span className="text-[10px]">Agence: {settings.seloger_agency_code || 'NEL13'}</span>
          </div>
          <div className="space-y-1">
            {syncLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Poliris Files Inspector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Inspecteur de Fichiers Poliris (Archive ZIP)
            </h3>
            <p className="text-xs text-gray-500">
              Contenu textuel brut généré en temps réel pour validation technique.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveFileTab('csv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeFileTab === 'csv' ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              annonces.csv ({activeProperties.length} lignes)
            </button>
            <button
              onClick={() => setActiveFileTab('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeFileTab === 'photos' ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              photos.cfg
            </button>
            <button
              onClick={() => setActiveFileTab('config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeFileTab === 'config' ? 'bg-[#E12B7B] text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              config.txt
            </button>
          </div>
        </div>

        {/* File Content Area */}
        <div className="bg-[#0E141D] text-gray-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 whitespace-pre leading-relaxed">
          {activeFileTab === 'csv' && csvContent}
          {activeFileTab === 'photos' && photosCfgContent}
          {activeFileTab === 'config' && configTxtContent}
        </div>
      </div>

      {/* Direct Property Diffusion Table with Clickable Links */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              État de Diffusion par Annonce ({activeProperties.length} biens actifs)
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
              {activeProperties.map((p) => (
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
                      <img
                        src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
                        alt=""
                        className="w-11 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
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

    </div>
  );
}
