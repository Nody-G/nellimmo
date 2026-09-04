'use client';

import { Sparkles } from 'lucide-react';
import {
    SENTIMENT_OPTIONS,
    STRENGTH_OPTIONS,
    WEAKNESS_OPTIONS,
    VisitorSentiment
} from './visites-types';

interface MicroBilanProps {
    sentiment: VisitorSentiment;
    strengths: string[];
    weaknesses: string[];
    onSentimentChange: (s: VisitorSentiment) => void;
    onToggleStrength: (val: string) => void;
    onToggleWeakness: (val: string) => void;
}

export function MicroBilan({
    sentiment,
    strengths,
    weaknesses,
    onSentimentChange,
    onToggleStrength,
    onToggleWeakness
}: MicroBilanProps) {
    return (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-xs font-bold uppercase text-gray-800 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E12B7B]" />
                Micro-Bilan Immédiat : Sentiment de l{"\u2019"}Acquéreur
            </span>

            {/* Sentiment Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SENTIMENT_OPTIONS.map((s) => (
                    <button
                        type="button"
                        key={s.id}
                        onClick={() => onSentimentChange(s.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${sentiment === s.id
                            ? s.activeClass
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Quick Strengths / Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                    <span className="font-bold text-gray-600 block mb-1.5">Points Forts Remarqués :</span>
                    <div className="flex flex-wrap gap-1.5">
                        {STRENGTH_OPTIONS.map((str) => (
                            <button
                                key={str}
                                type="button"
                                onClick={() => onToggleStrength(str)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${strengths.includes(str)
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {strengths.includes(str) ? `✓ ${str}` : `+ ${str}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <span className="font-bold text-gray-600 block mb-1.5">Réserves ou Points Bloquants :</span>
                    <div className="flex flex-wrap gap-1.5">
                        {WEAKNESS_OPTIONS.map((wk) => (
                            <button
                                key={wk}
                                type="button"
                                onClick={() => onToggleWeakness(wk)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${weaknesses.includes(wk)
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {weaknesses.includes(wk) ? `✓ ${wk}` : `+ ${wk}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
