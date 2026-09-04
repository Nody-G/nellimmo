'use client';

import { Radio, ShieldCheck } from 'lucide-react';
import type { AgencySettings } from '@/lib/types';
import { SectionCard } from './SectionCard';
import type { SettingsChange } from './parametres-types';

interface PortalsSectionProps {
    formData: AgencySettings;
    onChange: SettingsChange;
}

const inputClass =
    'w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-[#E12B7B]';

/** Section 5: Passerelles & Multidiffusion Portails (SFTP Poliris / SeLoger & LeBonCoin). */
export function PortalsSection({ formData, onChange }: PortalsSectionProps) {
    return (
        <SectionCard
            icon={<Radio className="w-5 h-5 text-[#E12B7B]" />}
            title="5. Passerelles & Multidiffusion Portails"
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Code Agence Poliris</label>
                    <input
                        type="text"
                        value={formData.seloger_agency_code}
                        onChange={(e) => onChange({ seloger_agency_code: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E12B7B] focus:outline-[#E12B7B]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Serveur SFTP SeLoger / Poliris</label>
                    <input
                        type="text"
                        value={formData.seloger_sftp_host}
                        onChange={(e) => onChange({ seloger_sftp_host: e.target.value })}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Serveur SFTP LeBonCoin</label>
                    <input
                        type="text"
                        value={formData.leboncoin_sftp_host}
                        onChange={(e) => onChange({ leboncoin_sftp_host: e.target.value })}
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Jeton d{"\u2019"}API Flux XML Bien{"\u2019"}ici</label>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                        Le jeton du flux XML est configuré côté serveur via la variable d{"\u2019"}environnement <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">BIENICI_FEED_TOKEN</code>. Il n{"\u2019"}est plus stocké dans les paramètres du navigateur.
                    </span>
                </div>
            </div>
        </SectionCard>
    );
}
