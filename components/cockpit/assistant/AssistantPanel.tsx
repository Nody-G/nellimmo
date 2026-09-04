'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { QualificationResult } from '@/lib/assistant';
import { QualificationForm, QualificationResultCard } from './chat';

interface AssistantPanelProps {
  /** Nom du prospect pré-rempli (optionnel). */
  initialName?: string;
  /** Message du prospect pré-rempli (optionnel). */
  initialMessage?: string;
}

export function AssistantPanel({ initialName, initialMessage }: AssistantPanelProps) {
  const [name, setName] = useState(initialName || '');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [message, setMessage] = useState(initialMessage || '');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'contact',
          name: name.trim() || undefined,
          city: city.trim() || undefined,
          propertyType: propertyType.trim() || undefined,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Erreur lors de la qualification du lead.');
        return;
      }
      setResult(data.result as QualificationResult);
    } catch {
      setError("Impossible de contacter l'assistant. Vérifiez votre connexion.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E12B7B]" />
          <CardTitle className="text-sm">Assistant IA — Qualification des Leads Entrants</CardTitle>
        </div>
        <p className="text-xs text-gray-500">
          Collez le message d&apos;un prospect reçu (contact, estimation) : l&apos;assistant le qualifie et rédige une réponse à votre plume.
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <QualificationForm
          name={name}
          setName={setName}
          city={city}
          setCity={setCity}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          message={message}
          setMessage={setMessage}
          busy={busy}
          resultSource={result?.source}
          onSubmit={handleAnalyze}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        {result && <QualificationResultCard result={result} />}
      </CardContent>
    </Card>
  );
}
