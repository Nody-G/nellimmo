'use client';

import React from 'react';
import { DpeLetter, GesLetter } from '@/lib/types';
import { getDpeLetterFromValue, getGesLetterFromValue, isAuditEnergetiqueObligatoire } from '@/lib/hoguet';
import { Zap, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DpeBadge } from '@/components/ui/DpeBadge';

interface StepDpeProps {
  dpeValue: number;
  onDpeValueChange: (val: number) => void;
  gesValue: number;
  onGesValueChange: (val: number) => void;
  energyCostMin: number;
  onEnergyCostMinChange: (val: number) => void;
  energyCostMax: number;
  onEnergyCostMaxChange: (val: number) => void;
}

export const StepDpe: React.FC<StepDpeProps> = ({
  dpeValue,
  onDpeValueChange,
  gesValue,
  onGesValueChange,
  energyCostMin,
  onEnergyCostMinChange,
  energyCostMax,
  onEnergyCostMaxChange
}) => {
  const dpeLetter = getDpeLetterFromValue(dpeValue) as DpeLetter;
  const gesLetter = getGesLetterFromValue(gesValue) as GesLetter;
  const requiresAudit = isAuditEnergetiqueObligatoire(dpeLetter);

  return (
    <Card id="step-dpe">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#E12B7B]" />
          <span>5. Performance Énergétique & Climat (DPE 2024)</span>
        </CardTitle>
        <span className="text-[11px] font-bold text-gray-500">
          Loi Climat & Résilience
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Consommation d&apos;énergie primaire (DPE)
                </label>
                <span className="text-xs font-black text-gray-900">
                  {dpeValue} kWh/m²/an
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                value={dpeValue}
                onChange={(e) => onDpeValueChange(Number(e.target.value))}
                className="w-full accent-[#E12B7B] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Émissions de gaz à effet de serre (GES)
                </label>
                <span className="text-xs font-black text-gray-900">
                  {gesValue} kg CO₂/m²/an
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={120}
                value={gesValue}
                onChange={(e) => onGesValueChange(Number(e.target.value))}
                className="w-full accent-[#C59A45] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                  Coût estimé min (€/an)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={energyCostMin}
                  onChange={(e) => onEnergyCostMinChange(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                  Coût estimé max (€/an)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={energyCostMax}
                  onChange={(e) => onEnergyCostMaxChange(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
                />
              </div>
            </div>
          </div>

          {/* DPE visual preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <DpeBadge
              dpeLetter={dpeLetter}
              dpeValue={dpeValue}
              gesLetter={gesLetter}
              gesValue={gesValue}
              compact={false}
            />

            {requiresAudit && (
              <div className="w-full mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Audit énergétique obligatoire</strong> pour la vente (Passoire thermique classes F/G).
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
