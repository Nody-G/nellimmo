'use client';

import { Heading } from 'lucide-react';

interface TitleItem {
    title: string;
    category: string;
}

interface TitlesDrawerProps {
    titles: TitleItem[];
    onInsert: (title: string) => void;
    onClose: () => void;
}

/** Drawer showing catchy listing titles that can be inserted at the top of the text. */
export function TitlesDrawer({ titles, onInsert, onClose }: TitlesDrawerProps) {
    return (
        <div className="bg-gradient-to-r from-[#FDF2F8] to-white rounded-3xl p-6 border border-[#F3E8EE] shadow-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                        <Heading className="w-5 h-5 text-[#E12B7B]" />
                        Générateur de Titres d{"\u2019"}Annonce Percutants
                    </h3>
                    <p className="text-xs text-gray-600">
                        Titres accrocheurs pour SeLoger, LeBonCoin ou les réseaux sociaux. Cliquez
                        pour insérer en haut du texte.
                    </p>
                </div>
                <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-800">
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {titles.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2 flex flex-col justify-between hover:border-[#E12B7B] transition"
                    >
                        <div>
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 block w-fit mb-1.5">
                                {item.category}
                            </span>
                            <p className="text-xs font-bold text-gray-900 leading-snug">
                                {item.title}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onInsert(item.title)}
                            className="w-full py-1.5 bg-[#FDF2F8] hover:bg-[#E12B7B] text-[#E12B7B] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer text-center"
                        >
                            Insérer comme Titre
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
