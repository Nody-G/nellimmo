'use client';

import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { TransactionDeal } from '@/lib/types';
import { EntityLink } from '@/components/ui/EntityLink';
import { openGmailCompose } from '@/lib/gmail';

interface DealPartiesCardsProps {
  deal: TransactionDeal;
}

export const DealPartiesCards: React.FC<DealPartiesCardsProps> = ({ deal }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Acquéreur */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
        <span className="text-xs font-bold uppercase text-purple-700 block tracking-wider">
          Acquéreur (Acheteur)
        </span>
        <p className="text-sm font-bold text-gray-900">
          <EntityLink kind="buyer" id={deal.buyer_id} withIcon title="Voir la fiche acquéreur">
            {deal.buyer_name}
          </EntityLink>
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <a href={`tel:${deal.buyer_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
            <Phone className="w-3.5 h-3.5" />
            <span>{deal.buyer_phone}</span>
          </a>
          {deal.buyer_email && (
            <button
              type="button"
              onClick={() => openGmailCompose({
                to: deal.buyer_email,
                subject: `Transaction Nell'Immo — Mandat & Accord`,
              })}
              className="flex items-center gap-1 text-gray-500 hover:underline cursor-pointer"
              title="Envoyer un email via Gmail Pro"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{deal.buyer_email}</span>
            </button>
          )}
        </div>
        {deal.loan_bank_name && (
          <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <span className="font-semibold">Banque :</span> {deal.loan_bank_name}{' '}
            {deal.broker_name && `(Courtier : ${deal.broker_name})`}
          </p>
        )}
      </div>

      {/* Étude Notariale */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
        <span className="text-xs font-bold uppercase text-blue-700 block tracking-wider">
          Notaire Instrumentaire
        </span>
        <p className="text-sm font-bold text-gray-900">
          <EntityLink kind="contact" id={deal.seller_notary_contact_id} withIcon title="Voir la fiche contact du notaire">
            {deal.seller_notary_name}
          </EntityLink>
        </p>
        <p className="text-xs text-gray-600">{deal.seller_notary_office}</p>
        <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
          <a href={`tel:${deal.seller_notary_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
            <Phone className="w-3.5 h-3.5" />
            <span>{deal.seller_notary_phone}</span>
          </a>
          {deal.seller_notary_email && (
            <button
              type="button"
              onClick={() => openGmailCompose({
                to: deal.seller_notary_email,
                subject: `Dossier de vente Nell'Immo — ${deal.seller_name} / ${deal.buyer_name}`,
              })}
              className="flex items-center gap-1 text-gray-500 hover:underline cursor-pointer"
              title="Envoyer un email au notaire via Gmail Pro"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{deal.seller_notary_email}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
