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
  const mediator = settings.mediator_name || 'ANM Conso / Médiation FNAIM';
  const mediatorUrl = settings.mediator_url || 'www.anm-conso.com';

  const sectionCad = property.cadastral_section || 'AC';
  const numCad = property.cadastral_number || '0245';
  const surfaceCad = property.cadastral_surface || property.land_area || property.living_area;

  return (
    <>
      {/* ARTICLE 1 : LE MANDANT */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
          ARTICLE 1 — LE MANDANT (LE VENDEUR)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-800">
          <p><strong>Identité :</strong> {property.seller_name}</p>
          <p><strong>Téléphone :</strong> {property.seller_phone}</p>
          <p className="sm:col-span-2"><strong>Domicile :</strong> {property.seller_address || property.address}</p>
          {property.seller_email && (
            <p className="sm:col-span-2"><strong>Courriel :</strong> {property.seller_email}</p>
          )}
        </div>
        <p className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-200">
          Déclarant avoir la pleine capacité juridique et tous pouvoirs pour disposer du bien ci-après décrit.
        </p>
      </div>

      {/* ARTICLE 2 : LE MANDATAIRE */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
          ARTICLE 2 — LE MANDATAIRE (L’AGENCE IMMOBILIÈRE)
        </h3>
        <div className="text-[11px] text-gray-800 space-y-1">
          <p><strong>{agencyName}</strong>, représentée par <strong>{agentName}</strong>.</p>
          <p>Adresse : {settings.address || '26 avenue des Enjouvènes, 13330 Pélissanne'} • Tél : {settings.phone || '07 55 68 61 09'}</p>
          <p>Carte T : <strong>{cardTNumber}</strong> (CCI {cciCity}) • Garantie Financière : {guaranteeFund} ({guaranteeAmount}).</p>
          <p>RCP : {rcpInsurance} • Médiation de la consommation : {mediator} ({mediatorUrl}).</p>
          <p className="text-[10px] text-gray-500 italic">L’agence déclare sur l’honneur ne recevoir ni détenir aucun fonds, effet ou valeur.</p>
        </div>
      </div>

      {/* ARTICLE 3 : DÉSIGNATION DU BIEN & RÉFÉRENCES CADASTRALES */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
          ARTICLE 3 — DÉSIGNATION DU BIEN & RÉFÉRENCES CADASTRALES OFFICIELLES
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-800">
          <p><strong>Désignation :</strong> {property.title}</p>
          <p><strong>Adresse :</strong> {property.address}, {property.postal_code} {property.city}</p>
          <p><strong>Type de bien :</strong> {property.property_type.toUpperCase()}</p>
          <p><strong>Surface Habitable :</strong> {property.living_area} m² (Loi Carrez : {property.carrez_area || property.living_area} m²)</p>
          <p className="col-span-2 p-2 bg-teal-50/60 border border-teal-200 rounded-lg text-teal-900 font-mono">
            <strong>Cadastre Officiel :</strong> Section <strong>{sectionCad}</strong> • Parcelle N° <strong>{numCad}</strong> • Contenance foncière : <strong>{surfaceCad} m²</strong> (IDU : {property.cadastral_id || `13071000${sectionCad}${numCad}`})
          </p>
          <p className="col-span-2">
            <strong>Diagnostics Énergétiques (DPE/GES) :</strong> DPE Classe {property.dpe_letter || 'C'} ({property.dpe_value || '140'} kWh/m²/an) • GES Classe {property.ges_letter || 'B'} ({property.ges_value || '12'} kg CO₂/m²/an).
          </p>
        </div>
      </div>

      {/* ARTICLE 4 : CONDITIONS FINANCIÈRES & HONORAIRES (LOI ALUR) */}
      <div className="border-2 border-[#131B26] rounded-xl p-4 bg-[#FCFAF7] space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#131B26]">
          ARTICLE 4 — CONDITIONS FINANCIÈRES & RÉMUNÉRATION DE NÉGOCIATION (LOI ALUR)
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
        <p className="text-[11px] text-gray-700 leading-relaxed">
          <strong>Charge des honoraires :</strong> Les honoraires de négociation sont stipulés{' '}
          <strong className="underline uppercase">
            {property.fees_paid_by === 'vendeur' ? 'à la charge exclusive du vendeur' : 'à la charge de l’acquéreur'}
          </strong>
          . Aucune somme d’argent n’est exigible avant la signature de l’acte authentique notarié (Art. 6 Loi Hoguet).
        </p>
      </div>

      {/* ARTICLE 5 & 6 : DURÉE, EXCLUSIVITÉ & CLAUSE PÉNALE 12 MOIS */}
      <div className="space-y-2 text-[11px] text-gray-800">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
          ARTICLE 5 — DURÉE, {mandateType === 'exclusif' ? 'EXCLUSIVITÉ' : 'NON-EXCLUSIVITÉ'} & CLAUSE PÉNALE (12 MOIS)
        </h3>
        <p>
          Le présent contrat ({mandateType === 'exclusif' ? 'MANDAT EXCLUSIF' : 'MANDAT SIMPLE'}) prend effet le <strong>{startDateFormatted}</strong> pour une durée initiale irrévocable de{' '}
          <strong>trois (3) mois</strong> expirant le <strong>{endDateFormatted}</strong>, renouvelable par tacite reconduction mensuelle avec un préavis de dénonciation de 15 jours par lettre recommandée.
        </p>
        {mandateType === 'exclusif' && (
          <p className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 leading-relaxed text-[10px]">
            <strong>Engagement d’exclusivité :</strong> Le Mandant confie au Mandataire l’exclusivité absolue de la négociation et de la vente du bien. Il s’interdit de confier la vente à un tiers ou de traiter directement avec un acquéreur sans le concours du Mandataire pendant la durée de l’exclusivité.
          </p>
        )}
        <p className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 leading-relaxed">
          <strong>Clause d’interdiction de négocier et clause pénale (Art. 78 Décret n° 72-678) :</strong> Pendant la durée du présent mandat et pendant les <strong>douze (12) mois</strong> suivant son expiration, le Mandant s’interdit formellement de vendre directement ou par un tiers à un acquéreur ayant visité le bien par l’intermédiaire du Mandataire. En cas de violation, le Mandant s’oblige à verser au Mandataire une indemnité forfaitaire et compensatrice égale au montant des honoraires fixés à l’Article 4.
        </p>
      </div>

      {/* ARTICLE 7 : OBLIGATIONS & DISPOSITIONS LÉGALES */}
      <div className="space-y-1 text-[10px] text-gray-600 leading-relaxed">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
          ARTICLE 6 — OBLIGATIONS, RGPD & TRACFIN
        </h3>
        <p>
          Le Mandataire s’engage à déployer tous les moyens de diffusion (SeLoger, LeBonCoin, Bien’ici, réseaux sociaux) et à adresser des comptes-rendus de visite réguliers au Mandant. Conformément aux dispositions L. 561-1 du Code monétaire et financier (TRACFIN) et au RGPD, les parties s’engagent à justifier de leur identité et autorisent le traitement sécurisé de leurs données personnelles.
        </p>
      </div>
    </>
  );
}
