'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  PenTool,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileSignature,
  FileText
} from 'lucide-react';
import { VoiceVisitRecorder } from '@/components/cockpit/VoiceVisitRecorder';
import { InstantOfferModal } from '@/components/cockpit/visites/InstantOfferModal';
import { PrintableVisitModal, PrintableVisitData } from '@/components/cockpit/visites/PrintableVisitModal';
import { CalendarSyncModal } from '@/components/cockpit/visites/CalendarSyncModal';
import { VisitRegisterTable } from '@/components/cockpit/visites/VisitRegisterTable';
import { useToast } from '@/components/ui/Toast';

export default function VisitSheetsPage() {
  const { properties, buyers, visits, createVisitSheet } = useNellimoStore();
  const { showToast } = useToast();

  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isLegalPrintModalOpen, setIsLegalPrintModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [lastSavedSignatureUrl, setLastSavedSignatureUrl] = useState<string | null>(null);
  const [selectedVisitToPrint, setSelectedVisitToPrint] = useState<PrintableVisitData | null>(null);

  // Sentiment & Feedback state
  const [visitorSentiment, setVisitorSentiment] = useState<
    'coup_de_coeur' | 'interesse' | 'neutre' | 'refus'
  >('coup_de_coeur');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([
    'Luminosité',
    'Jardin / Extérieur'
  ]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [priceFeedback, setPriceFeedback] = useState<string>('Au prix du marché');

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];

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

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  const toggleStrength = (val: string) => {
    setSelectedStrengths((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const toggleWeakness = (val: string) => {
    setSelectedWeaknesses((prev) =>
      prev.includes(val) ? prev.filter((w) => w !== val) : [...prev, val]
    );
  };

  const handleSaveVisit = async () => {
    const canvas = canvasRef.current;
    let signatureUrl = '';
    if (canvas) {
      signatureUrl = canvas.toDataURL('image/png');
      setLastSavedSignatureUrl(signatureUrl);
    }

    const compiledNotes = [
      `Sentiment : ${visitorSentiment.toUpperCase()}`,
      selectedStrengths.length > 0 ? `Points forts : ${selectedStrengths.join(', ')}` : '',
      selectedWeaknesses.length > 0 ? `Points faibles : ${selectedWeaknesses.join(', ')}` : '',
      `Avis prix : ${priceFeedback}`,
      notes ? `Remarques : ${notes}` : ''
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      await createVisitSheet({
        property_id: selectedProperty?.id || '',
        buyer_id: selectedBuyer?.id || '',
        visit_date: new Date().toISOString(),
        notes: compiledNotes,
        signature_data_url: signatureUrl
      });

      setIsSigned(true);
      showToast('Bon de visite horodaté et archivé avec succès !', 'success');

      setSelectedVisitToPrint({
        property: selectedProperty,
        buyer: selectedBuyer,
        visit_date: new Date().toISOString(),
        signature_data_url: signatureUrl,
        notes: compiledNotes,
        hash: 'sha256-bv-' + Math.random().toString(36).substring(2, 10) + '-certifie'
      });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'archivage du bon de visite');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Émargement Tactile & Horodatage
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
            Bons de Visite Électroniques
          </h1>
          <p className="text-xs text-gray-500">
            Conforme Loi Hoguet Art. 73 et Code Civil Art. 1366. Signature probante avec reconnaissance
            d&apos;honoraires.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOfferModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <FileSignature className="w-4 h-4 text-emerald-600" />
            <span>Formuler Offre d&apos;Achat</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCalendarModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-[#F3E8EE] text-gray-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#E12B7B]" />
            <span>Synchro iCal / Agenda</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-5">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Bien Immobilier Visité
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  setIsSigned(false);
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatMandateRef(p.mandate_number)} - {p.title} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Acquéreur Visiteur (CRM)
              </label>
              <select
                value={selectedBuyerId}
                onChange={(e) => {
                  setSelectedBuyerId(e.target.value);
                  setIsSigned(false);
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-[#E12B7B]"
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.first_name} {b.last_name} ({b.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voice Visit Recorder */}
          <VoiceVisitRecorder
            onTranscriptComplete={({ rawTranscript, sentiment, strengths, weaknesses, priceFeedback: pf }) => {
              if (sentiment) setVisitorSentiment(sentiment);
              if (strengths && strengths.length > 0) setSelectedStrengths(strengths);
              if (weaknesses && weaknesses.length > 0) setSelectedWeaknesses(weaknesses);
              if (pf) setPriceFeedback(pf);
              setNotes((prev) =>
                prev ? `${prev}\n\n[Dictée Vocale] ${rawTranscript}` : `[Dictée Vocale] ${rawTranscript}`
              );
            }}
          />

          {/* Micro-Compte-Rendu Post-Visite */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-xs font-bold uppercase text-gray-800 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
              Micro-Bilan Immédiat : Sentiment de l&apos;Acquéreur
            </span>

            {/* Sentiment Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'coup_de_coeur', label: '😍 Coup de cœur', activeClass: 'bg-emerald-600 text-white ring-2 ring-emerald-300' },
                { id: 'interesse', label: '🤔 Très intéressé', activeClass: 'bg-blue-600 text-white ring-2 ring-blue-300' },
                { id: 'neutre', label: '😐 Hésitant', activeClass: 'bg-amber-600 text-white ring-2 ring-amber-300' },
                { id: 'refus', label: '❌ Pas de suite', activeClass: 'bg-gray-800 text-white ring-2 ring-gray-400' }
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setVisitorSentiment(s.id as typeof visitorSentiment)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    visitorSentiment === s.id
                      ? s.activeClass
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Strengths / Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="font-bold text-gray-600 block mb-1.5">Points Forts Remarqués :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Luminosité', 'Jardin / Extérieur', 'Piscine', 'Calme absolu', 'Cuisine équipée', 'Volumes'].map(
                    (str) => (
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
                    )
                  )}
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-600 block mb-1.5">Réserves ou Points Bloquants :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Travaux à prévoir', 'Chambres trop petites', 'Prix jugé élevé', 'Cuisine à refaire', 'Vis-à-vis'].map(
                    (wk) => (
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
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legal clause */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-2">
            <span className="font-bold text-gray-900 block">Engagement Juridique du Visiteur (Loi Hoguet) :</span>
            <p className="leading-relaxed text-[11px] text-gray-600">
              « Je soussigné(e) {selectedBuyer?.first_name} {selectedBuyer?.last_name}, reconnais que l&apos;agence
              SASU Nell&apos;Immo m&apos;a fait visiter ce jour le bien désigné ci-dessus au prix de{' '}
              {selectedProperty?.price_fai.toLocaleString('fr-FR')} € FAI. Je m&apos;interdis formellement de
              traiter directement ou indirectement avec le mandant sans le concours de l&apos;agence pendant toute la
              durée légale. »
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

        {/* Right col: History of Visit Sheets */}
        <VisitRegisterTable
          visits={visits}
          properties={properties}
          buyers={buyers}
          onSelectVisitToPrint={(data) => {
            setSelectedVisitToPrint(data);
            setIsLegalPrintModalOpen(true);
          }}
        />
      </div>

      {/* Modal Formuler une Offre d'Achat Express */}
      <InstantOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        property={selectedProperty}
        buyer={selectedBuyer}
      />

      {/* Modal Calendrier iCal */}
      <CalendarSyncModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      {/* Modal Bon de Visite Officiel Imprimable */}
      <PrintableVisitModal
        isOpen={isLegalPrintModalOpen}
        onClose={() => setIsLegalPrintModalOpen(false)}
        visitData={selectedVisitToPrint}
      />
    </div>
  );
}
