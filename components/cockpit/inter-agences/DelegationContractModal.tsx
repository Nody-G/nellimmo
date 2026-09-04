'use client';

import React from 'react';
import { X, FileSignature, Printer } from 'lucide-react';
import type { DelegationAgreement, Property, PartnerAgency } from '@/lib/types';

interface DelegationContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegation: DelegationAgreement | null;
  property: Property | undefined;
  partner: PartnerAgency | undefined;
}

export function DelegationContractModal({
  isOpen,
  onClose,
  delegation,
  property,
  partner,
}: DelegationContractModalProps) {
  if (!isOpen || !delegation || !property || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6 animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-[#E12B7B]" />
            <h3 className="font-serif font-bold text-lg text-[#131B26]">
              Convention Officielle de Délégation de Mandat de Vente
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Legal Contract Text */}
        <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-gray-200 font-mono text-xs text-gray-800 space-y-4 leading-relaxed">
          <div className="text-center font-bold pb-2 border-b border-gray-200">
            <span className="text-sm block text-gray-900">CONVENTION DE DÉLÉGATION DE MANDAT DE VENTE</span>
            <span className="text-[10px] text-gray-500 font-normal">
              Conforme aux articles 65 et 77 du Décret n° 72-678 du 20 juillet 1972 (Loi Hoguet)
            </span>
          </div>

          <div>
            <strong>ENTRE LES SOUSSIGNÉS :</strong><br />
            <strong>1. LE DÉLÉGANT :</strong> SASU NELL’IMMO, Capital 1 000 €, siège 145 Chemin des Oliviers, 13330 Pélissanne, représentée par Mme Nelly FERNANDEZ, titulaire de la Carte Professionnelle CPI 1310 2019 000 042 974 délivrée par la CCI d’Aix-Marseille-Provence, garantie financière GALIAN (120 000 €).<br /><br />
            <strong>2. LE DÉLÉGUÉ :</strong> {partner.agency_name}, représentée par {partner.director_name}, titulaire de la Carte Professionnelle {partner.cpi_number}, garantie {partner.financial_guarantee}.
          </div>

          <div>
            <strong>ARTICLE 1 - OBJET DE LA DÉLÉGATION :</strong><br />
            Le Délégant, titulaire du Mandat N° {property.mandate_number} portant sur le bien situé à {property.address}, {property.city}, au prix de {property.price_fai.toLocaleString('fr-FR')} € FAI, délègue par les présentes au Délégué le pouvoir de présenter le bien à ses acquéreurs en portefeuille.
          </div>

          <div>
            <strong>ARTICLE 2 - ACCORD DU MANDANT :</strong><br />
            Le Délégant certifie détenir l’accord exprès et écrit du mandant vendeur pour confier le bien en délégation à des confrères partenaires.
          </div>

          <div>
            <strong>ARTICLE 3 - RÉPARTITION DES HONORAIRES :</strong><br />
            En cas de vente conclue avec un acquéreur présenté par le Délégué, les honoraires d’agence de {property.agency_fees_amount.toLocaleString('fr-FR')} € TTC seront partagés selon la clé convenue de : <strong>{delegation.fee_share_ratio.replace('_', ' % / ')} %</strong>.
          </div>

          <div>
            <strong>ARTICLE 4 - NON-CONTOURNEMENT & DÉONTOLOGIE :</strong><br />
            Le Délégué s’interdit formellement de démarcher directement le vendeur mandant sans l’accord écrit préalable du Délégant pendant toute la durée du mandat et pendant 24 mois suivant son terme.
          </div>

          <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-4 text-center">
            <div>
              <span>Pour le Délégant :</span><br />
              <strong className="text-gray-900">Nelly FERNANDEZ (Nell’Immo)</strong>
            </div>
            <div>
              <span>Pour le Délégué :</span><br />
              <strong className="text-gray-900">{partner.director_name}</strong>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#C59A45]" />
            <span>Imprimer la Convention</span>
          </button>
        </div>
      </div>
    </div>
  );
}
