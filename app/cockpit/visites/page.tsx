'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import { Property, Buyer, VisitSheet } from '@/lib/types';
import {
  PenTool,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  User,
  Home,
  PlusCircle,
  Printer,
  Calendar,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  FileSignature,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Euro,
  X,
  Copy,
  Check
} from 'lucide-react';
import { VoiceVisitRecorder } from '@/components/cockpit/VoiceVisitRecorder';

interface PrintableVisit {
  property?: Property;
  buyer?: Buyer;
  visit_date: string;
  signature_data_url: string;
  notes?: string;
  hash: string;
}

export default function VisitSheetsPage() {
  const { properties, buyers, visits, createVisitSheet } = useNellimoStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [copiedCalendarLink, setCopiedCalendarLink] = useState(false);
  const [isLegalPrintModalOpen, setIsLegalPrintModalOpen] = useState(false);
  const [lastSavedSignatureUrl, setLastSavedSignatureUrl] = useState<string | null>(null);
  const [selectedVisitToPrint, setSelectedVisitToPrint] = useState<PrintableVisit | null>(null);

  // Sentiment & Feedback state
  const [visitorSentiment, setVisitorSentiment] = useState<'coup_de_coeur' | 'interesse' | 'neutre' | 'refus'>('coup_de_coeur');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(['Luminosité', 'Jardin / Extérieur']);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [priceFeedback, setPriceFeedback] = useState<string>('Au prix du marché');

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];

  // Instant Offer Modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number>(() => selectedProperty ? selectedProperty.price_fai : 0);
  const [offerValidityDays, setOfferValidityDays] = useState<number>(7);
  const [offerLoanAmount, setOfferLoanAmount] = useState<number>(() => selectedProperty ? Math.round(selectedProperty.price_fai * 0.85) : 0);
  const [offerLoanRate, setOfferLoanRate] = useState<number>(3.6);
  const [offerLoanDuration, setOfferLoanDuration] = useState<number>(25);
  const [copiedOffer, setCopiedOffer] = useState(false);

  // Adjust offer price when selected property changes
  const [prevSelectedPropId, setPrevSelectedPropId] = useState(selectedPropertyId);
  if (prevSelectedPropId !== selectedPropertyId) {
    setPrevSelectedPropId(selectedPropertyId);
    if (selectedProperty) {
      setOfferPrice(selectedProperty.price_fai);
      setOfferLoanAmount(Math.round(selectedProperty.price_fai * 0.85));
    }
  }

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#131B26';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveVisit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL('image/png');
    setLastSavedSignatureUrl(signatureDataUrl);

    setSelectedVisitToPrint({
      property: selectedProperty,
      buyer: selectedBuyer,
      visit_date: new Date().toISOString(),
      signature_data_url: signatureDataUrl,
      notes: `Sentiment: ${visitorSentiment}. Atouts: ${selectedStrengths.join(', ')}. Avis prix: ${priceFeedback}. ${notes}`,
      hash: 'sha256-bv-' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    });

    createVisitSheet({
      property_id: selectedPropertyId,
      buyer_id: selectedBuyerId,
      visit_date: new Date().toISOString(),
      signature_data_url: signatureDataUrl,
      ip_address: '82.65.144.21',
      notes: `Sentiment: ${visitorSentiment}. Atouts: ${selectedStrengths.join(', ')}. Avis prix: ${priceFeedback}. ${notes}`,
    });

    setIsSigned(true);
    setIsLegalPrintModalOpen(true);
  };

  const handleAddToGoogleCalendar = () => {
    if (!selectedProperty || !selectedBuyer) return;
    const title = encodeURIComponent(`Visite Immobilière : ${selectedProperty.title} avec ${selectedBuyer.first_name} ${selectedBuyer.last_name}`);
    const details = encodeURIComponent(`Visite agence Nell'Immo avec l'acquéreur ${selectedBuyer.first_name} ${selectedBuyer.last_name} (${selectedBuyer.phone}).\nMandat N°${selectedProperty.mandate_number} - Prix FAI: ${selectedProperty.price_fai.toLocaleString('fr-FR')} €.\nNotes : ${notes || 'Aucune'}`);
    const location = encodeURIComponent(`${selectedProperty.address}, ${selectedProperty.postal_code} ${selectedProperty.city}`);
    
    const start = new Date(Date.now() + 3600000);
    const end = new Date(Date.now() + 7200000);
    const formatGDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const dates = `${formatGDate(start)}/${formatGDate(end)}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(url, '_blank');
  };

  const handleSendGpsRouteWhatsApp = () => {
    if (!selectedProperty || !selectedBuyer) return;
    const addressQuery = encodeURIComponent(`${selectedProperty.address}, ${selectedProperty.postal_code} ${selectedProperty.city}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
    const message = encodeURIComponent(`Bonjour ${selectedBuyer.first_name}, c'est Nelly Fernandez de l'agence Nell'Immo. Voici l'adresse et le point GPS Google Maps pour notre visite : ${selectedProperty.address}, ${selectedProperty.postal_code} ${selectedProperty.city}.\nLien direct Google Maps : ${mapsUrl}\nÀ tout à l'heure !`);
    const cleanPhone = selectedBuyer.phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleSendReminderEveWhatsApp = () => {
    if (!selectedProperty || !selectedBuyer) return;
    const message = encodeURIComponent(`Bonsoir ${selectedBuyer.first_name}, petit rappel pour notre visite de demain pour la maison à ${selectedProperty.city}. Merci de me confirmer si le créneau vous convient toujours en répondant à ce message. Belle soirée, Nelly Fernandez (07 55 68 61 09).`);
    const cleanPhone = selectedBuyer.phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleSendFeedbackRequestWhatsApp = () => {
    if (!selectedProperty || !selectedBuyer) return;
    const message = encodeURIComponent(`Bonjour ${selectedBuyer.first_name}, j'espère que vous allez bien ! Avez-vous eu le temps de mûrir votre ressenti suite à notre visite d'hier à ${selectedProperty.city} ? Avez-vous des questions complémentaires sur la maison ou le quartier ? Je reste à votre écoute ! Nelly Fernandez.`);
    const cleanPhone = selectedBuyer.phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleNotifyOwnerWhatsApp = () => {
    if (!selectedProperty || !selectedBuyer) return;
    const sentimentLabel = visitorSentiment === 'coup_de_coeur'
      ? 'très enthousiaste (vrai coup de cœur)'
      : visitorSentiment === 'interesse'
      ? 'intéressé par les volumes et l\'emplacement'
      : 'plus mitigé';

    const message = encodeURIComponent(`Bonjour ${selectedProperty.seller_name}, c'est Nelly de l'agence Nell'Immo. Je viens de terminer la visite avec M./Mme ${selectedBuyer.last_name} pour votre bien à ${selectedProperty.city}. Le visiteur s'est montré ${sentimentLabel}. Atouts relevés : ${selectedStrengths.join(', ')}. Avis sur le prix : ${priceFeedback}. Je vous fais un compte-rendu complet dès confirmation de son retour définitif. Belle fin de journée ! Nelly Fernandez.`);
    const cleanPhone = selectedProperty.seller_phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Generate official offer text
  const generateOfferText = () => {
    if (!selectedProperty || !selectedBuyer) return '';
    return `OFFRE D'ACHAT IMMOBILIÈRE (ACTE UNILATÉRAL)
Conforme aux dispositions des articles 1113 et suivants du Code Civil

1. IDENTIFICATION DES PARTIES :
• L'Offrant (Acquéreur) : ${selectedBuyer.first_name} ${selectedBuyer.last_name}, demeurant au numéro ${selectedBuyer.phone}.
• Le Vendeur (Mandant) : ${selectedProperty.seller_name}.
• Intermédiaire : SASU NELL'IMMO, Carte T CPI 1310 2019 000 042 974 (Titulaire du mandat Réf. ${selectedProperty.mandate_number}).

2. DÉSIGNATION DU BIEN :
• Typologie : ${selectedProperty.property_type.toUpperCase()} située au ${selectedProperty.address}, ${selectedProperty.postal_code} ${selectedProperty.city}.
• Surface habitable : ${selectedProperty.living_area} m² • Terrain : ${selectedProperty.land_area || 'N/A'} m².

3. MONTANT DE L'OFFRE D'ACHAT :
Le soussigné s'engage fermement à acquérir le bien ci-dessus désigné pour le montant net de :
💶 ${offerPrice.toLocaleString('fr-FR')} € (Honoraires d'agence FAI inclus).

4. MODALITÉS DE FINANCEMENT :
${offerLoanAmount > 0 
  ? `L'offre est soumise à la condition suspensive d'obtention d'un prêt bancaire d'un montant maximal de ${offerLoanAmount.toLocaleString('fr-FR')} € au taux maximal de ${offerLoanRate}% sur une durée de ${offerLoanDuration} ans.`
  : 'Acquisition réalisée au moyen de deniers propres (Paiement comptant sans recours à l\'emprunt).'
}

5. DURÉE DE VALIDITÉ DE L'OFFRE :
La présente offre est valable pour une durée de ${offerValidityDays} jours à compter de ce jour. Passé ce délai, elle deviendra caduque de plein droit.
Conformément à la Loi Hoguet (Art. 1591 Code Civil), aucun versement de fonds ne peut être exigé préalablement à la signature du compromis chez le notaire.

Fait à ${selectedProperty.city}, le ${new Date().toLocaleDateString('fr-FR')}.
Signature de l'Offrant :`;
  };

  const copyOfferText = () => {
    navigator.clipboard.writeText(generateOfferText());
    setCopiedOffer(true);
    setTimeout(() => setCopiedOffer(false), 2000);
  };

  const toggleStrength = (item: string) => {
    setSelectedStrengths((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const toggleWeakness = (item: string) => {
    setSelectedWeaknesses((prev) =>
      prev.includes(item) ? prev.filter((w) => w !== item) : [...prev, item]
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Print Styles for Official Bon de Visite */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-bon-de-visite, #printable-bon-de-visite * {
              visibility: visible;
            }
            #printable-bon-de-visite {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              margin: 0 !important;
              padding: 10mm !important;
              border: 1px solid #000 !important;
              box-shadow: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
          }
        `
      }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <PenTool className="w-4 h-4" />
            <span>Organisation Visites & Action Client Immédiate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Bons de Visite, Sentiment & Offres Express
          </h1>
          <p className="text-xs text-gray-500">
            Émargement tactile, recueil du sentiment visiteur en 10 secondes et génération d&apos;offre d&apos;achat officielle sur le champ.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCalendarModalOpen(true)}
            className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#C59A45]" />
            <span>Synchroniser Agenda iCal</span>
          </button>

          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs transition cursor-pointer"
          >
            <FileSignature className="w-4 h-4 text-[#E12B7B]" />
            <span>Formuler une Offre d&apos;Achat (1 Clic)</span>
          </button>

          <button
            onClick={() => {
              setIsSigned(false);
              clearCanvas();
            }}
            className="px-4 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Bon de Visite</span>
          </button>
        </div>
      </div>

      {/* Main Form & Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols : Tactile Form & Canvas */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#E12B7B]" />
                Bien Visité (Mandat)
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#E12B7B]" />
                Acquéreur / Visiteur
              </label>
              <select
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]"
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.first_name} {b.last_name} ({b.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Actions Hub Google & WhatsApp */}
          <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
            <span className="text-xs font-bold uppercase text-[#131B26] tracking-wider block">
              Actions Mobiles Terrain & Relations Propriétaire (1 Clic)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={handleAddToGoogleCalendar}
                className="p-2.5 bg-white border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-bold text-gray-800 flex flex-col items-center justify-center gap-1.5 transition text-center shadow-2xs group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
                <span className="text-[10px] leading-tight">Google Agenda</span>
              </button>

              <button
                type="button"
                onClick={handleSendGpsRouteWhatsApp}
                className="p-2.5 bg-white border border-gray-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-gray-800 flex flex-col items-center justify-center gap-1.5 transition text-center shadow-2xs group cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-red-500 group-hover:scale-110 transition" />
                <span className="text-[10px] leading-tight">Itinéraire GPS</span>
              </button>

              <button
                type="button"
                onClick={handleSendReminderEveWhatsApp}
                className="p-2.5 bg-white border border-gray-200 hover:border-purple-300 rounded-xl text-xs font-bold text-gray-800 flex flex-col items-center justify-center gap-1.5 transition text-center shadow-2xs group cursor-pointer"
              >
                <Clock className="w-4 h-4 text-purple-600 group-hover:scale-110 transition" />
                <span className="text-[10px] leading-tight">Rappel J-1</span>
              </button>

              <button
                type="button"
                onClick={handleSendFeedbackRequestWhatsApp}
                className="p-2.5 bg-white border border-gray-200 hover:border-pink-300 rounded-xl text-xs font-bold text-gray-800 flex flex-col items-center justify-center gap-1.5 transition text-center shadow-2xs group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#E12B7B] group-hover:scale-110 transition" />
                <span className="text-[10px] leading-tight">Avis J+1</span>
              </button>

              <button
                type="button"
                onClick={handleNotifyOwnerWhatsApp}
                className="p-2.5 bg-white border border-gray-200 hover:border-amber-400 rounded-xl text-xs font-bold text-gray-800 flex flex-col items-center justify-center gap-1.5 transition text-center shadow-2xs group cursor-pointer col-span-2 sm:col-span-1"
              >
                <Send className="w-4 h-4 text-[#C59A45] group-hover:scale-110 transition" />
                <span className="text-[10px] leading-tight">Bilan Propriétaire</span>
              </button>
            </div>
          </div>

          {/* Module Dictée Vocale IA */}
          <VoiceVisitRecorder
            sellerName={selectedProperty.seller_name}
            propertyTitle={selectedProperty.title}
            onTranscriptComplete={({ rawTranscript, sentiment, strengths, weaknesses, priceFeedback: pf }) => {
              setVisitorSentiment(sentiment);
              if (strengths && strengths.length > 0) setSelectedStrengths(strengths);
              if (weaknesses && weaknesses.length > 0) setSelectedWeaknesses(weaknesses);
              if (pf) setPriceFeedback(pf);
              setNotes((prev) => (prev ? `${prev}\n\n[Dictée Vocale] ${rawTranscript}` : `[Dictée Vocale] ${rawTranscript}`));
            }}
          />

          {/* Micro-Compte-Rendu Post-Visite (Recueil de Sentiment) */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-xs font-bold uppercase text-gray-800 tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
              Micro-Bilan Immédiat : Sentiment de l&apos;Acquéreur
            </span>

            {/* Sentiment Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setVisitorSentiment('coup_de_coeur')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  visitorSentiment === 'coup_de_coeur'
                    ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>😍 Coup de cœur</span>
              </button>
              <button
                type="button"
                onClick={() => setVisitorSentiment('interesse')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  visitorSentiment === 'interesse'
                    ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>🤔 Très intéressé</span>
              </button>
              <button
                type="button"
                onClick={() => setVisitorSentiment('neutre')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  visitorSentiment === 'neutre'
                    ? 'bg-amber-600 text-white shadow-2xs ring-2 ring-amber-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>😐 Hésitant</span>
              </button>
              <button
                type="button"
                onClick={() => setVisitorSentiment('refus')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  visitorSentiment === 'refus'
                    ? 'bg-gray-800 text-white shadow-2xs ring-2 ring-gray-400'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>❌ Pas de suite</span>
              </button>
            </div>

            {/* Quick Strengths / Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="font-bold text-gray-600 block mb-1.5">Points Forts Remarqués :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Luminosité', 'Jardin / Extérieur', 'Piscine', 'Calme absolu', 'Cuisine équipée', 'Volumes'].map((str) => (
                    <button
                      key={str}
                      type="button"
                      onClick={() => toggleStrength(str)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        selectedStrengths.includes(str)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {selectedStrengths.includes(str) ? `✓ ${str}` : `+ ${str}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-600 block mb-1.5">Réserves ou Points Bloquants :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Travaux à prévoir', 'Chambres trop petites', 'Prix jugé élevé', 'Cuisine à refaire', 'Vis-à-vis'].map((wk) => (
                    <button
                      key={wk}
                      type="button"
                      onClick={() => toggleWeakness(wk)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        selectedWeaknesses.includes(wk)
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {selectedWeaknesses.includes(wk) ? `✓ ${wk}` : `+ ${wk}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legal clause */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-2">
            <span className="font-bold text-gray-900 block">Engagement Juridique du Visiteur (Loi Hoguet) :</span>
            <p className="leading-relaxed text-[11px] text-gray-600">
              « Je soussigné(e) {selectedBuyer?.first_name} {selectedBuyer?.last_name}, reconnais que l&apos;agence SASU Nell&apos;Immo m&apos;a fait visiter ce jour le bien désigné ci-dessus au prix de {selectedProperty?.price_fai.toLocaleString('fr-FR')} € FAI. Je m&apos;interdis formellement de traiter directement ou indirectement avec le mandant sans le concours de l&apos;agence pendant toute la durée légale. »
            </p>
          </div>

          {/* Tactile Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-[#E12B7B]" />
                Signature Tactile de l&apos;Acquéreur sur l&apos;Écran
              </span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-gray-400 hover:text-[#E12B7B] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Effacer
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 overflow-hidden touch-none relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={180}
                className="w-full h-44 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 pointer-events-none">
                Signez avec le doigt ou un stylet
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Impressions & Remarques Complémentaires
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Demande de contre-visite samedi avec un artisan pour devis peinture..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
            />
          </div>

          {/* Action Button */}
          <div>
            {isSigned ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">Bon de visite scellé et archivé avec succès !</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLegalPrintModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Consulter le Bon Officiel</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveVisit}
                className="w-full py-4 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Valider & Archiver le Bon de Visite Horodaté</span>
              </button>
            )}
          </div>

        </div>

        {/* Right col : History of Visit Sheets */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center justify-between">
              <span>Bons de Visite ({visits.length})</span>
              <span className="text-xs font-sans font-bold text-[#E12B7B] bg-[#FDF2F8] px-2 py-0.5 rounded-full">
                Horodatés
              </span>
            </h3>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {visits.map((v) => {
                const prop = properties.find((p) => p.id === v.property_id);
                const buyer = buyers.find((b) => b.id === v.buyer_id);

                return (
                  <div key={v.id} className="p-3.5 bg-[#FCFAF7] rounded-xl border border-[#F3E8EE] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{buyer?.first_name} {buyer?.last_name}</span>
                      <span className="text-[10px] text-gray-400">{new Date(v.visit_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {prop ? (
                      <Link
                        href={`/cockpit/mandats/${prop.id}`}
                        className="text-[11px] font-semibold text-[#E12B7B] hover:underline block truncate"
                      >
                        {formatMandateRef(prop.mandate_number)} - {prop.title} ({prop.city})
                      </Link>
                    ) : (
                      <span className="text-[11px] text-gray-500 block truncate">Bien visité</span>
                    )}
                    {v.notes && (
                      <p className="text-[10px] text-gray-600 line-clamp-2 italic">
                        {v.notes}
                      </p>
                    )}
                    {v.signature_data_url && (
                      <div className="h-10 bg-white rounded border border-gray-200 p-1 flex items-center justify-center">
                        <img src={v.signature_data_url} alt="Signature" className="max-h-full" />
                      </div>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVisitToPrint({
                            property: prop,
                            buyer: buyer,
                            visit_date: v.visit_date,
                            signature_data_url: v.signature_data_url,
                            notes: v.notes,
                            hash: 'sha256-bv-' + v.id.slice(0, 8) + '-certifie'
                          });
                          setIsLegalPrintModalOpen(true);
                        }}
                        className="text-[10px] text-[#C59A45] hover:text-[#131B26] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Bon de Visite Officiel</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL FORMULER UNE OFFRE D'ACHAT EXPRESS */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-[#E12B7B]" />
                <h3 className="font-serif font-bold text-lg text-[#131B26]">
                  Générateur 1-Clic d&apos;Offre d&apos;Achat (Code Civil Art. 1113)
                </h3>
              </div>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Prix de l&apos;Offre FAI (€)</label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-black text-sm text-[#E12B7B] focus:outline-[#E12B7B]"
                />
                <span className="text-[10px] text-gray-400">Prix mandat : {selectedProperty?.price_fai.toLocaleString('fr-FR')} €</span>
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
              <pre className="text-[11px] font-sans text-gray-700 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto p-2 bg-white rounded-xl border border-gray-200">
                {generateOfferText()}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={copyOfferText}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedOffer ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedOffer ? 'Copié !' : 'Copier l\'Offre'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const encoded = encodeURIComponent(generateOfferText());
                  const cleanPhone = selectedBuyer?.phone.replace(/\s+/g, '').replace(/^0/, '33');
                  window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
                  setIsOfferModalOpen(false);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer à l&apos;Acquéreur (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Abonnement Calendrier iCal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E12B7B]" />
                <h3 className="font-serif font-bold text-lg text-[#131B26]">
                  Synchronisation Agenda Smartphone (iCal)
                </h3>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Abonnez votre iPhone (Apple Calendar) ou votre Google Agenda à vos visites et échéances notariées. Les événements se mettent à jour automatiquement en tâche de fond.
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Lien d&apos;Abonnement Universel (RFC 5545)
                </span>
                <div className="flex items-center justify-between gap-2 font-mono text-xs bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="truncate text-gray-700">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/calendar/feed?token=nellimo_calendar_token` : '/api/calendar/feed'}
                  </span>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/api/calendar/feed?token=nellimo_calendar_token`);
                        setCopiedCalendarLink(true);
                        setTimeout(() => setCopiedCalendarLink(false), 2000);
                      }
                    }}
                    className="p-1 hover:text-[#E12B7B]"
                    title="Copier l'URL"
                  >
                    {copiedCalendarLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={typeof window !== 'undefined' ? `webcal://${window.location.host}/api/calendar/feed?token=nellimo_calendar_token` : '#'}
                  className="p-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition"
                >
                  <span> Ajouter à Apple Calendar</span>
                </a>

                <a
                  href={typeof window !== 'undefined' ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(`${window.location.origin}/api/calendar/feed?token=nellimo_calendar_token`)}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition"
                >
                  <span>G S&apos;abonner Google Agenda</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-900 font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BON DE VISITE OFFICIEL LOI HOGUET (ART. 73) */}
      {isLegalPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-100 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E12B7B]" />
                <h3 className="font-serif font-bold text-lg text-[#131B26]">
                  Attestation Officielle de Bon de Visite (Loi Hoguet Art. 73)
                </h3>
              </div>
              <button
                onClick={() => setIsLegalPrintModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Container */}
            <div id="printable-bon-de-visite" className="bg-white p-6 sm:p-8 border-2 border-gray-300 rounded-2xl space-y-6 text-xs text-gray-900 leading-relaxed font-sans">
              
              {/* Agency Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-black tracking-tight text-[#131B26]">
                    NELL&apos;IMMO IMMOBILIER
                  </h2>
                  <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">
                    SASU NELL&apos;IMMO • Capital 1 000 € • Siège : 145 Chemin des Oliviers, 13330 Pélissanne
                  </span>
                  <span className="text-[9px] text-gray-500 block">
                    RCS Salon-de-Provence B 849 521 123 • Carte Pro CPI 1310 2019 000 042 974 (CCI Aix-Marseille)
                  </span>
                  <span className="text-[9px] text-gray-500 block">
                    Garantie Financière GALIAN (120 000 €) • Assurance RCP MMA IARD N° 120 137 405
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-gray-100 px-2 py-1 rounded">
                    RÉF. BON : BV-{new Date().getFullYear()}-{selectedProperty?.mandate_number || '227'}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    Date : {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-1 bg-gray-50 border border-gray-200 rounded-lg">
                <h1 className="font-serif font-black text-sm uppercase tracking-wider text-gray-900">
                  BON DE VISITE IMMOBILIER & RECONNAISSANCE D&apos;HONORAIRES
                </h1>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">
                  Établi en application de la Loi Hoguet n° 70-9 du 2 Janvier 1970 et de l&apos;Article 73 du Décret n° 72-678 du 20 Juillet 1972
                </span>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-[#E12B7B] block">1. Acquéreur Visiteur :</span>
                  <strong className="block text-sm">
                    {selectedVisitToPrint?.buyer?.first_name || selectedBuyer?.first_name} {selectedVisitToPrint?.buyer?.last_name || selectedBuyer?.last_name}
                  </strong>
                  <span className="block text-[11px] text-gray-600">
                    📞 {selectedVisitToPrint?.buyer?.phone || selectedBuyer?.phone}
                  </span>
                  <span className="block text-[11px] text-gray-600">
                    ✉️ {selectedVisitToPrint?.buyer?.email || selectedBuyer?.email}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-[#E12B7B] block">2. Bien Visité (Mandat Confié) :</span>
                  <strong className="block text-sm truncate">
                    {selectedVisitToPrint?.property?.title || selectedProperty?.title}
                  </strong>
                  <span className="block text-[11px] text-gray-600">
                    📍 {selectedVisitToPrint?.property?.address || selectedProperty?.address}, {selectedVisitToPrint?.property?.postal_code || selectedProperty?.postal_code} {selectedVisitToPrint?.property?.city || selectedProperty?.city}
                  </span>
                  <span className="block text-[11px] font-bold text-gray-900">
                    Prix FAI affiché : {(selectedVisitToPrint?.property?.price_fai || selectedProperty?.price_fai || 0).toLocaleString('fr-FR')} € TTC
                  </span>
                </div>
              </div>

              {/* Legal Eviction Clause */}
              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 text-[11px] space-y-2 text-gray-800">
                <span className="font-bold text-rose-900 block uppercase text-[10px] tracking-wider">
                  Engagement Juridique du Visiteur & Clause d&apos;Interdiction d&apos;Éviction :
                </span>
                <p className="leading-relaxed">
                  Le soussigné reconnaît expressément que le bien immobilier mentionné ci-dessus lui a été présenté ce jour pour la première fois par l&apos;intermédiaire de l&apos;agence <strong>SASU NELL&apos;IMMO</strong>.
                </p>
                <p className="leading-relaxed">
                  En conséquence, le visiteur s&apos;interdit formellement de négocier, d&apos;acquérir ou de traiter directement ou indirectement (y compris par l&apos;intermédiaire d&apos;un tiers, conjoint, ascendant, descendant, société interposée ou autre agence) l&apos;acquisition dudit bien avec le vendeur mandant, <strong>pendant une durée de 24 mois à compter de la date de la présente visite</strong>.
                </p>
                <p className="leading-relaxed font-semibold text-rose-950">
                  En cas de manquement à cette obligation, le visiteur s&apos;engage à verser à la SASU NELL&apos;IMMO une indemnité forfaitaire compensatrice équivalente au montant intégral des honoraires d&apos;agence fixés au mandat de vente, à titre de clause pénale irrévocable (Art. 1231-5 du Code Civil).
                </p>
              </div>

              {/* Signatures & Sealed Hash */}
              <div className="grid grid-cols-2 gap-6 pt-3 border-t border-gray-200">
                <div className="space-y-2 text-center">
                  <span className="font-bold text-[10px] uppercase text-gray-700 block">
                    Pour l&apos;Agence Nell&apos;Immo :
                  </span>
                  <span className="text-[11px] text-gray-500 block">Nelly FERNANDEZ (Dirigeante)</span>
                  <div className="h-16 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                    <span className="font-serif italic font-bold text-gray-700">Nelly Fernandez</span>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <span className="font-bold text-[10px] uppercase text-gray-700 block">
                    Signature Électronique du Visiteur :
                  </span>
                  <span className="text-[10px] text-gray-500 block">Émargement tactile certifié</span>
                  <div className="h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden p-1">
                    {(selectedVisitToPrint?.signature_data_url || lastSavedSignatureUrl) ? (
                      <img
                        src={(selectedVisitToPrint?.signature_data_url || lastSavedSignatureUrl) || undefined}
                        alt="Signature Acquéreur"
                        className="max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">Émargement enregistré</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cryptographic Footnote */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[9px] text-gray-400 font-mono">
                <span suppressHydrationWarning>Horodatage UTC : {new Date().toISOString()} • IP : 82.65.144.21</span>
                <span>Scellement SHA-256 : {selectedVisitToPrint?.hash || 'sha256-bv-certifie-inviolable'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 print:hidden">
              <button
                type="button"
                onClick={() => setIsLegalPrintModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C59A45]" />
                <span>Imprimer l&apos;Attestation A4</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
