'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import {
  generateListingCopy,
  CopywritingStyle,
  STYLE_TEMPLATES
} from '@/lib/copywriting';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MandateCopywritingTabProps {
  property: Property;
  onApplyDescription: (newDesc: string) => Promise<void>;
}

export const MandateCopywritingTab: React.FC<MandateCopywritingTabProps> = ({
  property,
  onApplyDescription
}) => {
  const [selectedStyle, setSelectedStyle] = useState<CopywritingStyle>('signature_nelly');
  const [copyNotes, setCopyNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const generatedText = generateListingCopy(property, selectedStyle, copyNotes);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = async () => {
    await onApplyDescription(generatedText);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#131B26] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E12B7B]" />
            <span>Studio de Rédaction & Copywriting Multi-Styles</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            5 tonalités éditoriales taillées sur mesure pour la diffusion portails, prestige et réseaux sociaux.
          </p>
        </div>
      </div>

      {/* Style selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STYLE_TEMPLATES.map((template) => (
          <button
            type="button"
            key={template.id}
            onClick={() => setSelectedStyle(template.id)}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${selectedStyle === template.id
                ? 'border-[#E12B7B] bg-[#FDF2F8] text-[#E12B7B] ring-2 ring-[#E12B7B]/20 font-bold'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold'
              }`}
          >
            <span className="block text-xs">{template.label}</span>
            <span className="block text-[10px] text-gray-500 font-normal mt-0.5 line-clamp-1">
              {template.description}
            </span>
          </button>
        ))}
      </div>

      {/* Additional instructions */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1">
          Instructions ou précisions contextuelles (optionnel) :
        </label>
        <input
          type="text"
          placeholder="Ex: Insister sur la vue dégagée Sainte-Victoire et la proximité écoles..."
          value={copyNotes}
          onChange={(e) => setCopyNotes(e.target.value)}
          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
        />
      </div>

      {/* Output card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-xs font-bold text-gray-800">
            Texte généré ({STYLE_TEMPLATES.find((t) => t.id === selectedStyle)?.label || selectedStyle})
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copié !' : 'Copier'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              leftIcon={applied ? <Check className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
            >
              {applied ? 'Appliqué au mandat !' : 'Appliquer au mandat'}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-800 whitespace-pre-line leading-relaxed font-sans max-h-96 overflow-y-auto">
          {generatedText}
        </div>
      </Card>
    </div>
  );
};
