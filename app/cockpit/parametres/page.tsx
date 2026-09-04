'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { SettingsHeader } from '@/components/cockpit/parametres/SettingsHeader';
import { IdentitySection } from '@/components/cockpit/parametres/IdentitySection';
import { SocialSection } from '@/components/cockpit/parametres/SocialSection';
import { GoogleSection } from '@/components/cockpit/parametres/GoogleSection';
import { AiSection } from '@/components/cockpit/parametres/AiSection';
import { PortalsSection } from '@/components/cockpit/parametres/PortalsSection';
import { BackupSection } from '@/components/cockpit/parametres/BackupSection';
import { UsersSection } from '@/components/cockpit/parametres/UsersSection';
import { SettingsActionBar } from '@/components/cockpit/parametres/SettingsActionBar';
import { ResetConfirmModal } from '@/components/cockpit/parametres/ResetConfirmModal';
import type { AgencySettings } from '@/lib/types';

export default function AgencySettingsPage() {
  const { settings, updateSettings, resetToDemoData } = useNellimoStore();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<AgencySettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleFieldChange = (patch: Partial<AgencySettings>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const confirmResetDemo = () => {
    resetToDemoData();
    setIsResetConfirmOpen(false);
    showToast('Données réinitialisées vers le jeu Provence avec succès !', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <SettingsHeader onReset={() => setIsResetConfirmOpen(true)} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <IdentitySection formData={formData} onChange={handleFieldChange} />
        <SocialSection formData={formData} onChange={handleFieldChange} />
        <GoogleSection
          formData={formData}
          onChange={handleFieldChange}
          copiedLink={copiedLink}
          onCopy={handleCopy}
        />
        <AiSection />
        <PortalsSection formData={formData} onChange={handleFieldChange} />
        <BackupSection formData={formData} showToast={showToast} />
        <UsersSection showToast={showToast} />
        <SettingsActionBar savedSuccess={savedSuccess} />
      </form>

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={confirmResetDemo}
      />
    </div>
  );
}
