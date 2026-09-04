'use client';

import React from 'react';
import Image from 'next/image';

interface ShareQrViewProps {
  qrCodeImageUrl: string;
  onBackToOptions: () => void;
}

export function ShareQrView({ qrCodeImageUrl, onBackToOptions }: ShareQrViewProps) {
  return (
    <div className="text-center space-y-3 py-2 animate-fade-in">
      <div className="bg-white p-3 inline-block rounded-2xl border border-gray-200 shadow-xs">
        <Image
          src={qrCodeImageUrl}
          alt="QR Code du bien"
          width={240}
          height={240}
          className="w-44 h-44 mx-auto rounded-lg"
        />
      </div>
      <p className="text-xs text-gray-500">Scannez ce QR Code avec votre smartphone pour ouvrir la fiche.</p>
      <button
        type="button"
        onClick={onBackToOptions}
        className="text-xs text-[#E12B7B] font-bold underline hover:text-[#C71B62] cursor-pointer"
      >
        Retour aux options de partage
      </button>
    </div>
  );
}
