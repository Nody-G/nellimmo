'use client';

import React from 'react';
import Link from 'next/link';
import { TransactionDeal, Property } from '@/lib/types';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface RecentTransactionsWidgetProps {
  transactions: TransactionDeal[];
  properties: Property[];
}

const STAGES = [
  { id: 'offre_acceptee', label: 'Offre' },
  { id: 'compromis_signe', label: 'Compromis' },
  { id: 'delai_sru_en_cours', label: 'SRU J+10' },
  { id: 'attente_pret', label: 'Financement' },
  { id: 'acte_planifie', label: 'Acte Signé' }
];

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  transactions,
  properties
}) => {
  const activeDeals = transactions.filter(
    (t) => t.status !== 'acte_signe' && t.status !== 'annule'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-blue-600" />
          <CardTitle className="text-sm">Ventes en Cours & Pipeline Notarial</CardTitle>
        </div>
        <Link
          href="/cockpit/transactions"
          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
        >
          <span>Voir tout le pipeline</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {activeDeals.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-4 text-center">
            Aucun compromis ou dossier notaire actif pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {activeDeals.slice(0, 4).map((deal) => {
              const prop = properties.find((p) => p.id === deal.property_id);
              return (
                <div
                  key={deal.id}
                  className="p-3.5 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-100 transition space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-1">
                        {prop?.title || 'Dossier Transaction'}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Acquéreur : {deal.buyer_name} • Vendeur : {deal.seller_name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-gray-900 block">
                        {deal.offer_price_fai.toLocaleString('fr-FR')} € FAI
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        + {deal.agency_fees_amount.toLocaleString('fr-FR')} € honoraires
                      </span>
                    </div>
                  </div>

                  {/* Stage bar */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
                      Étape : {deal.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Notaire : {deal.seller_notary_name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
