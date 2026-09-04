'use client';

import { Upload, Trash2, RefreshCw, FileText, Users } from 'lucide-react';
import { ImportType } from './import-hektor-types';

interface ImportInputPanelProps {
    importType: ImportType;
    inputText: string;
    fileName: string;
    updateExisting: boolean;
    isParsing: boolean;
    onSelectType: (type: ImportType) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTextChange: (text: string) => void;
    onToggleUpdateExisting: (checked: boolean) => void;
    onClear: () => void;
    onRunParse: () => void;
}

export function ImportInputPanel({
    importType,
    inputText,
    fileName,
    updateExisting,
    isParsing,
    onSelectType,
    onFileUpload,
    onTextChange,
    onToggleUpdateExisting,
    onClear,
    onRunParse,
}: ImportInputPanelProps) {
    const typeButton = (type: ImportType, label: string, Icon: typeof FileText) => (
        <button
            type="button"
            onClick={() => onSelectType(type)}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${importType === type
                    ? 'bg-[#E12B7B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-5">
            {/* Step 1 : Choose type */}
            <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    1. Type de Données à Importer
                </span>
                <div className="grid grid-cols-2 gap-2">
                    {typeButton('mandates', 'Mandats / Biens', FileText)}
                    {typeButton('buyers', 'Acquéreurs / CRM', Users)}
                </div>
            </div>

            {/* Step 2 : File Drop or Paste */}
            <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    2. Déposer un Fichier ou Coller du Texte
                </span>

                <label className="p-6 border-2 border-dashed border-gray-300 hover:border-[#E12B7B] bg-gray-50 hover:bg-[#FDF2F8]/30 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center">
                    <Upload className="w-6 h-6 text-[#E12B7B]" />
                    <span className="text-xs font-bold text-gray-800">
                        {fileName ? `Fichier chargé : ${fileName}` : 'Glisser votre export Hektor (CSV, TSV, TXT, JSON)'}
                    </span>
                    <span className="text-[10px] text-gray-400">Cliquez pour parcourir vos dossiers</span>
                    <input
                        type="file"
                        accept=".csv,.tsv,.txt,.json"
                        onChange={onFileUpload}
                        className="hidden"
                    />
                </label>

                <div className="pt-2">
                    <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Ou coller directement le contenu textuel / tableau
                    </label>
                    <textarea
                        rows={10}
                        value={inputText}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder="Collez ici les lignes de votre export CSV ou copiez-collez les colonnes depuis Excel..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono text-gray-800 focus:outline-[#E12B7B] leading-relaxed resize-y"
                    />
                </div>

                {/* Conflict resolution */}
                <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={updateExisting}
                            onChange={(e) => onToggleUpdateExisting(e.target.checked)}
                            className="rounded text-[#E12B7B] accent-[#E12B7B] w-4 h-4"
                        />
                        <span>
                            Mettre à jour les mandats déjà existants s{"\u2019"}ils ont le même numéro
                        </span>
                    </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-xs text-gray-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Effacer</span>
                    </button>

                    <button
                        type="button"
                        onClick={onRunParse}
                        disabled={!inputText.trim()}
                        className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin' : ''}`} />
                        <span>Analyser les données</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
