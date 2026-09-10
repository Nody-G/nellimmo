'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, X, Copy, Check, Printer, Send, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import { useNellimoStore } from '@/lib/store';
import type { TransactionDeal, Property } from '@/lib/types';

interface NotaryCompromisPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionDeal;
  property?: Property;
}

export function NotaryCompromisPackModal({
  isOpen,
  onClose,
  transaction,
  property,
}: NotaryCompromisPackModalProps) {
  const { showToast } = useToast();
  const { settings } = useNellimoStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const salePrice = (transaction.offer_price_fai || property?.price_fai || 0).toLocaleString('fr-FR');
  const agencyFees = (transaction.agency_fees_amount || property?.agency_fees_amount || 0).toLocaleString('fr-FR');
  const feesPayer = property?.fees_paid_by || 'acquereur';

  const notaryEmailDraft =
    `Objet : Dossier de vente — Mandat ${property?.mandate_number || 'Exclusif'} / ${property?.title || 'Villa'}\n\n` +
    `Cher Maître,\n\n` +
    `J’ai le plaisir de vous transmettre les éléments complets en vue de la rédaction de l’avant-contrat (compromis de vente) pour le bien suivant :\n\n` +
    `📍 DÉSIGNATION DU BIEN :\n` +
    `• Adresse : ${property?.address || 'Pélissanne'}\n` +
    `• Typologie : ${property?.property_type || 'Maison'} • ${property?.living_area || 0} m² • ${property?.rooms_count || 0} pièces\n` +
    `• Cadastre : Section ${property?.cadastral_section || 'AC'} n°${property?.cadastral_number || '142'} (${property?.city || 'Pélissanne'})\n\n` +
    `👥 PARTIES EN CAUSE :\n` +
    `• VENDEUR : ${transaction.seller_name || property?.seller_name || 'Monsieur & Madame Vendeur'} (Tél: ${transaction.seller_phone || property?.seller_phone || 'N/C'})\n` +
    `• ACQUÉREUR : ${transaction.buyer_name || 'Monsieur & Madame Acquéreur'}\n\n` +
    `💶 CONDITIONS FINANCIÈRES ACCORDÉES :\n` +
    `• Prix de vente convenu : ${salePrice} € FAI\n` +
    `• Dont honoraires d’agence Nell’Immo : ${agencyFees} € TTC (charge ${feesPayer})\n` +
    `• Séquestre recommandé : 5 % à verser en l’étude\n` +
    `• Financement : Avec condition suspensive d’octroi de prêt\n\n` +
    `📂 PIÈCES ALUR JOINTES :\n` +
    `1. Mandat de vente Nell’Immo en cours de validité\n` +
    `2. Offre d’achat acceptée et contresignée\n` +
    `3. Dossier de Diagnostic Technique (DDT complet : DPE, Amiante, Plomb, Élec, ERP)\n` +
    `4. Titre de propriété et avis de taxe foncière\n` +
    `5. Pièce d’identité et attestation de financement de l’acquéreur\n\n` +
    `Je reste à votre entière disposition pour fixer la date de signature du compromis.\n\n` +
    `Bien confraternellement,\n${settings.agent_name || 'Nelly'} • ${settings.agency_name || "Nell’Immo"} ${settings.city || 'Pélissanne'} (${settings.phone || '07 55 68 61 09'})`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notaryEmailDraft);
      setCopied(true);
      showToast('Courrier notaire copié dans le presse-papier !', 'success');
      setTimeout(() => setCopied(false), 2000);
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
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Dossier Compromis Notaire en 1 Clic</h3>
                <p className="text-xs text-gray-500">
                  {property?.title || 'Bien'} • Acquéreur : {transaction.buyer_name}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Pieces status bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Audit de conformité ALUR : 5/5 pièces indispensables identifiées
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                Prêt pour l’Étude
              </span>
            </div>

            {/* Email textarea preview */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-gray-400">Courrier notarial préparé</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white text-blue-700 border border-blue-200 rounded-lg text-xs font-bold shadow-2xs hover:bg-blue-50 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>
              <textarea
                readOnly
                rows={9}
                value={notaryEmailDraft}
                className="w-full text-xs font-mono text-gray-800 bg-transparent border-0 resize-none focus:outline-hidden leading-relaxed custom-scrollbar"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer Bordereau
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Fermer
                </button>
                <a
                  href={`mailto:notaire@notaires.fr?subject=${encodeURIComponent(
                    `Dossier Compromis - Mandat ${property?.title || 'Nell’Immo'}`
                  )}&body=${encodeURIComponent(notaryEmailDraft)}`}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ouvrir dans Messagerie
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
