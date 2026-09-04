'use client';

import { Shield } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { SectionCard } from './SectionCard';
import { exportMasterBackup, restoreMasterBackup } from './parametres-types';

interface BackupSectionProps {
    formData: AgencySettings;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

/** Section 6: Sauvegarde & Portabilité des Données de l'Agence. */
export function BackupSection({ formData, showToast }: BackupSectionProps) {
    const handleRestore = async (file: File) => {
        const ok = await restoreMasterBackup(file);
        if (ok) {
            showToast('Sauvegarde restaurée avec succès ! Rechargement...', 'success');
            setTimeout(() => window.location.reload(), 600);
        } else {
            showToast('Format de fichier de sauvegarde invalide.', 'error');
        }
    };

    return (
        <SectionCard
            icon={<Shield className="w-5 h-5 text-emerald-600" />}
            title="6. Sauvegarde & Portabilité des Données de l'Agence"
        >
            <p className="text-xs text-gray-600">
                Téléchargez une copie intégrale de sécurité de toute votre activité (mandats, acquéreurs, visites, transactions notaires, audit scellé SHA-256) ou restaurez un fichier JSON.
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
                        <span className="text-[11px] text-gray-500">Toutes les données de l{"\u2019"}agence en 1 clic</span>
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
            </div>
        </SectionCard>
    );
}
