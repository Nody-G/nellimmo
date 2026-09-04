'use client';

import { Info, Printer, X } from 'lucide-react';
import type { Property, PropertyDocument } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';
import type { ChecklistItemDef } from './alur-ged-types';
import { findAttachedDocument } from './alur-ged-types';

interface NotarySlipModalProps {
    isOpen: boolean;
    property: Property;
    applicableChecklist: ChecklistItemDef[];
    documents: PropertyDocument[];
    onClose: () => void;
}

/** Notary transmission slip modal listing all collected ALUR documents. */
export function NotarySlipModal({
    isOpen,
    property,
    applicableChecklist,
    documents,
    onClose,
}: NotarySlipModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                            Étude Notariale • Dossier de Vente
                        </span>
                        <h3 className="text-lg font-serif font-bold text-[#131B26]">
                            Bordereau Officiel de Transmission Notaire
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 bg-[#131B26] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Imprimer
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Slip Content */}
                <div className="space-y-4 text-xs">
                    <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Agence Émettrice</span>
                            <span className="font-bold text-gray-900 block">SASU Nell{"\u2019"}Immo (Nelly Fernandez)</span>
                            <span className="text-gray-600">Pélissanne • Carte CPI 1310 2019 000 042 974</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Bien & Mandat</span>
                            <span className="font-bold text-[#E12B7B] block">{formatMandateRef(property.mandate_number)}</span>
                            <span className="text-gray-800 font-semibold">{property.title} ({property.city})</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#131B26] uppercase tracking-wider mb-2">
                            Inventaire des Pièces Justificatives Fournies :
                        </h4>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500">
                                    <tr>
                                        <th className="p-2.5">Document</th>
                                        <th className="p-2.5">Catégorie</th>
                                        <th className="p-2.5">Statut</th>
                                        <th className="p-2.5">Date Validité</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-[11px]">
                                    {applicableChecklist.map((item) => {
                                        const doc = findAttachedDocument(documents, item);
                                        return (
                                            <tr key={item.key}>
                                                <td className="p-2.5 font-semibold text-gray-900">{item.name}</td>
                                                <td className="p-2.5 uppercase font-mono text-[10px] text-gray-500">{item.category}</td>
                                                <td className="p-2.5">
                                                    {doc ? (
                                                        <span className="text-emerald-700 font-bold">✓ Fourni ({doc.filename})</span>
                                                    ) : (
                                                        <span className={item.mandatory ? 'text-rose-600 font-bold' : 'text-gray-400'}>
                                                            {item.mandatory ? '✗ Manquant' : 'Non requis'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-2.5 text-gray-600">
                                                    {doc?.expires_at ? new Date(doc.expires_at).toLocaleDateString('fr-FR') : 'Permanente'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p>
                            Ce bordereau certifie que les pièces mentionnées ci-dessus ont été collectées et vérifiées par la SASU Nell{"\u2019"}Immo conformément aux dispositions de la Loi ALUR n° 2014-366 et du Décret n° 72-678 (Loi Hoguet).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
