import { STYLE_TEMPLATES, StyleTemplate } from '@/lib/copywriting';

export type StyleCategory = 'all' | 'portails' | 'reseaux' | 'direct' | 'strategique';

export const STYLE_CATEGORIES: { id: StyleCategory; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'portails', label: 'Portails' },
    { id: 'reseaux', label: 'Réseaux & Vidéo' },
    { id: 'direct', label: 'WhatsApp' },
    { id: 'strategique', label: 'Stratégique' },
];

/** Filters style templates by active category. */
export function filterTemplates(activeCategory: StyleCategory): StyleTemplate[] {
    if (activeCategory === 'all') return STYLE_TEMPLATES;
    return STYLE_TEMPLATES.filter((t) => t.category === activeCategory);
}

/** Returns the label of a style template by id. */
export function getStyleLabel(styleId: string): string {
    return STYLE_TEMPLATES.find((s) => s.id === styleId)?.label || '';
}

/** Counts non-empty lines in a text. */
export function countLines(text: string): number {
    return text.split('\n').length;
}

/** Counts words in a text. */
export function countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
}

/** Counts characters in a text. */
export function countCharacters(text: string): number {
    return text.length;
}

/** Downloads text as a .txt file. */
export function downloadTextFile(text: string, filename: string): void {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/** Opens WhatsApp share with the given text. */
export function openWhatsAppShare(text: string): void {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
}
