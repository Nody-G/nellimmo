'use client';

import { Cpu, ShieldCheck } from 'lucide-react';
import { SectionCard } from './SectionCard';

/** Section 4: Intelligence Artificielle & Studio de Rédaction. */
export function AiSection() {
    return (
        <SectionCard
            icon={<Cpu className="w-5 h-5 text-[#E12B7B]" />}
            title="4. Intelligence Artificielle & Studio de Rédaction"
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Clé API DeepSeek
                    </label>
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                            La clé est configurée c{"\u00F4"}té serveur via la variable d{"\u2019"}environnement <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">DEEPSEEK_API_KEY</code> et n{"\u2019"}est jamais stockée ni exposée dans le navigateur. Le Studio de Rédaction bascule automatiquement sur le moteur local si elle est absente.
                        </span>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                        Utilisée par le Studio de Rédaction pour générer instantanément vos textes d{"\u2019"}annonces au style signature de Nelly (ou fallback local élégant sans frais).
                    </span>
                </div>
            </div>
        </SectionCard>
    );
}
