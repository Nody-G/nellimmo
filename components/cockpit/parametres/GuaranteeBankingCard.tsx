'use client';

import React from 'react';
import type { AgencySettings } from '@/lib/types';
import type { SettingsChange } from './parametres-types';

interface GuaranteeBankingCardProps {
  formData: AgencySettings;
  onChange: SettingsChange;
}

const subInputClass = 'w-full p-2 bg-white border border-gray-200 rounded-lg text-xs';

export function GuaranteeBankingCard({ formData, onChange }: GuaranteeBankingCardProps) {
  return (
    <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-4">
      <span className="text-xs font-bold uppercase text-[#C59A45] tracking-wider block">
        Garantie Financière, Médiation & Coordonnées Bancaires Notariales
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            Garantie Financière
          </label>
          <input
            type="text"
            value={formData.guarantee_fund_name || 'GALIAN Assurances (120 000 €)'}
            onChange={(e) => onChange({ guarantee_fund_name: e.target.value })}
            className={subInputClass}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            Assurance RCP Pro
          </label>
          <input
            type="text"
            value={formData.insurance_name || 'MMA Entreprise (Police n° 114.240.230)'}
            onChange={(e) => onChange({ insurance_name: e.target.value })}
            className={subInputClass}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            Médiateur Consommation (DGCCRF)
          </label>
          <input
            type="text"
            value={formData.mediator_name || 'ANM Conso / Médiation FNAIM'}
            onChange={(e) => onChange({ mediator_name: e.target.value })}
            className={subInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            IBAN Agence (Note d{"\u2019"}honoraires Notaires)
          </label>
          <input
            type="text"
            value={formData.agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'}
            onChange={(e) => onChange({ agency_rib_iban: e.target.value })}
            className={`${subInputClass} font-mono text-[#131B26]`}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            Code BIC / SWIFT
          </label>
          <input
            type="text"
            value={formData.agency_rib_bic || 'BNPAFRPP'}
            onChange={(e) => onChange({ agency_rib_bic: e.target.value })}
            className={`${subInputClass} font-mono`}
          />
        </div>
      </div>
    </div>
  );
}
