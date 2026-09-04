'use client';

import { TrendingDown } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatEuro } from './avenant-types';

interface AvenantPriceSectionProps {
    property: Property;
    newPriceFai: number;
    newFeesAmount: number;
    newNetSeller: number;
    newFeesPercentage: number;
    onPriceChange: (val: number) => void;
    onFeesChange: (val: number) => void;
}

export function AvenantPriceSection({
    property,
    newPriceFai,
    newFeesAmount,
    newNetSeller,
    newFeesPercentage,
    onPriceChange,
    onFeesChange,
}: AvenantPriceSectionProps) {
    const priceDifference = newPriceFai - property.price_fai;
    const dropPercent = property.price_fai > 0 ? ((priceDifference / property.price_fai) * 100).toFixed(1) : '0';

    return (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Prix FAI Mandat Actuel :</span>
                <span className="font-mono font-bold text-gray-900 text-sm">
                    {formatEuro(property.price_fai)} € FAI
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="font-bold text-gray-700 block mb-1">Nouveau Prix FAI (€) *</label>
                    <input
                        type="number"
                        value={newPriceFai}
                        onChange={(e) => onPriceChange(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:outline-[#E12B7B]"
                    />
                </div>

                <div>
                    <label className="font-bold text-gray-700 block mb-1">Honoraires TTC (€)</label>
                    <input
                        type="number"
                        value={newFeesAmount}
                        onChange={(e) => onFeesChange(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-semibold focus:outline-[#E12B7B]"
                    />
                    <span className="text-[10px] text-[#E12B7B] font-semibold mt-0.5 block">
                        Taux : {newFeesPercentage}% FAI
                    </span>
                </div>

                <div>
                    <label className="font-bold text-gray-700 block mb-1">Net Vendeur Résultant</label>
                    <div className="p-2.5 bg-white border border-gray-200 rounded-xl font-serif font-black text-gray-900 text-sm">
                        {formatEuro(newNetSeller)} €
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 pt-1">
                <TrendingDown className="w-4 h-4" />
                <span>
                    Baisse consentie : {formatEuro(Math.abs(priceDifference))} € ({dropPercent}%)
                </span>
            </div>
        </div>
    );
}
