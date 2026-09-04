'use client';

import { Share2 } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { SectionCard } from './SectionCard';
import type { SettingsChange } from './parametres-types';

interface SocialSectionProps {
    formData: AgencySettings;
    onChange: SettingsChange;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

/** Section 2: Réseaux Sociaux & Auto-Publication (Meta Graph API & LinkedIn). */
export function SocialSection({ formData, onChange }: SocialSectionProps) {
    return (
        <SectionCard
            icon={<Share2 className="w-5 h-5 text-[#E12B7B]" />}
            title="2. Réseaux Sociaux & Auto-Publication (Meta Graph API & LinkedIn)"
            badge="Instagram / Facebook"
            badgeClassName="bg-pink-50 text-[#E12B7B] border-pink-200"
        >
            <p className="text-xs text-gray-600">
                Connectez votre compte Meta Business (Facebook Page & Instagram Professionnel). Lorsque vous rentrez un nouveau mandat exclusif, que vous baissez un prix ou vendez un bien, Cockpit génère et diffuse automatiquement vos publications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Identifiant de Page Facebook (Page ID)
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: nellimmo.immobilier"
                        value={formData.facebook_page_id || ''}
                        onChange={(e) => onChange({ facebook_page_id: e.target.value })}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Compte Instagram Professionnel (ID / Handle)
                    </label>
                    <input
                        type="text"
                        placeholder="@nellimmo_provence"
                        value={formData.instagram_business_id || ''}
                        onChange={(e) => onChange({ instagram_business_id: e.target.value })}
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center justify-between">
                    <span>Jeton d{"\u2019"}accès Meta Graph API (Page Access Token)</span>
                    <span className="text-[11px] text-gray-400 font-normal">Chiffré localement (AES-256) et déchiffré à la connexion — chiffrement serveur à venir avec Supabase</span>
                </label>
                <input
                    type="password"
                    placeholder="EAAG... (Token longue durée Meta Graph API)"
                    value={formData.facebook_page_access_token || ''}
                    onChange={(e) => onChange({ facebook_page_access_token: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-[#E12B7B]"
                />
            </div>

            {/* Toggles d'Auto-publication */}
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3">
                <span className="text-xs font-bold uppercase text-[#131B26] tracking-wider block">
                    Déclencheurs d{"\u2019"}Auto-Publication en 1 Clic
                </span>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.social_autopost_new_mandate ?? true}
                            onChange={(e) => onChange({ social_autopost_new_mandate: e.target.checked })}
                            className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                        />
                        <span className="text-xs text-gray-700 font-semibold">
                            Proposer la publication carrousel Instagram & Facebook dès l{"\u2019"}activation d{"\u2019"}un nouveau mandat exclusif
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.social_autopost_price_drop ?? true}
                            onChange={(e) => onChange({ social_autopost_price_drop: e.target.checked })}
                            className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                        />
                        <span className="text-xs text-gray-700 font-semibold">
                            Générer automatiquement un visuel & post {"\u201C"}Baisse de Prix{"\u201D"} lors d{"\u2019"}un avenant de mandat
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.social_autopost_sold ?? true}
                            onChange={(e) => onChange({ social_autopost_sold: e.target.checked })}
                            className="w-4 h-4 text-[#E12B7B] rounded focus:ring-[#E12B7B]"
                        />
                        <span className="text-xs text-gray-700 font-semibold">
                            Publier la story {"\u201C"}Vendu par Nell{"\u2019"}Immo{"\u201D"} le jour de la réitération de l{"\u2019"}acte authentique
                        </span>
                    </label>
                </div>
            </div>
        </SectionCard>
    );
}
