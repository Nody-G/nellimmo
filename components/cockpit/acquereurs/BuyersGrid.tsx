'use client';

import React from 'react';
import type { Buyer, Property } from '@/lib/types';
import { getMatchingProperties } from './acquereurs-types';
import { BuyerCard } from './BuyerCard';
import { Users } from 'lucide-react';

interface BuyersGridProps {
    buyers: Buyer[];
    activeProperties: Property[];
    onOpenSelection: (buyer: Buyer) => void;
    showRanking?: boolean;
}

/** Responsive grid of buyer cards with live matching against active mandates. */
export function BuyersGrid({
    buyers,
    activeProperties,
    onOpenSelection,
    showRanking = true,
}: BuyersGridProps) {
    if (buyers.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-[#F3E8EE] p-12 text-center text-gray-500 space-y-3 max-w-lg mx-auto">
                <Users className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="font-bold text-gray-700">Aucun acquéreur trouvé</h3>
                <p className="text-xs text-gray-400">
                    Modifiez vos critères de recherche ou ajoutez un nouveau profil acquéreur.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {buyers.map((b, idx) => {
                const matchingProperties = getMatchingProperties(activeProperties, b);
                return (
                    <BuyerCard
                        key={b.id}
                        buyer={b}
                        rankIndex={showRanking ? idx + 1 : undefined}
                        matchingProperties={matchingProperties}
                        onOpenSelection={onOpenSelection}
                    />
                );
            })}
        </div>
    );
}
