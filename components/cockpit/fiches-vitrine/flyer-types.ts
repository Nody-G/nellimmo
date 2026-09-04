import type { Property, AgencySettings } from '@/lib/types';

export type ColorTheme = 'nellimo' | 'gold' | 'minimal' | 'provence' | 'terracotta' | 'dark_led';
export type LayoutFormat = 'A4_landscape' | 'A4_portrait' | 'A3_landscape' | 'social_square' | 'story_vertical';
export type PhotoArrangement = 'standard_3' | 'hero_only' | 'split_2' | 'grid_4' | 'mosaic_5';
export type BadgePreset = 'auto' | 'exclusif' | 'coup_de_coeur' | 'baisse_prix' | 'sous_compromis' | 'offre_en_cours' | 'vendu' | 'dpe_a' | 'custom';
export type QrDestination = 'web' | 'whatsapp' | 'visite360' | 'google_review' | 'gps';

export interface FlyerTheme {
    primary: string;
    secondary: string;
    accent: string;
    badgeBg: string;
    border: string;
    textAccent: string;
    bgWrapper: string;
    textColor: string;
    subText: string;
    cardBg: string;
}

export const THEME_STYLES: Record<ColorTheme, FlyerTheme> = {
    nellimo: {
        primary: '#E12B7B',
        secondary: '#131B26',
        accent: '#FDF2F8',
        badgeBg: 'bg-[#E12B7B] text-white',
        border: 'border-[#E12B7B]',
        textAccent: 'text-[#E12B7B]',
        bgWrapper: 'bg-white',
        textColor: 'text-[#131B26]',
        subText: 'text-gray-500',
        cardBg: 'bg-gray-50'
    },
    gold: {
        primary: '#C59A45',
        secondary: '#0F172A',
        accent: '#FAF6EE',
        badgeBg: 'bg-[#C59A45] text-white',
        border: 'border-[#C59A45]',
        textAccent: 'text-[#C59A45]',
        bgWrapper: 'bg-white',
        textColor: 'text-[#0F172A]',
        subText: 'text-gray-500',
        cardBg: 'bg-[#FAF6EE]/50'
    },
    minimal: {
        primary: '#18181B',
        secondary: '#27272A',
        accent: '#F4F4F5',
        badgeBg: 'bg-zinc-900 text-white',
        border: 'border-zinc-900',
        textAccent: 'text-zinc-900',
        bgWrapper: 'bg-white',
        textColor: 'text-zinc-900',
        subText: 'text-zinc-500',
        cardBg: 'bg-zinc-50'
    },
    provence: {
        primary: '#0284C7',
        secondary: '#0C4A6E',
        accent: '#F0F9FF',
        badgeBg: 'bg-[#0284C7] text-white',
        border: 'border-[#0284C7]',
        textAccent: 'text-[#0284C7]',
        bgWrapper: 'bg-white',
        textColor: 'text-[#0C4A6E]',
        subText: 'text-sky-700',
        cardBg: 'bg-sky-50/50'
    },
    terracotta: {
        primary: '#C05621',
        secondary: '#7B341E',
        accent: '#FFFAF0',
        badgeBg: 'bg-[#C05621] text-white',
        border: 'border-[#C05621]',
        textAccent: 'text-[#C05621]',
        bgWrapper: 'bg-white',
        textColor: 'text-[#7B341E]',
        subText: 'text-amber-800',
        cardBg: 'bg-amber-50/40'
    },
    dark_led: {
        primary: '#F43F5E',
        secondary: '#020617',
        accent: '#1E293B',
        badgeBg: 'bg-[#F43F5E] text-white',
        border: 'border-[#F43F5E]',
        textAccent: 'text-[#F43F5E]',
        bgWrapper: 'bg-[#0B1120]',
        textColor: 'text-white',
        subText: 'text-gray-400',
        cardBg: 'bg-white/5 border border-white/10'
    }
};

