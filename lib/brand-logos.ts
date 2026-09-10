/**
 * Registre central des logos officiels de marques tierces.
 *
 * Tous les fichiers de `public/brands/` proviennent des favicons / logos
 * officiels publiés par les sites des marques elles-mêmes (aucune génération
 * d'image). Ils sont utilisés pour remplacer du texte par un repère visuel
 * immédiatement identifiable.
 *
 * IMPORTANT : ces logos restent la propriété de leurs détenteurs respectifs.
 * Ils sont utilisés ici à titre de référence nominative (identifier un portail
 * de diffusion, un réseau social ou un partenaire), ce qui est un usage
 * légitime et courant dans un outil de gestion d'agence immobilière.
 */

export type BrandKey =
    | 'seloger'
    | 'leboncoin'
    | 'bienici'
    | 'figaro'
    | 'pap'
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'google'
    | 'gmail'
    | 'whatsapp'
    | 'deepseek'
    | 'mma'
    | 'fnaim'
    | 'galian';

export interface BrandLogo {
    /** Chemin public de l'asset (commence par /). */
    src: string;
    /** Nom lisible de la marque (utilisé en alt et en repli textuel). */
    label: string;
    /** Dimensions intrinsèques du fichier — requises par next/image. */
    width: number;
    height: number;
    /** Couleur d'accent de la marque (utile pour les pastilles / bordures). */
    color: string;
}

/**
 * Table de correspondance marque -> logo officiel.
 * Les dimensions correspondent exactement aux fichiers de `public/brands/`.
 */
export const BRAND_LOGOS: Record<BrandKey, BrandLogo> = {
    seloger: {
        src: '/brands/seloger.png',
        label: 'SeLoger',
        width: 24,
        height: 24,
        color: '#E4002B',
    },
    leboncoin: {
        src: '/brands/leboncoin.png',
        label: 'leboncoin',
        width: 16,
        height: 16,
        color: '#FF6E14',
    },
    bienici: {
        src: '/brands/bienici.png',
        label: "Bien'ici",
        width: 32,
        height: 32,
        color: '#00A0E3',
    },
    figaro: {
        src: '/brands/figaro.png',
        label: 'Figaro Immobilier',
        width: 16,
        height: 16,
        color: '#1A1A1A',
    },
    pap: {
        src: '/brands/pap.png',
        label: 'PAP',
        width: 16,
        height: 16,
        color: '#E30613',
    },
    facebook: {
        src: '/brands/facebook.png',
        label: 'Facebook',
        width: 60,
        height: 60,
        color: '#1877F2',
    },
    instagram: {
        src: '/brands/instagram.png',
        label: 'Instagram',
        width: 32,
        height: 32,
        color: '#E4405F',
    },
    linkedin: {
        src: '/brands/linkedin.png',
        label: 'LinkedIn',
        width: 64,
        height: 64,
        color: '#0A66C2',
    },
    google: {
        src: '/brands/google.png',
        label: 'Google',
        width: 32,
        height: 32,
        color: '#4285F4',
    },
    gmail: {
        src: '/brands/gmail.png',
        label: 'Gmail',
        width: 256,
        height: 256,
        color: '#EA4335',
    },
    whatsapp: {
        src: '/brands/whatsapp.png',
        label: 'WhatsApp',
        width: 32,
        height: 32,
        color: '#25D366',
    },
    deepseek: {
        src: '/brands/deepseek.png',
        label: 'DeepSeek',
        width: 225,
        height: 225,
        color: '#4D6BFE',
    },
    mma: {
        src: '/brands/mma.png',
        label: 'MMA',
        width: 16,
        height: 16,
        color: '#E2001A',
    },
    fnaim: {
        src: '/fnaim.png',
        label: 'FNAIM',
        width: 134,
        height: 99,
        color: '#003366',
    },
    galian: {
        src: '/galian.png',
        label: 'GALIAN',
        width: 1141,
        height: 187,
        color: '#1B3A6B',
    },
};

/**
 * Récupère la définition d'un logo de marque, ou `null` si la marque n'a pas
 * d'asset officiel disponible (repli textuel géré par le composant BrandLogo).
 */
export function getBrandLogo(key: BrandKey | string | undefined | null): BrandLogo | null {
    if (!key) return null;
    return BRAND_LOGOS[key as BrandKey] ?? null;
}
