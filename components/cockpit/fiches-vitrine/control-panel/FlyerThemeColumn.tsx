'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { THEME_STYLES, type ColorTheme, type QrDestination } from '../flyer-types';

interface FlyerThemeColumnProps {
  colorTheme: ColorTheme;
  setColorTheme: (v: ColorTheme) => void;
  showQrCode: boolean;
  setShowQrCode: (v: boolean) => void;
  qrDestination: QrDestination;
  setQrDestination: (v: QrDestination) => void;
}

const THEME_OPTIONS: { key: ColorTheme; label: string; dot: string; activeClass: string }[] = [
  { key: 'nellimo', label: "Nell'Immo Rose", dot: 'bg-[#E12B7B]', activeClass: 'border-[#E12B7B] bg-[#FDF2F8] text-[#E12B7B]' },
  { key: 'gold', label: 'Or Prestige', dot: 'bg-[#C59A45]', activeClass: 'border-[#C59A45] bg-[#FAF6EE] text-[#C59A45]' },
  { key: 'minimal', label: 'Noir Minimal', dot: 'bg-zinc-900', activeClass: 'border-zinc-900 bg-zinc-100 text-zinc-900' },
  { key: 'provence', label: 'Bleu Azur', dot: 'bg-[#0284C7]', activeClass: 'border-[#0284C7] bg-[#F0F9FF] text-[#0284C7]' },
  { key: 'terracotta', label: 'Terracotta', dot: 'bg-[#C05621]', activeClass: 'border-[#C05621] bg-[#FFFAF0] text-[#C05621]' },
  { key: 'dark_led', label: 'Nuit LED Sombre', dot: 'bg-[#F43F5E]', activeClass: 'border-[#F43F5E] bg-gray-900 text-white' }
];

export function FlyerThemeColumn({
  colorTheme,
  setColorTheme,
  showQrCode,
  setShowQrCode,
  qrDestination,
  setQrDestination
}: FlyerThemeColumnProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
      <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
        <Palette className="w-3.5 h-3.5 text-[#E12B7B]" />
        Ambiance Graphique ({Object.keys(THEME_STYLES).length} Thèmes)
      </label>
      <div className="grid grid-cols-2 gap-2">
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setColorTheme(opt.key)}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
              colorTheme === opt.key ? opt.activeClass : 'border-gray-200 bg-gray-50 text-gray-700'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full ${opt.dot}`} />
            {opt.label}
          </button>
        ))}
      </div>

      <div className="pt-2 space-y-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showQrCode}
              onChange={(e) => setShowQrCode(e.target.checked)}
              className="rounded text-[#E12B7B] accent-[#E12B7B]"
            />
            <span>Activer QR Code</span>
          </label>

          <span className="text-[10px] uppercase font-bold text-gray-400">Destination</span>
        </div>

        {showQrCode && (
          <select
            value={qrDestination}
            onChange={(e) => setQrDestination(e.target.value as QrDestination)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
          >
            <option value="web">🌐 Fiche Web Publique Nell’Immo</option>
            <option value="whatsapp">💬 WhatsApp Direct Nelly (avec message)</option>
            <option value="visite360">🕶️ Visite Virtuelle 360° / Vidéo</option>
            <option value="google_review">⭐ Déposer un Avis Google</option>
            <option value="gps">📍 Itinéraire Google Maps</option>
          </select>
        )}
      </div>
    </div>
  );
}
