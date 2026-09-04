'use client';

import { Smartphone, Sparkles } from 'lucide-react';

interface SignatureOtpStepProps {
    signerPhone: string;
    generatedOtp: string;
    enteredOtp: string;
    onEnteredOtpChange: (value: string) => void;
    otpError: boolean;
    onBack: () => void;
    onVerify: () => void;
}

export function SignatureOtpStep({
    signerPhone,
    generatedOtp,
    enteredOtp,
    onEnteredOtpChange,
    otpError,
    onBack,
    onVerify
}: SignatureOtpStepProps) {
    return (
        <div className="space-y-6 max-w-md mx-auto text-center py-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Smartphone className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#131B26]">
                    Code d{"\u2019"}Authentification Sécurisé Envoyé
                </h4>
                <p className="text-xs text-gray-500">
                    Un code à 6 chiffres a été envoyé par SMS au numéro{' '}
                    <strong className="text-gray-800">{signerPhone}</strong>.
                </p>
            </div>

            {/* Demo Simulation Alert */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold block">Simulation d{"\u2019"}envoi SMS actif :</span>
                    <span>
                        Code OTP de test généré :{' '}
                        <strong className="font-mono text-sm">{generatedOtp}</strong> (ou saisissez 123456)
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    maxLength={6}
                    placeholder="Ex: 748291"
                    value={enteredOtp}
                    onChange={(e) => onEnteredOtpChange(e.target.value)}
                    className="text-center tracking-widest text-2xl font-mono font-bold p-3 bg-gray-50 border border-gray-300 rounded-2xl w-52 mx-auto focus:border-[#E12B7B] focus:outline-hidden"
                />
                {otpError && (
                    <p className="text-xs text-rose-600 font-semibold">
                        Code incorrect. Veuillez saisir le code affiché ci-dessus.
                    </p>
                )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
                <button
                    onClick={onBack}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                    Retour
                </button>
                <button
                    onClick={onVerify}
                    className="px-6 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                    Valider le Code OTP
                </button>
            </div>
        </div>
    );
}
