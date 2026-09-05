'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LocalDataHealthPillProps {
  onOpenSync: () => void;
}

export function LocalDataHealthPill({ onOpenSync }: LocalDataHealthPillProps) {
  return (
    <button
      type="button"
      onClick={onOpenSync}
      title="Vos données sont protégées localement sur cet appareil. Cliquez pour synchroniser avec votre mobile."
      className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 text-[11px] text-emerald-800 font-medium transition cursor-pointer"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="font-bold">Données Sécurisées</span>
      <span className="text-gray-400">•</span>
      <span className="text-emerald-700/80 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        Local actif
      </span>
    </button>
  );
}
