'use client';

import { TrendingDown, Clock } from 'lucide-react';
import type { AvenantType } from '@/lib/types';

interface AvenantTypeSelectorProps {
    avenantType: AvenantType;
    onChange: (type: AvenantType) => void;
}

export function AvenantTypeSelector({ avenantType, onChange }: AvenantTypeSelectorProps) {
    const optionClass = (active: boolean) =>
        `p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${active
            ? 'border-[#E12B7B] bg-[#FAF5F8] text-[#E12B7B] font-bold shadow-xs'
            : 'border-gray-200 hover:border-gray-300 text-gray-700'
        }`;

    return (
        <div>
            <label className="font-bold text-gray-700 block mb-1.5 uppercase tracking-wider text-[10px]">
                Nature de la modification contractuelle :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onChange('baisse_prix')}
                    className={optionClass(avenantType === 'baisse_prix')}
                >
                    <TrendingDown className="w-5 h-5 shrink-0" />
                    <div>
                        <span className="block text-xs">Baisse de Prix & Rémunération</span>
                        <span className="text-[10px] text-gray-500 font-normal">Ajustement du prix FAI et des honoraires</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onChange('prorogation')}
                    className={optionClass(avenantType === 'prorogation')}
                >
                    <Clock className="w-5 h-5 shrink-0" />
                    <div>
                        <span className="block text-xs">Prorogation de Durée</span>
                        <span className="text-[10px] text-gray-500 font-normal">Prolongation de l{"\u2019"}irrévocabilité du mandat</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
