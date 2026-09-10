'use client';

import Link from 'next/link';
import { BookOpen, Heading, Key, Lightbulb, Sparkles } from 'lucide-react';

interface RedacteurHeaderProps {
    showAnglesDrawer: boolean;
    showTitlesDrawer: boolean;
    showTrainingSection: boolean;
    anglesCount: number;
    trainingCount: number;
    onToggleAngles: () => void;
    onToggleTitles: () => void;
    onToggleTraining: () => void;
}

/** Header banner with toggle buttons for the drawers. */
export function RedacteurHeader({
    showAnglesDrawer,
    showTitlesDrawer,
    showTrainingSection,
    anglesCount,
    trainingCount,
    onToggleAngles,
    onToggleTitles,
    onToggleTraining,
}: RedacteurHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E8EE] pb-4">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
                    <Sparkles className="w-4 h-4" />
                    <span>Studio de Rédaction Immobilière</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#131B26] mt-1">
                    Générateur d{"\u2019"}Annonces, Vidéos & Pitchs
                </h1>
                <p className="text-xs text-gray-500">
                    10 styles rédactionnels, suggestions d{"\u2019"}angles uniques et scripts vidéo.
                </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
                <button
                    onClick={onToggleAngles}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer ${showAnglesDrawer
                            ? 'bg-[#C59A45] text-white border-[#C59A45]'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <Lightbulb className="w-4 h-4" />
                    <span>Pépites & Angles ({anglesCount})</span>
                </button>

                <button
                    onClick={onToggleTitles}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer ${showTitlesDrawer
                            ? 'bg-[#131B26] text-white border-[#131B26]'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <Heading className="w-4 h-4" />
                    <span>Titres Accrocheurs</span>
                </button>

                <Link
                    href="/cockpit/parametres"
                    title="Gérer la clé API DeepSeek unique dans les Paramètres"
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border bg-white hover:bg-[#FAF5F8] text-[#131B26] border-gray-200 hover:border-[#E12B7B]/40 shadow-2xs transition cursor-pointer"
                >
                    <Key className="w-4 h-4 text-[#C59A45]" />
                    <span>Clé DeepSeek</span>
                </Link>

                <button
                    onClick={onToggleTraining}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer ${showTrainingSection
                            ? 'bg-[#131B26] text-white border-[#131B26]'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <BookOpen className="w-4 h-4 text-[#C59A45]" />
                    <span>Mémoire ({trainingCount})</span>
                </button>
            </div>
        </div>
    );
}
