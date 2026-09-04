'use client';

import { useState, useRef } from 'react';
import type { Property, AgencySettings, SignatureCertificate } from '@/lib/types';
import { generateLegalMandateContract, createElectronicSignatureCertificate } from '@/lib/signature';
import {
  SignatureStep,
  ContractKind,
  generateOtpCode,
  isOtpValid,
  toCertificateContractType,
  beginStroke,
  continueStroke,
  clearCanvasDrawing,
} from './electronic-signature-types';

interface UseElectronicSignatureProps {
  property: Property;
  settings: AgencySettings;
  onSigned: (certificate: SignatureCertificate) => Promise<void>;
}

export function useElectronicSignature({
  property,
  settings,
  onSigned,
}: UseElectronicSignatureProps) {
  const [step, setStep] = useState<SignatureStep>('contract');
  const [contractType, setContractType] = useState<ContractKind>(
    property.mandate_type === 'exclusif' ? 'exclusif' : 'simple'
  );
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

  const contractText = generateLegalMandateContract({
    property,
    settings,
    contractType,
    renounceRetraction,
  });

  const handleSendOtp = () => {
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
        contractType: toCertificateContractType(contractType),
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

  return {
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
  };
}
