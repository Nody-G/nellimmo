'use client';

import React, { useState } from 'react';
import { MessageSquare, Copy, Check, X, Send, Sparkles, Mail } from 'lucide-react';
import type { Property, Buyer } from '@/lib/types';
import type { VisitorSentiment } from './visites-types';
import { openGmailCompose } from '@/lib/google';

interface VisitDebriefWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  buyer: Buyer | null;
  sentiment: VisitorSentiment;
  strengths: string[];
  weaknesses: string[];
  notes?: string;
}

export function VisitDebriefWhatsAppModal({
  isOpen,
  onClose,
  property,
  buyer,
  sentiment,
  strengths,
  weaknesses,
}: VisitDebriefWhatsAppModalProps) {
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSource, setAiSource] = useState<'deepseek' | 'local' | null>(null);

  const handleGenerateWithAi = async () => {
    if (!property || !buyer || isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vendor_debrief',
          context: {
            property,
            buyer,
            sentiment,
            strengths,
            weaknesses,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setCustomMessage(data.text);
        setAiSource(data.source === 'deepseek' ? 'deepseek' : 'local');
      }
    } catch (e) {
      console.error('Erreur génération débriefing IA:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const sentimentLabel =
    sentiment === 'coup_de_coeur'
      ? 'Coup de cœur confirmé ✨'
      : sentiment === 'interesse'
      ? 'Très intéressé 🟢'
      : sentiment === 'neutre'
      ? 'Intérêt modéré / Réflexion 🟡'
      : 'Visite mitigée / Non retenu 🔴';

  const strengthsText = strengths.length > 0 ? strengths.join(', ') : 'Belle impression générale';
  const weaknessesText = weaknesses.length > 0 ? `Points d'hésitation : ${weaknesses.join(', ')}.` : '';

  const defaultMessage = property && buyer ? `Bonjour ${property.seller_name || 'Monsieur, Madame'},

Je viens de terminer la visite de votre bien (${property.title || property.address}) avec ${buyer.first_name} ${buyer.last_name}.

📊 Débriefing à chaud :
• Ressenti : ${sentimentLabel}
• Points forts remarqués : ${strengthsText}
${weaknessesText ? `• ${weaknessesText}\n` : ''}• Financement : Profil qualifié (${buyer.financing_status === 'accord_bancaire_valide' ? 'Accord de principe bancaire validé' : 'Financement en cours de finalisation'})

Je fais le point avec eux sous 24-48h pour recueillir leur position définitive et je vous tiens informé(e) sans faute.

Bien à vous,
Nelly Fernandez — Nell'Immo Pélissanne
📞 07 55 68 61 09 | ✉️ nellimmo.acte@gmail.com` : '';

  const message = customMessage ?? defaultMessage;

  const cleanPhone = (property?.seller_phone || '').replace(/[^0-9+]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const handleEmailSeller = () => {
    if (!property || !buyer) return;
    openGmailCompose({
      to: property.seller_email || '',
      subject: `[Nell'Immo] Compte-rendu de visite — ${buyer.first_name} ${buyer.last_name} (${property.title || property.address})`,
      body: message,
    });
    onClose();
  };

  if (!isOpen || !property || !buyer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">
                Débriefing Immédiat au Vendeur
              </h3>
              <p className="text-[11px] text-gray-500">
                Destinataire : {property.seller_name} ({property.seller_phone || 'Tél non renseigné'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Le bon de visite est archivé. Rassurez le vendeur en 1 clic dès votre sortie dans la voiture !
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700">
              Message pré-rédigé à votre plume :
            </label>
            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={isGeneratingAi}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-[#E12B7B] border border-pink-200 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#C59A45] ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Rédaction IA en cours...' : '🪄 Rédiger à ma plume (DeepSeek IA)'}</span>
            </button>
          </div>

          {aiSource && (
            <div className="mb-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C59A45]" />
              <span>
                {aiSource === 'deepseek'
                  ? 'Message personnalisé généré par l\'IA DeepSeek (Style Nelly Fernandez).'
                  : 'Message généré via le moteur certifié local.'}
              </span>
            </div>
          )}

          <textarea
            rows={7}
            value={message}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#E12B7B] focus:ring-1 focus:ring-[#E12B7B] text-gray-800 font-sans leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={handleEmailSeller}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
            title="Envoyer ce débriefing par email via Gmail"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
