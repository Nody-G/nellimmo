'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ContactLead, EstimationLead } from '@/lib/types';
import {
  Mail,
  MessageCircle,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface LeadsInboxWidgetProps {
  contactLeads: ContactLead[];
  estimationLeads: EstimationLead[];
  onUpdateContactStatus: (id: string, status: ContactLead['status']) => Promise<void>;
  onDeleteContact: (id: string) => Promise<void>;
  onUpdateEstimationStatus: (id: string, status: EstimationLead['status']) => Promise<void>;
  onDeleteEstimation: (id: string) => Promise<void>;
}

export const LeadsInboxWidget: React.FC<LeadsInboxWidgetProps> = ({
  contactLeads,
  estimationLeads,
  onUpdateContactStatus,
  onDeleteContact,
  onUpdateEstimationStatus,
  onDeleteEstimation
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'estimations'>('contacts');

  const newContactsCount = contactLeads.filter((l) => l.status === 'nouveau').length;
  const newEstimationsCount = estimationLeads.filter((l) => l.status === 'nouveau').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#E12B7B]" />
          <CardTitle className="text-sm">Boîte de Réception Demandes Entrantes (Site Web)</CardTitle>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Contacts ({contactLeads.length})</span>
            {newContactsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#E12B7B] animate-ping" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('estimations')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'estimations'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Estimations ({estimationLeads.length})</span>
            {newEstimationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#C59A45] animate-ping" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {activeTab === 'contacts' ? (
          contactLeads.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              Aucune demande de contact reçue.
            </p>
          ) : (
            <div className="space-y-3">
              {contactLeads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{lead.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lead.status === 'nouveau'
                          ? 'bg-rose-100 text-rose-800'
                          : lead.status === 'traite'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
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

                  <div className="flex items-center gap-2 shrink-0">
                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\s+/g, '')}`}
                        target="_blank"
                        className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg transition"
                        title="Répondre sur WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition"
                        title="Envoyer un email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onUpdateContactStatus(lead.id, lead.status === 'traite' ? 'nouveau' : 'traite')}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[11px] font-bold text-gray-700 transition"
                    >
                      {lead.status === 'traite' ? 'Rouvrir' : 'Marquer Traité'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteContact(lead.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          estimationLeads.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              Aucune demande d&apos;estimation en ligne.
            </p>
          ) : (
            <div className="space-y-3">
              {estimationLeads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </span>
                      <span className="font-bold text-[#C59A45]">
                        {lead.city} • {lead.property_type} ({lead.living_area} m²)
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lead.status === 'nouveau'
                          ? 'bg-rose-100 text-rose-800'
                          : lead.status === 'avis_envoye'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
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

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/cockpit/avis-de-valeur?city=${encodeURIComponent(lead.city)}&surface=${lead.living_area}&owner=${encodeURIComponent(`${lead.first_name} ${lead.last_name}`)}&address=${encodeURIComponent(lead.address)}`}
                      className="px-2.5 py-1.5 bg-[#C59A45] hover:bg-[#B38734] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      title="Ouvrir le module Avis de Valeur DVF pré-rempli"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Calculer Avis</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateEstimationStatus(
                          lead.id,
                          lead.status === 'avis_envoye' ? 'en_cours' : 'avis_envoye'
                        )
                      }
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[11px] font-bold text-gray-700 transition"
                    >
                      {lead.status === 'avis_envoye' ? 'En cours' : 'Avis Envoyé'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEstimation(lead.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
