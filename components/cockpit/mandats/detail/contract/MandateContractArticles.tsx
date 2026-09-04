'use client';

import React from 'react';
import type { Property, AgencySettings } from '@/lib/types';

interface MandateContractArticlesProps {
  property: Property;
  mandateType: 'exclusif' | 'simple';
  settings: AgencySettings;
  mandateRef: string;
  startDateFormatted: string;
  endDateFormatted: string;
}

export function MandateContractArticles({
  property,
  mandateType,
  settings,
  startDateFormatted,
  endDateFormatted,
}: MandateContractArticlesProps) {
  const agencyName = settings.agency_name || "SASU NELL’IMMO";
  const agentName = settings.agent_name || 'Mme Nelly FERNANDEZ';
  const cardTNumber = settings.card_t_number || 'CPI 1310 2019 000 042 974';
  const cciCity = settings.cci_card_t || 'Aix-Marseille-Provence';
  const guaranteeFund = settings.guarantee_fund_name || 'Galian Assurances (Non-détention de fonds)';
  const guaranteeAmount = settings.guarantee_fund_amount || '120 000 €';
  const rcpInsurance = settings.insurance_name
    ? `${settings.insurance_name} (Police ${settings.insurance_policy || 'N° 120 137 405'})`
    : 'MMA IARD Entreprises (Police N° 120 137 405)';
  const mediator = settings.mediator_name || 'Médiation Franchise-Consommateurs / ANM Conso';
  const mediatorUrl = settings.mediator_url || 'www.anm-conso.com';

  return (
    <>
      {/* PARTIE 1 : LE MANDANT */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
          <span>1. LE MANDANT (LE VENDEUR)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-800">
          <p>
            <strong>Identité :</strong> {property.seller_name}
          </p>
          <p>
            <strong>Téléphone :</strong> {property.seller_phone}
          </p>
          <p className="sm:col-span-2">
            <strong>Domicile :</strong> {property.seller_address || property.address}
          </p>
          {property.seller_email && (
            <p className="sm:col-span-2">
              <strong>Courriel :</strong> {property.seller_email}
            </p>
          )}
        </div>
        <p className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-200">
          Ci-après dénommé « le Mandant », déclarant avoir la pleine capacité juridique et tous pouvoirs pour disposer du bien ci-après décrit.
        </p>
      </div>

      {/* PARTIE 2 : LE MANDATAIRE */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
          <span>2. LE MANDATAIRE (L’AGENCE)</span>
        </h3>
        <div className="text-[11px] text-gray-800 space-y-1">
          <p>
            <strong>{agencyName}</strong>, représentée par <strong>{agentName}</strong>.
          </p>
          <p>
            Adresse : {settings.address || 'Place de l’Église, 13330 Pélissanne'} • Tél :{' '}
            {settings.phone || '06 12 34 56 78'}
          </p>
          <p>
            Carte Professionnelle : <strong>{cardTNumber}</strong> délivrée par la CCI de {cciCity}.
          </p>
          <p>
            Garantie Financière : {guaranteeFund} à hauteur de {guaranteeAmount}.{' '}
            <em>L’agence déclare ne recevoir ni détenir aucun fonds, effet ou valeur.</em>
          </p>
          <p>
            Assurance RCP : {rcpInsurance}. Médiation de la consommation : {mediator} ({mediatorUrl}).
          </p>
        </div>
      </div>

      {/* PARTIE 3 : DÉSIGNATION DU BIEN */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
          3. DÉSIGNATION DU BIEN
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-800">
          <p>
            <strong>Désignation :</strong> {property.title}
          </p>
          <p>
            <strong>Localisation :</strong> {property.address}, {property.postal_code} {property.city}
          </p>
          <p>
            <strong>Type de bien :</strong> {property.property_type.toUpperCase()}
          </p>
          <p>
            <strong>Surface habitable :</strong> {property.living_area} m² (Carrez:{' '}
            {property.carrez_area || property.living_area} m²)
          </p>
          <p>
            <strong>Terrain :</strong> {property.land_area ? `${property.land_area} m²` : 'Sans terrain'}
          </p>
          <p>
            <strong>Pièces / Chambres :</strong> {property.rooms_count} pièces ({property.bedrooms_count} chambres)
          </p>
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
            <span className="text-base font-black text-gray-900">
              {property.price_net_seller.toLocaleString('fr-FR')} €
            </span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-[#E12B7B]">
            <span className="text-[10px] uppercase font-bold text-[#E12B7B] block">
              Honoraires TTC ({property.agency_fees_percentage}%)
            </span>
            <span className="text-base font-black text-[#E12B7B]">
              {property.agency_fees_amount.toLocaleString('fr-FR')} €
            </span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-gray-300">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Prix Public FAI</span>
            <span className="text-base font-black text-gray-900">
              {property.price_fai.toLocaleString('fr-FR')} €
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-700">
          <strong>Charge des honoraires :</strong> Les honoraires de négociation sont stipulés{' '}
          <strong className="underline uppercase">
            {property.fees_paid_by === 'vendeur'
              ? 'à la charge exclusive du vendeur'
              : 'à la charge de l’acquéreur'}
          </strong>
          , conformément au barème des honoraires de l’agence affiché en vitrine et consultable sur le site internet de l’agence.
        </p>
        <p className="text-[10px] text-gray-500 italic">
          Aucune somme d’argent ni rémunération n’est exigible ou payable avant la conclusion définitive de la vente par acte authentique devant notaire instrumentaire (Article 6 de la Loi Hoguet du 2 janvier 1970).
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
          À l’issue de cette période initiale, il se poursuivra par tacite reconduction par périodes successives d’un (1) mois, sauf dénonciation par l’une ou l’autre des parties par lettre recommandée avec accusé de réception ou tout autre moyen écrit avec accusé de réception, avec un <strong>préavis de quinze (15) jours</strong>. La durée totale du mandat ne pourra en aucun cas excéder douze (12) mois.
        </p>
        {mandateType === 'exclusif' && (
          <p className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[10px] text-rose-900 font-medium">
            <strong>Clause d’Exclusivité (Art. 78 du Décret n° 72-678) :</strong> Pendant toute la durée du mandat, le Mandant s’interdit formellement de négocier la vente du bien directement ou par l’intermédiaire d’un tiers. Tout acquéreur se présentant directement sera orienté vers le Mandataire.
          </p>
        )}
      </div>
    </>
  );
}
