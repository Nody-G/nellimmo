'use client';

import { FileSignature } from 'lucide-react';
import type { Property } from '@/lib/types';

interface AvenantHeaderProps {
    property: Property;
    onClose: () => void;
}

export function AvenantHeader({ property, onClose }: AvenantHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] text-white flex items-center justify-center">
                    <FileSignature className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg text-[#131B26]">
                        Générateur d{"\u2019"}Avenant au Mandat (Loi Hoguet Art. 72)
                    </h3>
                    <span className="text-xs text-gray-500 block">
                        Mandat N° {property.mandate_number} ({property.mandate_type}) • {property.title}
                    </span>
                </div>
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold text-xs"
                aria-label="Fermer"
            >
                ✕
            </button>
        </div>
    );
}
