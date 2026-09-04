'use client';

import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { ContractKind } from './electronic-signature-types';

interface SignatureDrawStepProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    signerName: string;
    contractType: ContractKind;
    hasDrawn: boolean;
    isProcessing: boolean;
    onStartDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
    onDraw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
    onStopDrawing: () => void;
    onClear: () => void;
    onBack: () => void;
    onFinalize: () => void;
}

export function SignatureDrawStep({
    canvasRef,
    signerName,
    contractType,
    hasDrawn,
    isProcessing,
    onStartDrawing,
    onDraw,
    onStopDrawing,
    onClear,
    onBack,
    onFinalize
}: SignatureDrawStepProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-[#131B26]">
                        Émargement Électronique & Consentement
                    </h4>
                    <p className="text-xs text-gray-500">
                        {signerName}, veuillez apposer votre signature sur l{"\u2019"}écran tactile ci-dessous.
                    </p>
                </div>

                <button
                    onClick={onClear}
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
                    onMouseDown={onStartDrawing}
                    onMouseMove={onDraw}
                    onMouseUp={onStopDrawing}
                    onMouseLeave={onStopDrawing}
                    onTouchStart={onStartDrawing}
                    onTouchMove={onDraw}
                    onTouchEnd={onStopDrawing}
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
                    En validant, vous certifiez l{"\u2019"}exactitude des informations et donnez mandat officiel à la SASU Nell{"\u2019"}Immo pour commercialiser votre bien.
                </p>
            </div>

            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={onBack}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                    Retour
                </button>

                <button
                    onClick={onFinalize}
                    disabled={!hasDrawn || isProcessing}
                    className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition ${hasDrawn && !isProcessing
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
    );
}
