'use client';

import React, { useState } from 'react';
import { MailCheck, X, Sparkles, Send, ArrowRight } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

interface QuickLeadParserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Heuristique d'extraction de coordonnées et contenu depuis un email de portail ou SMS */
function parseRawLeadText(raw: string) {
  const phoneMatch = raw.match(/(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}/);
  const emailMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const refMatch = raw.match(/(?:réf(?:érence)?|mandat|annonce)\s*[:#]?\s*([A-Za-z0-9-_]+)/i);

  let source = 'Portail Inconnu';
  const lower = raw.toLowerCase();
  if (lower.includes('seloger')) source = 'SeLoger';
  else if (lower.includes('leboncoin')) source = 'LeBonCoin';
  else if (lower.includes('bienici') || lower.includes("bien'ici")) source = "Bien'Ici";
  else if (lower.includes('logic-immo')) source = 'Logic-Immo';
  else if (lower.includes('sms')) source = 'SMS Mobile';

  // Détection du nom
  let name = '';
  const nameLineMatch = raw.match(/(?:nom|contact|de)\s*[:]\s*([A-Za-zÀ-ÿ\s-]+)/i);
  if (nameLineMatch && nameLineMatch[1]) {
    name = nameLineMatch[1].trim();
  } else {
    // Essayer de trouver un nom civilisé "M. / Mme Dupont"
    const civMatch = raw.match(/(?:M\.|Mme|Monsieur|Madame)\s+([A-Za-zÀ-ÿ-]+(?:\s+[A-Za-zÀ-ÿ-]+)?)/i);
    if (civMatch && civMatch[1]) name = civMatch[0].trim();
  }

  return {
    name: name || 'Prospect Portail',
    phone: phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : '',
    email: emailMatch ? emailMatch[0] : '',
    reference: refMatch ? refMatch[1] : '',
    source,
    message: raw.trim(),
  };
}

export function QuickLeadParserModal({ isOpen, onClose }: QuickLeadParserModalProps) {
  const { addContactLead } = useNellimoStore();
  const { showToast } = useToast();

  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseRawLeadText> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!rawText.trim()) return;
    const result = parseRawLeadText(rawText);
    setParsed(result);
  };

  const handleSave = async () => {
    if (!parsed) return;
    setIsSubmitting(true);
    try {
      await addContactLead({
        name: parsed.name,
        phone: parsed.phone || 'Non renseigné',
        email: parsed.email || 'lead@portail.fr',
        message: `[Source: ${parsed.source}${parsed.reference ? ` | Réf: ${parsed.reference}` : ''}]\n${parsed.message}`,
        subject: `Lead entrant ${parsed.source}${parsed.reference ? ` (${parsed.reference})` : ''}`,
      });
      showToast(`Lead de ${parsed.name} importé dans la boîte de réception !`, 'success');
      onClose();
      setRawText('');
      setParsed(null);
    } catch {
      showToast("Erreur lors de l'enregistrement du lead", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">
                Coller un Lead Portail (SeLoger / LeBonCoin / SMS)
              </h3>
              <p className="text-[11px] text-gray-500">
                Collez le texte brut du mail ou du SMS reçu : l&apos;IA extrait automatiquement les coordonnées
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Collez le contenu brut du message ici :
          </label>
          <textarea
            rows={4}
            placeholder="Exemple : Vous avez reçu un message de M. Thomas Martin (06 12 34 56 78 - tmartin@email.com) concernant l'annonce Réf NEL-102 sur SeLoger : Bonjour, nous aimerions visiter cette maison à Pélissanne ce samedi..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-sans"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!rawText.trim()}
            className="mt-2 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Extraire & Analyser Automatiquement
          </button>
        </div>

        {parsed && (
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-3">
            <span className="text-xs font-bold uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
              <MailCheck className="w-4 h-4 text-purple-600" />
              Données Détectées ({parsed.source})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500 text-[10px] block">Nom :</span>
                <input
                  type="text"
                  value={parsed.name}
                  onChange={(e) => setParsed({ ...parsed, name: e.target.value })}
                  className="w-full font-bold p-1.5 bg-white border border-purple-200 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Téléphone :</span>
                <input
                  type="text"
                  value={parsed.phone}
                  onChange={(e) => setParsed({ ...parsed, phone: e.target.value })}
                  className="w-full font-bold p-1.5 bg-white border border-purple-200 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Email :</span>
                <input
                  type="email"
                  value={parsed.email}
                  onChange={(e) => setParsed({ ...parsed, email: e.target.value })}
                  className="w-full p-1.5 bg-white border border-purple-200 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Référence Bien :</span>
                <input
                  type="text"
                  value={parsed.reference}
                  onChange={(e) => setParsed({ ...parsed, reference: e.target.value })}
                  className="w-full p-1.5 bg-white border border-purple-200 rounded-lg text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#131B26] hover:bg-gray-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <ArrowRight className="w-4 h-4 text-[#C59A45]" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer dans la boîte de réception'}
              </button>
              {parsed.phone && (
                <a
                  href={`https://wa.me/${parsed.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Bonjour ${parsed.name}, Nelly Fernandez de l'agence Nell'Immo à Pélissanne. J'ai bien reçu votre demande concernant notre bien ${parsed.reference ? `(Réf: ${parsed.reference})` : ''}. Quand seriez-vous disponible pour que nous en discutions ? Bien à vous.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-xs font-bold transition"
                  title="Ouvrir WhatsApp"
                >
                  <Send className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
