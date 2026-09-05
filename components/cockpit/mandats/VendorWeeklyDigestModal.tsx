'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Copy, Check, Sparkles, User } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface VendorWeeklyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function VendorWeeklyDigestModal({ isOpen, onClose, property }: VendorWeeklyDigestModalProps) {
  const [copied, setCopied] = useState(false);
  const mandateRef = formatMandateRef(property.mandate_number);

  const defaultMessage = `Bonjour ${property.seller_name || 'Monsieur, Madame'},

C'est Nelly de l'agence Nell'Immo. Je vous transmets le point d'étape hebdomadaire pour votre bien (${property.title} - ${mandateRef}) :

📊 Commercialisation & Visibilité :
• Annonce active et valorisée sur notre vitrine et les grands portails partenaires.
• Votre bien suscite de l'intérêt et je poursuis le rapprochement avec nos acquéreurs qualifiés sur ${property.city}.
• Situation administrative : Dossier Loi ALUR et conformité sous contrôle.

Je continue de suivre activement chaque piste sérieuse et je vous préviens immédiatement dès qu'une visite se concrétise.

Je reste à votre écoute si vous avez la moindre question !

Bien à vous,
Nelly Fernandez — Nell'Immo (Pélissanne)
📞 04 90 55 55 55`;

  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const message = customMessage ?? defaultMessage;

  const cleanPhone = (property.seller_phone || '').replace(/[^0-9+]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">
                Point d&apos;Étape Hebdo au Vendeur (WhatsApp)
              </h3>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {property.seller_name} ({property.seller_phone || 'Tél non renseigné'})
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs text-purple-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            Rassurez votre vendeur en 3 secondes chaque semaine : fidélisation et relation de confiance garantie !
          </span>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-700 block mb-1">
            Message WhatsApp pré-formaté :
          </label>
          <textarea
            rows={7}
            value={message}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-sans leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {formattedPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Send className="w-4 h-4" />
              Envoyer par WhatsApp ({property.seller_phone})
            </a>
          ) : (
            <span className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg w-full text-center">
              Numéro du vendeur non renseigné sur ce mandat
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>
    </div>
  );
}
