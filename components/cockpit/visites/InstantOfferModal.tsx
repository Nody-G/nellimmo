'use client';

import React, { useState, useMemo } from 'react';
import { Property, Buyer } from '@/lib/types';
import {
  FileSignature,
  Copy,
  Check,
  MessageCircle
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface InstantOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
  buyer?: Buyer;
}

export const InstantOfferModal: React.FC<InstantOfferModalProps> = ({
  isOpen,
  onClose,
  property,
  buyer
}) => {
  const [offerPrice, setOfferPrice] = useState<number>(() => (property ? property.price_fai : 0));
  const [offerValidityDays, setOfferValidityDays] = useState<number>(7);
  const [offerLoanAmount, setOfferLoanAmount] = useState<number>(() =>
    property ? Math.round(property.price_fai * 0.85) : 0
  );
  const [offerLoanRate, setOfferLoanRate] = useState<number>(3.6);
  const [offerLoanDuration, setOfferLoanDuration] = useState<number>(25);
  const [copiedOffer, setCopiedOffer] = useState(false);
  const [mountTimestamp] = useState(() => Date.now());

  const offerText = useMemo(() => {
    const today = new Date(mountTimestamp).toLocaleDateString('fr-FR');
    const validityDate = new Date(
      mountTimestamp + offerValidityDays * 24 * 60 * 60 * 1000
    ).toLocaleDateString('fr-FR');

    return (
      `OFFRE D'ACHAT FERME ET IRRÉVOCABLE (Art. 1113 du Code Civil)\n\n` +
      `Date : ${today}\n` +
      `Bien concerné : ${property?.title || 'Bien immobilier'} situé à ${property?.city || 'Provence'}\n` +
      `Mandat de vente Nell'Immo n° : ${property?.mandate_number || 'En cours'}\n\n` +
      `ACQUÉREUR(S) OFFERT : \n` +
      `- Nom & Prénom : ${buyer?.first_name || ''} ${buyer?.last_name || ''}\n` +
      `- Coordonnées : ${buyer?.phone || ''} | ${buyer?.email || ''}\n\n` +
      `PRIX PROPOSÉ : \n` +
      `L'acquéreur propose d'acquérir le bien pour un montant de ${offerPrice.toLocaleString('fr-FR')} € FAI (Honoraires d'agence inclus).\n\n` +
      `FINANCEMENT : \n` +
      (offerLoanAmount > 0
        ? `- Prêt bancaire sollicité : ${offerLoanAmount.toLocaleString('fr-FR')} € sur ${offerLoanDuration} ans à un taux maximal de ${offerLoanRate}%.\n` +
          `- Apport personnel net : ${(offerPrice - offerLoanAmount).toLocaleString('fr-FR')} €.\n`
        : `- Paiement comptant sans recours à un prêt bancaire (renonciation à la condition suspensive de prêt).\n`) +
      `\nCONDITIONS ET VALIDITÉ : \n` +
      `- La présente offre est valable jusqu'au ${validityDate} à 18h00, date au-delà de laquelle elle deviendra caduque de plein droit sans indemnité.\n` +
      `- La vente sera conclue sous réserve des conditions suspensives légales (urbanisme, absence de préemption, etc.).\n\n` +
      `Transmis par l'intermédiaire de l'agence SASU Nell'Immo, titulaire de la Carte Pro CPI 1310 2019 000 042 974.`
    );
  }, [property, buyer, offerPrice, offerValidityDays, offerLoanAmount, offerLoanRate, offerLoanDuration, mountTimestamp]);

  const copyOfferText = () => {
    navigator.clipboard.writeText(offerText);
    setCopiedOffer(true);
    setTimeout(() => setCopiedOffer(false), 2000);
  };

  const sendWhatsApp = () => {
    const encoded = encodeURIComponent(offerText);
    const cleanPhone = buyer?.phone.replace(/\s+/g, '').replace(/^0/, '33') || '';
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-[#E12B7B]" />
          <span>Générateur 1-Clic d&apos;Offre d&apos;Achat (Code Civil Art. 1113)</span>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Prix de l&apos;Offre FAI (€)</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-black text-sm text-[#E12B7B] focus:outline-[#E12B7B]"
            />
            <span className="text-[10px] text-gray-400">
              Prix mandat : {property?.price_fai.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Validité de l&apos;Offre (Jours)</label>
            <input
              type="number"
              value={offerValidityDays}
              onChange={(e) => setOfferValidityDays(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Montant Emprunté (€)</label>
            <input
              type="number"
              value={offerLoanAmount}
              onChange={(e) => setOfferLoanAmount(Number(e.target.value))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-[#E12B7B]"
            />
            <span className="text-[10px] text-gray-400">0 si paiement comptant</span>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-700 mb-1">Taux Max & Durée</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={offerLoanRate}
                onChange={(e) => setOfferLoanRate(Number(e.target.value))}
                className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                placeholder="Taux %"
              />
              <input
                type="number"
                value={offerLoanDuration}
                onChange={(e) => setOfferLoanDuration(Number(e.target.value))}
                className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                placeholder="Années"
              />
            </div>
          </div>
        </div>

        {/* Preview of Offer Document */}
        <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
          <span className="text-xs font-bold uppercase text-[#131B26] block">
            Texte Contractuel Généré :
          </span>
          <pre className="text-[11px] font-sans text-gray-700 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto p-2.5 bg-white rounded-xl border border-gray-200">
            {offerText}
          </pre>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copyOfferText}
            leftIcon={copiedOffer ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copiedOffer ? 'Copié !' : 'Copier l\'Offre'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={sendWhatsApp}
            leftIcon={<MessageCircle className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Envoyer à l&apos;Acquéreur (WhatsApp)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
