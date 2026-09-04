'use client';

import { Lightbulb } from 'lucide-react';

interface AnglesDrawerProps {
    angles: string[];
    onInject: (angle: string) => void;
    onClose: () => void;
}

/** Brainstormer drawer showing hidden marketing angles for the current property. */
export function AnglesDrawer({ angles, onInject, onClose }: AnglesDrawerProps) {
    return (
        <div className="bg-gradient-to-r from-[#FAF6EE] to-white rounded-3xl p-6 border border-[#E9DFD3] shadow-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#C59A45]" />
                        Brainstormer d{"\u2019"}Angles & Pépites Cachées pour ce Bien
                    </h3>
                    <p className="text-xs text-gray-600">
                        5 angles marketing inattendus détectés pour démarquer cette annonce des
                        concurrents. Cliquez sur un angle pour l{"\u2019"}ajouter à la consigne.
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-gray-400 hover:text-gray-800"
                >
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {angles.map((angle, idx) => (
                    <div
                        key={idx}
                        className="p-3.5 bg-white rounded-2xl border border-[#F3E8EE] shadow-2xs space-y-2 flex flex-col justify-between hover:border-[#C59A45] transition"
                    >
                        <p className="text-xs text-gray-800 leading-relaxed font-medium">{angle}</p>
                        <button
                            type="button"
                            onClick={() => onInject(angle)}
                            className="w-full py-1.5 bg-[#FAF6EE] hover:bg-[#C59A45] text-[#C59A45] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer text-center"
                        >
                            + Injecter cet atout
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
