'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingDown } from 'lucide-react';
import type { AgencySettings, Property } from '@/lib/types';

interface PortalQuotasCardProps {
  activeProperties: Property[];
  settings: AgencySettings;
}

export function PortalQuotasCard({ activeProperties, settings }: PortalQuotasCardProps) {
  const quotas = settings.portal_quotas || {
    seloger: 15,
    leboncoin: 10,
    bienici: 20,
    figaro: 10,
    greenacres: 10,
    facebook: 25,
  };

  const portalStats = [
    {
      name: 'SeLoger / Logic-Immo',
      active: activeProperties.filter((p) => p.publish_seloger).length,
      quota: quotas.seloger,
    },
    {
      name: 'LeBonCoin Pro',
      active: activeProperties.filter((p) => p.publish_leboncoin).length,
      quota: quotas.leboncoin,
    },
    {
      name: 'Bien’ici 3D',
      active: activeProperties.filter((p) => p.publish_bienici).length,
      quota: quotas.bienici,
    },
    {
      name: 'Figaro & Belles Demeures',
      active: activeProperties.filter((p) => p.publish_figaro).length,
      quota: quotas.figaro,
    },
    {
      name: 'Green-Acres Europe',
      active: activeProperties.filter((p) => p.publish_greenacres).length,
      quota: quotas.greenacres,
    },
    {
      name: 'Facebook & Instagram Shop',
      active: activeProperties.filter((p) => p.publish_facebook).length,
      quota: quotas.facebook,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF5F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
              Gestion des Packs & Forfaits
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Zéro Dépassement Involontaire</span>
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-[#131B26] mt-0.5">
            Quotas de Diffusion par Portail
          </h3>
        </div>

        {/* Badge Passerelle Directe */}
        <div className="flex items-center gap-2 bg-[#FCFAF7] border border-[#F3E8EE] px-4 py-2.5 rounded-2xl shadow-2xs">
          <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-black text-[#131B26]">Passerelle Directe & Automatique</div>
            <div className="text-[10px] text-gray-500 font-medium">
              Flux Poliris & XML certifiés sans intermédiaire
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portalStats.map((item) => {
          const percentage = Math.min(100, Math.round((item.active / (item.quota || 1)) * 100));
          const isNearMax = percentage >= 85;
          const isOver = item.active > item.quota;

          return (
            <div
              key={item.name}
              className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#F3E8EE] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 truncate max-w-[170px]">
                  {item.name}
                </span>
                <span
                  className={`text-[11px] font-black font-mono ${
                    isOver
                      ? 'text-rose-600'
                      : isNearMax
                      ? 'text-amber-600'
                      : 'text-gray-700'
                  }`}
                >
                  {item.active} / {item.quota}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? 'bg-rose-500'
                      : isNearMax
                      ? 'bg-amber-500'
                      : 'bg-[#E12B7B]'
                  }`}
                  style={{ width: `${Math.min(100, (item.active / item.quota) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>{percentage}% du pack consommé</span>
                {isOver ? (
                  <span className="text-rose-600 font-bold flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Dépassement</span>
                  </span>
                ) : (
                  <span>{item.quota - item.active} place(s) libre(s)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
