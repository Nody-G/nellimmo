'use client';

import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { parseListingText } from './pige-import';
import type { NewLeadFormState } from './pige-types';

interface AssistedPigeInputProps {
  onApplyPatch: (patch: Partial<NewLeadFormState>) => void;
}

export const AssistedPigeInput: React.FC<AssistedPigeInputProps> = ({ onApplyPatch }) => {
  const [pastedText, setPastedText] = useState('');
  const [assistMessage, setAssistMessage] = useState<string | null>(null);

  const handleAssistFill = () => {
    if (!pastedText.trim()) {
      setAssistMessage('Collez d’abord le texte ou le lien de l’annonce.');
      return;
    }
    const patch = parseListingText(pastedText);
    onApplyPatch(patch);
    setAssistMessage('Formulaire pré-rempli automatiquement — vérifiez puis complétez si besoin.');
  };

  return (
    <div className="p-3.5 bg-[#FCFAF7] border border-[#F3E8EE] rounded-2xl space-y-2">
      <label className="block font-bold uppercase text-gray-700 text-[11px]">
        Saisie assistée — coller l’annonce (texte ou URL)
      </label>
      <textarea
        rows={2}
        placeholder='Ex: "Villa 120m² à Pélissanne, 420 000 €, M. Bernard 06 12 34 56 78, https://www.leboncoin.fr/..."'
        value={pastedText}
        onChange={(e) => {
          setPastedText(e.target.value);
          setAssistMessage(null);
        }}
        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B]"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleAssistFill}
          className="px-3 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5 text-[#C59A45]" />
          Remplir automatiquement
        </button>
        {assistMessage && <span className="text-[10px] text-emerald-700">{assistMessage}</span>}
      </div>
    </div>
  );
};
