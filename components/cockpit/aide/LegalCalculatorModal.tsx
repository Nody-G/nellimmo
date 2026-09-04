'use client';

import { Calculator } from 'lucide-react';
import { computeLegalDates } from './aide-types';

interface LegalCalculatorModalProps {
    isOpen: boolean;
    calcDate: string;
    onDateChange: (value: string) => void;
    onClose: () => void;
}

/** Modal computing legal deadlines (SRU, loan, final deed) from a notification date. */
export function LegalCalculatorModal({
    isOpen,
    calcDate,
    onDateChange,
    onClose,
}: LegalCalculatorModalProps) {
    if (!isOpen) return null;

    const calculatedDates = computeLegalDates(calcDate);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center">
                            <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Calculateur de Délais Légaux
                            </h3>
                            <span className="text-[11px] text-gray-400">
                                SRU 10j, Accord Prêt J+60, Acte J+90
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xs font-bold px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 cursor-pointer"
                    >
                        Fermer
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 block">
                        Date de Notification du Compromis (LRAR / AR24) :
                    </label>
                    <input
                        type="date"
                        value={calcDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20"
                    />
                </div>

                {calculatedDates && (
                    <div className="space-y-2.5 pt-2">
                        <div className="p-3 rounded-xl bg-pink-50 border border-pink-200/80 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 block">
                                    Purge Délai SRU (10 jours)
                                </span>
                                <span className="text-xs font-bold text-gray-900">
                                    {calculatedDates.sru} à 24h00
                                </span>
                            </div>
                            <span className="text-[10px] bg-pink-200 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                                J+10 Ouvré
                            </span>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                                    Dépôt Dossier Prêt Acquéreur
                                </span>
                                <span className="text-xs font-bold text-gray-900">
                                    {calculatedDates.loanApp}
                                </span>
                            </div>
                            <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                                J+30
                            </span>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                                    Accord de Prêt Définitif
                                </span>
                                <span className="text-xs font-bold text-gray-900">
                                    {calculatedDates.loanApproval}
                                </span>
                            </div>
                            <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                J+60
                            </span>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                                    Date Cible Acte Authentique
                                </span>
                                <span className="text-xs font-bold text-gray-900">
                                    {calculatedDates.finalDeed}
                                </span>
                            </div>
                            <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                J+90
                            </span>
                        </div>
                    </div>
                )}

                <p className="text-[11px] text-gray-400 italic">
                    Rappel : Si le 10e jour de la rétractation SRU expire un samedi, dimanche ou
                    jour férié, l{"\u2019"}échéance est automatiquement reportée au premier jour
                    ouvrable suivant à 24h00.
                </p>
            </div>
        </div>
    );
}
