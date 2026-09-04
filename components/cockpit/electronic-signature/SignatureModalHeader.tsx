'use client';

import { FileSignature, X } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';
import { SignatureStep } from './electronic-signature-types';

interface SignatureModalHeaderProps {
    mandateNumber: number;
    step: SignatureStep;
    onClose: () => void;
}

const STEP_LABELS: { key: SignatureStep; label: string }[] = [
    { key: 'contract', label: '1. Contrat Légal' },
    { key: 'otp_verify', label: '2. Code SMS (OTP)' },
    { key: 'signature_draw', label: '3. Émargement' },
    { key: 'success', label: '4. Scellé SHA-256' }
];

export function SignatureModalHeader({ mandateNumber, step, onClose }: SignatureModalHeaderProps) {
    return (
        <>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center">
                        <FileSignature className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                                Signature Électronique eIDAS
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                Niveau Avancé OTP
                            </span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-[#131B26]">
                            Mandat de Vente • {formatMandateRef(mandateNumber)}
                        </h3>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Step Progression */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
                {STEP_LABELS.map((s) => {
                    const isActive = step === s.key;
                    const isSuccess = s.key === 'success';
                    const activeClass = isSuccess
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[#131B26] text-white border-[#131B26]';
                    return (
                        <div
                            key={s.key}
                            className={`p-2 rounded-xl border ${isActive ? activeClass : 'bg-gray-50 text-gray-500 border-gray-200'
                                }`}
                        >
                            {s.label}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
