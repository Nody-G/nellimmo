'use client';

import React from 'react';
import type { Property, TransactionDeal, AgencySettings } from '@/lib/types';

interface InvoiceFactureSectionProps {
  deal: TransactionDeal;
  prop?: Property;
  settings: AgencySettings;
}

export function InvoiceFactureSection({ deal, prop, settings }: InvoiceFactureSectionProps) {
  const feesTTC = deal.agency_fees_amount || 0;
  const feesHT = Math.round(feesTTC / 1.2);
  const tva20 = feesTTC - feesHT;

  return (
    <>
      {/* Invoice Meta */}
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Type d’acte</span>
          <span className="text-sm font-bold text-gray-900">
            FACTURE D’HONORAIRES N° {deal.invoice_number || 'FACT-2026-004'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Date d’Émission</span>
          <span className="text-xs font-bold text-gray-900">
            {deal.invoice_date || new Date().toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Transaction Target Description */}
      <div className="space-y-1.5 text-xs bg-[#FAF5F8]/40 p-4 rounded-xl border border-[#F3E8EE]">
        <span className="text-[11px] font-bold uppercase text-[#E12B7B] block">Objet de la Transaction</span>
        <p className="font-bold text-gray-900 text-sm">{prop?.title}</p>
        <div className="grid grid-cols-2 gap-2 text-gray-700 mt-2">
          <p>
            <span className="font-semibold">Mandat N° :</span> {prop?.mandate_number} (Loi Hoguet)
          </p>
          <p>
            <span className="font-semibold">Date de compromis :</span> {deal.compromis_date || 'En cours'}
          </p>
          <p>
            <span className="font-semibold">Vendeur(s) :</span> {deal.seller_name}
          </p>
          <p>
            <span className="font-semibold">Acquéreur(s) :</span> {deal.buyer_name}
          </p>
        </div>
      </div>

      {/* Line Items Table with VAT 20% Breakdown */}
      <div className="space-y-3">
        <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3 text-left">Désignation des Prestations</th>
              <th className="p-3 text-right">Base HT</th>
              <th className="p-3 text-right">Taux TVA</th>
              <th className="p-3 text-right">Montant TVA</th>
              <th className="p-3 text-right">Total TTC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3">
                <span className="font-bold text-gray-900 block">
                  Honoraires de négociation et transaction immobilière
                </span>
                <span className="text-[11px] text-gray-500">
                  Conformément au mandat de vente et au barème d’honoraires de l’agence.
                </span>
              </td>
              <td className="p-3 text-right font-mono">{feesHT.toLocaleString('fr-FR')} €</td>
              <td className="p-3 text-right font-mono">20,00 %</td>
              <td className="p-3 text-right font-mono">{tva20.toLocaleString('fr-FR')} €</td>
              <td className="p-3 text-right font-black text-[#E12B7B] text-sm">
                {feesTTC.toLocaleString('fr-FR')} €
              </td>
            </tr>
          </tbody>
        </table>

        {/* Total & Bank Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1.5 flex-1">
            <span className="font-bold text-gray-800 block text-[11px]">
              Coordonnées Bancaires pour Virement Notarié :
            </span>
            <p className="font-mono text-[11px] text-gray-800">
              Titulaire : SASU NELL’IMMO
            </p>
            <p className="font-mono text-[11px] text-gray-800">
              IBAN : {settings.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}
            </p>
            <p className="font-mono text-[11px] text-gray-800">
              BIC : {settings.agency_rib_bic || 'BNPAFRPP'}
            </p>
            <p className="text-[10px] text-gray-500 italic mt-1">
              Conformément à l’article 6 de la Loi Hoguet (loi n° 70-9 du 2 janvier 1970), aucun versement ne peut être exigé avant la réitération effective par acte authentique de vente.
            </p>
          </div>

          <div className="text-right p-4 bg-[#FAF5F8] border border-[#F3E8EE] rounded-xl shrink-0 min-w-[220px] space-y-1">
            <span className="text-[10px] font-bold uppercase text-gray-500 block">
              Total Net à Verser
            </span>
            <span className="text-2xl font-serif font-black text-[#E12B7B] block">
              {feesTTC.toLocaleString('fr-FR')} €
            </span>
            <span className="text-[10px] text-gray-600 block">
              Dont TVA 20% : {tva20.toLocaleString('fr-FR')} €
            </span>
            {deal.fees_received && (
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] uppercase">
                ✓ Honoraires Acquittés
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
