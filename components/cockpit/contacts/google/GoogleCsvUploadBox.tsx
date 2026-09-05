'use client';

import React from 'react';
import { Upload, Check } from 'lucide-react';

interface GoogleCsvUploadBoxProps {
  isImporting: boolean;
  importStatus: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GoogleCsvUploadBox({
  isImporting,
  importStatus,
  onFileUpload,
}: GoogleCsvUploadBoxProps) {
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
        2. Importer un fichier CSV ou Google Contacts
      </span>
      <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-2">
        <Upload className="w-6 h-6 text-gray-400 mx-auto" />
        <div className="text-gray-700 font-semibold">
          Glissez un fichier CSV ou cliquez pour sélectionner
        </div>
        <p className="text-[10px] text-gray-400">
          Compatible exports Google Contacts, Hektor, Outlook ou CSV standard.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          disabled={isImporting}
          className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#131B26] file:text-white hover:file:bg-black cursor-pointer"
        />
      </div>

      {importStatus && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-medium text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}
    </div>
  );
}
