'use client';

import { Calendar, Star, MapPin, Smartphone, Copy, Check } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { SectionCard } from './SectionCard';
import type { SettingsChange } from './parametres-types';

interface GoogleSectionProps {
    formData: AgencySettings;
    onChange: SettingsChange;
    copiedLink: string | null;
    onCopy: (text: string, label: string) => void;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

/** Section 3: Hub Écosystème Google (Agenda, Maps, My Business, Contacts). */
export function GoogleSection({ formData, onChange, copiedLink, onCopy }: GoogleSectionProps) {
    return (
        <SectionCard
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            title="3. Hub Écosystème Google (Mobile & Terrain de Nelly)"
            badge="Google Workspace"
            badgeClassName="bg-blue-50 text-blue-700 border-blue-200"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Google Calendar ID (Synchronisation Visites)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="nellimmo.acte@gmail.com"
                        value={formData.google_calendar_id || ''}
                        onChange={(e) => onChange({ google_calendar_id: e.target.value })}
                        className={inputClass}
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">
                        Permet d{"\u2019"}ajouter vos rendez-vous de visite en 1 clic directement dans votre agenda mobile avec alertes de départ.
                    </span>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>Lien Direct d{"\u2019"}Avis Google My Business</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="https://g.page/r/nellimmo/review"
                            value={formData.google_my_business_url || ''}
                            onChange={(e) => onChange({ google_my_business_url: e.target.value })}
                            className={inputClass}
                        />
                        {formData.google_my_business_url && (
                            <button
                                type="button"
                                onClick={() => onCopy(formData.google_my_business_url || '', 'google_review')}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1 shrink-0"
                            >
                                {copiedLink === 'google_review' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        )}
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                        Envoyé automatiquement aux acquéreurs et vendeurs le jour de la signature de l{"\u2019"}acte notarié pour collecter les 5 étoiles.
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Clé API Google Maps & Places (Optionnelle)</span>
                    </label>
                    <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={formData.google_maps_api_key || ''}
                        onChange={(e) => onChange({ google_maps_api_key: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">
                        Pour le géocodage précis des commodités locales (écoles, gares, commerces).
                    </span>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Synchronisation Google Contacts</span>
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-800 block">Carnet d{"\u2019"}adresses Téléphone</span>
                            <span className="text-[11px] text-gray-500">Ajoute les acheteurs/vendeurs au répertoire mobile</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.google_contacts_sync_enabled ?? true}
                            onChange={(e) => onChange({ google_contacts_sync_enabled: e.target.checked })}
                            className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
