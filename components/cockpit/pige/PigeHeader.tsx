'use client';

import { Radar, PlusCircle, FileUp } from 'lucide-react';

interface PigeHeaderProps {
    onNewLead: () => void;
    onImport: () => void;
}

/** Page header with the "Ajouter une Annonce Pige" and "Importer CSV" actions. */
export function PigeHeader({ onNewLead, onImport }: PigeHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <Radar className="w-4 h-4" />
                    <span>Module 05 • Radar PAP & Prospection Terrain</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Pige Immobilière & Détection Vendeurs
                </h1>
                <p className="text-xs text-gray-500">
                    Veille Leboncoin/PAP, comparateur DVF en direct, sparring-partner d{"\u2019"}objections et conversion en mandat en 1 clic.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onImport}
                    className="px-4 py-2.5 bg-white hover:bg-gray-50 text-[#131B26] border border-[#F3E8EE] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                    <FileUp className="w-4 h-4 text-[#E12B7B]" />
                    <span>Importer CSV</span>
                </button>
                <button
                    onClick={onNewLead}
                    className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Ajouter une Annonce Pige</span>
                </button>
            </div>
        </div>
    );
}
