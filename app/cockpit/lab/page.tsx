'use client';

import React, { useState } from 'react';
import { useNellimoStore } from '@/lib/store';
import {
  LAB_PRESETS,
  generateLabFallbackOutput,
  type LabMode,
  type LabPreset,
  LabHeader,
  LabPresetsGrid,
  LabConsole,
} from '@/components/cockpit/lab';

export default function InfiniteLabPage() {
  const { properties } = useNellimoStore();

  const [activeMode, setActiveMode] = useState<LabMode>('ideation');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [userPrompt, setUserPrompt] = useState<string>(LAB_PRESETS[0].prompt);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const handleSelectMode = (mode: LabMode) => {
    setActiveMode(mode);
    const firstPresetForMode = LAB_PRESETS.find((p) => p.mode === mode);
    if (firstPresetForMode) {
      setUserPrompt(firstPresetForMode.prompt);
    }
  };

  const handleApplyPreset = (preset: LabPreset) => {
    setActiveMode(preset.mode);
    setUserPrompt(preset.prompt);
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    setGeneratedOutput('');

    try {
      const res = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: currentProperty,
          style: 'mode_libre',
          customNotes: `LAB NELL'IMMO - Mode: ${activeMode}. Consigne: ${userPrompt}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setGeneratedOutput(data.text);
        setIsProcessing(false);
        return;
      }

      // Local heuristic simulation engine if API key not configured
      await new Promise((r) => setTimeout(r, 600));
      setGeneratedOutput(generateLabFallbackOutput(activeMode, currentProperty));
    } catch (e) {
      console.error(e);
      setGeneratedOutput('Erreur lors de la génération. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relevantPresets = LAB_PRESETS.filter((p) => p.mode === activeMode);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header with Workshop Mode Selector */}
      <LabHeader activeMode={activeMode} onSelectMode={handleSelectMode} />

      {/* Quick Inspiration Presets */}
      <LabPresetsGrid presets={relevantPresets} onApplyPreset={handleApplyPreset} />

      {/* Main Console & Output Terminal */}
      <LabConsole
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onSelectPropertyId={setSelectedPropertyId}
        currentProperty={currentProperty}
        activeMode={activeMode}
        userPrompt={userPrompt}
        onChangeUserPrompt={setUserPrompt}
        onGenerate={handleGenerate}
        isProcessing={isProcessing}
        generatedOutput={generatedOutput}
        copied={copied}
        onCopy={copyToClipboard}
      />
    </div>
  );
}
