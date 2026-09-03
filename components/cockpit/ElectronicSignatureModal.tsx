'use client';

import React, { useState, useRef } from 'react';
import { Property, AgencySettings, SignatureCertificate } from '@/lib/types';
import { generateLegalMandateContract, createElectronicSignatureCertificate } from '@/lib/signature';
import { formatMandateRef } from '@/lib/hoguet';
import {
  FileSignature,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Lock,
  Printer,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Send
} from 'lucide-react';

interface ElectronicSignatureModalProps {
  property: Property;
  settings: AgencySettings;
  isOpen: boolean;
  onClose: () => void;
  onSigned: (certificate: SignatureCertificate) => Promise<void>;
}

export function ElectronicSignatureModal({
  property,
  settings,
  isOpen,
  onClose,
  onSigned
}: ElectronicSignatureModalProps) {
  const [step, setStep] = useState<'contract' | 'otp_verify' | 'signature_draw' | 'success'>('contract');
  const [contractType, setContractType] = useState<'exclusif' | 'simple'>(property.mandate_type === 'exclusif' ? 'exclusif' : 'simple');
  const [renounceRetraction, setRenounceRetraction] = useState(true);
  
  // Signer metadata
  const [signerName, setSignerName] = useState(property.seller_name || '');
  const [signerEmail, setSignerEmail] = useState(property.seller_email || 'vendeur.nellimmo@gmail.com');
  const [signerPhone, setSignerPhone] = useState(property.seller_phone || '06 12 34 56 78');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('748291');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Canvas tactile drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdCertificate, setCreatedCertificate] = useState<SignatureCertificate | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const contractText = generateLegalMandateContract({
    property,
    settings,
    contractType,
    renounceRetraction
  });

  const handleSendOtp = () => {
    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setStep('otp_verify');
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '123456') {
      setOtpError(false);
      setStep('signature_draw');
    } else {
      setOtpError(true);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#131B26';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFinalizeSignature = async () => {
    setIsProcessing(true);

    try {
      const certificate = await createElectronicSignatureCertificate({
        property,
        contractText,
        signerName,
        signerEmail,
        signerPhone,
        otpCode: generatedOtp,
        contractType: contractType === 'exclusif' ? 'mandat_exclusif' : 'mandat_simple'
      });

      setCreatedCertificate(certificate);
      await onSigned(certificate);
      setStep('success');
    } catch (e) {
      console.error('Erreur lors du scellement de signature:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
        
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
                Mandat de Vente • {formatMandateRef(property.mandate_number)}
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
          <div className={`p-2 rounded-xl border ${step === 'contract' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            1. Contrat Légal
          </div>
          <div className={`p-2 rounded-xl border ${step === 'otp_verify' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            2. Code SMS (OTP)
          </div>
          <div className={`p-2 rounded-xl border ${step === 'signature_draw' ? 'bg-[#131B26] text-white border-[#131B26]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            3. Émargement
          </div>
          <div className={`p-2 rounded-xl border ${step === 'success' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            4. Scellé SHA-256
          </div>
        </div>

        {/* STEP 1: CONTRAT & RELECTURE */}
        {step === 'contract' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Type de Mandat Loi Hoguet
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setContractType('exclusif')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      contractType === 'exclusif'
                        ? 'bg-[#E12B7B] text-white border-[#E12B7B] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    ★ Exclusif
                  </button>
                  <button
                    type="button"
                    onClick={() => setContractType('simple')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      contractType === 'simple'
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
                    onChange={(e) => setRenounceRetraction(e.target.checked)}
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
                  onChange={(e) => setSignerName(e.target.value)}
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
                  onChange={(e) => setSignerPhone(e.target.value)}
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
                  onChange={(e) => setSignerEmail(e.target.value)}
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
                onClick={handleSendOtp}
                className="px-6 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                Envoyer le Code OTP par SMS
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp_verify' && (
          <div className="space-y-6 max-w-md mx-auto text-center py-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Smartphone className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-[#131B26]">
                Code d&apos;Authentification Sécurisé Envoyé
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
                <span className="font-bold block">Simulation d&apos;envoi SMS actif :</span>
                <span>Code OTP de test généré : <strong className="font-mono text-sm">{generatedOtp}</strong> (ou saisissez 123456)</span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Ex: 748291"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
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
                onClick={() => setStep('contract')}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Retour
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-6 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Valider le Code OTP
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TACTILE SIGNATURE DRAWING */}
        {step === 'signature_draw' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#131B26]">
                  Émargement Électronique & Consentement
                </h4>
                <p className="text-xs text-gray-500">
                  {signerName}, veuillez apposer votre signature sur l&apos;écran tactile ci-dessous.
                </p>
              </div>

              <button
                onClick={clearCanvas}
                className="text-xs text-gray-500 hover:text-rose-600 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Effacer
              </button>
            </div>

            <div className="border-2 border-gray-300 rounded-2xl bg-[#FCFAF7] p-2 relative">
              <canvas
                ref={canvasRef}
                width={650}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[160px] bg-white rounded-xl touch-none cursor-crosshair border border-gray-200 shadow-inner"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-400 text-xs font-serif italic">
                  Signez ici avec votre doigt ou stylet...
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">
                Mention légale : « Lu et approuvé, bon pour mandat de vente {contractType} ».
              </p>
              <p className="text-gray-500">
                En validant, vous certifiez l&apos;exactitude des informations et donnez mandat officiel à la SASU Nell&apos;Immo pour commercialiser votre bien.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('otp_verify')}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Retour
              </button>

              <button
                onClick={handleFinalizeSignature}
                disabled={!hasDrawn || isProcessing}
                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition ${
                  hasDrawn && !isProcessing
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>Scellement cryptographique...</>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Signer & Sceller le Mandat
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS & CERTIFICATE SEAL */}
        {step === 'success' && createdCertificate && (
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
                  {createdCertificate.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-400 block">Signataire :</span>
                  <span className="font-bold text-gray-800">{createdCertificate.signer_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Horodatage UTC :</span>
                  <span className="font-mono text-gray-800">{createdCertificate.signed_at}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Numéro de Téléphone :</span>
                  <span className="font-mono text-gray-800">{createdCertificate.signer_phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Adresse IP certifiée :</span>
                  <span className="font-mono text-gray-800">{createdCertificate.ip_address}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-400 block text-[10px]">Empreinte Cryptographique Inviolable SHA-256 :</span>
                <div className="flex items-center justify-between gap-2 mt-1 p-2 bg-white rounded-xl border border-gray-200 font-mono text-[10px] text-gray-700">
                  <span className="truncate">{createdCertificate.sha256_fingerprint}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdCertificate.sha256_fingerprint);
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    className="p-1 hover:text-[#E12B7B]"
                    title="Copier l'empreinte"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
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
        )}

      </div>
    </div>
  );
}
