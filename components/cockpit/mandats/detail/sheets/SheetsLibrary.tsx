'use client';

import React, { useState, useCallback } from 'react';
import {
    FileText,
    Trash2,
    RefreshCw,
    Download,
    FolderOpen,
    Loader2,
    Check,
} from 'lucide-react';
import type { Property } from '@/lib/types';
import {
    NeighborhoodSheet,
    getSheetsForProperty,
    deleteSheet,
    slugifySheetTitle,
} from '@/lib/neighborhood-sheets';

interface SheetsLibraryProps {
    property: Property;
    /** Ouvre le générateur avec les options d'une fiche existante (régénération). */
    onRegenerate: (sheet: NeighborhoodSheet) => void;
    /** Ouvre le générateur vierge (nouvelle fiche). */
    onNew: () => void;
}

/**
 * Bibliothèque des « Fiches Quartier » enregistrées pour un bien.
 * Liste les fiches (localStorage, structure prête Supabase), permet de les
 * télécharger à nouveau (PNG), de les régénérer ou de les supprimer.
 */
export function SheetsLibrary({
    property,
    onRegenerate,
    onNew,
}: SheetsLibraryProps) {
    const [sheets, setSheets] = useState<NeighborhoodSheet[]>(() =>
        getSheetsForProperty(property.id)
    );
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletedId, setDeletedId] = useState<string | null>(null);

    const refresh = useCallback(() => {
        setSheets(getSheetsForProperty(property.id));
    }, [property.id]);

    const handleDownloadPng = async (sheet: NeighborhoodSheet) => {
        setDownloadingId(sheet.id);
        try {
            // Si un aperçu est stocké, on le télécharge directement.
            if (sheet.preview_data_url) {
                const a = document.createElement('a');
                a.href = sheet.preview_data_url;
                a.download = `${slugifySheetTitle(sheet.title)}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                return;
            }
            // Sinon on régénère via le générateur (l'utilisateur clique sur PNG HD).
            onRegenerate(sheet);
        } catch (e) {
            console.error('Erreur téléchargement fiche', e);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDelete = (sheet: NeighborhoodSheet) => {
        setDeletingId(sheet.id);
        deleteSheet(sheet.id);
        setDeletedId(sheet.id);
        setTimeout(() => setDeletedId(null), 2000);
        setDeletingId(null);
        refresh();
    };

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return '';
        }
    };

    return (
        <div className="space-y-4">
            {/* En-tête de la bibliothèque */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                        <FolderOpen className="w-4 h-4" />
                    </span>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#131B26]">
                            Bibliothèque des Fiches Quartier
                        </h4>
                        <p className="text-[11px] text-gray-400">
                            {sheets.length} fiche{sheets.length > 1 ? 's' : ''} enregistrée{sheets.length > 1 ? 's' : ''} pour ce bien — stockage local (prêt Supabase)
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onNew}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Nouvelle fiche</span>
                </button>
            </div>

            {sheets.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-400">
                    <p className="text-xs font-medium">
                        Aucune fiche enregistrée pour ce bien pour le moment.
                    </p>
                    <p className="text-[11px] mt-1">
                        Ouvrez la carte en plein écran puis cliquez sur « Générer une fiche » pour créer un
                        document carré haute résolution (PNG/PDF) à joindre au dossier client.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sheets.map((sheet) => (
                        <div
                            key={sheet.id}
                            className="group rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg transition-shadow"
                        >
                            {/* Aperçu carré */}
                            <div className="relative aspect-square bg-[#0B132B]">
                                {sheet.preview_data_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={sheet.preview_data_url}
                                        alt={sheet.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                                        Aperçu non disponible
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadPng(sheet)}
                                        disabled={downloadingId === sheet.id}
                                        title="Télécharger en PNG haute résolution"
                                        className="p-1.5 rounded-lg bg-black/60 hover:bg-teal-600 text-white transition cursor-pointer disabled:opacity-50"
                                    >
                                        {downloadingId === sheet.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Download className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(sheet)}
                                        disabled={deletingId === sheet.id}
                                        title="Supprimer la fiche"
                                        className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition cursor-pointer disabled:opacity-50"
                                    >
                                        {deletedId === sheet.id ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : deletingId === sheet.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Infos & actions */}
                            <div className="p-3 space-y-2">
                                <div>
                                    <div className="text-xs font-bold text-[#131B26] leading-tight line-clamp-2">
                                        {sheet.title}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                        {formatDate(sheet.created_at)}
                                        {sheet.options?.radiusMeters ? ` • ${sheet.options.radiusMeters} m` : ''}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onRegenerate(sheet)}
                                    className="w-full px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Régénérer / Modifier</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
