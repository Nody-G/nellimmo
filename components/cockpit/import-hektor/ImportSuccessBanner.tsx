'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ImportSuccessBannerProps {
    injectedCount: number;
    onClose: () => void;
}

export function ImportSuccessBanner({ injectedCount, onClose }: ImportSuccessBannerProps) {
    return (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-start justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-emerald-950 text-base">
                        Importation terminée avec succès !
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                        <strong>{injectedCount} enregistrement(s)</strong> ont été intégrés et synchronisés
                        dans votre registre Cockpit.
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <Link
                            href="/cockpit/mandats"
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
                        >
                            <span>Voir le Registre des Mandats</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="/cockpit/acquereurs"
                            className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl transition"
                        >
                            Voir le Fichier Acquéreurs
                        </Link>
                    </div>
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-emerald-700 hover:text-emerald-900 font-bold p-1 cursor-pointer"
            >
                ✕
            </button>
        </div>
    );
}
