'use client';

import React, { useState } from 'react';
import { Building2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { setAgencyKey } from '@/lib/users';

interface AgencyKeyFormProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AgencyKeyForm({ showToast }: AgencyKeyFormProps) {
  const [agencyKey, setAgencyKeyField] = useState('');
  const [agencyKeyConfirm, setAgencyKeyConfirm] = useState('');
  const [showAgency, setShowAgency] = useState(false);
  const [agencyBusy, setAgencyBusy] = useState(false);

  const handleAgencyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgencyBusy(true);
    try {
      if (agencyKey.length < 6) {
        showToast('La clé d’agence doit contenir au moins 6 caractères.', 'error');
        setAgencyBusy(false);
        return;
      }
      if (agencyKey !== agencyKeyConfirm) {
        showToast('Les deux clés d’agence ne correspondent pas.', 'error');
        setAgencyBusy(false);
        return;
      }
      setAgencyKey(agencyKey);
      showToast('Clé d’agence mise à jour.', 'success');
      setAgencyKeyField('');
      setAgencyKeyConfirm('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur.', 'error');
    } finally {
      setAgencyBusy(false);
    }
  };

  return (
    <div className="pt-4 border-t border-[#F3E8EE]">
      <div className="flex items-center gap-2 text-[#131B26] mb-2">
        <Building2 className="w-4 h-4 text-[#E12B7B]" />
        <span className="text-sm font-bold uppercase tracking-wider">Clé d’agence</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-3">
        Cette clé déverrouille le coffre-fort partagé (identifiants SFTP, réseaux, Google…)
        pour tous les utilisateurs authentifiés. Changez-la si elle a été compromise.
      </p>
      <form onSubmit={handleAgencyKey} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <input
            type={showAgency ? 'text' : 'password'}
            value={agencyKey}
            onChange={(e) => setAgencyKeyField(e.target.value)}
            className="w-full p-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
            placeholder="Nouvelle clé d’agence"
          />
          <button
            type="button"
            onClick={() => setShowAgency(!showAgency)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showAgency ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type={showAgency ? 'text' : 'password'}
            value={agencyKeyConfirm}
            onChange={(e) => setAgencyKeyConfirm(e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/30"
            placeholder="Confirmer la clé"
          />
          <button
            type="submit"
            disabled={agencyBusy || !agencyKey}
            className="px-4 py-2 bg-[#131B26] hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
