'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';

interface ISpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function checkSpeechRecognitionSupport(): boolean {
  if (typeof window === 'undefined') return false;
  const windowWithSpeech = window as unknown as {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  };
  return Boolean(windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition);
}

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const hasRecognitionSupport = useSyncExternalStore(
    () => () => {},
    checkSpeechRecognitionSupport,
    () => false
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => ISpeechRecognition;
        webkitSpeechRecognition?: new () => ISpeechRecognition;
      };
      const SpeechRecognitionClass =
        windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const rec = new SpeechRecognitionClass();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event: ISpeechRecognitionEvent) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setTranscript(current.trim());
        };

        rec.onerror = (e: unknown) => {
          console.warn('Speech recognition error:', e);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return false;
    try {
      recognitionRef.current.start();
      setIsRecording(true);
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      return false;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return {
    isRecording,
    transcript,
    setTranscript,
    hasRecognitionSupport,
    startListening,
    stopListening,
  };
}
