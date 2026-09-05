'use client';

import React from 'react';
import { AlertCircle, Clock, Send, Landmark, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { TransactionDeal, Property } from '@/lib/types';

interface BriefingUrgentTasksProps {
  transactions: TransactionDeal[];
  properties: Property[];
}

export function BriefingUrgentTasks({ transactions, properties }: BriefingUrgentTasksProps) {
  // Détecte les compromis en cours avec alertes de prêt ou SRU
  const urgentDeals = transactions
    .filter((t) => t.status !== 'acte_signe' && t.status !== 'annule')
    .slice(0, 3);

  if (urgentDeals.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Toutes les échéances de prêt et délais SRU sont sous contrôle.
        </span>
        <Link href="/cockpit/transactions" className="text-emerald-700 font-bold hover:underline">
          Voir les ventes →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
          <AlertCircle className="w-3.5 h-3.5 text-[#E12B7B]" />
          Urgences Notariales & Délais en cours ({urgentDeals.length})
        </span>
        <Link href="/cockpit/transactions" className="text-[11px] text-[#E12B7B] font-bold hover:underline flex items-center gap-1">
          Pipeline complet <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {urgentDeals.map((deal) => {
          const prop = properties.find((p) => p.id === deal.property_id);
          const buyerName = deal.buyer_name || 'Acquéreur';
          const deadlineText =
            deal.status === 'attente_pret'
              ? 'Échéance accord bancaire'
              : deal.status === 'delai_sru_en_cours'
              ? 'Délai de rétractation SRU 10j'
              : 'En cours de régularisation';

          const loanAmount = deal.loan_amount_requested
            ? `${deal.loan_amount_requested.toLocaleString('fr-FR')} €`
            : 'Montant non précisé';

          return (
            <div
              key={deal.id}
              className="p-3 bg-white rounded-xl border border-gray-100 hover:border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{buyerName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 font-medium">{prop?.title || 'Mandat'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-amber-700 font-medium">
                  <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{deadlineText} ({loanAmount})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/cockpit/transactions"
                  className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <Landmark className="w-3 h-3 text-blue-600" />
                  Dossier
                </Link>
                {deal.buyer_phone && (
                  <a
                    href={`https://wa.me/${deal.buyer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${buyerName}, où en est votre dossier de prêt pour la vente de ${prop?.city || 'Pélissanne'} ? Le notaire sollicite un point d'avancement. Bien à vous, Nelly.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    Relance WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
