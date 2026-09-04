'use client';

import React, { useState, useRef } from 'react';
import { Property, AgencySettings, SignatureCertificate } from '@/lib/types';
import { generateLegalMandateContract, createElectronicSignatureCertificate } from '@/lib/signature';
import { SignatureModalHeader } from './electronic-signature/SignatureModalHeader';
import { SignatureContractStep } from './electronic-signature/SignatureContractStep';
import { SignatureOtpStep } from './electronic-signature/SignatureOtpStep';
import { SignatureDrawStep } from './electronic-signature/SignatureDrawStep';
import { SignatureSuccessStep } from './electronic-signature/SignatureSuccessStep';
import {
  SignatureStep,
  ContractKind,
  generateOtpCode,
  isOtpValid,
  toCertificateContractType,
  beginStroke,
  continueStroke,
  clearCanvasDrawing
} from './electronic-signature/electronic-signature-types';

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
  const [step, setStep] = useState<SignatureStep>('contract');
  const [contractType, setContractType] = useState<ContractKind>(property.mandate_type === 'exclusif' ? 'exclusif' : 'simple');
  const [renounceRetraction, setRenounceRetraction] = useState(true);

  // Signer metadata
  const [signerName, setSignerName] = useState(property.seller_name || '');
  const [signerEmail, setSignerEmail] = useState(property.seller_email || 'vendeur.nellimmo@gmail.com');
  const [signerPhone, setSignerPhone] = useState(property.seller_phone || '06 12 34 56 78');

  // OTP state
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
    const code = generateOtpCode();
    setGeneratedOtp(code);
    setStep('otp_verify');
  };

  const handleVerifyOtp = () => {
    if (isOtpValid(enteredOtp, generatedOtp)) {
      setOtpError(false);
      setStep('signature_draw');
    } else {
      setOtpError(true);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (beginStroke(canvasRef.current, e)) {
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (continueStroke(canvasRef.current, e)) {
      setHasDrawn(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    clearCanvasDrawing(canvasRef.current);
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
        contractType: toCertificateContractType(contractType)
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

  const handleCopyHash = () => {
    if (!createdCertificate) return;
    navigator.clipboard.writeText(createdCertificate.sha256_fingerprint);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6">
        <SignatureModalHeader
          mandateNumber={property.mandate_number}
          step={step}
          onClose={onClose}
        />

        {/* STEP 1: CONTRAT & RELECTURE */}
        {step === 'contract' && (
          <SignatureContractStep
            contractText={contractText}
            contractType={contractType}
            onContractTypeChange={setContractType}
            renounceRetraction={renounceRetraction}
            onRenounceRetractionChange={setRenounceRetraction}
            signerName={signerName}
            onSignerNameChange={setSignerName}
            signerPhone={signerPhone}
            onSignerPhoneChange={setSignerPhone}
            signerEmail={signerEmail}
            onSignerEmailChange={setSignerEmail}
            onSendOtp={handleSendOtp}
          />
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp_verify' && (
          <SignatureOtpStep
            signerPhone={signerPhone}
            generatedOtp={generatedOtp}
            enteredOtp={enteredOtp}
            onEnteredOtpChange={setEnteredOtp}
            otpError={otpError}
            onBack={() => setStep('contract')}
            onVerify={handleVerifyOtp}
          />
        )}

        {/* STEP 3: TACTILE SIGNATURE DRAWING */}
        {step === 'signature_draw' && (
          <SignatureDrawStep
            canvasRef={canvasRef}
            signerName={signerName}
            contractType={contractType}
            hasDrawn={hasDrawn}
            isProcessing={isProcessing}
            onStartDrawing={startDrawing}
            onDraw={draw}
            onStopDrawing={stopDrawing}
            onClear={clearCanvas}
            onBack={() => setStep('otp_verify')}
            onFinalize={handleFinalizeSignature}
          />
        )}

        {/* STEP 4: SUCCESS & CERTIFICATE SEAL */}
        {step === 'success' && createdCertificate && (
          <SignatureSuccessStep
            certificate={createdCertificate}
            copiedHash={copiedHash}
            onCopyHash={handleCopyHash}
            onPrint={() => window.print()}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
