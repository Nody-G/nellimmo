'use client';

import { MessageCircle, Check, X, Phone, CalendarDays } from 'lucide-react';
import type { RelanceAction, RelanceCategory } from '@/lib/relances';

interface RelanceCardProps {
    action: RelanceAction;
    onWhatsApp: (action: RelanceAction) => void;
    onMarkDone: (action: RelanceAction) => void;
    onIgnore: (action: RelanceAction) => void;
}

const CATEGORY_BADGE: Record<RelanceCategory, { label: string; className: string }> = {
    visite_rappel: { label: 'Confirmation de visite', className: 'bg-sky-50 text-sky-700 border-sky-200' },
    visite_relance: { label: 'Relance après visite', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    transaction_pret: { label: 'Accord de prêt', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    transaction_sru: { label: 'Fin de délai SRU', className: 'bg-orange-50 text-orange-700 border-orange-200' },
    transaction_acte: { label: 'Signature de l\u2019acte', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    mandat_echeance: { label: '\u00c9ch\u00e9ance de mandat', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export function RelanceCard({ action, onWhatsApp, onMarkDone, onIgnore }: RelanceCardProps) {
    const badge = CATEGORY_BADGE[action.category];

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.className}`}>
                        {badge.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {action.dueLabel}
                    </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                    <Phone className="w-3 h-3" />
                    {action.contactPhone || 'Num\u00e9ro manquant'}
                </span>
            </div>

            <div>
                <h3 className="text-sm font-bold text-[#131B26]">{action.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    {action.contactName} &middot; {action.sourceLabel}
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{action.message}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                    onClick={() => onWhatsApp(action)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1fb457] text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Ouvrir WhatsApp
                </button>
                <button
                    onClick={() => onMarkDone(action)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                    <Check className="w-3.5 h-3.5" />
                    Marquer faite
                </button>
                <button
                    onClick={() => onIgnore(action)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                    Ignorer
                </button>
            </div>
        </div>
    );
}
