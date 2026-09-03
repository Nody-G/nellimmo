'use client';

import React, { useState } from 'react';
import { Wand2, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface FastFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessText: (text: string) => void;
  isSuccess: boolean;
}

const SAMPLE_DEMO_TEXT = `EXCLUSIVITÉ PÉLISSANNE (13330)
Superbe villa contemporaine T5 de 145m² habitables sur parcelle arborée de 850m² avec piscine traditionnelle.
Salon séjour lumineux de 52m² avec cuisine américaine haut de gamme équipée, 4 chambres dont une suite parentale au rez-de-chaussée, 2 salles d'eau.
Garage carrelé de 25m², climatisation réversible gainable, terrasse couverte exposée Sud.
Prix de vente : 520 000 € honoraires agence inclus.
DPE : Classe B (78 kWh/m²/an) - GES : A (2 kg CO2/m²/an).
Contactez Nelly Fernandez au 07 55 68 61 09.`;

export const FastFillModal: React.FC<FastFillModalProps> = ({
  isOpen,
  onClose,
  onProcessText,
  isSuccess
}) => {
  const [inputText, setInputText] = useState('');

  const handleApply = (textToApply: string) => {
    onProcessText(textToApply);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FDF2F8] text-[#E12B7B] rounded-xl">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Remplissage Express Intelligent
            </h3>
            <p className="text-xs text-gray-500">
              Collez le texte d&apos;une annonce, un email ou des notes de visite.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">
            Texte brut à analyser (Prix, Surface, Pièces, Commune, DPE...) :
          </label>
          <textarea
            rows={7}
            placeholder="Collez ici le texte brut..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-[#E12B7B] font-mono leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setInputText(SAMPLE_DEMO_TEXT);
              handleApply(SAMPLE_DEMO_TEXT);
            }}
            className="text-xs text-[#E12B7B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            ⚡ Tester avec une annonce exemple (Villa Pélissanne)
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!inputText.trim()}
              onClick={() => handleApply(inputText)}
              leftIcon={
                isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )
              }
            >
              {isSuccess ? 'Extraction réussie !' : 'Analyser & Remplir'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
