'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Mail,
  User,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  LogIn,
  Unplug,
} from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGoogleConnection } from './useGoogleConnection';
import { GOOGLE_SERVICE_ORDER, GOOGLE_SCOPES, type GoogleServiceKey } from '@/lib/google/scopes';

interface GoogleConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: AgencySettings;
  onSave: (updates: Partial<AgencySettings>) => void;
}

export function GoogleConnectModal({
  isOpen,
  onClose,
  formData,
  onSave,
}: GoogleConnectModalProps) {
  const { status, isLoading, error, connect, disconnect, refreshStatus, refreshToken } =
    useGoogleConnection();

  const [selectedServices, setSelectedServices] = useState<Record<GoogleServiceKey, boolean>>({
    calendar: true,
    gmail: true,
    drive: true,
    contacts: false,
    tasks: false,
    reviews: false,
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const toggleService = (key: GoogleServiceKey) => {
    setSelectedServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConnect = () => {
    const services = GOOGLE_SERVICE_ORDER.filter((k) => selectedServices[k]);
    connect(services);
  };

  const handleDisconnect = async () => {
    setActionMessage(null);
    await disconnect();
    setActionMessage('Compte Google déconnecté et jeton révoqué.');
  };

  const handleRefresh = async () => {
    setActionMessage(null);
    const ok = await refreshToken();
    setActionMessage(ok ? 'Jeton Google rafraîchi.' : 'Échec du rafraîchissement.');
  };

  const handleSyncSettings = () => {
    if (status.connected && status.email) {
      onSave({
        google_account_email: status.email,
        google_account_name: status.name || status.email,
        google_calendar_id: formData.google_calendar_id || 'primary',
        google_connected_at: new Date().toISOString(),
      });
      setActionMessage('Compte Google synchronisé avec les paramètres de l\'agence.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-serif font-black text-sm">
            G
          </div>
          <span className="font-serif font-bold text-base text-[#131B26]">
            Connexion Compte Google Workspace
          </span>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-gray-600 leading-relaxed">
          Connectez votre compte Google professionnel via la connexion sécurisée OAuth 2.0 de Google.
          Vos identifiants ne transitent jamais par l'application : seul un jeton révocable est
          conservé, chiffré, côté serveur.
        </p>

        {/* État réel de la connexion */}
        {isLoading ? (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Vérification de l'état de la connexion…</span>
          </div>
        ) : status.connected ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-900">Compte connecté</span>
            </div>
            <div className="space-y-1 text-emerald-900">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-mono">{status.email}</span>
              </p>
              {status.name && (
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{status.name}</span>
                </p>
              )}
              <p className="text-[11px] text-emerald-700">
                {Object.values(status.services).filter(Boolean).length} service(s) autorisé(s)
                {status.expiresAt
                  ? ` • jeton valide jusqu'au ${new Date(status.expiresAt).toLocaleString('fr-FR')}`
                  : ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-amber-900 leading-snug">
              <span className="font-bold block">Aucun compte Google connecté</span>
              {status.configured
                ? 'Cliquez sur « Connecter avec Google » pour autoriser l\'accès aux services sélectionnés.'
                : 'La configuration OAuth serveur est incomplète (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI).'}
            </div>
          </div>
        )}

        {/* Sélection des services à autoriser */}
        {!status.connected && (
          <div className="space-y-2 p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE]">
            <span className="block text-xs font-bold uppercase text-gray-700">
              Services à autoriser
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GOOGLE_SERVICE_ORDER.map((key) => (
                <label
                  key={key}
                  className="flex items-start gap-2 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices[key]}
                    onChange={() => toggleService(key)}
                    className="mt-0.5 accent-[#E12B7B]"
                  />
                  <span className="leading-snug">
                    <span className="font-bold text-gray-800 block">{GOOGLE_SCOPES[key].label}</span>
                    <span className="text-[10px] text-gray-500">{GOOGLE_SCOPES[key].description}</span>
                    {GOOGLE_SCOPES[key].requiresApiApproval && (
                      <span className="text-[10px] text-amber-600 font-semibold block">
                        Nécessite une approbation Google spécifique
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sécurité */}
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-blue-900 leading-snug">
            <span className="font-bold block">Sécurité & Confidentialité</span>
            Flux OAuth 2.0 avec PKCE. Les jetons sont chiffrés (AES-256-GCM) et ne quittent jamais le
            serveur. Vous pouvez révoquer l'accès à tout moment.
          </div>
        </div>

        {/* Messages d'action */}
        {(actionMessage || error) && (
          <div className="p-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-800 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-gray-500 shrink-0" />
            <span>{error || actionMessage}</span>
          </div>
        )}

        {/* Lien de gestion du compte Google */}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Gérer les accès accordés dans mon compte Google</span>
        </a>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {status.connected && (
              <>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rafraîchir</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Unplug className="w-3.5 h-3.5" />
                  <span>Déconnecter</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Fermer
            </Button>
            {status.connected ? (
              <button
                type="button"
                onClick={handleSyncSettings}
                className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                Synchroniser les paramètres
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                disabled={!status.configured}
                className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connecter avec Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
