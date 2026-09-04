'use client';

import React from 'react';
import { FileText, Sparkles, Globe, Wand2 } from 'lucide-react';

interface MediaDescriptionSectionProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  onGenerateAiDescription: (mode: 'portail' | 'luxe' | 'social' | 'bullet') => void;
  isAiGenerating: boolean;
}

export const MediaDescriptionSection: React.FC<MediaDescriptionSectionProps> = ({
  description,
  onDescriptionChange,
  onGenerateAiDescription,
  isAiGenerating
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <label className="text-xs font-bold text-gray-700">
          Texte de présentation de l&apos;annonce *
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Générateur IA :
          </span>
          {[
            { id: 'portail', label: 'Portails', icon: <FileText className="w-3 h-3" /> },
            { id: 'luxe', label: 'Prestige', icon: <Sparkles className="w-3 h-3" /> },
            { id: 'social', label: 'Réseaux', icon: <Globe className="w-3 h-3" /> },
            { id: 'bullet', label: 'Synthèse', icon: <Wand2 className="w-3 h-3" /> }
          ].map((m) => (
            <button
              type="button"
              key={m.id}
              disabled={isAiGenerating}
              onClick={() => onGenerateAiDescription(m.id as 'portail' | 'luxe' | 'social' | 'bullet')}
              className="px-2.5 py-1 bg-[#FAF5F8] hover:bg-[#FDF2F8] border border-[#F3E8EE] hover:border-[#E12B7B]/40 text-[#131B26] hover:text-[#E12B7B] rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        rows={6}
        required
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-[#E12B7B] leading-relaxed"
      />
    </div>
  );
};
