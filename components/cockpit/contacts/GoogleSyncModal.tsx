'use client';

import React, { useState } from 'react';
import { X, Share2, Download, CheckCircle2, ExternalLink } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { exportGoogleContactsCsv, parseContactsCsv } from '@/lib/gmail';
import { GoogleCsvUploadBox } from './google/GoogleCsvUploadBox';

interface GoogleSyncModalProps {
  contacts: ContactItem[];
  onClose: () => void;
}

export function GoogleSyncModal({ contacts, onClose }: GoogleSyncModalProps) {
  const { createContact } = useNellimoStore();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportGoogleCsv = () => {
    exportGoogleContactsCsv(contacts);
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#131B26]">
                Google Contacts &amp; Synchronisation
              </h2>
              <p className="text-xs text-gray-500">
                Liaison bidirectionnelle Google Workspace, Gmail, iPhone &amp; Android.
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
        <div className="p-6 space-y-5 text-xs">
          {/* Status info box */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Format officiel Google Contacts 100% compatible</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Exportez vos contacts Nell’Immo pour les retrouver instantanément dans votre application Gmail sur mobile, ou importez un carnet existant depuis Google Contacts.
            </p>
          </div>

          {/* Export section */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
              1. Exporter vers Google &amp; Mobile
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
  );
}
