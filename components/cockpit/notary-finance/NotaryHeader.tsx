'use client';

import { Calculator } from 'lucide-react';
import type { NotaryTab } from './notary-finance-types';

interface NotaryHeaderProps {
    activeTab: NotaryTab;
    onTabChange: (tab: NotaryTab) => void;
}

export function NotaryHeader({ activeTab, onTabChange }: NotaryHeaderProps) {
    const tabClass = (active: boolean) =>
        `px-3 py-1.5 rounded-lg text-xs font-bold transition ${active ? 'bg-[#131B26] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
        }`;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
                <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#E12B7B]" />
                    <span>Simulateur Notarial Avancé & Plus-Value Immobilière</span>
                </h3>
                <p className="text-xs text-gray-500">
                    Calculs officiels certifiés : Décret n° 2020-179 & Barème fiscal des plus-values immobilières des
                    particuliers.
                </p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button type="button" onClick={() => onTabChange('notary')} className={tabClass(activeTab === 'notary')}>
                    Frais de Notaire Réels
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange('capital_gains')}
                    className={tabClass(activeTab === 'capital_gains')}
                >
                    Plus-Value Vendeur
                </button>
            </div>
        </div>
    );
}
