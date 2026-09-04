'use client';

import { Sparkles } from 'lucide-react';
import type { StyleTemplate } from '@/lib/copywriting';
import { STYLE_TEMPLATES } from '@/lib/copywriting';
import { STYLE_CATEGORIES, StyleCategory } from './redacteur-types';

interface StyleSelectorProps {
    activeCategory: StyleCategory;
    selectedStyle: string;
    templates: StyleTemplate[];
    onCategoryChange: (category: StyleCategory) => void;
    onStyleChange: (id: string) => void;
}

/** Left column card: format & diffusion channel selector with category tabs. */
export function StyleSelector({
    activeCategory,
    selectedStyle,
    templates,
    onCategoryChange,
    onStyleChange,
}: StyleSelectorProps) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E12B7B]" />
                    2. Format & Canal de Diffusion
                </h3>
                <span className="text-[11px] font-bold text-[#E12B7B] bg-[#FDF2F8] px-2 py-0.5 rounded-full">
                    {STYLE_TEMPLATES.length} formats
                </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-wider">
                {STYLE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onCategoryChange(cat.id)}
                            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${isActive
                                    ? 'bg-[#131B26] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {templates.map((tmpl) => {
                    const isSelected = selectedStyle === tmpl.id;

                    return (
                        <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => onStyleChange(tmpl.id)}
                            className={`w-full text-left p-3 rounded-2xl border transition flex items-start justify-between gap-3 cursor-pointer ${isSelected
                                    ? 'bg-[#FDF2F8] border-[#E12B7B] shadow-2xs ring-1 ring-[#E12B7B]'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100/70'
                                }`}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className={`text-xs font-bold ${isSelected ? 'text-[#E12B7B]' : 'text-gray-900'
                                            }`}
                                    >
                                        {tmpl.label}
                                    </span>
                                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200">
                                        {tmpl.badge}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    {tmpl.description}
                                </p>
                            </div>

                            <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected
                                        ? 'border-[#E12B7B] bg-[#E12B7B]'
                                        : 'border-gray-300'
                                    }`}
                            >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
