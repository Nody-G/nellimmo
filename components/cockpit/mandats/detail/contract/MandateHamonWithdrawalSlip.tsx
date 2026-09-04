'use client';

import React from 'react';
import type { Property, AgencySettings } from '@/lib/types';
import { Scissors } from 'lucide-react';

interface MandateHamonWithdrawalSlipProps {
  property: Property;
  settings: AgencySettings;
  mandateRef: string;
  startDateFormatted: string;
}

/**
 * Bordereau officiel détachable de rétractation (Loi Hamon / Art. L221-18 C. Conso)
 * Obligation d'ordre public pour tout mandat conclu hors établissement ou à distance.
 */
export function MandateHamonWithdrawalSlip({
  property,
  settings,
  mandateRef,
  startDateFormatted,
}: MandateHamonWithdrawalSlipProps) {
  const agencyName = settings.agency_name || "SASU NELL’IMMO";
  const agencyAddress = settings.address || '26 avenue des Enjouvènes, 13330 Pélissanne';
  const agencyEmail = settings.email || 'nellimmo.acte@gmail.com';

  return (
    <div className="pt-6 border-t-2 border-dashed border-gray-400 space-y-4 print:break-before-page">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
        <Scissors className="w-4 h-4 text-[#E12B7B]" />
        <span>Bordereau de Rétractation Détachable — Loi Hamon & ALUR</span>
      </div>

      <div className="border border-gray-300 rounded-2xl p-5 bg-[#FCFAF7] space-y-4 text-xs text-gray-800">
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          <strong>Conditions d’exercice du droit de rétractation (Articles L. 221-18 à L. 221-28 du Code de la consommation) :</strong>
          <p className="mt-1">
            Si le présent mandat a été conclu hors établissement (à votre domicile) ou à distance, vous avez le droit de vous rétracter sans donner de motif dans un délai de <strong>quatorze (14) jours calendaires</strong> à compter du jour de sa signature. Pour exercer ce droit, veuillez compléter et envoyer ce formulaire par lettre recommandée avec accusé de réception à l’adresse ci-dessous avant l’expiration du délai.
          </p>
        </div>

        <div className="space-y-1 text-[11px]">
          <p>
            <strong>Destinataire :</strong> {agencyName} — Service Mandats & Actes
          </p>
          <p>
            <strong>Adresse :</strong> {agencyAddress} • <strong>Email :</strong> {agencyEmail}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
          <p className="font-bold text-gray-900 uppercase text-[11px]">
            Notification de Rétractation :
          </p>
          <p className="text-[11px] leading-relaxed">
            Je vous notifie par la présente ma rétractation du contrat de mandat de vente portant la référence :{' '}
            <strong className="underline">{mandateRef}</strong>, signé le <strong>{startDateFormatted}</strong>,
            concernant le bien situé à : <strong>{property.address}, {property.postal_code} {property.city}</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-[11px]">
            <div>
              <p><strong>Nom et Prénom du Mandant :</strong> {property.seller_name}</p>
              <p className="mt-1"><strong>Adresse du Mandant :</strong> {property.seller_address || property.address}</p>
            </div>
            <div className="space-y-4 sm:text-right">
              <p>Fait à : ...................................., le : ....................</p>
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 block mb-6">Signature du Mandant :</span>
                <div className="border-b border-gray-300 w-44 inline-block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
