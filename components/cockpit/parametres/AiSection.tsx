'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, ArrowRight, Activity, Zap } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { isPeakHour } from '@/lib/deepseek/pricing';

/** Section 4: Intelligence Artificielle & DeepSeek V4 Flash. */
export function AiSection() {
    const isPeak = isPeakHour();

    return (
        <SectionCard
            icon={<Sparkles className="w-5 h-5 text-[#E12B7B]" />}
            title="4. Intelligence Artificielle & Moteur Officiel DeepSeek V4"
        >
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase text-gray-700">
                            Modèle Officiel Actif : DeepSeek V4 Flash (0731)
                        </label>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isPeak ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {isPeak ? 'Heures Pleines' : 'Heures Creuses (-50%)'}
                        </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                            La clé API officielle est gérée de façon étanche via <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">DEEPSEEK_API_KEY</code>. Contexte étendu à <strong>1M de tokens</strong> et réduction automatique de <strong>90% à 98%</strong> grâce au Prompt Caching natif.
                        </span>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-blue-600" />
                            Centre de Télémétrie & Coûts Réels
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            Suivez en temps réel les jetons consommés, vos économies comparées à GPT-4o et ajustez votre budget mensuel.
                        </p>
                    </div>

                    <Link
                        href="/cockpit/base-de-donnees"
                        className="px-3 py-1.5 bg-[#E12B7B] hover:bg-[#c22066] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0 justify-center"
                    >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Ouvrir la Télémétrie</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </SectionCard>
    );
}
