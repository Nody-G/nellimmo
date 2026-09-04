'use client';

import React from 'react';
import { Check, Save, Sparkles } from 'lucide-react';
import type { Property, AgencySettings } from '@/lib/types';
import { StudioHeader } from './StudioHeader';
import { SocialVisualCard } from './SocialVisualCard';

interface StudioPreviewProps {
  currentText: string;
  currentProperty: Property | undefined;
  selectedStyle: string;
  generationSource: 'deepseek' | 'local_template';
  generationMessage: string;
  isGenerating: boolean;
  copied: boolean;
  appliedToMandate: boolean;
  isPublishingSocial: boolean;
  settings: AgencySettings;
  onRegenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onWhatsApp: () => void;
  onPublishMeta: () => void;
  onTextChange: (value: string) => void;
  onApplyToProperty: () => void;
}

/** Right column: live generated preview with action buttons and text editor. */
export function StudioPreview({
  currentText,
  currentProperty,
  selectedStyle,
  generationSource,
  generationMessage,
  isGenerating,
  copied,
  appliedToMandate,
  isPublishingSocial,
  settings,
  onRegenerate,
  onCopy,
  onDownload,
  onWhatsApp,
  onPublishMeta,
  onTextChange,
  onApplyToProperty,
}: StudioPreviewProps) {
  const isSocialStyle =
    selectedStyle === 'reseaux_sociaux' || selectedStyle === 'script_video_reel';

  return (
    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xl space-y-6 sticky top-24">
      <StudioHeader
        selectedStyle={selectedStyle}
        generationSource={generationSource}
        isGenerating={isGenerating}
        copied={copied}
        isPublishingSocial={isPublishingSocial}
        isSocialStyle={isSocialStyle}
        onRegenerate={onRegenerate}
        onCopy={onCopy}
        onDownload={onDownload}
        onWhatsApp={onWhatsApp}
        onPublishMeta={onPublishMeta}
      />

      {generationMessage && (
        <div className="p-2.5 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{generationMessage}</span>
        </div>
      )}

      {isSocialStyle && currentProperty && (
        <SocialVisualCard property={currentProperty} settings={settings} style={selectedStyle} />
      )}

      {/* Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Éditeur plein format dynamique</span>
          <span className="font-bold text-[#E12B7B] bg-[#FDF2F8] px-2.5 py-0.5 rounded-full">
            {currentText.split('\n').length} ligne(s)
          </span>
        </div>
        <textarea
          rows={24}
          value={currentText}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full min-h-[480px] p-4 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl text-xs sm:text-sm font-sans text-gray-800 leading-relaxed focus:outline-[#E12B7B] resize-y shadow-inner"
          placeholder="Texte de l'annonce ou du script..."
        />
      </div>

      {/* Actions Bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-3 text-[11px]">
          <span>
            📊 <strong>{currentText.split(/\s+/).filter(Boolean).length}</strong> mots
          </span>
          <span>•</span>
          <span>
            <strong>{currentText.length}</strong> caractères
          </span>
        </div>

        <button
          onClick={onApplyToProperty}
          className="w-full sm:w-auto px-5 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          {appliedToMandate ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Appliqué à la fiche mandat !</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#C59A45]" />
              <span>Enregistrer dans la fiche du mandat</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
