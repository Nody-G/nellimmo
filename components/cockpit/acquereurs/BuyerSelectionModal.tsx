'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Buyer, Property } from '@/lib/types';
import { calculateMatchingScore, formatMandateRef } from '@/lib/hoguet';
import {
  X,
  MessageCircle,
  Printer,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Home,
  CheckCircle2,
  Euro,
  Layers,
  Send,
  Download
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

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

  // Ranked matching properties
  const scoredProperties = activeProperties
    .map((p) => ({
      property: p,
      match: calculateMatchingScore(p, buyer),
    }))
    .sort((a, b) => b.match.score - a.match.score);

  // Default selection: top 2 matches
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

  // Generate WhatsApp message
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

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedText(true);
    showToast('Message de sélection copié dans le presse-papier !', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden">
        
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
          
          {/* Left Column: Properties Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase text-gray-400 block tracking-wider">
              Biens Compatibles ({scoredProperties.length})
            </span>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {scoredProperties.map(({ property: p, match }) => {
                const isSelected = selectedPropertyIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProperty(p.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#FDF2F8] border-[#E12B7B] shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 accent-[#E12B7B] cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-gray-400">
                          {formatMandateRef(p.mandate_number)}
                        </span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            match.score >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : match.score >= 60
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {match.score}% match
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[#131B26] truncate">{p.title}</h4>
                      <p className="text-[11px] text-gray-500 truncate">{p.city} • {p.living_area} m² • {p.rooms_count}p</p>
                      <div className="text-xs font-black text-[#E12B7B] mt-1">
                        {p.price_fai.toLocaleString('fr-FR')} € FAI
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Preview & Action Channels (7 cols) */}
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
                <span>Message WhatsApp VIP</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'print'
                    ? 'bg-[#131B26] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Dossier de Sélection A4</span>
              </button>
            </div>

            {/* TAB 1: WhatsApp Preview */}
            {activeTab === 'whatsapp' && (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-gray-300 font-sans text-xs text-gray-900 leading-relaxed whitespace-pre-line shadow-inner max-h-[380px] overflow-y-auto">
                  <div className="bg-white p-3.5 rounded-xl shadow-xs max-w-md border-l-4 border-emerald-500">
                    {whatsappMessage}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? 'Copié !' : 'Copier le message'}</span>
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer sur WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Printable A4 Preview */}
            {activeTab === 'print' && (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="border border-gray-300 rounded-2xl p-5 bg-white shadow-xs max-h-[380px] overflow-y-auto space-y-4 print:p-0 print:border-none">
                  {/* Agency Header */}
                  <div className="border-b border-[#C59A45] pb-3 flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-lg text-[#131B26] tracking-tight block">
                        NELL&apos;IMMO
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#C59A45] block">
                        Sélection Exclusive de Biens Immobiliers
                      </span>
                    </div>
                    <div className="text-right text-[10px] text-gray-500">
                      <span className="font-bold text-gray-900 block">Dossier pour : {buyer.first_name} {buyer.last_name}</span>
                      <span>Édité le {new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Property Cards */}
                  <div className="space-y-3">
                    {selectedProperties.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex gap-3 text-xs"
                      >
                        <div className="w-24 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                          <Image
                            src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
                            alt={p.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-xs text-gray-900 truncate">{p.title}</h4>
                            <span className="font-serif font-black text-sm text-[#E12B7B]">
                              {p.price_fai.toLocaleString('fr-FR')} €
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            {p.city} • {p.living_area} m² • {p.rooms_count} pièces ({p.bedrooms_count} ch.)
                          </p>
                          <div className="flex gap-1.5 text-[9px] font-semibold text-gray-500">
                            {p.land_area ? <span className="bg-white px-1.5 py-0.5 rounded border">Terrain {p.land_area} m²</span> : null}
                            <span className="bg-white px-1.5 py-0.5 rounded border">DPE : {p.dpe_letter || 'C'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-2 text-[10px] text-gray-400 flex justify-between">
                    <span>Nelly Fernandez — Conseillère Indépendante • Pélissanne & Pays Salonais</span>
                    <span>Tél : 06 12 34 56 78</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePrint}
                    className="w-full py-2.5 px-4 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#C59A45]" />
                    <span>Imprimer la Fiche Sélection A4 / Télécharger PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
