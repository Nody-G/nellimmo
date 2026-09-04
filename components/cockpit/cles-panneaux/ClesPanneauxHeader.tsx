'use client';

import React from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ClesPanneauxHeaderProps {
  onNewKey: () => void;
  onNewSignboard: () => void;
}

export function ClesPanneauxHeader({ onNewKey, onNewSignboard }: ClesPanneauxHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          <KeyRound className="w-4 h-4" />
          <span>Sécurité & Logistique Agence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
          Registre des Clés & Parc de Panneaux
        </h1>
        <p className="text-xs text-gray-500">
          Armoire à clés officielle, émargement tactile des décharges de prêts et suivi de dépose légale Loi Grenelle II.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="primary"
          size="sm"
          onClick={onNewKey}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nouveau Trousseau
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNewSignboard}
          leftIcon={<Plus className="w-4 h-4 text-[#C59A45]" />}
        >
          Nouveau Panneau
        </Button>
      </div>
    </div>
  );
}
