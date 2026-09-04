'use client';

import React from 'react';
import Link from 'next/link';
import { EstimationLead } from '@/lib/types';
import { MessageCircle, Sparkles, Trash2 } from 'lucide-react';

interface EstimationLeadCardProps {
  lead: EstimationLead;
  onUpdateStatus: (id: string, status: EstimationLead['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EstimationLeadCard: React.FC<EstimationLeadCardProps> = ({
  lead,
  onUpdateStatus,
  onDelete
}) => {
  const whatsappUrl = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\s+/g, '').replace(/^0/, '33')}?text=${encodeURIComponent(
        `Bonjour ${lead.first_name}, c'est Nelly Fernandez de l'agence Nell'Immo. J'ai bien reçu votre demande d'avis de valeur pour votre bien à ${lead.city}. Les ventes notariées DVF récentes de votre quartier sont prêtes. Souhaitez-vous que nous fassions un point ensemble ?`
      )}`
    : null;

  const avisDvfUrl = `/cockpit/avis-de-valeur?city=${encodeURIComponent(lead.city)}&surface=${lead.living_area}&owner=${encodeURIComponent(`${lead.first_name} ${lead.last_name}`)}&address=${encodeURIComponent(lead.address)}`;
  const mandatUrl = `/cockpit/mandats/nouveau?sellerName=${encodeURIComponent(`${lead.first_name} ${lead.last_name}`)}&sellerPhone=${encodeURIComponent(lead.phone)}&sellerEmail=${encodeURIComponent(lead.email)}&city=${encodeURIComponent(lead.city)}&address=${encodeURIComponent(lead.address)}&livingArea=${lead.living_area}&propertyType=${lead.property_type}`;

  return (
    <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            {lead.first_name} {lead.last_name}
          </span>
          <span className="font-bold text-[#C59A45]">
            {lead.city} • {lead.property_type} ({lead.living_area} m²)
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              lead.status === 'nouveau'
                ? 'bg-rose-100 text-rose-800'
                : lead.status === 'avis_envoye'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {lead.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-gray-600 text-[11px]">
          Adresse : {lead.address} {lead.has_pool ? '• Avec piscine' : ''}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-0.5">
          <span>{new Date(lead.created_at).toLocaleString('fr-FR')}</span>
          <span>•</span>
          <a href={`tel:${lead.phone}`} className="text-[#E12B7B] hover:underline font-bold">
            {lead.phone}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg transition"
            title="Envoyer message WhatsApp de prise de contact"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        )}
        <Link
          href={avisDvfUrl}
          className="px-2.5 py-1 bg-[#C59A45] hover:bg-[#B38734] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
          title="Ouvrir le module Avis de Valeur DVF pré-rempli"
        >
          <Sparkles className="w-3 h-3" />
          <span>Avis DVF</span>
        </Link>
        <Link
          href={mandatUrl}
          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-[#E12B7B] border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
          title="Convertir immédiatement ce lead en nouveau mandat"
        >
          <span>+ Mandat</span>
        </Link>
        <button
          type="button"
          onClick={() =>
            onUpdateStatus(
              lead.id,
              lead.status === 'avis_envoye' ? 'en_cours' : 'avis_envoye'
            )
          }
          className="px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[11px] font-bold text-gray-700 transition"
        >
          {lead.status === 'avis_envoye' ? 'En cours' : 'Avis Envoyé'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(lead.id)}
          className="p-1 text-gray-400 hover:text-rose-600 transition"
          title="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
