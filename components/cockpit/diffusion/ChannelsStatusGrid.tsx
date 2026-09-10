'use client';

import React, { useState } from 'react';
import { AlertTriangle, XCircle, Download, Loader2 } from 'lucide-react';
import type { AgencySettings, Property } from '@/lib/types';
import { downloadFeed, type FeedKey } from '@/lib/feed-download-client';

interface ChannelsStatusGridProps {
  activeProperties: Property[];
  settings: AgencySettings;
}

type ChannelStatus = 'active' | 'partial' | 'inactive';

interface ChannelConfig {
  id: string;
  feed: FeedKey;
  name: string;
  count: number;
  subtitle: string;
  info: string;
  status: ChannelStatus;
  statusReason: string;
  actionLabel: string;
  badge?: string;
}

const STATUS_STYLES: Record<ChannelStatus, { dot: string; label: string; text: string }> = {
  active: {
    dot: 'bg-emerald-500',
    label: 'Configuré',
    text: 'text-emerald-700',
  },
  partial: {
    dot: 'bg-amber-500',
    label: 'Partiel',
    text: 'text-amber-700',
  },
  inactive: {
    dot: 'bg-rose-500',
    label: 'Non configuré',
    text: 'text-rose-700',
  },
};

export function ChannelsStatusGrid({ activeProperties, settings }: ChannelsStatusGridProps) {
  const [busyFeed, setBusyFeed] = useState<FeedKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selogerProperties = activeProperties.filter((p) => p.publish_seloger);
  const lbcProperties = activeProperties.filter((p) => p.publish_leboncoin);
  const bieniciProperties = activeProperties.filter((p) => p.publish_bienici);
  const figaroProperties = activeProperties.filter((p) => p.publish_figaro);
  const greenacresProperties = activeProperties.filter((p) => p.publish_greenacres);
  const facebookProperties = activeProperties.filter((p) => p.publish_facebook);
  const papProperties = activeProperties.filter((p) => p.publish_pap);

  // Statut réel dérivé de la configuration agence — plus de pastille verte
  // systématique. Un canal n'est « configuré » que si ses identifiants requis
  // sont renseignés dans les paramètres.
  const selogerConfigured = Boolean(settings.seloger_agency_code);
  const lbcConfigured = Boolean(settings.leboncoin_sftp_host);
  const bieniciConfigured = Boolean(settings.seloger_agency_code);
  const facebookConfigured = Boolean(settings.instagram_business_id);
  const figaroConfigured = Boolean(settings.figaro_agency_code);
  const greenacresConfigured = Boolean(settings.greenacres_agency_code);
  const papConfigured = Boolean(settings.pap_agency_code);

  const channels: ChannelConfig[] = [
    {
      id: 'seloger',
      feed: 'poliris',
      name: 'SeLoger & Logic-Immo',
      count: selogerProperties.length,
      subtitle: 'Passerelle Poliris 4.08',
      info: selogerConfigured
        ? `Code : ${settings.seloger_agency_code}`
        : 'Code agence SeLoger manquant',
      status: selogerConfigured ? 'active' : 'inactive',
      statusReason: selogerConfigured
        ? 'Code agence renseigné'
        : 'Renseignez le code agence SeLoger dans les paramètres',
      actionLabel: 'ZIP Poliris',
    },
    {
      id: 'leboncoin',
      feed: 'leboncoin',
      name: 'LeBonCoin (LBC Pro)',
      count: lbcProperties.length,
      subtitle: 'Import CSV LBC Pro',
      info: lbcConfigured
        ? `Hôte : ${settings.leboncoin_sftp_host}`
        : 'Hôte SFTP LeBonCoin manquant',
      status: lbcConfigured ? 'active' : 'partial',
      statusReason: lbcConfigured
        ? 'Hôte SFTP renseigné'
        : 'Export CSV disponible — renseignez l’hôte SFTP pour le dépôt automatique',
      actionLabel: 'CSV LeBonCoin',
      badge: 'N°1 Trafic',
    },
    {
      id: 'bienici',
      feed: 'bienici',
      name: 'Bien’ici (FNAIM / Carto)',
      count: bieniciProperties.length,
      subtitle: 'Flux XML 3D Géolocalisé',
      info: bieniciConfigured ? 'Flux XML disponible' : 'Code agence manquant',
      status: bieniciConfigured ? 'active' : 'inactive',
      statusReason: bieniciConfigured
        ? 'Flux XML prêt'
        : 'Renseignez le code agence pour activer le flux',
      actionLabel: 'Flux XML',
    },
    {
      id: 'figaro',
      feed: 'figaro',
      name: 'Figaro Immo & Belles Demeures',
      count: figaroProperties.length,
      subtitle: 'Portail Prestige & Cadres',
      info: figaroConfigured
        ? `Code : ${settings.figaro_agency_code}`
        : 'Diffusion biens > 400 k€',
      status: figaroConfigured ? 'active' : 'partial',
      statusReason: figaroConfigured
        ? 'Code agence Figaro renseigné'
        : 'Export XML disponible — renseignez le code agence Figaro pour le référencement',
      actionLabel: 'Flux XML',
      badge: 'Prestige',
    },
    {
      id: 'greenacres',
      feed: 'greenacres',
      name: 'Green-Acres (Europe)',
      count: greenacresProperties.length,
      subtitle: 'Clientèle Internationale & UK',
      info: greenacresConfigured
        ? `Code : ${settings.greenacres_agency_code}`
        : '14 langues & devises',
      status: greenacresConfigured ? 'active' : 'partial',
      statusReason: greenacresConfigured
        ? 'Code agence Green-Acres renseigné'
        : 'Export XML disponible — renseignez le code agence Green-Acres',
      actionLabel: 'Flux XML',
      badge: 'Expat',
    },
    {
      id: 'pap',
      feed: 'pap',
      name: 'PAP (De Particulier à Particulier)',
      count: papProperties.length,
      subtitle: 'Portail Grand Public',
      info: papConfigured ? `Code : ${settings.pap_agency_code}` : 'Audience nationale',
      status: papConfigured ? 'active' : 'partial',
      statusReason: papConfigured
        ? 'Code agence PAP renseigné'
        : 'Export XML disponible — renseignez le code agence PAP',
      actionLabel: 'Flux XML',
    },
    {
      id: 'facebook',
      feed: 'facebook',
      name: 'Facebook & Instagram Shop',
      count: facebookProperties.length,
      subtitle: 'Catalogue Meta Marketplace',
      info: facebookConfigured
        ? 'Catalogue Meta configuré'
        : 'Identifiant Instagram Business manquant',
      status: facebookConfigured ? 'active' : 'inactive',
      statusReason: facebookConfigured
        ? 'Catalogue Meta prêt'
        : 'Renseignez l’identifiant Instagram Business dans les paramètres',
      actionLabel: 'Flux Meta XML',
    },
  ];

  const handleDownload = async (feed: FeedKey) => {
    setBusyFeed(feed);
    setError(null);
    const result = await downloadFeed(feed, activeProperties, settings);
    if (!result.ok && result.error) {
      setError(result.error);
    }
    setBusyFeed(null);
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const styles = STATUS_STYLES[ch.status];
          const isBusy = busyFeed === ch.feed;
          const hasProperties = ch.count > 0;
          return (
            <div
              key={ch.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F3E8EE] shadow-xs space-y-3 relative overflow-hidden transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 truncate max-w-[190px]">
                  {ch.name}
                </span>
                <div className="flex items-center gap-1.5">
                  {ch.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {ch.badge}
                    </span>
                  )}
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${styles.dot}`}
                    title={ch.statusReason}
                  />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-[#131B26]">
                  {ch.count} <span className="text-sm font-medium text-gray-500">annonces</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  {ch.subtitle}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-gray-500 font-mono text-[10px] truncate max-w-[130px]">
                  {ch.info}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownload(ch.feed)}
                  disabled={isBusy || !hasProperties}
                  title={
                    hasProperties
                      ? `Télécharger ${ch.actionLabel}`
                      : 'Aucun bien activé sur ce canal'
                  }
                  className="text-[#E12B7B] font-bold flex items-center gap-1 hover:underline disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {isBusy ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span>{isBusy ? 'Génération...' : ch.actionLabel}</span>
                </button>
              </div>

              {ch.status !== 'active' && (
                <div className={`flex items-start gap-1 text-[10px] font-semibold ${styles.text}`}>
                  {ch.status === 'partial' ? (
                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  )}
                  <span>{ch.statusReason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
