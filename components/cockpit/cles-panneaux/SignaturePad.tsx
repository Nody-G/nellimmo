'use client';

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FileSignature } from 'lucide-react';

export interface SignaturePadHandle {
  clear: () => void;
  hasSignature: () => boolean;
  toDataURL: () => string | null;
}

interface SignaturePadProps {
  label?: string;
  placeholder?: string;
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  {
    label = 'Émargement tactile du réceptionnaire (Décharge de responsabilité) :',
    placeholder = 'Signez ici au doigt ou stylet pour décharge légale'
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#131B26';
      }
    }
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  useImperativeHandle(ref, () => ({
    clear,
    hasSignature: () => hasSig,
    toDataURL: () => {
      if (!canvasRef.current || !hasSig) return null;
      return canvasRef.current.toDataURL('image/png');
    }
  }));

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
    setHasSig(true);
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
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="space-y-1 pt-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-700 flex items-center gap-1.5">
          <FileSignature className="w-3.5 h-3.5 text-[#E12B7B]" />
          {label}
        </label>
        {hasSig && (
          <button
            type="button"
            onClick={clear}
            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
          >
            Effacer
          </button>
        )}
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-[#FAF5F8]/30 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={480}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-28 touch-none cursor-crosshair"
        />
        {!hasSig && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-xs italic">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
});
