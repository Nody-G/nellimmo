'use client';

import React from 'react';
import { Property, AgencySettings, SignatureCertificate } from '@/lib/types';
import { SignatureModalHeader } from './electronic-signature/SignatureModalHeader';
import { SignatureContractStep } from './electronic-signature/SignatureContractStep';
import { SignatureOtpStep } from './electronic-signature/SignatureOtpStep';
import { SignatureDrawStep } from './electronic-signature/SignatureDrawStep';
import { SignatureSuccessStep } from './electronic-signature/SignatureSuccessStep';
import { useElectronicSignature } from './electronic-signature/useElectronicSignature';

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
  onSigned,
}: ElectronicSignatureModalProps) {
  const {
    step,
    setStep,
    contractType,
    setContractType,
    renounceRetraction,
    setRenounceRetraction,
    signerName,
    setSignerName,
    signerEmail,
    setSignerEmail,
    signerPhone,
    setSignerPhone,
    generatedOtp,
    enteredOtp,
    setEnteredOtp,
    otpError,
    canvasRef,
    hasDrawn,
    isProcessing,
    createdCertificate,
    copiedHash,
    contractText,
    handleSendOtp,
    handleVerifyOtp,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    handleFinalizeSignature,
    handleCopyHash,
  } = useElectronicSignature({
    property,
    settings,
    onSigned,
  });

  if (!isOpen) return null;

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
