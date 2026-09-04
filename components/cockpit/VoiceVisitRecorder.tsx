'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  analyzeVisitTranscript,
  DEMO_VISIT_TRANSCRIPT,
  VisitAnalysisResult,
} from '@/lib/voice-visit-analysis';
import { useSpeechRecognition, VoiceAnalysisPreview } from './voice';

interface VoiceVisitRecorderProps {
  onTranscriptComplete: (data: {
    rawTranscript: string;
    sentiment: VisitAnalysisResult['sentiment'];
    strengths: string[];
    weaknesses: string[];
    priceFeedback: string;
  }) => void;
}

export function VoiceVisitRecorder({ onTranscriptComplete }: VoiceVisitRecorderProps) {
  const {
    isRecording,
    transcript,
    setTranscript,
    hasRecognitionSupport,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const [analysisResult, setAnalysisResult] = useState<VisitAnalysisResult | null>(null);

  const handleProcessText = (text: string) => {
    const result = analyzeVisitTranscript(text);
    setAnalysisResult(result);
    onTranscriptComplete({
      rawTranscript: text,
      ...result,
    });
  };

  const simulateVoiceInput = () => {
    setTranscript(DEMO_VISIT_TRANSCRIPT);
    handleProcessText(DEMO_VISIT_TRANSCRIPT);
  };

  const toggleRecording = () => {
    if (!hasRecognitionSupport) {
      simulateVoiceInput();
      return;
    }

    if (isRecording) {
      stopListening();
      handleProcessText(transcript);
    } else {
      setTranscript('');
      setAnalysisResult(null);
      const ok = startListening();
      if (!ok) {
        simulateVoiceInput();
      }
    }
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
            <VoiceAnalysisPreview analysisResult={analysisResult} />
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
            className="text-[10px] text-[#C59A45] underline font-bold hover:text-white shrink-0 ml-2 cursor-pointer"
          >
            Tester un exemple
          </button>
        </div>
      )}
    </div>
  );
}
