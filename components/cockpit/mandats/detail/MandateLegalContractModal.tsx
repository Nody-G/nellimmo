'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { MandateContractArticles, MandateContractSignatures, MandateHamonWithdrawalSlip } from './contract';

interface MandateLegalContractModalProps {
  property: Property;
  onClose: () => void;
}

export const MandateLegalContractModal: React.FC<MandateLegalContractModalProps> = ({
  property,
  onClose,
}) => {
  const { settings } = useNellimoStore();
  const { showToast } = useToast();

  const [mandateType, setMandateType] = useState<'exclusif' | 'simple'>(
    property.mandate_type === 'exclusif' ? 'exclusif' : 'simple'
  );

  const mandateRef = formatMandateRef(property.mandate_number);
  const startDateFormatted = new Date(property.mandate_date).toLocaleDateString('fr-FR');
  const endDateFormatted = new Date(property.mandate_end_date).toLocaleDateString('fr-FR');

  const handlePrint = () => {
    window.print();
    showToast('Document envoyé à l’impression.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-gray-200 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-[#FCFAF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#131B26] text-white flex items-center justify-center font-serif font-black text-lg">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E12B7B]">
                  Contrat Juridique Officiel
                </span>
                <span className="text-[10px] font-mono font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {mandateRef}
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#131B26]">
                Mandat de Vente Immobilier — Loi Hoguet & ALUR
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C59A45]" />
              <span className="hidden sm:inline">Imprimer / PDF (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / Type Toggle */}
        <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Régime juridique :</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setMandateType('exclusif')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  mandateType === 'exclusif'
                    ? 'bg-[#E12B7B] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mandat Exclusif
              </button>
              <button
                onClick={() => setMandateType('simple')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  mandateType === 'simple'
                    ? 'bg-[#131B26] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mandat Simple
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conforme décret n° 72-678 du 20 juillet 1972 & Loi ALUR</span>
          </div>
        </div>

        {/* Scrollable Printable A4 Contract Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-gray-100 flex justify-center">
          <div className="bg-white max-w-[780px] w-full p-8 sm:p-12 shadow-lg border border-gray-300 font-sans text-gray-900 text-xs leading-relaxed space-y-6 print:shadow-none print:border-none print:p-0 print:m-0">
            {/* Header / Titre Officiel */}
            <div className="text-center border-b-2 border-gray-900 pb-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59A45] block">
                RÉPUBLIQUE FRANÇAISE • LOI N° 70-9 DU 2 JANVIER 1970
              </span>
              <h1 className="text-xl font-serif font-black uppercase text-[#131B26] tracking-tight">
                MANDAT DE VENTE {mandateType === 'exclusif' ? 'EXCLUSIF' : 'SIMPLE'} SANS MANIEMENT DE FONDS
              </h1>
              <p className="text-[11px] font-semibold text-gray-600">
                Inscrit au Registre Spécial des Mandats sous le Numéro :{' '}
                <strong className="text-black font-mono font-black">{mandateRef}</strong>
              </p>
            </div>

            <MandateContractArticles
              property={property}
              mandateType={mandateType}
              settings={settings}
              mandateRef={mandateRef}
              startDateFormatted={startDateFormatted}
              endDateFormatted={endDateFormatted}
            />

            <MandateContractSignatures
              property={property}
              settings={settings}
              mandateRef={mandateRef}
              startDateFormatted={startDateFormatted}
            />

            {/* Bordereau de Rétractation 14 Jours Loi Hamon */}
            <MandateHamonWithdrawalSlip
              property={property}
              settings={settings}
              mandateRef={mandateRef}
              startDateFormatted={startDateFormatted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
