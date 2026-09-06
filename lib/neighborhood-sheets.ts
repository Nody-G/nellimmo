'use client';

import type { AmenityCategory, AmenityItem } from './amenities';
import type { Property } from './types';

/**
 * ============================================================================
 * FICHES QUARTIER — Générateur de fiches cartographiques haute résolution
 * ============================================================================
 * Permet à l'agent immobilier de produire des fiches carrées (format très
 * grand, type 1600×1600) depuis la carte plein écran d'un bien, avec :
 *   • les métriques clés du quartier (distances, temps, score de praticité),
 *   • les lois & règles en vigueur applicables (ALUR, DPE, distances, etc.),
 *   • les points d'intérêt (POI) autour, entièrement personnalisables,
 * le tout pour constituer des dossiers clients à forte valeur ajoutée.
 *
 * Stockage : localStorage d'abord (rapide), avec une structure prête à être
 * branchée sur Supabase (champs id / property_id / created_at / payload).
 * ============================================================================
 */

export const NEIGHBORHOOD_SHEETS_STORAGE_KEY = 'nellimo_neighborhood_sheets_v1';

/** Format d'export disponible pour une fiche. */
export type SheetExportFormat = 'png' | 'pdf';

/** Fonds de carte disponibles pour la fiche. */
export type SheetMapMode = 'plan' | 'satellite' | 'arpenteur';

/** Une fiche enregistrée (structure prête pour Supabase). */
export interface NeighborhoodSheet {
    /** Identifiant unique de la fiche. */
    id: string;
    /** Bien associé. */
    property_id: string;
    /** Titre de la fiche (ex: « Fiche Quartier — Famille »). */
    title: string;
    /** Sous-titre libre (ex: « Argumentaire de visite »). */
    subtitle?: string;
    /** Date de création ISO. */
    created_at: string;
    /** Date de dernière modification ISO. */
    updated_at: string;
    /** Aperçu PNG (dataURL) pour la bibliothèque. */
    preview_data_url?: string;
    /** Options de rendu utilisées pour générer la fiche. */
    options: NeighborhoodSheetOptions;
    /** Métadonnées d'export (dernier export). */
    last_export?: { format: SheetExportFormat; at: string };
}

/** Options de rendu d'une fiche (persistées pour re-génération). */
export interface NeighborhoodSheetOptions {
    /** Fonds de carte. */
    mapMode: SheetMapMode;
    /** Rayon d'affichage en mètres (zoom). */
    radiusMeters: number;
    /** Afficher la parcelle cadastrale. */
    showParcel: boolean;
    /** Afficher les bornes / cotes. */
    showCadastralDetails: boolean;
    /** Afficher le score de praticité. */
    showWalkability: boolean;
    /** Afficher les métriques de distance clés. */
    showMetrics: boolean;
    /** Afficher les lois & règles en vigueur. */
    showLaws: boolean;
    /** Afficher la légende des POI. */
    showLegend: boolean;
    /** Afficher l'en-tête (titre / logo / adresse). */
    showHeader: boolean;
    /** Catégories de POI affichées. */
    poiCategories: AmenityCategory[];
    /** Identifiants des lois affichées. */
    lawIds: string[];
    /** Identifiants des métriques affichées. */
    metricIds: string[];
    /** Couleur d'accent (hex). */
    accentColor: string;
    /** Nom de l'agence (en-tête). */
    agencyName: string;
    /** Slogan / mention de l'agence. */
    agencyTagline?: string;
    /** Adresse du bien affichée (si autorisée). */
    showAddress: boolean;
}

/* ============================================================================
 * LOIS & RÈGLES EN VIGUEUR (référentiel)
 * Chaque loi est présentée de façon factuelle, sans exagération, avec sa
 * source réglementaire. L'agent peut activer/désactiver celles qui s'appliquent
 * réellement au bien.
 * ========================================================================== */
