'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { AgencySettings, Property } from '@/lib/types';

interface ChannelsStatusGridProps {
  activeProperties: Property[];
  settings: AgencySettings;
}

export function ChannelsStatusGrid({ activeProperties, settings }: ChannelsStatusGridProps) {
  const selogerProperties = activeProperties.filter((p) => p.publish_seloger);
  const lbcProperties = activeProperties.filter((p) => p.publish_leboncoin);
  const bieniciProperties = activeProperties.filter((p) => p.publish_bienici);

  return (
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
          href="/api/feeds/download?feed=bienici"
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
  );
}
