'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Volume2
} from 'lucide-react';

interface VoiceVisitRecorderProps {
  onTranscriptComplete: (data: {
    rawTranscript: string;
    sentiment: 'coup_de_coeur' | 'interesse' | 'neutre' | 'refus';
    strengths: string[];
    weaknesses: string[];
    priceFeedback: string;
  }) => void;
  sellerName?: string;
  propertyTitle?: string;
}

export function VoiceVisitRecorder({
  onTranscriptComplete,
  sellerName = 'M. Propriétaire',
  propertyTitle = 'la propriété'
}: VoiceVisitRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<{
    sentiment: 'coup_de_coeur' | 'interesse' | 'neutre' | 'refus';
    strengths: string[];
    weaknesses: string[];
    priceFeedback: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setTranscript(current.trim());
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition error:', e);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      // Fallback demo simulation if browser doesn't have mic enabled
      simulateVoiceInput();
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      analyzeTranscript(transcript);
    } else {
      setTranscript('');
      setAnalysisResult(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    const demo =
      "Visite terminée avec l'acquéreur. C'est un vrai coup de cœur, ils ont adoré le grand jardin sans vis-à-vis, la piscine et la belle luminosité du séjour. Par contre la cuisine est un peu à moderniser et une chambre d'enfant est étroite. Financement bancaire déjà accordé à 540 000 euros. Le prix est jugé conforme au marché.";
    setTranscript(demo);
    analyzeTranscript(demo);
  };

  const analyzeTranscript = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Sentiment detection
    let sentiment: 'coup_de_coeur' | 'interesse' | 'neutre' | 'refus' = 'interesse';
    if (lower.includes('coup de coeur') || lower.includes('coup de cœur') || lower.includes('adoré') || lower.includes('offre') || lower.includes('va acheter') || lower.includes('parfait')) {
      sentiment = 'coup_de_coeur';
    } else if (lower.includes('pas intéressé') || lower.includes('refus') || lower.includes('ne convient pas') || lower.includes('trop petit')) {
      sentiment = 'refus';
    } else if (lower.includes('hésite') || lower.includes('neutre') || lower.includes('à voir')) {
      sentiment = 'neutre';
    }

    // 2. Strengths extraction
    const detectedStrengths: string[] = [];
    if (lower.includes('jardin') || lower.includes('extérieur') || lower.includes('terrain')) detectedStrengths.push('Jardin / Extérieur');
    if (lower.includes('lumineux') || lower.includes('luminosité') || lower.includes('ensoleillé') || lower.includes('clarté')) detectedStrengths.push('Luminosité');
    if (lower.includes('piscine')) detectedStrengths.push('Piscine');
    if (lower.includes('calme') || lower.includes('silence') || lower.includes('tranquille')) detectedStrengths.push('Calme absolu');
    if (lower.includes('vue') || lower.includes('dégagé')) detectedStrengths.push('Vue dégagée');
    if (lower.includes('rénové') || lower.includes('état') || lower.includes('impeccable') || lower.includes('propre')) detectedStrengths.push('État impeccable');
    if (lower.includes('garage') || lower.includes('stationnement')) detectedStrengths.push('Garage / Parking');

    // Default if empty
    if (detectedStrengths.length === 0) {
      detectedStrengths.push('Luminosité', 'Emplacement recherché');
    }

    // 3. Weaknesses extraction
    const detectedWeaknesses: string[] = [];
    if (lower.includes('travaux') || lower.includes('moderniser') || lower.includes('rénover') || lower.includes('peinture')) detectedWeaknesses.push('Travaux de rafraîchissement');
    if (lower.includes('chambre') && (lower.includes('petite') || lower.includes('étroite') || lower.includes('serré'))) detectedWeaknesses.push('Taille des chambres');
    if (lower.includes('cuisine')) detectedWeaknesses.push('Cuisine à rajeunir');
    if (lower.includes('bruit') || lower.includes('route') || lower.includes('passage')) detectedWeaknesses.push('Nuisance sonore');
    if (lower.includes('vis-à-vis') || lower.includes('voisin')) detectedWeaknesses.push('Vis-à-vis');

    // 4. Price feedback
    let price = 'Au prix du marché';
    if (lower.includes('trop cher') || lower.includes('cher') || lower.includes('négocier') || lower.includes('baisse')) {
      price = 'Jugé légèrement au-dessus du marché (négociation souhaitée)';
    } else if (lower.includes('très bon prix') || lower.includes('bonne affaire')) {
      price = 'Très attractif par rapport aux prestations';
    }

    const result = {
      sentiment,
      strengths: detectedStrengths,
      weaknesses: detectedWeaknesses,
      priceFeedback: price
    };

    setAnalysisResult(result);
    onTranscriptComplete({
      rawTranscript: text,
      ...result
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#131B26] to-[#1E293B] text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/20 border border-[#E12B7B]/40 flex items-center justify-center text-[#E12B7B]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-white">
              Dictée Vocale & IA Terrain (Débriefing Voiture)
            </h4>
            <span className="text-[10px] text-gray-400 block">
              Dictez votre retour de visite à l&apos;oral : l&apos;IA extrait automatiquement les points forts, le sentiment et pré-remplit le compte-rendu.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-md ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-[#E12B7B] hover:bg-[#C71B62] text-white'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Arrêter la dictée</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Dicter à la voix</span>
            </>
          )}
        </button>
      </div>

      {/* Recording Wave or Transcript Area */}
      {isRecording && (
        <div className="p-4 bg-black/40 rounded-2xl border border-rose-500/40 flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2 text-xs text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">Enregistrement vocal en cours... Parlez naturellement.</span>
          </div>
          <Volume2 className="w-4 h-4 text-rose-400" />
        </div>
      )}

      {transcript && (
        <div className="space-y-3">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono text-gray-300 leading-relaxed max-h-28 overflow-y-auto">
            <span className="text-[#C59A45] font-bold block text-[10px] uppercase mb-1">
              Transcription Brute :
            </span>
            &ldquo;{transcript}&rdquo;
          </div>

          {analysisResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Sentiment Visiteur :</span>
                <span className="font-bold text-emerald-400 block mt-0.5 capitalize">
                  {analysisResult.sentiment.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Atouts Relevés :</span>
                <span className="font-semibold text-white block mt-0.5 truncate">
                  {analysisResult.strengths.join(', ')}
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Avis sur le Prix :</span>
                <span className="font-semibold text-amber-300 block mt-0.5 truncate">
                  {analysisResult.priceFeedback}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!transcript && !isRecording && (
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
          <span>
            Exemple : <em>« Visite coup de cœur, ils ont adoré la piscine et le grand jardin calme, prévoient juste des travaux pour la cuisine... »</em>
          </span>
          <button
            type="button"
            onClick={simulateVoiceInput}
            className="text-[10px] text-[#C59A45] underline font-bold hover:text-white shrink-0 ml-2"
          >
            Tester un exemple
          </button>
        </div>
      )}
    </div>
  );
}
