'use client';

import React from 'react';
import { DpeLetter, GesLetter } from '@/lib/types';
import { isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import { AlertTriangle, Zap, Leaf } from 'lucide-react';

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

const DPE_COLORS: Record<DpeLetter, { bg: string; text: string; label: string; range: string }> = {
  A: { bg: '#009E52', text: '#FFFFFF', label: '≤ 70', range: 'A' },
  B: { bg: '#33B85B', text: '#FFFFFF', label: '71 à 110', range: 'B' },
  C: { bg: '#99D25F', text: '#1C232B', label: '111 à 180', range: 'C' },
  D: { bg: '#FFE833', text: '#1C232B', label: '181 à 250', range: 'D' },
  E: { bg: '#F8B633', text: '#1C232B', label: '251 à 330', range: 'E' },
  F: { bg: '#EC6A33', text: '#FFFFFF', label: '331 à 420', range: 'F' },
  G: { bg: '#DF1A22', text: '#FFFFFF', label: '> 420', range: 'G' },
};

const GES_COLORS: Record<GesLetter, { bg: string; text: string; label: string; range: string }> = {
  A: { bg: '#A6CDE2', text: '#1C232B', label: '≤ 6', range: 'A' },
  B: { bg: '#86B5D8', text: '#FFFFFF', label: '7 à 11', range: 'B' },
  C: { bg: '#6A92C5', text: '#FFFFFF', label: '12 à 30', range: 'C' },
  D: { bg: '#546EA8', text: '#FFFFFF', label: '31 à 50', range: 'D' },
  E: { bg: '#48508F', text: '#FFFFFF', label: '51 à 70', range: 'E' },
  F: { bg: '#3B3673', text: '#FFFFFF', label: '71 à 100', range: 'F' },
  G: { bg: '#292153', text: '#FFFFFF', label: '> 100', range: 'G' },
};

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
  const letters: DpeLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
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
        {/* ÉCHELLE DPE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Consommation Énergétique</span>
            <span className="text-xs text-gray-500 font-mono">kWh/m²/an</span>
          </div>

          <div className="space-y-1">
            {letters.map((letter, idx) => {
              const isCurrent = dpeLetter === letter;
              const widthPercent = 38 + idx * 10;
              const colorInfo = DPE_COLORS[letter];

              return (
                <div key={letter} className="flex items-center gap-2">
                  <div
                    className="h-6 rounded-r-md flex items-center justify-between px-2 text-xs font-bold transition-all relative"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: colorInfo.bg,
                      color: colorInfo.text,
                      boxShadow: isCurrent ? '0 0 0 2px #1C232B, 0 2px 4px rgba(0,0,0,0.2)' : 'none',
                      transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span>{letter}</span>
                    <span className="text-[10px] opacity-90 font-normal">{colorInfo.label}</span>
                  </div>

                  {isCurrent && (
                    <div className="flex items-center gap-1 font-bold text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                      <span>{dpeValue || '-'}</span>
                      <span className="text-[10px] text-gray-500 font-normal">kWh/m²</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ÉCHELLE GES */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Émissions de Gaz à Effet de Serre</span>
            <span className="text-xs text-gray-500 font-mono">kg CO₂/m²/an</span>
          </div>

          <div className="space-y-1">
            {letters.map((letter, idx) => {
              const isCurrent = gesLetter === letter;
              const widthPercent = 38 + idx * 10;
              const colorInfo = GES_COLORS[letter];

              return (
                <div key={letter} className="flex items-center gap-2">
                  <div
                    className="h-6 rounded-r-md flex items-center justify-between px-2 text-xs font-bold transition-all relative"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: colorInfo.bg,
                      color: colorInfo.text,
                      boxShadow: isCurrent ? '0 0 0 2px #1C232B, 0 2px 4px rgba(0,0,0,0.2)' : 'none',
                      transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span>{letter}</span>
                    <span className="text-[10px] opacity-90 font-normal">{colorInfo.label}</span>
                  </div>

                  {isCurrent && (
                    <div className="flex items-center gap-1 font-bold text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                      <span>{gesValue || '-'}</span>
                      <span className="text-[10px] text-gray-500 font-normal">kg CO₂</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
