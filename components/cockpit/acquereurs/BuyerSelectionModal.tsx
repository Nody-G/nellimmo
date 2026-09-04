'use client';

import React, { useState } from 'react';
import { Buyer, Property } from '@/lib/types';
import { calculateMatchingScore } from '@/lib/hoguet';
import { X, MessageCircle, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import {
  BuyerMatchingPicker,
  BuyerSelectionWhatsAppTab,
  BuyerSelectionPrintSheet,
} from './selection';

interface BuyerSelectionModalProps {
  buyer: Buyer;
  activeProperties: Property[];
  onClose: () => void;
}

export const BuyerSelectionModal: React.FC<BuyerSelectionModalProps> = ({
  buyer,
  activeProperties,
  onClose,
}) => {
  const { showToast } = useToast();

  const scoredProperties = activeProperties
    .map((p) => ({
      property: p,
      match: calculateMatchingScore(p, buyer),
    }))
    .sort((a, b) => b.match.score - a.match.score);

  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>(
    scoredProperties.slice(0, 2).map((s) => s.property.id)
  );

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'print'>('whatsapp');
  const [copiedText, setCopiedText] = useState(false);

  const toggleProperty = (id: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const selectedProperties = activeProperties.filter((p) =>
    selectedPropertyIds.includes(p.id)
  );

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nellimmo.fr';
  const whatsappMessage = `Bonjour ${buyer.first_name}, c'est Nelly Fernandez de l'agence Nell'Immo.
  
Suite à notre échange sur votre projet immobilier (budget jusqu'à ${buyer.budget_max.toLocaleString('fr-FR')} € sur ${buyer.target_cities.join(', ')}), j'ai sélectionné pour vous ${selectedProperties.length} opportunité(s) exclusive(s) correspondant parfaitement à vos attentes :

${selectedProperties
  .map(
    (p, i) =>
      `${i + 1}️⃣ *${p.title}* à ${p.city}
💶 Prix FAI : ${p.price_fai.toLocaleString('fr-FR')} €
📐 ${p.living_area} m² habitables • ${p.rooms_count} pièces (${p.bedrooms_count} ch.)
🌳 ${p.land_area ? `Terrain de ${p.land_area} m²` : 'Prestations soignées'}
🔗 Découvrir la fiche : ${origin}/biens/${p.id}`
  )
  .join('\n\n')}

Seriez-vous disponible cette semaine pour organiser une visite découverte ?
Bien cordialement,
Nelly Fernandez — SASU Nell'Immo
📞 06 12 34 56 78`;

  const handleSendWhatsApp = () => {
    const cleanPhone = buyer.phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  const handleSendEmail = () => {
    if (!buyer.email) {
      showToast('Adresse email manquante pour cet acquéreur', 'error');
      return;
    }
    const subject = `Sélection de biens exclusifs pour votre projet — Nell'Immo`;
    const mailBody = whatsappMessage.replace(/[*_#]/g, '');
    window.open(`mailto:${buyer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedText(true);
    showToast('Message de sélection copié dans le presse-papier !', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-[#FCFAF7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                Rapprochement Multicritères Sur-Mesure
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedProperties.length} sélectionné(s)
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#131B26] mt-0.5">
              Sélection de Biens pour {buyer.first_name} {buyer.last_name}
            </h2>
            <p className="text-xs text-gray-500">
              Budget max : {buyer.budget_max.toLocaleString('fr-FR')} € • Secteurs : {buyer.target_cities.join(', ')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left property checklist + Right preview tabs */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <BuyerMatchingPicker
            scoredProperties={scoredProperties}
            selectedPropertyIds={selectedPropertyIds}
            onToggleProperty={toggleProperty}
          />

          {/* Right Column: Preview & Action Channels */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Tab switchers */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message Direct (WhatsApp / Email)</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'print'
                    ? 'bg-[#131B26] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-[#C59A45]" />
                <span>Dossier de Sélection A4 Imprimable</span>
              </button>
            </div>

            {activeTab === 'whatsapp' ? (
              <BuyerSelectionWhatsAppTab
                whatsappMessage={whatsappMessage}
                copiedText={copiedText}
                onCopy={handleCopy}
                onSendEmail={handleSendEmail}
                onSendWhatsApp={handleSendWhatsApp}
              />
            ) : (
              <BuyerSelectionPrintSheet
                buyer={buyer}
                selectedProperties={selectedProperties}
                origin={origin}
                onPrint={() => window.print()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
