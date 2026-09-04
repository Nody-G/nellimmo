'use client';

import { Bot, Copy, Check } from 'lucide-react';
import { OBJECTION_SCRIPTS } from './pige-types';

interface SparringPartnerPanelProps {
    activeObjectionIndex: number;
    copiedPitch: boolean;
    onSelectObjection: (index: number) => void;
    onCopyPitch: (text: string) => void;
}

/** Sparring-Partner IA : Désamorçage d'objections au téléphone. */
export function SparringPartnerPanel({
    activeObjectionIndex,
    copiedPitch,
    onSelectObjection,
    onCopyPitch,
}: SparringPartnerPanelProps) {
    const activeScript = OBJECTION_SCRIPTS[activeObjectionIndex];

    return (
        <div className="bg-gradient-to-r from-[#131B26] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-700 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#C59A45]/20 text-[#C59A45] flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-base text-white">
                            Sparring-Partner IA : Désamorçage d{"\u2019"}Objections au Téléphone
                        </h3>
                        <p className="text-[11px] text-gray-300">
                            Pige téléphonique à haute valeur ajoutée. Cliquez sur l{"\u2019"}objection du vendeur pour afficher la réponse psychologique certifiée.
                        </p>
                    </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-white/10 text-[#C59A45] border border-white/10 shrink-0">
                    Méthode R1 Exclusivité
                </span>
            </div>

            {/* Objection Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {OBJECTION_SCRIPTS.map((script, idx) => (
                    <button
                        key={script.id}
                        type="button"
                        onClick={() => onSelectObjection(idx)}
                        className={`p-3 rounded-2xl text-left text-xs transition border cursor-pointer ${activeObjectionIndex === idx
                                ? 'bg-[#E12B7B] text-white border-[#E12B7B] shadow-md'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <span className="font-bold line-clamp-2">{script.title}</span>
                    </button>
                ))}
            </div>

            {/* Active Script Card */}
            {activeScript && (
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C59A45] uppercase tracking-wider">
                            Angle psychologique : {activeScript.angle}
                        </span>
                        <button
                            type="button"
                            onClick={() => onCopyPitch(activeScript.pitch)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                            {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedPitch ? 'Copié !' : 'Copier le Pitch'}</span>
                        </button>
                    </div>

                    <p className="text-xs leading-relaxed text-gray-100 font-sans italic bg-black/25 p-3 rounded-xl border border-white/5">
                        {activeScript.pitch}
                    </p>

                    <div className="p-3 bg-[#C59A45]/10 rounded-xl border border-[#C59A45]/20 text-xs text-[#FAF6EE]">
                        <strong className="text-[#C59A45]">Question de Recadrage Direct :</strong>{' '}
                        <span>{activeScript.reframeQuestion}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
