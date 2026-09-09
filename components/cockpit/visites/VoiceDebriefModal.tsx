'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Send, Copy, Sparkles, Check } from 'lucide-react';
import { useNellimoStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import { useSpeechRecognition } from '@/components/cockpit/voice/useSpeechRecognition';
import type { VisitorSentiment } from '@/components/cockpit/visites/visites-types';
import { generateVendorDebriefWhatsApp, buildWhatsAppLink } from './voice-debrief-helpers';

interface VoiceDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPropertyId?: string;
}

export function VoiceDebriefModal({ isOpen, onClose, initialPropertyId }: VoiceDebriefModalProps) {
  const { properties, buyers, createVisitSheet } = useNellimoStore();
  const { showToast } = useToast();
  const { isRecording, transcript, startListening, stopListening, hasRecognitionSupport } =
    useSpeechRecognition();

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [sentiment, setSentiment] = useState<VisitorSentiment>('interesse');
  const [notes, setNotes] = useState('');
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

  const activeProperties = properties.filter((p) => p.status === 'actif');
  const effectivePropertyId = selectedPropertyId || initialPropertyId || activeProperties[0]?.id || '';
  const currentProperty = properties.find((p) => p.id === effectivePropertyId) || activeProperties[0];

  const handleToggleListening = () => {
    if (isRecording) {
      stopListening();
      if (transcript) {
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    } else {
      startListening();
    }
  };

  const activeNotes = isRecording && transcript ? (notes ? `${notes} ${transcript}` : transcript) : notes;

  const vendorMessage = generateVendorDebriefWhatsApp(currentProperty, {
    propertyId: currentProperty?.id || '',
    buyerName,
    buyerPhone: '',
    sentiment,
    strengths: activeNotes.slice(0, 120),
    objections: '',
    rawNotes: activeNotes,
  });

  const handleCopyVendorMessage = async () => {
    try {
      await navigator.clipboard.writeText(vendorMessage);
      setCopied(true);
      showToast('Message vendeur copié ! Prêt à coller dans WhatsApp.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Presse-papier inaccessible', 'error');
    }
  };

  const handleSaveVisit = async () => {
    if (!currentProperty) {
      showToast('Sélectionnez un bien à débriefer.', 'error');
      return;
    }
    await createVisitSheet({
      property_id: currentProperty.id,
      buyer_id: buyers[0]?.id || '',
      signature_data_url: '',
      visit_date: new Date().toISOString(),
      notes: `[Débrief Vocal] Visiteur: ${buyerName || 'Non précisé'} | Sentiment: ${sentiment}. Notes: ${notes}`,
    });
    showToast('Compte-rendu de visite archivé avec succès.', 'success');
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#E12B7B] flex items-center justify-center shadow-xs">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Débriefing Vocal Immédiat</h3>
                <p className="text-xs text-gray-500">Dictez en sortie de visite • Génère le WhatsApp propriétaire</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 pt-4">
            {/* Property and Buyer row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Bien visité</label>
                <select
                  value={selectedPropertyId || currentProperty?.id}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:bg-white"
                >
                  {activeProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.city})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Visiteur / Acquéreur</label>
                <input
                  type="text"
                  placeholder="Ex: M. & Mme Blanc"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Sentiment chips */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">Ressenti de la visite</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'coup_de_coeur', label: '😍 Coup de cœur' },
                  { id: 'interesse', label: '🤔 Intéressé' },
                  { id: 'neutre', label: '😐 Hésitant' },
                  { id: 'refus', label: '❌ Pas de suite' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSentiment(s.id as VisitorSentiment)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition border ${
                      sentiment === s.id
                        ? 'bg-[#E12B7B] text-white border-[#E12B7B] shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice dictation area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase text-gray-500">Notes dictées ou saisies</label>
                {hasRecognitionSupport && (
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-rose-50 text-[#E12B7B] hover:bg-rose-100'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isRecording ? 'Arrêter la dictée' : 'Dicter au micro'}
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={activeNotes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Belle luminosité, jardin validé. Question posée sur la taxe foncière..."
                className="w-full text-xs rounded-2xl border border-gray-200 p-3 bg-gray-50 focus:bg-white focus:outline-[#E12B7B]"
              />
            </div>

            {/* Generated WhatsApp message preview */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Message WhatsApp Vendeur ({currentProperty?.seller_name || 'Propriétaire'})
                </span>
                <button
                  type="button"
                  onClick={handleCopyVendorMessage}
                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
              <p className="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed max-h-28 overflow-y-auto font-sans bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                {vendorMessage}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2">
              {currentProperty?.seller_phone && (
                <a
                  href={buildWhatsAppLink(currentProperty.seller_phone, vendorMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ouvrir WhatsApp Vendeur
                </a>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveVisit}
                  className="px-4 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Archiver le Débrief
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
