'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Trash2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import type { ToastType } from '@/components/ui/Toast';
import { SectionCard } from './SectionCard';
import {
    exportMasterBackup,
    restoreMasterBackup,
    countInactiveBuyers,
    purgeInactiveBuyers,
} from './parametres-types';

interface BackupSectionProps {
    formData: AgencySettings;
    showToast: (message: string, type?: ToastType) => void;
}

/** Section 6: Sauvegarde, Portabilité & Migration des Données de l'Agence. */
export function BackupSection({ formData, showToast }: BackupSectionProps) {
    const [inactiveCount, setInactiveCount] = useState<number>(() => countInactiveBuyers(3));
    const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);

    const handleRestore = async (file: File) => {
        const ok = await restoreMasterBackup(file);
        if (ok) {
            showToast('Sauvegarde restaurée avec succès ! Rechargement...', 'success');
            setTimeout(() => window.location.reload(), 600);
        } else {
            showToast('Format de fichier de sauvegarde invalide.', 'error');
        }
    };

    const handlePurge = () => {
        const result = purgeInactiveBuyers(3);
        setInactiveCount(0);
        setIsConfirmingPurge(false);
        showToast(
            `Purge RGPD effectuée : ${result.purgedCount} fiche(s) acquéreur inactives supprimées (${result.remainingCount} fiches actives conservées).`,
            'success'
        );
    };

    return (
        <SectionCard
            icon={<Shield className="w-5 h-5 text-emerald-600" />}
            title="6. Sauvegarde, Portabilité & Conformité RGPD"
        >
            <p className="text-xs text-gray-600">
                Téléchargez une copie intégrale de sécurité de toute votre activité (17 collections : mandats, acquéreurs, visites, transactions notaires, audit scellé SHA-256) ou restaurez un fichier JSON.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                    type="button"
                    onClick={() => exportMasterBackup(formData)}
                    className="p-4 bg-[#FCFAF7] hover:bg-emerald-50 border border-[#F3E8EE] hover:border-emerald-200 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group"
                >
                    <div>
                        <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block">
                            Exporter la Sauvegarde Master (JSON)
                        </span>
                        <span className="text-[11px] text-gray-500">Toutes les données de l’agence en 1 clic</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600">↓ Export</span>
                </button>

                <label className="p-4 bg-[#FCFAF7] hover:bg-amber-50 border border-[#F3E8EE] hover:border-amber-200 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group">
                    <div>
                        <span className="font-bold text-xs text-gray-900 group-hover:text-amber-800 block">
                            Restaurer depuis un Fichier JSON
                        </span>
                        <span className="text-[11px] text-gray-500">Charger une sauvegarde précédente</span>
                    </div>
                    <span className="text-xs font-black text-amber-600">↑ Importer</span>
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            handleRestore(file);
                            e.target.value = '';
                        }}
                    />
                </label>

                {/* Passerelle de migration Hektor */}
                <Link
                    href="/cockpit/import-hektor"
                    className="p-4 bg-[#FCFAF7] hover:bg-purple-50 border border-[#F3E8EE] hover:border-purple-200 rounded-2xl flex items-center justify-between transition cursor-pointer text-left group sm:col-span-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                            <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="font-bold text-xs text-gray-900 group-hover:text-purple-900 block">
                                Passerelle de Migration Hektor (CSV)
                            </span>
                            <span className="text-[11px] text-gray-500">
                                Importer votre catalogue mandats et vos acquéreurs depuis un export Hektor
                            </span>
                        </div>
                    </div>
                    <span className="text-xs font-black text-purple-600">Ouvrir l&apos;outil →</span>
                </Link>
            </div>

            {/* Conformité RGPD — Purge des données acquéreurs inactifs > 3 ans */}
            <div className="mt-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                            <span className="text-xs font-bold text-gray-900 block">
                                Conformité RGPD / ALUR — Conservation des Prospects (3 ans)
                            </span>
                            <span className="text-[11px] text-gray-500">
                                La CNIL préconise la purge des fiches acquéreurs sans contact actif depuis plus de 3 ans.
                            </span>
                        </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 shrink-0">
                        {inactiveCount} inactif{inactiveCount > 1 ? 's' : ''}
                    </span>
                </div>

                {isConfirmingPurge ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                        <span className="text-xs text-red-800 font-medium">
                            Confirmer la suppression irréversible de {inactiveCount} fiche(s) acquéreur inactives ?
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={handlePurge}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                                Oui, purger définitivement
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsConfirmingPurge(false)}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            if (inactiveCount === 0) {
                                showToast('Aucune fiche acquéreur inactive (> 3 ans) à purger.', 'info');
                                return;
                            }
                            setIsConfirmingPurge(true);
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-300 hover:border-red-300 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        Purger les Acquéreurs Inactifs (&gt; 3 ans)
                    </button>
                )}
            </div>
        </SectionCard>
    );
}

