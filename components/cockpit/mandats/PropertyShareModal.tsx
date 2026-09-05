'use client';

import React, { useState, useMemo } from 'react';
import { Share2, X, Send, Copy, Check, Users, MessageSquare } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import type { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface PropertyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function PropertyShareModal({ isOpen, onClose, property }: PropertyShareModalProps) {
  const { buyers } = useNellimoStore();
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('');
  const [customPhone, setCustomPhone] = useState('');
  const [customName, setCustomName] = useState('');
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState<string | null>(null);

  const activeBuyers = useMemo(() => buyers.filter((b) => b.status === 'actif'), [buyers]);
  const selectedBuyer = useMemo(() => activeBuyers.find((b) => b.id === selectedBuyerId), [activeBuyers, selectedBuyerId]);

  const recipientName = selectedBuyer ? `${selectedBuyer.first_name} ${selectedBuyer.last_name}` : customName || 'Bonjour';
  const recipientPhone = selectedBuyer?.phone || customPhone;
  const cleanPhone = recipientPhone.replace(/[^0-9+]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;

  const defaultMessage = useMemo(() => {
    const mandateRef = formatMandateRef(property.mandate_number);
    const publicUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/biens/${property.id}`
      : `https://nellimmo.fr/biens/${property.id}`;

    return `Bonjour ${recipientName},\n\nNelly de l'agence Nell'Immo à Pélissanne.\n\nSuite à nos échanges, voici une opportunité pouvant correspondre à vos critères :\n\n🏡 ${property.title} (${mandateRef})\n📍 Secteur : ${property.city}\n💰 Prix : ${property.price_fai.toLocaleString('fr-FR')} € FAI\n📐 Surface : ${property.living_area} m² • ${property.rooms_count} pièces (${property.bedrooms_count} ch.)\n\n👉 Fiche détaillée & photos HD :\n${publicUrl}\n\nÀ votre disposition pour organiser une visite !\n\nBien cordialement,\nNelly Fernandez — Nell'Immo (04 90 55 55 55)`;
  }, [property, recipientName]);

  const message = customMessage ?? defaultMessage;

  if (!isOpen) return null;

  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">Partager la Fiche par WhatsApp</h3>
              <p className="text-[11px] text-gray-500">{property.title} • {property.price_fai.toLocaleString('fr-FR')} € FAI</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destinataire */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            Sélectionner un acquéreur du CRM (ou numéro libre) :
          </label>
          <select
            value={selectedBuyerId}
            onChange={(e) => {
              setSelectedBuyerId(e.target.value);
              setCustomMessage(null);
              if (e.target.value) { setCustomPhone(''); setCustomName(''); }
            }}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
          >
            <option value="">-- Choisir un acquéreur ({activeBuyers.length}) --</option>
            {activeBuyers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.first_name} {b.last_name} ({b.phone}) — Budget {b.budget_max.toLocaleString('fr-FR')} €
              </option>
            ))}
          </select>

          {!selectedBuyerId && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <input
                type="text"
                placeholder="Prénom ou Nom"
                value={customName}
                onChange={(e) => { setCustomName(e.target.value); setCustomMessage(null); }}
                className="text-xs p-2 rounded-lg border border-gray-200"
              />
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                className="text-xs p-2 rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Message preview */}
        <div>
          <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1 mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-[#E12B7B]" />
            Message WhatsApp pré-formaté :
          </label>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#E12B7B] focus:ring-1 focus:ring-[#E12B7B] font-sans leading-relaxed"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {formattedPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Send className="w-4 h-4" /> Envoyer par WhatsApp ({recipientPhone})
            </a>
          ) : (
            <span className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg w-full text-center">
              Indiquez ou sélectionnez un numéro pour ouvrir WhatsApp
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
