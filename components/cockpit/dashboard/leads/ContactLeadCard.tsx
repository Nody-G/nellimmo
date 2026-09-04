'use client';

import React from 'react';
import Link from 'next/link';
import { ContactLead } from '@/lib/types';
import { Mail, MessageCircle, Trash2 } from 'lucide-react';

interface ContactLeadCardProps {
  lead: ContactLead;
  onUpdateStatus: (id: string, status: ContactLead['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ContactLeadCard: React.FC<ContactLeadCardProps> = ({
  lead,
  onUpdateStatus,
  onDelete
}) => {
  const whatsappUrl = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\s+/g, '').replace(/^0/, '33')}?text=${encodeURIComponent(
        `Bonjour ${lead.name.split(' ')[0]}, c'est Nelly Fernandez de l'agence Nell'Immo à Pélissanne. J'ai bien reçu votre demande sur notre site. Quand seriez-vous disponible pour que nous en discutions ?`
      )}`
    : null;

  const mailtoUrl = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent("Votre demande auprès de l'agence Nell'Immo")}&body=${encodeURIComponent(
        `Bonjour ${lead.name},\n\nMerci pour votre message concernant : "${lead.message}".\n\nJe reste à votre entière disposition.\n\nBien cordialement,\nNelly Fernandez — Nell'Immo\n07 55 68 61 09`
      )}`
    : null;

  const agendaUrl = `/cockpit/agenda?newVisit=true&contactName=${encodeURIComponent(lead.name)}&contactPhone=${encodeURIComponent(lead.phone)}&notes=${encodeURIComponent(lead.message)}`;
  const acquereurUrl = `/cockpit/acquereurs?prefillName=${encodeURIComponent(lead.name)}&prefillPhone=${encodeURIComponent(lead.phone)}&prefillEmail=${encodeURIComponent(lead.email)}&prefillNotes=${encodeURIComponent(lead.message)}`;

  return (
    <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{lead.name}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              lead.status === 'nouveau'
                ? 'bg-rose-100 text-rose-800'
                : lead.status === 'traite'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {lead.status}
          </span>
        </div>
        <p className="text-gray-600 line-clamp-1 italic">&ldquo;{lead.message}&rdquo;</p>
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
            title="Répondre sur WhatsApp avec message pré-rempli"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        )}
        {mailtoUrl && (
          <a
            href={mailtoUrl}
            className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition"
            title="Envoyer un email pré-rempli"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        )}
        <Link
          href={agendaUrl}
          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
          title="Planifier un créneau dans l'agenda"
        >
          <span>Planifier Visite</span>
        </Link>
        <Link
          href={acquereurUrl}
          className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
          title="Créer une fiche acquéreur dans le CRM"
        >
          <span>+ Acquéreur</span>
        </Link>
        <button
          type="button"
          onClick={() => onUpdateStatus(lead.id, lead.status === 'traite' ? 'nouveau' : 'traite')}
          className="px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[11px] font-bold text-gray-700 transition"
        >
          {lead.status === 'traite' ? 'Rouvrir' : 'Traité'}
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
