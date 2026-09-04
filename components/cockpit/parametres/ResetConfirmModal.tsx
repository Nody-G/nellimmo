'use client';

import { RotateCcw } from 'lucide-react';

interface ResetConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmation modal for resetting to the Provence demo dataset. */
export function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#131B26]">
                            Réinitialiser la Démo Provence ?
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Action irréversible sur les données locales.
                        </p>
                    </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                    Voulez-vous réinitialiser toutes les données vers le jeu de démonstration complet Provence (Pélissanne, Salon-de-Provence, Lambesc) ? Vos modifications locales seront remplacées.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition cursor-pointer"
                    >
                        Oui, Réinitialiser
                    </button>
                </div>
            </div>
        </div>
    );
}
