'use client';

import React, { useState } from 'react';
import { X, Share2, Download, CheckCircle2, ExternalLink, CloudUpload, Loader2, AlertTriangle } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { exportGoogleContactsCsv, parseContactsCsv } from '@/lib/gmail';
import { Portal } from '@/components/ui/Portal';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import { GoogleCsvUploadBox } from './google/GoogleCsvUploadBox';
import { useGoogleContacts } from './useGoogleContacts';

interface GoogleSyncModalProps {
  contacts: ContactItem[];
  onClose: () => void;
}

export function GoogleSyncModal({ contacts, onClose }: GoogleSyncModalProps) {
  const { createContact, updateContact } = useNellimoStore();
  const { syncContact, isSyncing, needsConnection } = useGoogleContacts();

  // Verrou de défilement du body (compté, sûr en cas d'empilement de modales)
  useBodyScrollLock(true);

  // Fermeture via la touche Échap
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [pushError, setPushError] = useState<string | null>(null);
  const [isPushing, setIsPushing] = useState(false);

  const handleExportGoogleCsv = () => {
    exportGoogleContactsCsv(contacts);
  };

  /** Pousse tous les contacts Nellimmo vers Google Contacts (création/mise à jour idempotente). */
  const handlePushToGoogle = async () => {
    if (contacts.length === 0) {
      setPushError('Aucun contact à synchroniser.');
      return;
    }
    setIsPushing(true);
    setPushStatus(null);
    setPushError(null);

    let synced = 0;
    let failed = 0;
    for (const contact of contacts) {
      const resourceName = await syncContact(contact);
      if (resourceName) {
        synced++;
        // Persiste le resourceName pour les prochaines mises à jour idempotentes.
        if (resourceName !== contact.google_resource_name) {
          await updateContact(contact.id, { google_resource_name: resourceName });
        }
      } else {
        failed++;
      }
    }

    if (failed === 0) {
      setPushStatus(`${synced} contact(s) synchronisé(s) avec Google Contacts.`);
    } else if (synced === 0) {
      setPushError(
        needsConnection
          ? 'Compte Google non connecté. Connectez-le depuis Paramètres → Google.'
          : `Échec de la synchronisation (${failed} contact(s)).`
      );
    } else {
      setPushStatus(`${synced} synchronisé(s), ${failed} en échec.`);
    }
    setIsPushing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseContactsCsv(text);
        if (parsed.length === 0) {
          setImportStatus('Aucun contact valide trouvé dans le fichier.');
          setIsImporting(false);
          return;
        }

        let addedCount = 0;
        for (const item of parsed) {
          if (item.first_name || item.last_name || item.email || item.phone) {
            await createContact({
              role: item.role || 'autre',
              status: item.status || 'actif',
              first_name: item.first_name || 'Contact',
              last_name: item.last_name || '',
              company: item.company,
              specialty: item.specialty,
              email: item.email || '',
              phone: item.phone || '',
              address: item.address,
              notes: item.notes,
              tags: ['Import Google Contacts'],
              interactions: [],
              documents: [],
            });
            addedCount++;
          }
        }

        setImportStatus(`${addedCount} contact(s) importé(s) avec succès dans Nell'Immo !`);
      } catch (err) {
        console.error('Error importing contacts:', err);
        setImportStatus('Erreur lors de la lecture du fichier CSV.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white rounded-3xl border border-[#F3E8EE] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#131B26]">
                  Google Contacts & Synchronisation
                </h2>
                <p className="text-xs text-gray-500">
                  Liaison bidirectionnelle Google Workspace, Gmail, iPhone & Android.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5 text-xs overflow-y-auto">
            {/* Status info box */}
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Format officiel Google Contacts 100% compatible</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Synchronisez directement votre carnet avec votre compte Google connecté, ou exportez/importez un fichier CSV compatible Gmail, iPhone et Android.
              </p>
            </div>

            {/* Direct Google sync section */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                1. Synchroniser avec votre compte Google
              </span>
              <button
                type="button"
                onClick={handlePushToGoogle}
                disabled={isPushing || isSyncing || contacts.length === 0}
                className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-left transition flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {isPushing || isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CloudUpload className="w-4 h-4" />
                    )}
                    <span>{isPushing || isSyncing ? 'Synchronisation…' : 'Pousser vers Google Contacts'}</span>
                  </div>
                  <div className="text-[10px] text-blue-100 mt-1">
                    Crée ou met à jour {contacts.length} fiche(s) dans votre compte Google.
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-100" />
              </button>

              {pushStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-medium text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pushStatus}</span>
                </div>
              )}
              {pushError && (
                <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-medium text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{pushError}</span>
                </div>
              )}
            </div>

            {/* Export section */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                2. Exporter vers Google & Mobile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleExportGoogleCsv}
                  className="p-3.5 bg-white hover:bg-blue-50/60 border border-gray-200 hover:border-blue-300 rounded-2xl text-left transition flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900 group-hover:text-blue-700">Google Contacts (CSV)</div>
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    Prêt à être importé dans <span className="font-medium text-blue-600">contacts.google.com</span> ({contacts.length} fiches).
                  </div>
                </button>

                <a
                  href="https://contacts.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900">Ouvrir Google Contacts</div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    Accéder à votre compte Google Workspace en ligne.
                  </div>
                </a>
              </div>
            </div>

            {/* Import section */}
            <GoogleCsvUploadBox
              isImporting={isImporting}
              importStatus={importStatus}
              onFileUpload={handleFileUpload}
            />
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#FCFAF7] border-t border-gray-100 text-right">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
