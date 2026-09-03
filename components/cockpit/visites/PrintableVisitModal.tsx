'use client';

import React from 'react';
import Image from 'next/image';
import { Property, Buyer } from '@/lib/types';
import { ShieldCheck, Printer, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface PrintableVisitData {
  property?: Property;
  buyer?: Buyer;
  visit_date: string;
  signature_data_url: string;
  notes?: string;
  hash: string;
}

interface PrintableVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitData: PrintableVisitData | null;
}

export const PrintableVisitModal: React.FC<PrintableVisitModalProps> = ({
  isOpen,
  onClose,
  visitData
}) => {
  if (!visitData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#E12B7B]" />
          <span>Attestation Officielle de Bon de Visite (Loi Hoguet Art. 73)</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Print Container */}
        <div id="printable-bon-de-visite" className="bg-white p-6 sm:p-8 border-2 border-gray-300 rounded-2xl space-y-6 text-xs text-gray-900 leading-relaxed font-sans">
          {/* Agency Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
            <div>
              <h2 className="text-lg font-serif font-black tracking-tight text-[#131B26]">
                NELL&apos;IMMO IMMOBILIER
              </h2>
              <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">
                SASU NELL&apos;IMMO • Capital 1 000 € • Siège : 145 Chemin des Oliviers, 13330 Pélissanne
              </span>
              <span className="text-[9px] text-gray-500 block">
                RCS Salon-de-Provence B 849 521 123 • Carte Pro CPI 1310 2019 000 042 974 (CCI Aix-Marseille)
              </span>
              <span className="text-[9px] text-gray-500 block">
                Garantie Financière GALIAN (120 000 €) • Assurance RCP MMA IARD N° 120 137 405
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold bg-gray-100 px-2 py-1 rounded">
                RÉF. BON : BV-{new Date().getFullYear()}-{visitData.property?.mandate_number || '227'}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Date : {new Date(visitData.visit_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-1 bg-gray-50 border border-gray-200 rounded-lg">
            <h1 className="font-serif font-black text-sm uppercase tracking-wider text-gray-900">
              BON DE VISITE IMMOBILIER & RECONNAISSANCE D&apos;HONORAIRES
            </h1>
            <span className="text-[9px] text-gray-500 uppercase font-semibold">
              Établi en application de la Loi Hoguet n° 70-9 du 2 Janvier 1970 et de l&apos;Article 73 du Décret n° 72-678 du 20 Juillet 1972
            </span>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <span className="font-bold text-[10px] uppercase text-[#E12B7B] block">1. Acquéreur Visiteur :</span>
              <strong className="block text-sm">
                {visitData.buyer?.first_name} {visitData.buyer?.last_name}
              </strong>
              <span className="block text-[11px] text-gray-600">
                📞 {visitData.buyer?.phone}
              </span>
              <span className="block text-[11px] text-gray-600">
                ✉️ {visitData.buyer?.email}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <span className="font-bold text-[10px] uppercase text-[#E12B7B] block">2. Bien Visité (Mandat Confié) :</span>
              <strong className="block text-sm truncate">
                {visitData.property?.title}
              </strong>
              <span className="block text-[11px] text-gray-600">
                📍 {visitData.property?.address}, {visitData.property?.postal_code} {visitData.property?.city}
              </span>
              <span className="block text-[11px] font-bold text-gray-900">
                Prix FAI affiché : {(visitData.property?.price_fai || 0).toLocaleString('fr-FR')} € TTC
              </span>
            </div>
          </div>

          {/* Legal Eviction Clause */}
          <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 text-[11px] space-y-2 text-gray-800">
            <span className="font-bold text-rose-900 block uppercase text-[10px] tracking-wider">
              Engagement Juridique du Visiteur & Clause d&apos;Interdiction d&apos;Éviction :
            </span>
            <p className="leading-relaxed">
              Le soussigné reconnaît expressément que le bien immobilier mentionné ci-dessus lui a été présenté ce jour pour la première fois par l&apos;intermédiaire de l&apos;agence <strong>SASU NELL&apos;IMMO</strong>.
            </p>
            <p className="leading-relaxed">
              En conséquence, le visiteur s&apos;interdit formellement de négocier, d&apos;acquérir ou de traiter directement ou indirectement (y compris par l&apos;intermédiaire d&apos;un tiers, conjoint, ascendant, descendant, société interposée ou autre agence) l&apos;acquisition dudit bien avec le vendeur mandant, <strong>pendant une durée de 24 mois à compter de la date de la présente visite</strong>.
            </p>
            <p className="leading-relaxed font-semibold text-rose-950">
              En cas de manquement à cette obligation, le visiteur s&apos;engage à verser à la SASU NELL&apos;IMMO une indemnité forfaitaire compensatrice équivalente au montant intégral des honoraires d&apos;agence fixés au mandat de vente, à titre de clause pénale irrévocable (Art. 1231-5 du Code Civil).
            </p>
          </div>

          {/* Signatures & Sealed Hash */}
          <div className="grid grid-cols-2 gap-6 pt-3 border-t border-gray-200">
            <div className="space-y-2 text-center">
              <span className="font-bold text-[10px] uppercase text-gray-700 block">
                Pour l&apos;Agence Nell&apos;Immo :
              </span>
              <span className="text-[11px] text-gray-500 block">Nelly FERNANDEZ (Dirigeante)</span>
              <div className="h-16 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="font-serif italic font-bold text-gray-700">Nelly Fernandez</span>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <span className="font-bold text-[10px] uppercase text-gray-700 block">
                Signature Électronique du Visiteur :
              </span>
              <span className="text-[10px] text-gray-500 block">Émargement tactile certifié</span>
              <div className="h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden p-1 relative">
                {visitData.signature_data_url ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={visitData.signature_data_url}
                      alt="Signature Acquéreur"
                      fill
                      sizes="200px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400">Émargement enregistré</span>
                )}
              </div>
            </div>
          </div>

          {/* Cryptographic Footnote */}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[9px] text-gray-400 font-mono">
            <span suppressHydrationWarning>Horodatage UTC : {new Date().toISOString()}</span>
            <span>Scellement SHA-256 : {visitData.hash}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 print:hidden">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimer / Enregistrer en PDF A4
          </Button>
        </div>
      </div>
    </Modal>
  );
};
