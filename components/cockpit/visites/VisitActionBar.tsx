'use client';

import { CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

interface VisitActionBarProps {
    isSigned: boolean;
    onSave: () => void;
    onViewOfficial: () => void;
}

export function VisitActionBar({ isSigned, onSave, onViewOfficial }: VisitActionBarProps) {
    if (isSigned) {
        return (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold">Bon de visite scellé et archivé avec succès !</span>
                </div>
                <button
                    type="button"
                    onClick={onViewOfficial}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                    <FileText className="w-4 h-4" />
                    <span>Consulter le Bon Officiel</span>
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onSave}
            className="w-full py-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
            <ShieldCheck className="w-5 h-5" />
            <span>Valider & Archiver le Bon de Visite Horodaté</span>
        </button>
    );
}
