'use client';

import React, { useEffect, useState } from 'react';
import { PenTool, RotateCcw } from 'lucide-react';
import {
    setupCanvasContext,
    beginStroke,
    continueStroke,
    clearCanvasDrawing
} from './visites-types';

interface SignatureCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function SignatureCanvas({ canvasRef }: SignatureCanvasProps) {
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setupCanvasContext(canvas);
    }, [canvasRef]);

    const handleStart = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        beginStroke(canvas, e, () => setIsDrawing(true));
    };

    const handleDraw = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        continueStroke(canvas, e);
    };

    const handleStop = () => {
        setIsDrawing(false);
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        clearCanvasDrawing(canvas);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-[#E12B7B]" />
                    Signature Tactile de l{"\u2019"}Acquéreur sur l{"\u2019"}Écran
                </span>
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-gray-400 hover:text-[#E12B7B] flex items-center gap-1 cursor-pointer"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Effacer
                </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 overflow-hidden touch-none relative">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={180}
                    className="w-full h-44 cursor-crosshair"
                    onMouseDown={handleStart}
                    onMouseMove={handleDraw}
                    onMouseUp={handleStop}
                    onMouseLeave={handleStop}
                    onTouchStart={handleStart}
                    onTouchMove={handleDraw}
                    onTouchEnd={handleStop}
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 pointer-events-none">
                    Signez avec le doigt ou un stylet
                </span>
            </div>
        </div>
    );
}
