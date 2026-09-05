'use client';

import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import type { ContactItem, ContactInteractionType } from '@/lib/types';
import { INTERACTION_TYPE_CONFIGS } from '../contacts-constants';

interface ContactTimelineTabProps {
  contact: ContactItem;
  onSaveInteraction: (type: ContactInteractionType, title: string, desc?: string) => Promise<void>;
}

export function ContactTimelineTab({ contact, onSaveInteraction }: ContactTimelineTabProps) {
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [interType, setInterType] = useState<ContactInteractionType>('appel');
  const [interTitle, setInterTitle] = useState('');
  const [interDesc, setInterDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interTitle.trim()) return;
    await onSaveInteraction(interType, interTitle.trim(), interDesc.trim() || undefined);
    setInterTitle('');
    setInterDesc('');
    setIsAddingInteraction(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700">Historique des interactions</span>
        <button
          type="button"
          onClick={() => setIsAddingInteraction(!isAddingInteraction)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Consigner un échange</span>
        </button>
      </div>

      {isAddingInteraction && (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-[#FCFAF7] rounded-2xl border border-gray-200 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Type d’échange
              </label>
              <select
                value={interType}
                onChange={(e) => setInterType(e.target.value as ContactInteractionType)}
                className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="appel">Appel téléphonique</option>
                <option value="email_gmail">Email envoyé</option>
                <option value="whatsapp">Message WhatsApp</option>
                <option value="rdv">Rendez-vous physique</option>
                <option value="note">Note interne</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Objet / Titre
              </label>
              <input
                type="text"
                value={interTitle}
                onChange={(e) => setInterTitle(e.target.value)}
                placeholder="Ex: Confirmation de disponibilité devis"
                className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
              Détails
            </label>
            <textarea
              value={interDesc}
              onChange={(e) => setInterDesc(e.target.value)}
              placeholder="Résumé des échanges ou directives..."
              className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-medium resize-none h-16"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingInteraction(false)}
              className="px-3 py-1.5 text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#131B26] hover:bg-black text-white rounded-xl font-bold cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      )}

      {/* Interaction Items */}
      <div className="space-y-2">
        {!contact.interactions || contact.interactions.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            Aucune interaction journalisée pour ce contact.
          </div>
        ) : (
          contact.interactions.map((inter) => {
            const cfg = INTERACTION_TYPE_CONFIGS[inter.type] || INTERACTION_TYPE_CONFIGS.note;
            const InterIcon = cfg.icon;
            return (
              <div
                key={inter.id}
                className="p-3 bg-white rounded-2xl border border-gray-100 flex items-start gap-3"
              >
                <div className={`p-2 rounded-xl shrink-0 ${cfg.colorClass}`}>
                  <InterIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-900">{inter.title}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(inter.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {inter.description && (
                    <p className="text-gray-600 mt-1 whitespace-pre-line text-[11px]">
                      {inter.description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-[9px] text-gray-400 font-medium">
                    <span>{cfg.label}</span>
                    {inter.author && <span>• par {inter.author}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
