'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyPricingProps {
    property: Property;
}

/**
 * Détail des prix & honoraires (Loi ALUR) + mention Géorisques.
 */
export function PropertyPricing({ property }: PropertyPricingProps) {
    return (
        <div className="bg-[#FCFAF7] rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E12B7B]" />
                Détail des Prix & Honoraires
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
                <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="text-gray-400">Prix FAI (Frais d’Agence Inclus) :</span>
                    <div className="text-xl font-black text-[#E12B7B]">
                        {property.price_fai.toLocaleString('fr-FR')} €
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="text-gray-400">Prix Net Vendeur :</span>
                    <div className="text-xl font-bold text-gray-900">
                        {property.price_net_seller.toLocaleString('fr-FR')} €
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="text-gray-400">Honoraires d’Agence TTC :</span>
                    <div className="font-bold text-gray-900">
                        {property.agency_fees_amount.toLocaleString('fr-FR')} € ({property.agency_fees_percentage} %)
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#F3E8EE] space-y-1">
                    <span className="text-gray-400">Charge des Honoraires :</span>
                    <div className="font-bold text-gray-900 capitalize">
                        À la charge de l’{property.fees_paid_by}
                    </div>
                </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
                Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : <a href="https://www.georisques.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#E12B7B]">www.georisques.gouv.fr</a>.
            </p>
        </div>
    );
}
