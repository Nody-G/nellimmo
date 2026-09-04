'use client';

import { Lock, Smartphone } from 'lucide-react';
import { ContractKind } from './electronic-signature-types';

interface SignatureContractStepProps {
    contractText: string;
    contractType: ContractKind;
    onContractTypeChange: (type: ContractKind) => void;
    renounceRetraction: boolean;
    onRenounceRetractionChange: (value: boolean) => void;
    signerName: string;
    onSignerNameChange: (value: string) => void;
    signerPhone: string;
    onSignerPhoneChange: (value: string) => void;
    signerEmail: string;
    onSignerEmailChange: (value: string) => void;
    onSendOtp: () => void;
}

export function SignatureContractStep({
    contractText,
    contractType,
    onContractTypeChange,
    renounceRetraction,
    onRenounceRetractionChange,
    signerName,
    onSignerNameChange,
    signerPhone,
    onSignerPhoneChange,
    signerEmail,
    onSignerEmailChange,
    onSendOtp
}: SignatureContractStepProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                        Type de Mandat Loi Hoguet
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onContractTypeChange('exclusif')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${contractType === 'exclusif'
                                    ? 'bg-[#E12B7B] text-white border-[#E12B7B] shadow-xs'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            ★ Exclusif
                        </button>
                        <button
                            type="button"
                            onClick={() => onContractTypeChange('simple')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${contractType === 'simple'
                                    ? 'bg-[#131B26] text-white border-[#131B26] shadow-xs'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            Simple
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                        Droit de Rétractation (14 jours)
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={renounceRetraction}
                            onChange={(e) => onRenounceRetractionChange(e.target.checked)}
                            className="rounded text-[#E12B7B] focus:ring-[#E12B7B]"
                        />
                        <span>Renonciation expresse pour commercialisation immédiate</span>
                    </label>
                </div>
            </div>

            {/* Signer Coordinates */}
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                        Signataire (Mandant)
                    </label>
                    <input
                        type="text"
                        value={signerName}
                        onChange={(e) => onSignerNameChange(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                        Téléphone Mobile (SMS OTP)
                    </label>
                    <input
                        type="text"
                        value={signerPhone}
                        onChange={(e) => onSignerPhoneChange(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                        E-mail de Réception
                    </label>
                    <input
                        type="email"
                        value={signerEmail}
                        onChange={(e) => onSignerEmailChange(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold"
                    />
                </div>
            </div>

            {/* Legal Text Scrollable Preview */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-100 p-2.5 border-b border-gray-200 text-xs font-bold text-gray-600 flex items-center justify-between">
                    <span>Texte Officiel du Contrat (Loi Hoguet / ALUR / Consommation)</span>
                    <span className="text-[10px] text-gray-400 font-mono">Décret n° 72-678</span>
                </div>
                <pre className="p-4 bg-gray-50 text-[11px] font-mono text-gray-800 h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                    {contractText}
                </pre>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    Certificat cryptographique conforme règlement eIDAS N° 910/2014
                </span>

                <button
                    onClick={onSendOtp}
                    className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                    <Smartphone className="w-4 h-4" />
                    Envoyer le Code OTP par SMS
                </button>
            </div>
        </div>
    );
}
