'use client';

import { ShieldCheck, Check } from 'lucide-react';
import type { Property, AvenantType } from '@/lib/types';
import { AvenantTypeSelector } from './AvenantTypeSelector';
import { AvenantPriceSection } from './AvenantPriceSection';
import { AvenantProrogationSection } from './AvenantProrogationSection';

interface AvenantFormProps {
    property: Property;
    avenantType: AvenantType;
    newPriceFai: number;
    newFeesAmount: number;
    newNetSeller: number;
    newFeesPercentage: number;
    newEndDate: string;
    reason: string;
    onTypeChange: (type: AvenantType) => void;
    onPriceChange: (val: number) => void;
    onFeesChange: (val: number) => void;
    onEndDateChange: (val: string) => void;
    onReasonChange: (val: string) => void;
    onPreview: () => void;
    onSave: () => void;
}

export function AvenantForm({
    property,
    avenantType,
    newPriceFai,
    newFeesAmount,
    newNetSeller,
    newFeesPercentage,
    newEndDate,
    reason,
    onTypeChange,
    onPriceChange,
    onFeesChange,
    onEndDateChange,
    onReasonChange,
    onPreview,
    onSave,
}: AvenantFormProps) {
    return (
        <div className="space-y-4 text-xs print:hidden">
            <AvenantTypeSelector avenantType={avenantType} onChange={onTypeChange} />

            {avenantType === 'baisse_prix' && (
                <AvenantPriceSection
                    property={property}
                    newPriceFai={newPriceFai}
                    newFeesAmount={newFeesAmount}
                    newNetSeller={newNetSeller}
                    newFeesPercentage={newFeesPercentage}
                    onPriceChange={onPriceChange}
                    onFeesChange={onFeesChange}
                />
            )}

            {avenantType === 'prorogation' && (
                <AvenantProrogationSection
                    property={property}
                    newEndDate={newEndDate}
                    onEndDateChange={onEndDateChange}
                />
            )}

            {/* Reason */}
            <div>
                <label className="font-bold text-gray-700 block mb-1">
                    Motifs et considérations de l{"\u2019"}avenant :
                </label>
                <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-[#E12B7B]"
                />
            </div>

            <div className="flex items-center justify-between pt-2">
                <button
                    type="button"
                    onClick={onPreview}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                    <ShieldCheck className="w-4 h-4 text-[#C59A45]" />
                    <span>Prévisualiser l{"\u2019"}Acte Juridique Officiel</span>
                </button>

                <button
                    type="button"
                    onClick={onSave}
                    className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                    <Check className="w-4 h-4" />
                    <span>Sceller l{"\u2019"}Avenant Immédiatement</span>
                </button>
            </div>
        </div>
    );
}
