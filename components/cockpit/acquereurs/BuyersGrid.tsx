'use client';

import type { Buyer, Property } from '@/lib/types';
import { getMatchingProperties } from './acquereurs-types';
import { BuyerCard } from './BuyerCard';

interface BuyersGridProps {
    buyers: Buyer[];
    activeProperties: Property[];
    onOpenSelection: (buyer: Buyer) => void;
}

/** Responsive grid of buyer cards with live matching against active mandates. */
export function BuyersGrid({ buyers, activeProperties, onOpenSelection }: BuyersGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {buyers.map((b) => {
                const matchingProperties = getMatchingProperties(activeProperties, b);
                return (
                    <BuyerCard
                        key={b.id}
                        buyer={b}
                        matchingProperties={matchingProperties}
                        onOpenSelection={onOpenSelection}
                    />
                );
            })}
        </div>
    );
}
