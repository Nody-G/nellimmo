'use client';

import type { Property } from '@/lib/types';
import { formatDateFr } from './avenant-types';

interface AvenantProrogationSectionProps {
    property: Property;
    newEndDate: string;
    onEndDateChange: (val: string) => void;
}

export function AvenantProrogationSection({
    property,
    newEndDate,
    onEndDateChange,
}: AvenantProrogationSectionProps) {
    return (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Échéance Actuelle du Mandat :</span>
                <span className="font-mono font-bold text-gray-900">
                    {formatDateFr(property.mandate_end_date)}
                </span>
            </div>

            <div>
                <label className="font-bold text-gray-700 block mb-1">Nouvelle date d{"\u2019"}échéance du mandat :</label>
                <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                    Conformément à la Loi Hoguet, le mandat peut être prorogé d{"\u2019"}un commun accord écrit entre les parties.
                </p>
            </div>
        </div>
    );
}
