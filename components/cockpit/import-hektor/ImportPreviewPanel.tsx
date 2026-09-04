'use client';

import { FileSpreadsheet, RefreshCw, Check } from 'lucide-react';
import { Property, Buyer } from '@/lib/types';
import { ParseResult } from '@/lib/hektor';
import { MandatesPreviewTable } from './MandatesPreviewTable';
import { BuyersPreviewTable } from './BuyersPreviewTable';

interface ImportPreviewPanelProps {
    propertyParseResult: ParseResult<Property> | null;
    buyerParseResult: ParseResult<Buyer> | null;
    isInjecting: boolean;
    onCommitImport: () => void;
}

export function ImportPreviewPanel({
    propertyParseResult,
    buyerParseResult,
    isInjecting,
    onCommitImport,
}: ImportPreviewPanelProps) {
    const hasValidData =
        (propertyParseResult && propertyParseResult.validCount > 0) ||
        (buyerParseResult && buyerParseResult.validCount > 0);
    const commitCount = propertyParseResult?.validCount || buyerParseResult?.validCount || 0;

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF5F8] pb-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                        Prévisualisation & Validation
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#131B26]">
                        Contrôle des Données Détectées
                    </h3>
                </div>

                {hasValidData && (
                    <button
                        type="button"
                        onClick={onCommitImport}
                        disabled={isInjecting}
                        className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                        {isInjecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>
                            {isInjecting ? 'Injection en cours...' : `Valider & Importer (${commitCount})`}
                        </span>
                    </button>
                )}
            </div>

            {/* Empty State */}
            {!propertyParseResult && !buyerParseResult && (
                <div className="p-12 text-center text-gray-400 space-y-3">
                    <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="text-xs font-medium max-w-md mx-auto">
                        Déposez un fichier CSV d{"\u2019"}Hektor ou collez du texte dans la zone de gauche pour
                        voir apparaître la prévisualisation instantanée.
                    </p>
                </div>
            )}

            {/* Mandates Preview */}
            {propertyParseResult && <MandatesPreviewTable result={propertyParseResult} />}

            {/* Buyers Preview */}
            {buyerParseResult && <BuyersPreviewTable result={buyerParseResult} />}
        </div>
    );
}
