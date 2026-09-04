'use client';

import React from 'react';
import type { Property, AvenantType } from '@/lib/types';
import { formatEuro, formatDateFr } from './avenant-types';

interface AvenantArticlesSectionProps {
  property: Property;
  avenantType: AvenantType;
  newPriceFai: number;
  newFeesAmount: number;
  newNetSeller: number;
  newFeesPercentage: number;
  newEndDate: string;
  reason: string;
}

export function AvenantArticlesSection({
  property,
  avenantType,
  newPriceFai,
  newFeesAmount,
  newNetSeller,
  newFeesPercentage,
  newEndDate,
  reason,
}: AvenantArticlesSectionProps) {
  return (
    <div className="space-y-3 pt-1">
      <div className="p-3 border border-gray-200 rounded-xl space-y-1">
        <span className="font-bold text-gray-900 block">ARTICLE 1 — OBJET DE L{"\u2019"}AVENANT</span>
        <p className="text-[11px] text-gray-700 leading-relaxed">
          Les parties conviennent d{"\u2019"}un commun accord d{"\u2019"}apporter la modification suivante au mandat
          initial :
        </p>
        {avenantType === 'baisse_prix' ? (
          <div className="space-y-1.5 pt-1 text-[11px]">
            <p>
              • <span className="font-bold">Ancien prix de présentation : </span>{' '}
              {formatEuro(property.price_fai)} € FAI.
            </p>
            <p>
              • <span className="font-bold text-[#E12B7B]">Nouveau prix de présentation convenu : </span>{' '}
              <span className="text-sm font-bold text-[#131B26]">{formatEuro(newPriceFai)} € FAI</span> (dont net
              vendeur : {formatEuro(newNetSeller)} €).
            </p>
            <p>
              • <span className="font-bold">Honoraires d{"\u2019"}agence modifiés : </span>{' '}
              {formatEuro(newFeesAmount)} € TTC (soit {newFeesPercentage}% du prix FAI), à la charge du{' '}
              {property.fees_paid_by}.
            </p>
            <p className="italic text-gray-500 text-[10px]">Motif : {reason}</p>
          </div>
        ) : (
          <div className="space-y-1 pt-1 text-[11px]">
            <p>
              • <span className="font-bold text-[#E12B7B]">Prorogation de la durée du mandat : </span> Le terme du
              mandat initial, prévu le {formatDateFr(property.mandate_end_date)}, est expressément reporté
              jusqu{"\u2019"}au{' '}
              <span className="font-bold text-gray-900">{formatDateFr(newEndDate)}</span> inclus.
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border border-gray-200 rounded-xl space-y-1">
        <span className="font-bold text-gray-900 block">ARTICLE 2 — MAINTIEN DES AUTRES CLAUSES</span>
        <p className="text-[10px] text-gray-600 leading-relaxed">
          Toutes les autres clauses, charges, conditions et obligations stipulées dans le mandat initial N°{' '}
          {property.mandate_number} non expressément modifiées par le présent avenant demeurent en vigueur et
          conservent leur plein et entier effet juridique.
        </p>
      </div>
    </div>
  );
}
