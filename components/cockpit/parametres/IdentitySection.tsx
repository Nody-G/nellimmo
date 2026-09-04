'use client';

import { Award } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { SectionCard } from './SectionCard';
import type { SettingsChange } from './parametres-types';

interface IdentitySectionProps {
    formData: AgencySettings;
    onChange: SettingsChange;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';
const subInputClass = 'w-full p-2 bg-white border border-gray-200 rounded-lg text-xs';

/** Section 1: agency identity, Carte T & legal mentions (Loi Hoguet / ALUR). */
export function IdentitySection({ formData, onChange }: IdentitySectionProps) {
    return (
        <SectionCard
            icon={<Award className="w-5 h-5 text-[#E12B7B]" />}
            title="1. Identité Commerciale & Conformité Juridique (Loi Hoguet / ALUR)"
            badge="Conforme 2026"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Raison Sociale
                    </label>
                    <input
                        type="text"
                        value={formData.agency_name}
                        onChange={(e) => onChange({ agency_name: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Nom de l{"\u2019"}Agent Immobilier (Dirigeante)
                    </label>
                    <input
                        type="text"
                        value={formData.agent_name}
                        onChange={(e) => onChange({ agent_name: e.target.value })}
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Carte Professionnelle (Carte T)
                    </label>
                    <input
                        type="text"
                        value={formData.card_t_number}
                        onChange={(e) => onChange({ card_t_number: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        CCI Délivrance
                    </label>
                    <input
                        type="text"
                        value={formData.cci_card_t || 'CCI Marseille Provence'}
                        onChange={(e) => onChange({ cci_card_t: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        SIREN & Greffe RCS
                    </label>
                    <input
                        type="text"
                        value={`${formData.siren || '853 807 006'} - RCS ${formData.rcs_city || 'Salon-de-Provence'}`}
                        onChange={(e) => {
                            const parts = e.target.value.split('-');
                            onChange({
                                siren: parts[0]?.trim(),
                                rcs_city: parts[1]?.replace('RCS', '').trim(),
                            });
                        }}
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Téléphone Direct
                    </label>
                    <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        E-mail Officiel
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Adresse Siège
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => onChange({ address: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Code Postal & Ville
                    </label>
                    <input
                        type="text"
                        value={`${formData.postal_code} ${formData.city}`}
                        onChange={(e) => {
                            const parts = e.target.value.split(' ');
                            onChange({
                                postal_code: parts[0] || '13330',
                                city: parts.slice(1).join(' ') || 'Pélissanne',
                            });
                        }}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Garanties et Notaires */}
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
        </SectionCard>
    );
}
