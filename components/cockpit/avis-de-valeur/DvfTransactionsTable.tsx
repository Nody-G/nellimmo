'use client';

import { Info } from 'lucide-react';
import type { DVFTransaction } from '@/lib/types';
import { formatFr } from './avis-de-valeur-types';

interface DvfTransactionsTableProps {
    transactions: DVFTransaction[];
    propertyType?: string;
    sourceLabel?: string;
    isOfficial?: boolean;
}

/** Real notary sales table (DVF) — data routed through the DvfProvider seam. */
export function DvfTransactionsTable({
    transactions,
    propertyType,
    sourceLabel = 'Données locales de démonstration',
    isOfficial = false,
}: DvfTransactionsTableProps) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
                <div>
                    <h3 className="font-serif font-bold text-base text-[#131B26]">
                        Transactions Notariées Comparables ({transactions.length} ventes{propertyType ? ` ${propertyType}` : ''})
                    </h3>
                    <p className="text-xs text-gray-500">
                        Actes authentiques enregistrés par les notaires dans un rayon de 500m
                    </p>
                </div>
            </div>

            {/* Transparency banner: reflects the active DVF source */}
            <div
                className={`flex items-start gap-3 p-3.5 rounded-2xl text-[11px] leading-relaxed border ${isOfficial
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}
            >
                <Info className={`w-4 h-4 mt-0.5 shrink-0 ${isOfficial ? 'text-emerald-600' : 'text-amber-600'}`} />
                {isOfficial ? (
                    <p>
                        <strong className="font-bold">Ventes réelles officielles.</strong>{' '}
                        Les références ci-dessous proviennent de la source {sourceLabel} et correspondent à des actes
                        authentiques enregistrés par les notaires.
                    </p>
                ) : (
                    <p>
                        <strong className="font-bold">Données de démonstration.</strong>{' '}
                        Les références ci-dessous sont issues de la source {sourceLabel} (simulation locale) afin
                        d{"\u2019"}illustrer la méthode. Elles ne constituent pas des actes authentiques vérifiés. La
                        connexion à l{"\u2019"}API officielle DGFiP / data.gouv remplacera automatiquement ces données
                        par les ventes réelles de votre secteur.
                    </p>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                            <th className="pb-3">Date Mutation</th>
                            <th className="pb-3">Adresse / Rue</th>
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Surface Bâti</th>
                            <th className="pb-3">Terrain</th>
                            <th className="pb-3">Distance</th>
                            <th className="pb-3">Prix Acte Réel</th>
                            <th className="pb-3 text-right">Prix / m²</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-3 font-semibold text-gray-900">{t.date_mutation}</td>
                                <td className="py-3 font-bold text-gray-900">{t.adresse_numero} {t.adresse_nom_voie}</td>
                                <td className="py-3 text-gray-600">{t.type_local} ({t.nombre_pieces_principales}p)</td>
                                <td className="py-3 font-semibold">{t.surface_reelle_bati} m²</td>
                                <td className="py-3 text-gray-500">{t.surface_terrain ? `${t.surface_terrain} m²` : '—'}</td>
                                <td className="py-3 text-gray-500 font-mono">~{t.distance_metres} m</td>
                                <td className="py-3 font-black text-[#131B26]">
                                    {formatFr(t.valeur_fonciere)} €
                                </td>
                                <td className="py-3 font-bold text-[#E12B7B] text-right">
                                    {formatFr(t.prix_m2)} €/m²
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
