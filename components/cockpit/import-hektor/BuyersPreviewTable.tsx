'use client';

import { Buyer } from '@/lib/types';
import { ParseResult } from '@/lib/hektor';

interface BuyersPreviewTableProps {
    result: ParseResult<Buyer>;
}

export function BuyersPreviewTable({ result }: BuyersPreviewTableProps) {
    return (
        <div className="space-y-4">
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl text-xs">
                <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Lignes Détectées</span>
                    <span className="font-bold text-gray-900 text-sm">{result.totalParsed}</span>
                </div>
                <div>
                    <span className="text-emerald-600 text-[10px] uppercase font-bold block">
                        Acquéreurs Valides
                    </span>
                    <span className="font-black text-emerald-700 text-sm">{result.validCount}</span>
                </div>
                <div>
                    <span className="text-amber-600 text-[10px] uppercase font-bold block">Avertissements</span>
                    <span className="font-bold text-amber-700 text-sm">{result.errorCount}</span>
                </div>
            </div>

            {/* Table Preview */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-2xs">
                        <tr className="text-gray-400 font-bold uppercase text-[10px]">
                            <th className="pb-2">Nom & Prénom</th>
                            <th className="pb-2">Téléphone</th>
                            <th className="pb-2">Budget Max</th>
                            <th className="pb-2">Surface Min</th>
                            <th className="pb-2">Secteur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {result.items.map((b, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-2.5 font-bold text-gray-900">
                                    {b.first_name} {b.last_name}
                                </td>
                                <td className="py-2.5 font-mono text-gray-600">{b.phone}</td>
                                <td className="py-2.5 font-bold text-[#E12B7B]">
                                    {b.budget_max.toLocaleString('fr-FR')} €
                                </td>
                                <td className="py-2.5 text-gray-700">
                                    {b.min_surface} m² ({b.min_bedrooms} ch.)
                                </td>
                                <td className="py-2.5 text-gray-600 truncate max-w-[140px]">
                                    {b.target_cities.join(', ')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
