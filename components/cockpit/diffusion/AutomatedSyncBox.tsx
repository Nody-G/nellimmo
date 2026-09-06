'use client';

import React from 'react';
import { Clock, Check, Copy, AlertTriangle } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';

interface AutomatedSyncBoxProps {
  settings: AgencySettings;
  webhookUrl: string;
  copiedWebhook: boolean;
  onCopyWebhook: () => void;
  syncLogs: string[];
}

export function AutomatedSyncBox({
  settings,
  webhookUrl,
  copiedWebhook,
  onCopyWebhook,
  syncLogs,
}: AutomatedSyncBoxProps) {
  // L'automatisation planifiée n'est réelle que si un déclencheur Cron externe
  // (Vercel Cron, GitHub Actions, crontab) appelle cette URL sur un intervalle.
  // Sans cela, l'URL n'est qu'un point d'entrée manuel — on l'affiche honnêtement.
  const intervalHours = settings.sftp_sync_interval_hours || 6;
  const lastSync = settings.last_sftp_sync_at;
  const lastStatus = settings.last_sftp_sync_status;

  return (
    <div className="space-y-4">
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
              L’URL ci-dessous est le point d’entrée du cycle de multidiffusion. Pour une
              synchronisation automatique toutes les {intervalHours} heures, branchez ce
              webhook sur un déclencheur planifié (Vercel Cron, GitHub Actions ou crontab).
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Dernière synchronisation</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {lastSync
                ? new Date(lastSync).toLocaleString('fr-FR')
                : 'Aucun cycle exécuté'}
            </span>
            {lastStatus === 'error' && (
              <span className="flex items-center justify-end gap-1 text-[10px] text-amber-400 font-semibold mt-1">
                <AlertTriangle className="w-3 h-3" />
                Dépôt distant non configuré
              </span>
            )}
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="truncate w-full text-gray-300">
            <span className="text-[#E12B7B]">GET / POST </span>
            <span>{webhookUrl}</span>
          </div>
          <button
            type="button"
            onClick={onCopyWebhook}
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
            <span>Journal d’exécution</span>
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
    </div>
  );
}