export interface LawReference {
    id: string;
    /** Code court (ex: « L. ALUR »). */
    code: string;
    /** Titre complet. */
    title: string;
    /** Description factuelle et prudente. */
    description: string;
    /** Source réglementaire. */
    source: string;
    /** Emoji / icône. */
    icon: string;
}

export const LAW_REFERENCES: LawReference[] = [
    {
        id: 'alur',
        code: 'Loi ALUR',
        title: 'Loi pour l’Accès au Logement et un Urbanisme Rénové',
        description:
            'Encadre les mandats, la diffusion des annonces et les diagnostics obligatoires. Les informations présentées ici sont fournies à titre informatif et ne se substituent pas aux diagnostics officiels.',
        source: 'Loi n° 2014-366 du 24 mars 2014',
        icon: '⚖️',
    },
    {
        id: 'dpe',
        code: 'DPE',
        title: 'Diagnostic de Performance Énergétique',
        description:
            'Le DPE classe le logement de A à G. Depuis 2021, il est opposable et doit figurer dans toute annonce. Les valeurs affichées proviennent du DPE du bien le cas échéant.',
        source: 'Directive 2010/31/UE — Décret n° 2020-1610',
        icon: '🔋',
    },
    {
        id: 'carrez',
        code: 'Loi Carrez',
        title: 'Loi Carrez — Surface privative',
        description:
            'Pour les lots en copropriété, la surface privative (loi Carrez) doit être mentionnée au contrat. Une erreur de plus de 5 % peut ouvrir droit à une réduction de prix.',
        source: 'Loi n° 96-1107 du 18 décembre 1996',
        icon: '📐',
    },
    {
        id: 'distance-ecole',
        code: 'Carte scolaire',
        title: 'Affectation scolaire (carte scolaire)',
        description:
            'L’affectation d’un enfant dans une école dépend de la carte scolaire de la commune et du lieu de résidence. Les distances affichées sont indicatives et ne garantissent pas l’affectation.',
        source: 'Code de l’éducation — R. 131-1 et suiv.',
        icon: '🎒',
    },
    {
        id: 'urbanisme',
        code: 'PLU',
        title: 'Plan Local d’Urbanisme',
        description:
            'Le PLU détermine les règles de constructibilité et d’usage des sols de la commune. À vérifier auprès du service urbanisme avant tout projet.',
        source: 'Code de l’urbanisme — L. 151-1 et suiv.',
        icon: '🏗️',
    },
    {
        id: 'alur-annonce',
        code: 'Annonces',
        title: 'Contenu réglementaire des annonces immobilières',
        description:
            'Les annonces doivent mentionner la surface, le DPE/GES, les honoraires et la qualité du vendeur. Les métriques de quartier présentées sont des informations complémentaires non réglementaires.',
        source: 'Loi ALUR — Décret n° 2016-1807',
        icon: '📢',
    },
];

/* ============================================================================
 * MÉTRIQUES DE QUARTIER (référentiel)
 * ========================================================================== */
export interface MetricReference {
    id: string;
    label: string;
    icon: string;
    /** Fonction de calcul à partir des commodités les plus proches. */
    compute: (items: Record<string, AmenityItem | undefined>) => string;
}

export const METRIC_REFERENCES: MetricReference[] = [
    {
        id: 'boulangerie',
        label: 'Boulangerie',
        icon: '🥖',
        compute: (m) => fmtDist(m.boulangerie),
    },
    {
        id: 'supermarche',
        label: 'Supermarché',
        icon: '🛒',
        compute: (m) => fmtDist(m.supermarche || m.superette),
    },
    {
        id: 'primaire',
        label: 'École primaire',
        icon: '🎒',
        compute: (m) => fmtDist(m.primaire),
    },
    {
        id: 'maternelle',
        label: 'École maternelle',
        icon: '🧸',
        compute: (m) => fmtDist(m.maternelle),
    },
    {
        id: 'college',
        label: 'Collège',
        icon: '🎓',
        compute: (m) => fmtDist(m.college),
    },
    {
        id: 'pharmacie',
        label: 'Pharmacie',
        icon: '💊',
        compute: (m) => fmtDist(m.pharmacie),
    },
    {
        id: 'sport',
        label: 'Sport & loisirs',
        icon: '⚽',
        compute: (m) => fmtDist(m.sport),
    },
    {
        id: 'parc',
        label: 'Parc / espace vert',
        icon: '🌳',
        compute: (m) => fmtDist(m.parc),
    },
    {
        id: 'transport',
        label: 'Transports',
        icon: '🚌',
        compute: (m) => fmtDist(m.bus || m.gare),
    },
];

