'use client';

import React from 'react';
import { DpeLetter, GesLetter } from '@/lib/types';
import { isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import { AlertTriangle, Zap, Leaf } from 'lucide-react';
import { DPE_COLORS, GES_COLORS, DpeScaleColumn, GesScaleColumn } from './dpe';

interface DpeBadgeProps {
  dpeValue?: number;
  dpeLetter?: DpeLetter;
  gesValue?: number;
  gesLetter?: GesLetter;
  referenceYear?: string;
  energyCostMin?: number;
  energyCostMax?: number;
  compact?: boolean;
}

export function DpeBadge({
  dpeValue,
  dpeLetter,
  gesValue,
  gesLetter,
  referenceYear = '2024',
  energyCostMin,
  energyCostMax,
  compact = false,
}: DpeBadgeProps) {
  const auditRequired = isAuditEnergetiqueObligatoire(dpeLetter);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {dpeLetter ? (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded font-bold text-xs shadow-sm"
            style={{ backgroundColor: DPE_COLORS[dpeLetter].bg, color: DPE_COLORS[dpeLetter].text }}
            title={`Consommation : ${dpeValue || '-'} kWh/m²/an`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>DPE {dpeLetter}</span>
            {dpeValue && <span className="font-normal opacity-90">({dpeValue})</span>}
          </div>
        ) : (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">DPE Vierge</span>
        )}

        {gesLetter && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded font-bold text-xs shadow-sm"
            style={{ backgroundColor: GES_COLORS[gesLetter].bg, color: GES_COLORS[gesLetter].text }}
            title={`Émissions GES : ${gesValue || '-'} kg CO2/m²/an`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>GES {gesLetter}</span>
            {gesValue && <span className="font-normal opacity-90">({gesValue})</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-[#F3E8EE] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#FAF5F8] pb-3">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#E12B7B]" />
          Diagnostics Énergétiques & Climat (Loi 2021-2024)
        </h4>
        <span className="text-xs text-gray-500">Année réf. : {referenceYear}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DpeScaleColumn currentLetter={dpeLetter} currentValue={dpeValue} />
        <GesScaleColumn currentLetter={gesLetter} currentValue={gesValue} />
      </div>

      {/* ESTIMATION DES DÉPENSES ANNUELLES */}
      {(energyCostMin || energyCostMax) && (
        <div className="bg-[#FCFAF7] p-3.5 rounded-lg border border-[#F3E8EE] text-xs text-gray-700 flex items-center justify-between">
          <span>Montant estimé des dépenses annuelles d&apos;énergie :</span>
          <span className="font-bold text-gray-900">
            {energyCostMin ? `${energyCostMin.toLocaleString('fr-FR')} €` : ''} à{' '}
            {energyCostMax ? `${energyCostMax.toLocaleString('fr-FR')} €` : ''} / an
          </span>
        </div>
      )}

      {/* ALERTE AUDIT ÉNERGÉTIQUE POUR F OU G */}
      {auditRequired && (
        <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold mb-0.5">Audit énergétique réglementaire obligatoire (Loi Climat & Résilience)</p>
            <p className="text-amber-800">
              Ce logement est classé {dpeLetter} (passoire thermique). La réalisation d&apos;un audit énergétique complet est requise pour toute promesse de vente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
