'use client';

import { Property, Buyer } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface VisitSelectorsProps {
    properties: Property[];
    buyers: Buyer[];
    selectedPropertyId: string;
    selectedBuyerId: string;
    onPropertyChange: (id: string) => void;
    onBuyerChange: (id: string) => void;
}

export function VisitSelectors({
    properties,
    buyers,
    selectedPropertyId,
    selectedBuyerId,
    onPropertyChange,
    onBuyerChange
}: VisitSelectorsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Bien Immobilier Visité
                </label>
                <select
                    value={selectedPropertyId}
                    onChange={(e) => onPropertyChange(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
                >
                    {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                            {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Acquéreur Visiteur (CRM)
                </label>
                <select
                    value={selectedBuyerId}
                    onChange={(e) => onBuyerChange(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
                >
                    {buyers.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.first_name} {b.last_name} ({b.phone})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
