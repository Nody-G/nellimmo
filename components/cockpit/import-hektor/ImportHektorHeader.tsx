'use client';

import { Database, Download, Coins } from 'lucide-react';

interface ImportHektorHeaderProps {
    onDownloadSample: () => void;
    onExportFullBackup: () => void;
}

export function ImportHektorHeader({
    onDownloadSample,
    onExportFullBackup,
}: ImportHektorHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <Database className="w-4 h-4" />
                    <span>Centre de Migration & Sauvegardes</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Importeur Universel Hektor & Données
                </h1>
                <p className="text-xs text-gray-500">
                    Importez en quelques clics tous vos fichiers CSV, exports Hektor / La Boîte Immo, et
                    prévisualisez les données avant injection.
                </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <a
                    href="/simulateur-economies-hektor.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-gradient-to-r from-[#E12B7B] to-[#9F1239] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-95 transition cursor-pointer"
                >
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Audit Gains vs Hektor</span>
                </a>
                <button
                    onClick={onDownloadSample}
                    className="px-4 py-2.5 bg-white border border-[#F3E8EE] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-xs cursor-pointer"
                >
                    <Download className="w-4 h-4 text-[#E12B7B]" />
                    Modèle CSV
                </button>
                <button
                    onClick={onExportFullBackup}
                    className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                    <Download className="w-4 h-4 text-[#C59A45]" />
                    Sauvegarde Complète (JSON)
                </button>
            </div>
        </div>
    );
}
