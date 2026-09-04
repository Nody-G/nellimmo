'use client';

import React from 'react';
import { Printer, Check } from 'lucide-react';
import type { Property, AvenantType } from '@/lib/types';
import { formatDateFr } from './avenant-types';
import { AvenantLetterhead } from './AvenantLetterhead';
import { AvenantArticlesSection } from './AvenantArticlesSection';

interface AvenantPreviewActeProps {
    property: Property;
    avenantType: AvenantType;
    newPriceFai: number;
    newFeesAmount: number;
    newNetSeller: number;
    newFeesPercentage: number;
    newEndDate: string;
    reason: string;
    avenantNumber: number;
    agentName: string;
    onBack: () => void;
    onSave: () => void;
}

export function AvenantPreviewActe({
    property,
    avenantType,
    newPriceFai,
    newFeesAmount,
    newNetSeller,
    newFeesPercentage,
    newEndDate,
    reason,
    avenantNumber,
    agentName,
    onBack,
    onSave,
}: AvenantPreviewActeProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between print:hidden">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-xs text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1"
                >
                    ← Modifier les paramètres de l{"\u2019"}avenant
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer A4</span>
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                        <Check className="w-4 h-4" />
                        <span>Valider & Enregistrer</span>
                    </button>
                </div>
            </div>

            {/* Official Legal Addendum Sheet */}
            <div
                id="printable-mandate-avenant"
                className="bg-white p-8 border-2 border-gray-300 rounded-2xl space-y-5 text-xs text-gray-900 font-sans leading-relaxed"
            >
                <AvenantLetterhead property={property} avenantNumber={avenantNumber} />

                {/* Parties */}
                <div className="space-y-2">
                    <p>
                        <span className="font-bold">ENTRE LES SOUSSIGNÉS :</span>
                    </p>
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                        <p>
                            <span className="font-bold">Le Mandant : </span> {property.seller_name}
                        </p>
                        <p>
                            <span className="font-bold">Demeurant : </span> {property.seller_address || property.city}
                        </p>
                        <p>
                            <span className="font-bold">Téléphone : </span> {property.seller_phone} • Email :{' '}
                            {property.seller_email || 'Non renseigné'}
                        </p>
                        <p className="text-[10px] text-gray-500 italic">D{"\u2019"}une part,</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                        <p>
                            <span className="font-bold">Et le Mandataire : </span> SASU NELL{"\u2019"}IMMO, représentée par Mme
                            Nelly FERNANDEZ, Présidente.
                        </p>
                        <p className="text-[10px] text-gray-500 italic">D{"\u2019"}autre part,</p>
                    </div>
                </div>

                {/* Preambule */}
                <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500 block">PRÉAMBULE</span>
                    <p className="text-justify text-[11px] text-gray-700">
                        Il est préalablement rappelé que par mandat de vente {property.mandate_type} N° {property.mandate_number}{' '}
                        en date du {formatDateFr(property.mandate_date)}, le Mandant a confié au Mandataire la mission de vendre le
                        bien immobilier situé à : <span className="font-bold">{property.title}</span>, sis {property.address},{' '}
                        {property.postal_code} {property.city}.
                    </p>
                </div>

                {/* Articles 1 & 2 */}
                <AvenantArticlesSection
                    property={property}
                    avenantType={avenantType}
                    newPriceFai={newPriceFai}
                    newFeesAmount={newFeesAmount}
                    newNetSeller={newNetSeller}
                    newFeesPercentage={newFeesPercentage}
                    newEndDate={newEndDate}
                    reason={reason}
                />

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div className="text-center p-3 border border-gray-200 rounded-xl">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Pour le Mandant</span>
                        <span className="text-xs font-bold text-gray-900 block">{property.seller_name}</span>
                        <div className="h-16 flex items-center justify-center text-xs text-gray-400 italic">
                            Mention {'"'}Bon pour avenant{'"'}
                        </div>
                    </div>

                    <div className="text-center p-3 border border-gray-200 rounded-xl">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                            Pour la SASU NELL{"\u2019"}IMMO
                        </span>
                        <span className="text-xs font-bold text-gray-900 block">{agentName}</span>
                        <div className="h-16 flex items-center justify-center text-xs text-gray-400 italic">
                            Présidente • CPI 1310 2019 000 042 974
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
