'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  RefreshCw,
  Share2,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useNellimoStore } from '@/lib/store';

interface ContactsHeaderProps {
  totalCount: number;
  onOpenNewContact: () => void;
  onOpenGoogleSync: () => void;
  onOpenEmailHub: () => void;
}

export function ContactsHeader({
  totalCount,
  onOpenNewContact,
  onOpenGoogleSync,
  onOpenEmailHub,
}: ContactsHeaderProps) {
  const { syncContactsFromActivity } = useNellimoStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncActivity = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const added = await syncContactsFromActivity();
      if (added > 0) {
        setSyncFeedback(`${added} nouveau(x) contact(s) importé(s) !`);
      } else {
        setSyncFeedback('Tous les contacts de l’activité sont déjà à jour.');
      }
      setTimeout(() => setSyncFeedback(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F3E8EE] shadow-xs">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E12B7B]/10 flex items-center justify-center text-[#E12B7B]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold font-serif text-[#131B26]">
                Carnet de Contacts Pro & Hub Gmail
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FCFAF7] text-[#E12B7B] border border-[#F3E8EE] rounded-full">
                {totalCount} contacts
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Annuaire métier unifié et connecté : notaires, diagnostiqueurs, courtiers, artisans, acquéreurs & vendeurs.
            </p>
          </div>
        </div>

        {syncFeedback && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleSyncActivity}
          disabled={isSyncing}
          title="Importe automatiquement les acheteurs, mandants et notaires de vos dossiers en cours"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-gray-700 bg-[#FCFAF7] hover:bg-gray-100 border border-[#F3E8EE] rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Synchroniser l’activité</span>
        </button>

        <button
          type="button"
          onClick={onOpenGoogleSync}
          title="Export CSV Google Contacts, vCard ou import"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Workspace & Export</span>
        </button>

        <button
          type="button"
          onClick={onOpenEmailHub}
          title="Bibliothèque d'emails types professionnels"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-red-500" />
          <span>Modèles Gmail</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewContact}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#E12B7B] hover:bg-[#c9236c] rounded-xl shadow-xs transition cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Nouveau Contact</span>
        </button>
      </div>
    </div>
  );
}
