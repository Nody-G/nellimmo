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
      title="Données synchronisées et sécurisées localement. Cliquez pour synchroniser avec votre mobile."
      className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-100 text-[11px] text-gray-500 hover:text-gray-800 transition cursor-pointer"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="font-medium">Données locales sécurisées</span>
      <ShieldCheck className="w-3 h-3 text-emerald-600 ml-0.5" />
    </button>
  );
}
