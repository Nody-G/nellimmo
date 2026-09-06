'use client';

import React from 'react';
import { CheckCircle2, RefreshCw, LogIn, ExternalLink, Circle } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';

interface GoogleAccountStatusCardProps {
  formData: AgencySettings;
  onOpenConnectModal: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
}

export function GoogleAccountStatusCard({
  formData,
  onOpenConnectModal,
  onQuickSync,
  isSyncing,
}: GoogleAccountStatusCardProps) {
  const accountEmail = formData.google_account_email || formData.google_calendar_id || '';
  const connectedAt = formData.google_connected_at;
  const isConnected = Boolean(connectedAt);

  const connectedDate = connectedAt
    ? new Date(connectedAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : null;

  // Nombre de services réellement activés (pas un chiffre inventé).
  const services = formData.google_services_enabled || {};
  const enabledCount = Object.values(services).filter(Boolean).length;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-white rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Google G Brand Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 shadow-2xs flex items-center justify-center shrink-0">
          <span className="font-serif font-black text-xl bg-gradient-to-r from-blue-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
            G
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900">
              {formData.google_account_name || 'Compte Google Workspace de Nelly'}
            </span>
            {isConnected ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Connecté</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                <Circle className="w-3 h-3" />
                <span>Non connecté</span>
              </span>
            )}
          </div>

          <p className="text-xs font-mono font-medium text-blue-700 truncate max-w-xs sm:max-w-md">
            {accountEmail || 'Aucun compte renseigné'}
          </p>

          <p className="text-[10px] text-gray-400">
            {isConnected
              ? `Dernière connexion le ${connectedDate}${enabledCount > 0 ? ` &bull; ${enabledCount} service(s) activé(s)` : ''}`
              : 'Connectez votre compte Google pour activer la synchronisation des services.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onQuickSync}
          disabled={isSyncing || !isConnected}
          className="px-3 py-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Vérifier la connectivité des services Google"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronisation...' : 'Tester Sync'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenConnectModal}
          className="px-3.5 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 text-[#E12B7B]" />
          <span>{isConnected ? 'Gérer le Compte' : 'Connecter le Compte'}</span>
        </button>

        <a
          href="https://myaccount.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
          title="Ouvrir la gestion du compte Google en ligne"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
