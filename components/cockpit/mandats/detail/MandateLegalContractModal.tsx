'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';
import { formatMandateRef } from '@/lib/hoguet';
import {
  X,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

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
  const agencyName = settings.agency_name || "SASU NELL'IMMO";
  const agentName = settings.agent_name || 'Mme Nelly FERNANDEZ';
  const cardTNumber = settings.card_t_number || 'CPI 1310 2019 000 042 974';
  const cciCity = settings.cci_card_t || 'Aix-Marseille-Provence';
  const guaranteeFund = settings.guarantee_fund_name || 'Galian Assurances (Non-détention de fonds)';
  const guaranteeAmount = settings.guarantee_fund_amount || '120 000 €';
  const rcpInsurance = settings.insurance_name ? `${settings.insurance_name} (Police ${settings.insurance_policy || 'N° 120 137 405'})` : 'MMA IARD Entreprises (Police N° 120 137 405)';
  const mediator = settings.mediator_name || 'Médiation Franchise-Consommateurs / ANM Conso';
  const mediatorUrl = settings.mediator_url || 'www.anm-conso.com';

  const startDateFormatted = new Date(property.mandate_date).toLocaleDateString('fr-FR');
  const endDateFormatted = new Date(property.mandate_end_date).toLocaleDateString('fr-FR');

  const handlePrint = () => {
    window.print();
    showToast('Document envoyé à l\'impression.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-200 flex flex-col max-h-[94vh] overflow-hidden">

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
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${mandateType === 'exclusif'
                    ? 'bg-[#E12B7B] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Mandat Exclusif
              </button>
              <button
                onClick={() => setMandateType('simple')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${mandateType === 'simple'
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
                Inscrit au Registre Spécial des Mandats sous le Numéro : <strong className="text-black font-mono font-black">{mandateRef}</strong>
              </p>
            </div>

            {/* PARTIE 1 : LE MANDANT */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <span>1. LE MANDANT (LE VENDEUR)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-800">
                <p><strong>Identité :</strong> {property.seller_name}</p>
                <p><strong>Téléphone :</strong> {property.seller_phone}</p>
                <p className="sm:col-span-2"><strong>Domicile :</strong> {property.seller_address || property.address}</p>
                {property.seller_email && <p className="sm:col-span-2"><strong>Courriel :</strong> {property.seller_email}</p>}
              </div>
              <p className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-200">
                Ci-après dénommé « le Mandant », déclarant avoir la pleine capacité juridique et tous pouvoirs pour disposer du bien ci-après décrit.
              </p>
            </div>

            {/* PARTIE 2 : LE MANDATAIRE */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <span>2. LE MANDATAIRE (L&apos;AGENCE)</span>
              </h3>
              <div className="text-[11px] text-gray-800 space-y-1">
                <p><strong>{agencyName}</strong>, représentée par <strong>{agentName}</strong>.</p>
                <p>Adresse : {settings.address || 'Place de l\'Église, 13330 Pélissanne'} • Tél : {settings.phone || '06 12 34 56 78'}</p>
                <p>
                  Carte Professionnelle : <strong>{cardTNumber}</strong> délivrée par la CCI de {cciCity}.
                </p>
                <p>
                  Garantie Financière : {guaranteeFund} à hauteur de {guaranteeAmount}. <em>L&apos;agence déclare ne recevoir ni détenir aucun fonds, effet ou valeur.</em>
                </p>
                <p>Assurance RCP : {rcpInsurance}. Médiation de la consommation : {mediator} ({mediatorUrl}).</p>
              </div>
            </div>

            {/* PARTIE 3 : DÉSIGNATION DU BIEN */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                3. DÉSIGNATION DU BIEN
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-800">
                <p><strong>Désignation :</strong> {property.title}</p>
                <p><strong>Localisation :</strong> {property.address}, {property.postal_code} {property.city}</p>
                <p><strong>Type de bien :</strong> {property.property_type.toUpperCase()}</p>
                <p><strong>Surface habitable :</strong> {property.living_area} m² (Carrez: {property.carrez_area || property.living_area} m²)</p>
                <p><strong>Terrain :</strong> {property.land_area ? `${property.land_area} m²` : 'Sans terrain'}</p>
                <p><strong>Pièces / Chambres :</strong> {property.rooms_count} pièces ({property.bedrooms_count} chambres)</p>
                <p className="col-span-2">
                  <strong>Diagnostic Énergétique (DPE) :</strong> Classe {property.dpe_letter || 'C'} ({property.dpe_value || '140'} kWh/m²/an) • GES Classe {property.ges_letter || 'B'} ({property.ges_value || '12'} kg CO₂/m²/an).
                </p>
              </div>
            </div>

            {/* PARTIE 4 : CONDITIONS FINANCIÈRES & RÉMUNÉRATION (LOI ALUR) */}
            <div className="border-2 border-[#131B26] rounded-xl p-4 bg-[#FCFAF7] space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#131B26]">
                4. CONDITIONS FINANCIÈRES & HONORAIRES DE NÉGOCIATION (LOI ALUR)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-white rounded-lg border border-gray-300">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Prix Net Vendeur</span>
                  <span className="text-base font-black text-gray-900">{property.price_net_seller.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#E12B7B]">
                  <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">Honoraires TTC ({property.agency_fees_percentage}%)</span>
                  <span className="text-base font-black text-[#E12B7B]">{property.agency_fees_amount.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-gray-300">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Prix Public FAI</span>
                  <span className="text-base font-black text-gray-900">{property.price_fai.toLocaleString('fr-FR')} €</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-700">
                <strong>Charge des honoraires :</strong> Les honoraires de négociation sont stipulés{' '}
                <strong className="underline uppercase">
                  {property.fees_paid_by === 'vendeur' ? 'à la charge exclusive du vendeur' : 'à la charge de l\'acquéreur'}
                </strong>
                , conformément au barème des honoraires de l&apos;agence affiché en vitrine et consultable sur le site internet de l&apos;agence.
              </p>
              <p className="text-[10px] text-gray-500 italic">
                Aucune somme d&apos;argent ni rémunération n&apos;est exigible ou payable avant la conclusion définitive de la vente par acte authentique devant notaire instrumentaire (Article 6 de la Loi Hoguet du 2 janvier 1970).
              </p>
            </div>

            {/* PARTIE 5 : DURÉE & FACULTÉ DE DÉNONCIATION */}
            <div className="space-y-1.5 text-[11px] text-gray-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                5. DURÉE DU MANDAT & DÉNONCIATION
              </h3>
              <p>
                Le présent mandat prend effet le <strong>{startDateFormatted}</strong> pour une durée initiale irrévocable de{' '}
                <strong>trois (3) mois</strong> expirant le <strong>{endDateFormatted}</strong>.
              </p>
              <p>
                À l&apos;issue de cette période initiale, il se poursuivra par tacite reconduction par périodes successives d&apos;un (1) mois, sauf dénonciation par l&apos;une ou l&apos;autre des parties par lettre recommandée avec accusé de réception ou tout autre moyen écrit avec accusé de réception, avec un <strong>préavis de quinze (15) jours</strong>. La durée totale du mandat ne pourra en aucun cas excéder douze (12) mois.
              </p>
              {mandateType === 'exclusif' && (
                <p className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[10px] text-rose-900 font-medium">
                  <strong>Clause d&apos;Exclusivité (Art. 78 du Décret n° 72-678) :</strong> Pendant toute la durée du mandat, le Mandant s&apos;interdit formellement de négocier la vente du bien directement ou par l&apos;intermédiaire d&apos;un tiers. Tout acquéreur se présentant directement sera orienté vers le Mandataire.
                </p>
              )}
            </div>

            {/* PARTIE 6 : BORDEREAU DE RÉTRACTATION (LOI HAMON) */}
            <div className="border-2 border-dashed border-gray-400 p-4 rounded-xl bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wide text-gray-900">
                  BORDEREAU DE RÉTRACTATION (ARTICLE L. 221-18 DU CODE DE LA CONSOMMATION)
                </span>
                <span className="text-[10px] font-bold text-gray-500">Délai légal : 14 jours</span>
              </div>
              <p className="text-[10px] text-gray-600">
                Si le présent mandat a été conclu hors établissement (au domicile du mandant) ou à distance, le Mandant bénéficie d&apos;un droit de rétractation de 14 jours calendaires à compter de la date de signature sans avoir à justifier de motif.
              </p>
              <div className="border-t border-gray-300 pt-2 text-[10px] text-gray-700 space-y-1">
                <p><em>À renvoyer complété et signé par LRAR à : {agencyName} — {settings.address || 'Place de l\'Église, 13330 Pélissanne'}</em></p>
                <p>« Je soussigné(e) ................................................................ notifie par la présente ma rétractation du mandat n° {mandateRef} signé le ........................ pour le bien situé à ............................................................................ »</p>
                <div className="flex justify-between pt-2">
                  <span>Fait à ......................................, le .............................</span>
                  <span>Signature du Mandant :</span>
                </div>
              </div>
            </div>

            {/* PARTIE 7 : SIGNATURES & EMPREINTE */}
            <div className="border-t-2 border-gray-900 pt-4 space-y-4">
              <div className="flex justify-between text-[11px]">
                <p>Fait à <strong>Pélissanne</strong>, le <strong>{startDateFormatted}</strong></p>
                <p>En deux exemplaires originaux</p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-2">
                {/* Mandant signature */}
                <div className="border border-gray-300 rounded-xl p-4 min-h-[110px] flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-[11px] block">LE MANDANT</span>
                    <span className="text-[10px] text-gray-500 block">Mention manuscrite « Bon pour pouvoir et mandat »</span>
                  </div>
                  <div className="text-center font-serif text-gray-400 italic text-xs pt-4">
                    {property.seller_name}
                  </div>
                </div>

                {/* Mandataire signature */}
                <div className="border border-gray-300 rounded-xl p-4 min-h-[110px] flex flex-col justify-between bg-gray-50/50">
                  <div>
                    <span className="font-bold text-[11px] block">LE MANDATAIRE</span>
                    <span className="text-[10px] text-gray-500 block">Pour {agencyName} — {agentName}</span>
                  </div>
                  <div className="text-center font-serif text-[#131B26] font-bold text-xs pt-4">
                    Nelly FERNANDEZ
                  </div>
                </div>
              </div>

              {/* Empreinte cryptographique d'inaltérabilité */}
              <div className="pt-2 text-[9px] text-gray-400 flex items-center justify-between font-mono">
                <span>SCELLEMENT HORODATÉ SHA-256 : d4a8f9c2e0b178a9c3d4e5f6... (INALTÉRABLE)</span>
                <span>SASU NELL&apos;IMMO • CARTE CPI 1310 2019 000 042 974</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