function fmtDist(item?: AmenityItem): string {
    if (!item) return '—';
    if (item.distanceMeters < 1000) return `${item.distanceMeters} m`;
    return `${(item.distanceMeters / 1000).toFixed(1)} km`;
}

/** Métriques par défaut (les plus parlantes pour un dossier client). */
export const DEFAULT_METRIC_IDS = [
    'boulangerie',
    'supermarche',
    'primaire',
    'college',
    'pharmacie',
    'transport',
];

/** Lois affichées par défaut (factuelles, sans exagération). */
export const DEFAULT_LAW_IDS = ['alur', 'dpe', 'carrez', 'distance-ecole'];

/** Options par défaut d'une fiche. */
export function defaultSheetOptions(property: Property): NeighborhoodSheetOptions {
    return {
        mapMode: 'satellite',
        radiusMeters: 800,
        showParcel: true,
        showCadastralDetails: false,
        showWalkability: true,
        showMetrics: true,
        showLaws: true,
        showLegend: true,
        showHeader: true,
        poiCategories: ['education', 'commerce', 'sport', 'sante', 'transport'],
        lawIds: [...DEFAULT_LAW_IDS],
        metricIds: [...DEFAULT_METRIC_IDS],
        accentColor: '#0F766E',
        agencyName: 'Nellimo Immobilier',
        agencyTagline: 'Conseil & transactions immobilières',
        showAddress: !!property.display_exact_address,
    };
}

/* ============================================================================
 * STORE localStorage (prêt pour Supabase)
 * ========================================================================== */

function loadSheets(): NeighborhoodSheet[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(NEIGHBORHOOD_SHEETS_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as NeighborhoodSheet[]) : [];
    } catch {
        return [];
    }
}

function persistSheets(sheets: NeighborhoodSheet[]) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(NEIGHBORHOOD_SHEETS_STORAGE_KEY, JSON.stringify(sheets));
    } catch {
        // quota dépassé : on ignore silencieusement
    }
}

/** Récupère toutes les fiches d'un bien. */
export function getSheetsForProperty(propertyId: string): NeighborhoodSheet[] {
    return loadSheets()
        .filter((s) => s.property_id === propertyId)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

/** Récupère une fiche par id. */
export function getSheetById(id: string): NeighborhoodSheet | undefined {
    return loadSheets().find((s) => s.id === id);
}

/** Enregistre (crée ou met à jour) une fiche. */
export function upsertSheet(sheet: NeighborhoodSheet): NeighborhoodSheet[] {
    const sheets = loadSheets();
    const idx = sheets.findIndex((s) => s.id === sheet.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
        sheets[idx] = { ...sheets[idx], ...sheet, updated_at: now };
    } else {
        sheets.unshift({ ...sheet, created_at: now, updated_at: now });
    }
    persistSheets(sheets);
    return sheets;
}

/** Supprime une fiche. */
export function deleteSheet(id: string): NeighborhoodSheet[] {
    const sheets = loadSheets().filter((s) => s.id !== id);
    persistSheets(sheets);
    return sheets;
}

/** Génère un identifiant unique. */
export function generateSheetId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Slug de nom de fichier à partir d'un titre. */
export function slugifySheetTitle(title: string): string {
    return (
        title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'fiche-quartier'
    );
}
