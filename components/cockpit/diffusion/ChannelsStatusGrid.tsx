'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { AgencySettings, Property } from '@/lib/types';

interface ChannelsStatusGridProps {
  activeProperties: Property[];
  settings: AgencySettings;
}

export function ChannelsStatusGrid({ activeProperties, settings }: ChannelsStatusGridProps) {
  const selogerProperties = activeProperties.filter((p) => p.publish_seloger);
  const lbcProperties = activeProperties.filter((p) => p.publish_leboncoin);
  const bieniciProperties = activeProperties.filter((p) => p.publish_bienici);
  const figaroProperties = activeProperties.filter((p) => p.publish_figaro);
  const greenacresProperties = activeProperties.filter((p) => p.publish_greenacres);
  const facebookProperties = activeProperties.filter((p) => p.publish_facebook);

  const channels = [
    {
      id: 'seloger',
      name: 'SeLoger & Logic-Immo',
      count: selogerProperties.length,
      subtitle: 'Passerelle Poliris 4.08',
      info: `Code : ${settings.seloger_agency_code || 'NELLIMMO-13330'}`,
      actionLabel: 'ZIP Poliris',
      actionHref: '/api/feeds/download?feed=poliris',
    },
    {
      id: 'leboncoin',
      name: 'LeBonCoin (LBC Pro)',
      count: lbcProperties.length,
      subtitle: 'Passerelle Dédiée SFTP',
      info: `Hôte : ${settings.leboncoin_sftp_host || 'sftp.leboncoin.fr'}`,
      badge: 'N°1 Trafic',
    },
    {
      id: 'bienici',
      name: 'Bien’ici (FNAIM / Carto)',
      count: bieniciProperties.length,
      subtitle: 'Flux XML 3D Géolocalisé',
      info: 'Mise à jour en continu',
      actionLabel: 'Flux XML',
      actionHref: '/api/feeds/download?feed=bienici',
    },
    {
      id: 'figaro',
      name: 'Figaro Immo & Belles Demeures',
      count: figaroProperties.length,
      subtitle: 'Portail Prestige & Cadres',
      info: 'Diffusion biens > 400 k€',
      badge: 'Prestige',
    },
    {
      id: 'greenacres',
      name: 'Green-Acres (Europe)',
      count: greenacresProperties.length,
      subtitle: 'Clientèle Internationale & UK',
      info: '14 langues & devises',
      badge: 'Expat',
    },
    {
      id: 'facebook',
      name: 'Facebook & Instagram Shop',
      count: facebookProperties.length,
      subtitle: 'Catalogue Meta Marketplace',
      info: 'Boutique & Dynamic Ads',
      actionLabel: 'Flux Meta XML',
      actionHref: '/api/feeds/download?feed=facebook',
      isMeta: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {channels.map((ch) => (
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
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
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

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500 font-mono text-[10px] truncate max-w-[150px]">
              {ch.info}
            </span>
            {ch.actionHref ? (
              <a
                href={ch.actionHref}
                target="_blank"
                rel="noreferrer"
                className="text-[#E12B7B] font-bold flex items-center gap-1 hover:underline"
              >
                <span>{ch.actionLabel}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Actif</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
