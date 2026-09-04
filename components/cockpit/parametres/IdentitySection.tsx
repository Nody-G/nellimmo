'use client';

import React from 'react';
import { Award } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { SectionCard } from './SectionCard';
import type { SettingsChange } from './parametres-types';
import { GuaranteeBankingCard } from './GuaranteeBankingCard';

interface IdentitySectionProps {
    formData: AgencySettings;
    onChange: SettingsChange;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

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
            <GuaranteeBankingCard formData={formData} onChange={onChange} />
        </SectionCard>
    );
}
