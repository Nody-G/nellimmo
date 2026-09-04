'use client';

import {
    Clock,
    Download,
    FileText,
    MessageCircle,
    Trash2,
    Upload,
} from 'lucide-react';
import type { PropertyDocument, AlurDocumentStatus } from '@/lib/types';
import type { ChecklistItemDef } from './alur-ged-types';

interface DocumentCardProps {
    item: ChecklistItemDef;
    attachedDoc?: PropertyDocument;
    status: AlurDocumentStatus;
    onUpload: (key: string) => void;
    onChangeStatus: (docId: string, status: AlurDocumentStatus) => void;
    onDelete: (docId: string) => void;
    onWhatsApp: (itemName: string) => void;
}

/** A single ALUR checklist item card with status, attached file and actions. */
export function DocumentCard({
    item,
    attachedDoc,
    status,
    onUpload,
    onChangeStatus,
    onDelete,
    onWhatsApp,
}: DocumentCardProps) {
    return (
        <div
            className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${status === 'valide'
                    ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                    : status === 'a_renouveler'
                        ? 'border-amber-300 bg-amber-50/20'
                        : item.mandatory
                            ? 'border-rose-200 bg-rose-50/10'
                            : 'border-gray-200'
                }`}
        >
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600 block">
                            {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#131B26] leading-tight">
                            {item.name}
                        </h4>
                    </div>

                    <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${status === 'valide'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'a_renouveler'
                                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                                    : item.mandatory
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {status === 'valide'
                            ? '✓ Valide'
                            : status === 'a_renouveler'
                                ? '⚠️ Périmé'
                                : item.mandatory
                                    ? 'Obligatoire'
                                    : 'Optionnel'}
                    </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description}
                </p>

                {/* Attached details */}
                {attachedDoc && (
                    <div className="p-2.5 bg-white/80 rounded-xl border border-gray-100 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-mono text-gray-600">
                            <span className="truncate max-w-[170px] flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-[#E12B7B]" />
                                {attachedDoc.filename}
                            </span>
                            <span>{Math.round((attachedDoc.file_size || 200000) / 1024)} Ko</span>
                        </div>
                        {attachedDoc.expires_at && (
                            <div className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>Validité : {new Date(attachedDoc.expires_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {attachedDoc ? (
                    <>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onChangeStatus(attachedDoc.id, attachedDoc.status === 'valide' ? 'a_renouveler' : 'valide')}
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                title="Changer statut"
                            >
                                <Clock className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => onDelete(attachedDoc.id)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Supprimer la pièce"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            {status === 'a_renouveler' && (
                                <button
                                    type="button"
                                    onClick={() => onWhatsApp(item.name)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                    title="Demander le renouvellement au vendeur par WhatsApp"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <a
                            href={attachedDoc.file_url || '#'}
                            download={attachedDoc.filename}
                            className="px-3 py-1 bg-white hover:bg-gray-50 text-[#131B26] border border-gray-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                        >
                            <Download className="w-3 h-3 text-[#E12B7B]" />
                            Télécharger
                        </a>
                    </>
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        <button
                            onClick={() => onUpload(item.key)}
                            className="flex-1 py-1.5 bg-gray-50 hover:bg-[#E12B7B] hover:text-white text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Uploader
                        </button>
                        <button
                            type="button"
                            onClick={() => onWhatsApp(item.name)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer"
                            title="Relancer le vendeur par WhatsApp pour cette pièce"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
