'use client';

import React from 'react';
import type { Property, TransactionDeal } from '@/lib/types';

interface InvoiceSequestreSectionProps {
  deal: TransactionDeal;
  prop?: Property;
}

export function InvoiceSequestreSection({ deal, prop }: InvoiceSequestreSectionProps) {
  return (
    <>
      <div className="flex justify-between items-center bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-700 block">
            Fiche de Liaison Notariale
          </span>
          <span className="text-sm font-bold text-gray-900">
            APPEL DE FONDS SÉQUESTRE & DÉPÔT DE GARANTIE
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-blue-700 block">
            Date de la Demande
          </span>
          <span className="text-xs font-bold text-gray-900">
            {new Date().toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs leading-relaxed">
        <p>
          Maître, faisant suite à la signature de l’avant-contrat de vente sous seing privé portant sur le bien situé à <strong>{prop?.city}</strong>, nous vous prions de bien vouloir appeler auprès de l’acquéreur le versement du dépôt de garantie (séquestre) ci-après désigné :
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-gray-600">Acquéreur Débiteur :</span>
            <span className="font-bold text-gray-900">
              {deal.buyer_name} ({deal.buyer_phone})
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-gray-600">Vendeur Bénéficiaire :</span>
            <span className="font-bold text-gray-900">{deal.seller_name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-gray-600">Prix de Vente Convenu :</span>
            <span className="font-bold text-gray-900">
              {deal.offer_price_net?.toLocaleString('fr-FR')} € Net Vendeur
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-800 font-bold">
              Montant du Dépôt de Garantie à Consigner :
            </span>
            <span className="text-base font-black text-blue-900 font-mono">
              {deal.deposit_amount?.toLocaleString('fr-FR') || '15 000'} € ({deal.deposit_percentage || 5}%)
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
          <strong className="block font-bold">
            Mention Déontologique & Loi Hoguet (Art. 55) :
          </strong>
          <p>
            La SASU Nell’Immo ne détenant pas de compte séquestre pour maniement direct de fonds, le dépôt de garantie ci-dessus doit être versé exclusivement par virement bancaire sur le compte de l’étude notariale instrumentaire ou de la Caisse des Dépôts et Consignations (CDC).
          </p>
        </div>
      </div>
    </>
  );
}
