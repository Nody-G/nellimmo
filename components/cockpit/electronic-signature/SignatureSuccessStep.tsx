'use client';

import { CheckCircle2, Check, Copy, Printer } from 'lucide-react';
import { SignatureCertificate } from '@/lib/types';

interface SignatureSuccessStepProps {
    certificate: SignatureCertificate;
    copiedHash: boolean;
    onCopyHash: () => void;
    onPrint: () => void;
    onClose: () => void;
}

export function SignatureSuccessStep({
    certificate,
    copiedHash,
    onCopyHash,
    onPrint,
    onClose
}: SignatureSuccessStepProps) {
    return (
        <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
                <h4 className="text-xl font-serif font-bold text-[#131B26]">
                    Mandat Officiellement Signé & Scellé !
                </h4>
                <p className="text-xs text-gray-500">
                    Le contrat a été horodaté, validé par preuve SMS et inscrit immédiatement au Registre Officiel des Mandats Loi Hoguet.
                </p>
            </div>

            {/* Certificate Details Card */}
            <div className="p-5 bg-[#FCFAF7] rounded-3xl border border-[#F3E8EE] text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">
                        Certificat de Preuve Numérique eIDAS
                    </span>
                    <span className="font-mono text-[10px] text-[#E12B7B] font-bold">
                        {certificate.id}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                        <span className="text-gray-400 block">Signataire :</span>
                        <span className="font-bold text-gray-800">{certificate.signer_name}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Horodatage UTC :</span>
                        <span className="font-mono text-gray-800">{certificate.signed_at}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Numéro de Téléphone :</span>
                        <span className="font-mono text-gray-800">{certificate.signer_phone}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Adresse IP certifiée :</span>
                        <span className="font-mono text-gray-800">{certificate.ip_address}</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-400 block text-[10px]">Empreinte Cryptographique Inviolable SHA-256 :</span>
                    <div className="flex items-center justify-between gap-2 mt-1 p-2 bg-white rounded-xl border border-gray-200 font-mono text-[10px] text-gray-700">
                        <span className="truncate">{certificate.sha256_fingerprint}</span>
                        <button
                            onClick={onCopyHash}
                            className="p-1 hover:text-[#E12B7B]"
                            title="Copier l'empreinte"
                        >
                            {copiedHash ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
                <button
                    onClick={onPrint}
                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition"
                >
                    <Printer className="w-4 h-4 text-[#C59A45]" />
                    Imprimer le Mandat Scellé
                </button>

                <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}
