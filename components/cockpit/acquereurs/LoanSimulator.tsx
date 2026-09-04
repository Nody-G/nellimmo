'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { computeLoanSimulation } from './acquereurs-types';

interface LoanSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

/** HCSF loan simulator drawer with the 4 financial pillars. */
export function LoanSimulator({ isOpen, onClose }: LoanSimulatorProps) {
    const [purchasePrice, setPurchasePrice] = useState<number>(450000);
    const [downPayment, setDownPayment] = useState<number>(60000);
    const [durationYears, setDurationYears] = useState<number>(25);
    const [interestRate, setInterestRate] = useState<number>(3.5);
    const [insuranceRate, setInsuranceRate] = useState<number>(0.34);

    if (!isOpen) return null;

    const result = computeLoanSimulation({
        purchasePrice,
        downPayment,
        durationYears,
        interestRate,
        insuranceRate,
    });

    return (
        <div className="bg-gradient-to-r from-[#FAF6EE] to-white rounded-3xl p-6 sm:p-8 border border-[#E9DFD3] shadow-md space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E9DFD3] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#131B26] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#C59A45]" />
                    Simulateur de Financement & Règle HCSF (Endettement max 35%)
                </h3>
                <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-800">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
                <div>
                    <label className="block font-bold uppercase text-gray-700 mb-1">Prix Achat Visé (€)</label>
                    <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                    />
                </div>
                <div>
                    <label className="block font-bold uppercase text-gray-700 mb-1">Apport Personnel (€)</label>
                    <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                    />
                </div>
                <div>
                    <label className="block font-bold uppercase text-gray-700 mb-1">Durée (Années)</label>
                    <select
                        value={durationYears}
                        onChange={(e) => setDurationYears(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                    >
                        <option value={15}>15 ans (180 mois)</option>
                        <option value={20}>20 ans (240 mois)</option>
                        <option value={25}>25 ans (300 mois)</option>
                    </select>
                </div>
                <div>
                    <label className="block font-bold uppercase text-gray-700 mb-1">Taux Nominal Annuel (%)</label>
                    <input
                        type="number"
                        step="0.05"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                    />
                </div>
                <div>
                    <label className="block font-bold uppercase text-gray-700 mb-1">Assurance (%)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={insuranceRate}
                        onChange={(e) => setInsuranceRate(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
                    />
                </div>
            </div>

            {/* Results 4 pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Frais Notaire (~7.5%)</span>
                    <span className="text-base font-black text-gray-900">{result.notaryFees.toLocaleString('fr-FR')} €</span>
                    <span className="text-[9px] text-gray-400 block">Total: {result.totalCost.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Montant Prêté</span>
                    <span className="text-base font-black text-gray-900">{result.loanAmount.toLocaleString('fr-FR')} €</span>
                    <span className="text-[9px] text-gray-400 block">Coût crédit: {result.totalLoanCost.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="p-3 bg-[#FDF2F8] rounded-2xl border border-[#F3E8EE] shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-[#E12B7B] block">Mensualité Totale</span>
                    <span className="text-xl font-black text-[#E12B7B]">{result.totalMonthlyPayment.toLocaleString('fr-FR')} €/m</span>
                    <span className="text-[9px] text-gray-500 block">Assurance comprise</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Revenus Nets Exigés</span>
                    <span className="text-xl font-black text-emerald-700">{result.minRequiredHouseholdIncome.toLocaleString('fr-FR')} €/m</span>
                    <span className="text-[9px] text-emerald-800/80 block">Seuil 35% HCSF strict</span>
                </div>
            </div>
        </div>
    );
}
