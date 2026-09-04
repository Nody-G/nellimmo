'use client';

import { AlertTriangle } from 'lucide-react';
import { Property } from '@/lib/types';
import { ParseResult } from '@/lib/hektor';
import { formatMandateRef } from '@/lib/hoguet';

interface MandatesPreviewTableProps {
    result: ParseResult<Property>;
}

export function MandatesPreviewTable({ result }: MandatesPreviewTableProps) {
    return (
        <div className="space-y-4">
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl text-xs">
                <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Lignes Détectées</span>
                    <span className="font-bold text-gray-900 text-sm">{result.totalParsed}</span>
                </div>
                <div>
                    <span className="text-emerald-600 text-[10px] uppercase font-bold block">Mandats Valides</span>
                    <span className="font-black text-emerald-700 text-sm">{result.validCount}</span>
                </div>
                <div>
                    <span className="text-amber-600 text-[10px] uppercase font-bold block">Avertissements</span>
                    <span className="font-bold text-amber-700 text-sm">{result.errorCount}</span>
                </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Remarques de conversion :</span>
                    </div>
                    {result.warnings.slice(0, 3).map((w, i) => (
                        <p key={i} className="text-[11px] text-amber-800">
                            • {w}
                        </p>
                    ))}
                </div>
            )}

            {/* Table Preview */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-2xs">
                        <tr className="text-gray-400 font-bold uppercase text-[10px]">
                            <th className="pb-2">Réf.</th>
                            <th className="pb-2">Titre & Ville</th>
                            <th className="pb-2">Prix FAI</th>
                            <th className="pb-2">Surface</th>
                            <th className="pb-2">Vendeur</th>
                            <th className="pb-2">DPE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {result.items.map((p, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-2.5 font-mono font-bold text-[#E12B7B]">
                                    {formatMandateRef(p.mandate_number)}
                                </td>
                                <td className="py-2.5">
                                    <div className="flex items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={
                                                p.images?.[0]?.image_url ||
                                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'
                                            }
                                            alt=""
                                            className="w-8 h-6 rounded object-cover bg-gray-100 shrink-0"
                                        />
                                        <div className="overflow-hidden">
                                            <span className="font-bold text-gray-900 block truncate max-w-[160px]">
                                                {p.title}
                                            </span>
                                            <span className="text-[10px] text-gray-500">{p.city}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2.5 font-bold text-gray-900">
                                    {p.price_fai.toLocaleString('fr-FR')} €
                                </td>
                                <td className="py-2.5 text-gray-700">
                                    {p.living_area} m² ({p.rooms_count}p)
                                </td>
                                <td className="py-2.5 text-gray-600 truncate max-w-[100px]">{p.seller_name}</td>
                                <td className="py-2.5">
                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 font-bold text-[10px]">
                                        {p.dpe_letter || '-'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
