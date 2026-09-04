'use client';

import { RotateCcw, Settings } from 'lucide-react';

interface SettingsHeaderProps {
    onReset: () => void;
}

/** Page header with the reset-demo button. */
export function SettingsHeader({ onReset }: SettingsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <Settings className="w-4 h-4" />
                    <span>Tour de Contrôle & Paramètres de l{"\u2019"}Agence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Paramètres, Passerelles & Connecteurs API
                </h1>
                <p className="text-xs text-gray-500">
                    Configurez vos mentions légales Loi Hoguet, connectez vos réseaux sociaux et
                    synchronisez votre écosystème Google.
                </p>
            </div>

            <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser Démo Provence
            </button>
        </div>
    );
}
