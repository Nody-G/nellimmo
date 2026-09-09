'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Users, X, Send, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import type { Property, Buyer } from '@/lib/types';
import { buildWhatsAppLink } from '@/components/cockpit/visites/voice-debrief-helpers';

interface BatchBuyerPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

interface MatchedBuyer {
  buyer: Buyer;
  score: number;
  message: string;
}

export function BatchBuyerPushModal({ isOpen, onClose, property }: BatchBuyerPushModalProps) {
  const { buyers } = useNellimoStore();
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const matchedBuyers: MatchedBuyer[] = useMemo(() => {
    return buyers
      .filter((b) => b.status === 'actif')
      .map((b) => {
        let score = 50;
        if (b.budget_max >= property.price_fai) score += 25;
        if (b.target_cities?.some((c) => c.toLowerCase() === property.city.toLowerCase())) score += 15;
        if (b.target_property_types?.includes(property.property_type)) score += 10;

        const firstName = b.first_name || 'Bonjour';
        const priceFmt = property.price_fai.toLocaleString('fr-FR');
        const message =
          `Bonjour ${firstName},\n\n` +
          `En avant-première avant diffusion portails : je rentre à l’instant une opportunité qui coche tous vos critères à ${property.city} !\n\n` +
          `🏡 ${property.title}\n` +
          `📐 ${property.living_area || 0} m² • ${property.bedrooms_count || 0} ch • ${priceFmt} € FAI\n\n` +
          `Souhaitez-vous organiser une visite privée cette semaine ?\n\n` +
          `Nelly • Nell’Immo Pélissanne\n📞 06 12 34 56 78`;

        return { buyer: b, score, message };
      })
      .filter((m) => m.score >= 60)
      .sort((a, b) => b.score - a.score);
  }, [buyers, property]);

  if (!isOpen) return null;

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Message WhatsApp copié !', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Presse-papier inaccessible', 'error');
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Rapprochement & Push WhatsApp</h3>
                <p className="text-xs text-gray-500">
                  {matchedBuyers.length} acquéreur(s) qualifié(s) pour {property.title}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of matched buyers */}
          <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {matchedBuyers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                Aucun acquéreur actif ne correspond à ce budget ou secteur.
              </div>
            ) : (
              matchedBuyers.map(({ buyer, score, message }) => (
                <div
                  key={buyer.id}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        {buyer.first_name} {buyer.last_name}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          score >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {score}% Match
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <span>Budget : {buyer.budget_max?.toLocaleString('fr-FR')} €</span>
                      <span>•</span>
                      <span>{buyer.phone || 'Sans tél'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyText(buyer.id, message)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      {copiedId === buyer.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      {copiedId === buyer.id ? 'Copié' : 'Copier'}
                    </button>

                    {buyer.phone ? (
                      <a
                        href={buildWhatsAppLink(buyer.phone, message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        WhatsApp ↗
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Pas de mobile</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
              Rapprochement calculé sur le budget, type et communes
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
