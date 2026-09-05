'use client';

import { useState, useEffect } from 'react';
import { Printer, Mail } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { Property, TransactionDeal, AgencySettings } from '@/lib/types';
import {
  InvoiceAgencyHeader,
  InvoiceFactureSection,
  InvoiceSequestreSection,
} from './invoice';

interface InvoicePrintModalProps {
  deal: TransactionDeal;
  properties: Property[];
  settings: AgencySettings;
  documentType: 'facture' | 'sequestre';
  onSetDocumentType: (t: 'facture' | 'sequestre') => void;
  onClose: () => void;
  /** Appelé après l'ouverture du mailto de la facture au notaire (marque la facture comme envoyée). */
  onInvoiceSent?: (dealId: string) => void;
}

export function InvoicePrintModal({
  deal,
  properties,
  settings,
  documentType,
  onSetDocumentType,
  onClose,
  onInvoiceSent,
}: InvoicePrintModalProps) {
  const prop = properties.find((p) => p.id === deal.property_id);
  const [emailNotice, setEmailNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleEmailToNotary = () => {
    const notaryEmail = deal.seller_notary_email || deal.buyer_notary_email;
    if (!notaryEmail) {
      setEmailNotice({
        type: 'error',
        message:
          'Aucune adresse email notariale renseignée pour cette transaction. Veuillez renseigner le notaire dans la fiche transaction.',
      });
      return;
    }
    const feesTTC = deal.agency_fees_amount || 0;
    const invoiceNo = deal.invoice_number || 'FACT-2026-004';
    const subject = `Facture d'honoraires ${invoiceNo} — ${prop?.title || ''} (${prop?.city || ''})`;
    const body = [
      `Bonjour Maître,`,
      ``,
      `Veuillez trouver ci-dessous les coordonnées bancaires de la SASU Nell'Immo pour le règlement de nos honoraires de transaction, à prévoir lors de la réitération par acte authentique.`,
      ``,
      `— FACTURE N° ${invoiceNo} —`,
      `Bien : ${prop?.title || ''} (${prop?.city || ''})`,
      `Vendeur(s) : ${deal.seller_name}`,
      `Acquéreur(s) : ${deal.buyer_name}`,
      `Montant TTC : ${feesTTC.toLocaleString('fr-FR')} €`,
      ``,
      `— COORDONNÉES BANCAIRES (RIB) —`,
      `Titulaire : SASU NELL'IMMO`,
      `IBAN : ${settings.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}`,
      `BIC : ${settings.agency_rib_bic || 'BNPAFRPP'}`,
      ``,
      `Merci de votre retour.`,
      `Bien cordialement,`,
      `${settings.agent_name || 'Nelly Fernandez'} — ${settings.agency_name || "SASU NELL'IMMO"}`,
    ].join('\n');
    window.location.href = `mailto:${notaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailNotice({
      type: 'success',
      message: `Client email ouvert vers ${notaryEmail}. Pensez à enregistrer le PDF pour le joindre à votre message.`,
    });
    onInvoiceSent?.(deal.id);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-[9999] animate-fade-in overflow-hidden print:p-0 print:bg-white print:static"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 print:p-0 print:border-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Notice message */}
        {emailNotice && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center justify-between border print:hidden ${
              emailNotice.type === 'error'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span>{emailNotice.message}</span>
            <button
              onClick={() => setEmailNotice(null)}
              className="text-xs font-black ml-2 px-1.5 py-0.5 rounded hover:bg-black/5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Bar print/close with Document Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetDocumentType('facture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                documentType === 'facture'
                  ? 'bg-[#E12B7B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Facture d’Honoraires (Acte)
            </button>
            <button
              onClick={() => onSetDocumentType('sequestre')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                documentType === 'sequestre'
                  ? 'bg-[#131B26] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Appel de Fonds Séquestre Notaire
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleEmailToNotary}
              className="px-4 py-2 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Mail className="w-4 h-4" />
              Envoyer au Notaire (Email)
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Imprimer Format A4 Officiel
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Official Document Body */}
        <div className="border border-gray-300 p-8 rounded-2xl bg-white space-y-6 text-gray-900 font-sans print:border-none print:p-0">
          <InvoiceAgencyHeader settings={settings} deal={deal} />

          {documentType === 'facture' ? (
            <InvoiceFactureSection deal={deal} prop={prop} settings={settings} />
          ) : (
            <InvoiceSequestreSection deal={deal} prop={prop} />
          )}

          {/* Signature Block */}
          <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
            <div className="text-[10px] text-gray-500 max-w-sm">
              <p>
                Membre d’une association agréée par l’administration fiscale acceptant le règlement des honoraires par virement bancaire.
              </p>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-gray-900 block">
                {settings.agent_name || 'Nelly Fernandez'}
              </span>
              <span className="text-[10px] text-gray-500 block">Présidente SASU Nell’Immo</span>
              <div className="h-8 flex items-center justify-center italic text-gray-400 text-xs mt-1">
                Pour valoir ce que de droit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
