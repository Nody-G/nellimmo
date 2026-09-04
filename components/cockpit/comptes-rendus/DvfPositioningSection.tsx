'use client';

import { useEffect, useMemo, useState } from 'react';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DVFTransaction, Property } from '@/lib/types';
import { fetchDvfTransactions, getActiveDvfSourceLabel, isDvfSourceOfficial } from '@/lib/dvf';

/**
 * Positionnement Concurrentiel DVF du Marché — Bilan de Commercialisation (Module 02).
 *
 * Liste les ventes notariées récentes sur la même commune (via la couture DvfProvider)
 * et compare le prix au m² demandé du mandat au prix au m² réellement constaté.
 */

interface DvfPositioningSectionProps {
    property: Property;
}

const TYPE_ALIASES: Record<string, string> = {
    maison: 'Maison',
    appartement: 'Appartement',
    villa: 'Maison',
    immeuble: 'Immeuble',
    terrain: 'Terrain',
};

function normalizeType(t: string): string {
    return t.trim().toLowerCase().replace(/[^a-z]/g, '');
}

export function DvfPositioningSection({ property }: DvfPositioningSectionProps) {
    const [transactions, setTransactions] = useState<DVFTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    const postalCode = property.postal_code || (property.city === 'Pélissanne' ? '13330' : undefined);
    const wantedType = TYPE_ALIASES[normalizeType(property.property_type)] || property.property_type;

    useEffect(() => {
        let active = true;
        fetchDvfTransactions({
            locality: property.city,
            postalCode,
            propertyType: wantedType,
        })
            .then((rows) => {
                if (active) setTransactions(rows);
            })
            .catch(() => {
                if (active) setTransactions([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property.id]);

    const stats = useMemo(() => {
        if (transactions.length === 0) return null;
        const prices = transactions.map((t) => t.prix_m2);
        const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return { avg, min, max };
    }, [transactions]);

    const askingM2 = property.living_area > 0 ? property.price_fai / property.living_area : null;

    const gapPct = stats && askingM2 ? ((askingM2 - stats.avg) / stats.avg) * 100 : null;

    const sourceLabel = getActiveDvfSourceLabel();
    const isOfficial = isDvfSourceOfficial();

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                    <h4 className="font-serif font-bold text-sm text-[#131B26]">
                        Positionnement Concurrentiel DVF du Marché
                    </h4>
                    <p className="text-[11px] text-gray-500">
                        Ventes notariées récentes à {property.city} — prix au m² réels
                    </p>
                </div>
            </div>

            {/* Benchmark vs prix demandé */}
            {stats && askingM2 !== null && gapPct !== null && (
                <div
                    className={`flex items-start gap-3 p-3.5 rounded-2xl text-[11px] leading-relaxed border ${gapPct <= 5
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                        }`}
                >
                    {gapPct <= 5 ? (
                        <TrendingUp className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    ) : gapPct > 0 ? (
                        <TrendingDown className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                    ) : (
                        <Minus className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    )}
                    <p>
                        Votre bien est proposé à{' '}
                        <strong className="font-bold">{Math.round(askingM2).toLocaleString('fr-FR')} €/m²</strong> contre une
                        moyenne de marché de{' '}
                        <strong className="font-bold">{Math.round(stats.avg).toLocaleString('fr-FR')} €/m²</strong> sur{' '}
                        {transactions.length} vente{transactions.length > 1 ? 's' : ''} comparable
                        {transactions.length > 1 ? 's' : ''} ({Math.round(stats.min).toLocaleString('fr-FR')} à{' '}
                        {Math.round(stats.max).toLocaleString('fr-FR')} €/m²).
                        {gapPct > 5 ? (
                            <> Un écart de <strong className="font-bold">+{gapPct.toFixed(0)}%</strong> au-dessus du marché justifie une vigilance sur le délai de vente.</>
                        ) : (
                            <> Un positionnement <strong className="font-bold">parfaitement en phase</strong> avec le micromarché notarial.</>
                        )}
                    </p>
                </div>
            )}

            {/* Transparency banner */}
            <div
                className={`flex items-start gap-3 p-3 rounded-2xl text-[10px] leading-relaxed border ${isOfficial
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}
            >
                <Info className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isOfficial ? 'text-emerald-600' : 'text-amber-600'}`} />
                <p>
                    {isOfficial ? (
                        <>Ventes réelles officielles issues de {sourceLabel}.</>
                    ) : (
                        <>Données de démonstration ({sourceLabel}). La connexion à l’API DGFiP / data.gouv remplacera ces références par les ventes réelles du secteur.</>
                    )}
                </p>
            </div>

            {/* Comparables table */}
            {loading ? (
                <p className="text-xs text-gray-400 font-semibold py-2">Chargement des références DVF…</p>
            ) : transactions.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold py-2">
                    Aucune vente comparable trouvée pour {property.city}.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px]">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Adresse</th>
                                <th className="pb-2">Type</th>
                                <th className="pb-2">Surface</th>
                                <th className="pb-2">Prix Acte</th>
                                <th className="pb-2 text-right">Prix / m²</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.slice(0, 6).map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-2 font-semibold text-gray-900">{t.date_mutation}</td>
                                    <td className="py-2 font-bold text-gray-900">
                                        {t.adresse_numero} {t.adresse_nom_voie}
                                    </td>
                                    <td className="py-2 text-gray-600">
                                        {t.type_local} ({t.nombre_pieces_principales}p)
                                    </td>
                                    <td className="py-2 font-semibold">{t.surface_reelle_bati} m²</td>
                                    <td className="py-2 font-black text-[#131B26]">
                                        {t.valeur_fonciere.toLocaleString('fr-FR')} €
                                    </td>
                                    <td className="py-2 font-bold text-[#E12B7B] text-right">
                                        {t.prix_m2.toLocaleString('fr-FR')} €/m²
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