export const FORMAT_LABELS: Record<LayoutFormat, string> = {
    A4_landscape: 'A4 Paysage',
    A4_portrait: 'A4 Portrait',
    A3_landscape: 'A3 Grand Vitrine',
    social_square: 'Carré Post 1:1',
    story_vertical: 'Story Insta 9:16'
};

export function getQrTargetUrl(
    property: Property | undefined,
    qrDestination: QrDestination,
    mandateRef: string,
    settings: AgencySettings
): string {
    if (!property) return 'https://www.nellimmo.fr';
    if (qrDestination === 'whatsapp') {
        const msg = encodeURIComponent(`Bonjour Nelly Fernandez, je vous contacte au sujet du bien ${property.title} (Réf. ${mandateRef}) vu en vitrine.`);
        return `https://wa.me/33755686109?text=${msg}`;
    }
    if (qrDestination === 'visite360') {
        return property.virtual_tour_url || property.video_url || `https://www.nellimmo.fr/biens/${property.id}`;
    }
    if (qrDestination === 'google_review') {
        return settings.google_my_business_url || 'https://g.page/r/nellimmo/review';
    }
    if (qrDestination === 'gps') {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address}, ${property.postal_code} ${property.city}`)}`;
    }
    return typeof window !== 'undefined'
        ? `${window.location.origin}/biens/${property.id}`
        : `https://www.nellimmo.fr/biens/${property.id}`;
}

export function getBadgeText(
    badgePreset: BadgePreset,
    customBadgeText: string,
    property: Property | undefined
): string {
    if (badgePreset === 'custom' && customBadgeText.trim()) return customBadgeText;
    if (badgePreset === 'exclusif') return "★ EXCLUSIVITÉ NELL'IMMO";
    if (badgePreset === 'coup_de_coeur') return "❤️ COUP DE CŒUR";
    if (badgePreset === 'baisse_prix') return "📉 BAISSE DE PRIX RÉCENTE";
    if (badgePreset === 'sous_compromis') return "🔒 SOUS COMPROMIS";
    if (badgePreset === 'offre_en_cours') return "📝 OFFRE EN COURS";
    if (badgePreset === 'vendu') return "🎉 VENDU PAR NELL'IMMO";
    if (badgePreset === 'dpe_a') return "🌱 DPE A • ÉCO-PERFORMANT";
    return property?.mandate_type === 'exclusif' ? "★ EXCLUSIVITÉ NELL'IMMO" : "NOUVEAUTÉ EXCLUSIVE";
}

export function getQrLabel(qrDestination: QrDestination): string {
    switch (qrDestination) {
        case 'whatsapp': return 'WhatsApp Direct';
        case 'visite360': return 'Visite 360°';
        case 'google_review': return 'Avis Google';
        case 'gps': return 'Itinéraire GPS';
        default: return 'Fiche Web HD';
    }
}

export function buildSocialCaption(property: Property, mandateRef: string): string {
    return `✨ [NOUVEAUTÉ EN PROVENCE] ✨\n\n🏡 ${property.title} — ${property.city} (${property.postal_code})\n\n📍 Réf. ${mandateRef} • Mandat ${property.mandate_type.toUpperCase()}\n📐 ${property.living_area} m² habitables • ${property.rooms_count} pièces (${property.bedrooms_count} chambres)\n🌿 Terrain : ${property.land_area ? `${property.land_area} m²` : 'Sans terrain'}\n💶 Prix FAI : ${property.price_fai.toLocaleString('fr-FR')} € (Honoraires charge ${property.fees_paid_by})\n\n${property.description ? property.description.slice(0, 180) + '...' : ''}\n\n📲 Informations & Visites privées auprès de Nelly Fernandez :\n📞 07 55 68 61 09\n📩 nellimmo.acte@gmail.com\n🔗 Fiche complète sur https://nellimmo.fr/biens/${property.id}\n\n#immobilier #pelissanne #payssalonais #provence #villaavendre #maisonprovencale #nellimmo #exclusivite #achatimmobilier`;
}
