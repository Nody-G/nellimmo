'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import {
  generatePolirisAnnoncesCsv,
  generatePolirisPhotosCfg,
  generatePolirisConfigTxt,
} from '@/lib/poliris';
import {
  DiffusionHeader,
  ChannelsStatusGrid,
  PortalQuotasCard,
  AutomatedSyncBox,
  PolirisInspector,
  PropertiesDiffusionTable,
} from '@/components/cockpit/diffusion';

export default function DiffusionDashboardPage() {
  const { properties, settings, updateSettings } = useNellimoStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const activeProperties = properties.filter((p) => p.status === 'actif' || p.status === 'sous_compromis');

  const agencyCode = settings.seloger_agency_code || 'NEL13';
  const csvContent = generatePolirisAnnoncesCsv(activeProperties, agencyCode);
  const photosCfgContent = generatePolirisPhotosCfg(activeProperties);
  const configTxtContent = generatePolirisConfigTxt(agencyCode);

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
      {/* Header with actions */}
      <DiffusionHeader onRunSync={handleRunSync} isSyncing={isSyncing} />

      {/* Syndication Channels Status Grid */}
      <ChannelsStatusGrid activeProperties={activeProperties} settings={settings} />

      {/* Quotas & Packs Monitoring (Anti-Overbilling vs Ubiflow) */}
      <PortalQuotasCard activeProperties={activeProperties} settings={settings} />

      {/* Automated Scheduled Sync Box */}
      <AutomatedSyncBox
        settings={settings}
        webhookUrl={webhookUrl}
        copiedWebhook={copiedWebhook}
        onCopyWebhook={copyWebhook}
        syncLogs={syncLogs}
      />

      {/* Raw Poliris Files Inspector */}
      <PolirisInspector
        csvContent={csvContent}
        photosCfgContent={photosCfgContent}
        configTxtContent={configTxtContent}
        activePropertiesCount={activeProperties.length}
      />

      {/* Direct Property Diffusion Table */}
      <PropertiesDiffusionTable properties={activeProperties} />
    </div>
  );
}
