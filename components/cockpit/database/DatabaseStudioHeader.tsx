'use client';

import React from 'react';
import { Database, ShieldCheck, Plus, Download, Lock } from 'lucide-react';

interface DatabaseStudioHeaderProps {
  totalRecords: number;
  selectedCollectionName: string;
  onOpenCustomFieldModal: () => void;
  onExportCurrent: () => void;
  onExportMaster: () => void;
}

export function DatabaseStudioHeader({
  totalRecords,
  selectedCollectionName,
  onOpenCustomFieldModal,
  onExportCurrent,
  onExportMaster,
}: DatabaseStudioHeaderProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gray-900 text-white shadow-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              Base de Données & Studio Data Unifié
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                AES-GCM & SHA-256
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Hub centralisé des 18 collections ({totalRecords.toLocaleString('fr-FR')} enregistrements) • Schémas extensibles • Interrogation neuronale DeepSeek V4 Flash
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenCustomFieldModal}
          className="px-3 py-2 bg-pink-50 text-[#E12B7B] border border-pink-200 font-semibold rounded-xl hover:bg-pink-100 text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter Champ ({selectedCollectionName})
        </button>

        <button
          onClick={onExportCurrent}
          className="px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 text-xs flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4" />
          Export Collection (CSV/JSON)
        </button>

        <button
          onClick={onExportMaster}
          className="px-3 py-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          Sauvegarde Chiffrée Master
        </button>
      </div>
    </div>
  );
}
