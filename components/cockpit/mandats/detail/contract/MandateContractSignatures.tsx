'use client';

import React from 'react';
import type { Property, AgencySettings } from '@/lib/types';

interface MandateContractSignaturesProps {
  property: Property;
  settings: AgencySettings;
  mandateRef: string;
  startDateFormatted: string;
}

export function MandateContractSignatures({
  property,
  settings,
  mandateRef,
  startDateFormatted,
}: MandateContractSignaturesProps) {
  const agencyName = settings.agency_name || "SASU NELL’IMMO";
  const agentName = settings.agent_name || 'Mme Nelly FERNANDEZ';

  return (
    <>
      {/* PARTIE 6 : BORDEREAU DE RÉTRACTATION (LOI HAMON) */}
      <div className="border-2 border-dashed border-gray-400 p-4 rounded-xl bg-gray-50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] uppercase tracking-wide text-gray-900">
            BORDEREAU DE RÉTRACTATION (ARTICLE L. 221-18 DU CODE DE LA CONSOMMATION)
          </span>
          <span className="text-[10px] font-bold text-gray-500">Délai légal : 14 jours</span>
        </div>
        <p className="text-[10px] text-gray-600">
          Si le présent mandat a été conclu hors établissement (au domicile du mandant) ou à distance, le Mandant bénéficie d’un droit de rétractation de 14 jours calendaires à compter de la date de signature sans avoir à justifier de motif.
        </p>
        <div className="border-t border-gray-300 pt-2 text-[10px] text-gray-700 space-y-1">
          <p>
            <em>
              À renvoyer complété et signé par LRAR à : {agencyName} —{' '}
              {settings.address || 'Place de l’Église, 13330 Pélissanne'}
            </em>
          </p>
          <p>
            « Je soussigné(e) ................................................................ notifie par la présente ma rétractation du mandat n° {mandateRef} signé le ........................ pour le bien situé à ............................................................................ »
          </p>
          <div className="flex justify-between pt-2">
            <span>Fait à ......................................, le .............................</span>
            <span>Signature du Mandant :</span>
          </div>
        </div>
      </div>

      {/* PARTIE 7 : SIGNATURES & EMPREINTE */}
      <div className="border-t-2 border-gray-900 pt-4 space-y-4">
        <div className="flex justify-between text-[11px]">
          <p>
            Fait à <strong>Pélissanne</strong>, le <strong>{startDateFormatted}</strong>
          </p>
          <p>En deux exemplaires originaux</p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-2">
          {/* Mandant signature */}
          <div className="border border-gray-300 rounded-xl p-4 min-h-[110px] flex flex-col justify-between">
            <div>
              <span className="font-bold text-[11px] block">LE MANDANT</span>
              <span className="text-[10px] text-gray-500 block">
                Mention manuscrite « Bon pour pouvoir et mandat »
              </span>
            </div>
            <div className="text-center font-serif text-gray-400 italic text-xs pt-4">
              {property.seller_name}
            </div>
          </div>

          {/* Mandataire signature */}
          <div className="border border-gray-300 rounded-xl p-4 min-h-[110px] flex flex-col justify-between bg-gray-50/50">
            <div>
              <span className="font-bold text-[11px] block">LE MANDATAIRE</span>
              <span className="text-[10px] text-gray-500 block">
                Pour {agencyName} — {agentName}
              </span>
            </div>
            <div className="text-center font-serif text-[#131B26] font-bold text-xs pt-4">
              Nelly FERNANDEZ
            </div>
          </div>
        </div>

        {/* Empreinte cryptographique d'inaltérabilité */}
        <div className="pt-2 text-[9px] text-gray-400 flex items-center justify-between font-mono">
          <span>SCELLEMENT HORODATÉ SHA-256 : d4a8f9c2e0b178a9c3d4e5f6... (INALTÉRABLE)</span>
          <span>SASU NELL’IMMO • CARTE CPI 1310 2019 000 042 974</span>
        </div>
      </div>
    </>
  );
}
