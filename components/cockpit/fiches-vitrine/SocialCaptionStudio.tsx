'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import type { Property } from '@/lib/types';
import { buildSocialCaption } from './flyer-types';

interface SocialCaptionStudioProps {
    property: Property;
    mandateRef: string;
}

export function SocialCaptionStudio({ property, mandateRef }: SocialCaptionStudioProps) {
    const [copiedCaption, setCopiedCaption] = useState(false);
    const caption = buildSocialCaption(property, mandateRef);

    const handleCopy = () => {
        navigator.clipboard.writeText(caption);
        setCopiedCaption(true);
        setTimeout(() => setCopiedCaption(false), 2000);
    };

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-[#E12B7B]" />
                    <div>
                        <h3 className="font-serif font-bold text-base text-[#131B26]">
                            Studio Réseaux Sociaux : Légende Prête à Publier
                        </h3>
                        <span className="text-xs text-gray-500">
                            Texte optimisé pour Instagram, Facebook & LinkedIn avec émoticônes et hashtags locaux.
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    className="px-5 py-2.5 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                    {copiedCaption ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCaption ? 'Légende Copiée !' : 'Copier la Légende Instagram'}</span>
                </button>
            </div>

            <pre className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
                {caption}
            </pre>
        </div>
    );
}
