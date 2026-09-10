'use client';

import React, { useState } from 'react';
import { Calendar, Star, MapPin, Folder, Copy, Check } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { SectionCard } from './SectionCard';
import type { SettingsChange } from './parametres-types';
import { GoogleAccountStatusCard } from './google/GoogleAccountStatusCard';
import { GoogleServicesGrid } from './google/GoogleServicesGrid';
import { GoogleConnectModal } from './google/GoogleConnectModal';

interface GoogleSectionProps {
  formData: AgencySettings;
  onChange: SettingsChange;
  copiedLink: string | null;
  onCopy: (text: string, label: string) => void;
}

const inputClass =
  'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

/** Section 3: Centre de Contrôle Google Workspace (Compte Nelly, 7 Services, Maps, Drive, Calendar, Gmail). */
export function GoogleSection({ formData, onChange, copiedLink, onCopy }: GoogleSectionProps) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  /**
   * Vérification réelle de la configuration Google : on contrôle que le compte
   * est renseigné et que les passerelles configurées (Drive, Maps, My Business)
   * sont cohérentes. Aucun faux succès simulé.
   */
  const handleQuickSync = () => {
    setIsSyncing(true);
    setSyncMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      const account = formData.google_account_email || formData.google_calendar_id || '';
      const issues: string[] = [];
      if (!account) issues.push('compte Google non renseigné');
      if (formData.google_drive_folder_id && !/^[\w-]+$/.test(formData.google_drive_folder_id)) {
        issues.push('identifiant de dossier Drive invalide');
      }
      if (formData.google_my_business_url && !/^https?:\/\//.test(formData.google_my_business_url)) {
        issues.push('lien Avis Google invalide (doit commencer par https://)');
      }
      if (formData.google_maps_api_key && !formData.google_maps_api_key.startsWith('AIza')) {
        issues.push('clé API Maps suspecte (doit commencer par AIza)');
      }

      if (issues.length === 0) {
        setSyncMessage('Configuration Google vérifiée : tous les paramètres sont cohérents.');
        onChange({ google_connected_at: new Date().toISOString() });
      } else {
        setSyncMessage(`À corriger : ${issues.join(', ')}.`);
      }
    }, 500);
  };

  const handleToggleService = (serviceKey: keyof NonNullable<AgencySettings['google_services_enabled']>) => {
    const currentServices = formData.google_services_enabled || {};
    const updated = {
      ...currentServices,
      [serviceKey]: !currentServices[serviceKey],
    };
    onChange({ google_services_enabled: updated });
  };

  return (
    <SectionCard
      icon={<Calendar className="w-5 h-5 text-blue-600" />}
      title="3. Hub Écosystème Google Workspace (Compte & Services de Nelly)"
      badge="Google Workspace Pro"
      badgeClassName="bg-blue-50 text-blue-700 border-blue-200"
    >
      {/* 1. Account Status Card */}
      <GoogleAccountStatusCard
        formData={formData}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onQuickSync={handleQuickSync}
        isSyncing={isSyncing}
        syncMessage={syncMessage}
      />

      {/* 2. Active Services Matrix */}
      <GoogleServicesGrid
        formData={formData}
        onToggleService={handleToggleService}
      />

      {/* 3. Deep Integrations Config */}
      <div className="pt-2 border-t border-gray-100 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Configuration des Passerelles Google Agence
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
              <BrandLogo brand="google" size={14} />
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Lien Avis Google My Business</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://g.page/r/nellimmo/review"
                value={formData.google_my_business_url || ''}
                onChange={(e) => onChange({ google_my_business_url: e.target.value })}
                className={inputClass}
              />
              {formData.google_my_business_url && (
                <button
                  type="button"
                  onClick={() => onCopy(formData.google_my_business_url || '', 'google_review')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedLink === 'google_review' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              Envoyé aux clients pour collecter les 5 étoiles notariées.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
              <BrandLogo brand="google" size={14} />
              <Folder className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dossier Racine Google Drive</span>
            </label>
            <input
              type="text"
              placeholder="drive_nellimmo_mandates_2026"
              value={formData.google_drive_folder_id || ''}
              onChange={(e) => onChange({ google_drive_folder_id: e.target.value })}
              className={inputClass}
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Dossier Cloud centralisant les archives de mandats et diagnostics.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
              <BrandLogo brand="google" size={14} />
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Clé API Google Maps &amp; Places</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={formData.google_maps_api_key || ''}
              onChange={(e) => onChange({ google_maps_api_key: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Optionnelle : pour le géocodage précis des commodités locales.
            </span>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      <GoogleConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        formData={formData}
        onSave={onChange}
      />
    </SectionCard>
  );
}
