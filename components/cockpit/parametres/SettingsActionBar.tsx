'use client';

import { Save, CheckCircle2 } from 'lucide-react';

interface SettingsActionBarProps {
    savedSuccess: boolean;
}

/** Bottom action bar with saved indicator and submit button. */
export function SettingsActionBar({ savedSuccess }: SettingsActionBarProps) {
    return (
        <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Tous les paramètres et connexions sont enregistrés !
                </span>
            ) : (
                <span className="text-xs text-gray-400">Toutes les modifications sont immédiatement actives sur votre cockpit.</span>
            )}

            <button
                type="submit"
                className="px-6 py-3.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
            >
                <Save className="w-4 h-4" />
                Enregistrer les Paramètres
            </button>
        </div>
    );
}
