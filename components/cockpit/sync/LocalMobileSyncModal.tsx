'use client';

import React, { useState } from 'react';
import { Smartphone, Download, Upload, X, Check, Share2, HelpCircle } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { exportMasterBackup, restoreMasterBackup } from '@/components/cockpit/parametres/parametres-types';
import { useToast } from '@/components/ui/Toast';

interface LocalMobileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocalMobileSyncModal({ isOpen, onClose }: LocalMobileSyncModalProps) {
  const { settings } = useNellimoStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [isRestoring, setIsRestoring] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      exportMasterBackup(settings);
      showToast('Fichier de synchronisation généré avec succès !', 'success');
    } catch {
      showToast("Erreur lors de l'exportation", 'error');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const ok = await restoreMasterBackup(file);
      if (ok) {
        showToast('Données synchronisées avec succès ! Rechargement...', 'success');
        setTimeout(() => window.location.reload(), 800);
      } else {
        showToast('Fichier invalide ou corrompu.', 'error');
      }
    } catch {
      showToast("Erreur lors de l'importation", 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C59A45]/20 text-[#967026] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">
                Passerelle Mobile Express (PC ↔ Smartphone)
              </h3>
              <p className="text-[11px] text-gray-500">
                Transférez vos données sur votre téléphone sans attendre le cloud
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'export' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            1. Depuis votre PC (Exporter)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'import' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            2. Sur votre Mobile (Importer)
          </button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-3">
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-2 text-amber-950">
              <span className="font-bold block flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#C59A45]" />
                Comment faire pour synchroniser votre téléphone :
              </span>
              <ol className="list-decimal list-inside space-y-1 text-amber-900/90 pl-1 leading-relaxed">
                <li>Cliquez sur le bouton ci-dessous pour télécharger le fichier de sync.</li>
                <li>Envoyez-le vous sur WhatsApp (votre conversation « Vous ») ou par Email / AirDrop.</li>
                <li>Ouvrez le Cockpit sur votre smartphone, allez dans cet onglet « Importer » et sélectionnez le fichier !</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="w-full py-3 px-4 rounded-xl bg-[#131B26] hover:bg-gray-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C59A45]" />
              Télécharger le Fichier de Synchronisation (JSON)
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs space-y-1 text-emerald-950">
              <span className="font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Chargement des données du PC
              </span>
              <p className="text-emerald-900/90 leading-relaxed">
                Sélectionnez le fichier que vous venez de vous envoyer pour mettre votre smartphone à jour instantanément.
              </p>
            </div>

            <label className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
              <Upload className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-bold text-gray-900">
                {isRestoring ? 'Restauration en cours...' : 'Sélectionner le fichier reçu du PC'}
              </span>
              <span className="text-[10px] text-gray-500">Fichier de type .json</span>
              <input
                type="file"
                accept=".json"
                disabled={isRestoring}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        <div className="pt-2 text-center">
          <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <HelpCircle className="w-3 h-3" />
            100% sécurisé et local • Vos données ne quittent pas vos appareils
          </span>
        </div>
      </div>
    </div>
  );
}
