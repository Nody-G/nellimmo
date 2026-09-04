import type { ProspectingLead, ProspectingSource } from './types';

/**
 * Couture vers le scraping automatisé de pige (Leboncoin / PAP / ParuVendu).
 *
 * Ce module est la "couture" entre la saisie manuelle/CSV du radar de pige et le futur
 * scraping automatisé des annonces de particuliers. Il expose une interface de provider
 * unique afin que le reste de l'application ne dépende jamais d'une source concrète.
 *
 * Aujourd'hui, seul le provider "manuel" est actif : les leads sont saisis à la main ou
 * importés par CSV. Lors du raccordement au scraping (Phase E), il suffira d'implémenter
 * `scrapeListings` et de basculer la source sélectionnée — aucun autre fichier ne changera.
 */

/** Sources de détection de pige disponibles. */
export type PigeSourceMode = 'manuel' | 'scraping';

/** Paramètres d'une recherche de prospection automatisée. */
export interface PigeQuery {
    /** Communes cibles (ex. ["Pélissanne", "Salon-de-Provence"]). */
    localities?: string[];
    /** Types de biens recherchés. */
    propertyTypes?: string[];
    /** Prix maximum demandé (filtre de pertinence). */
    maxPrice?: number;
    /** Nombre maximal d'annonces à remonter. */
    limit?: number;
}

/** Contrat commun à toutes les sources de détection de pige. */
export interface PigeProvider {
    readonly id: PigeSourceMode;
    readonly label: string;
    /** Indique si les annonces proviennent d'un scraping automatisé réel. */
    readonly isAutomated: boolean;
    /** Récupère les annonces de particuliers détectées pour une requête donnée. */
    fetchListings(query: PigeQuery): Promise<ProspectingLead[]>;
}

/** Provider manuel : aucune détection automatique, saisie humaine uniquement. */
const manualProvider: PigeProvider = {
    id: 'manuel',
    label: 'Saisie manuelle & import CSV',
    isAutomated: false,
    async fetchListings(query: PigeQuery): Promise<ProspectingLead[]> {
        // La détection manuelle n'ajoute aucune annonce automatiquement :
        // les leads sont créés via le formulaire ou l'import CSV.
        // La requête est conservée pour respecter le contrat PigeProvider et
        // préparer la bascule vers le scraping (Phase E) sans changer d'interface.
        void query;
        return [];
    },
};

/**
 * Provider scraping — NON ACTIF.
 * Point de raccordement prévu pour le scraping Leboncoin / PAP / ParuVendu.
 * À implémenter lors de la Phase E (backend + conformité RGPD / CGU des portails requis).
 */
const scrapingProvider: PigeProvider = {
    id: 'scraping',
    label: 'Scraping automatisé (Leboncoin / PAP / ParuVendu)',
    isAutomated: true,
    async fetchListings(query: PigeQuery): Promise<ProspectingLead[]> {
        const zone = (query.localities ?? []).join(', ') || 'secteur inconnu';
        throw new Error(`Scraping automatisé non raccordé pour "${zone}" — utilisez la saisie manuelle ou l'import CSV.`);
    },
};

/** Registre des providers disponibles. */
const providers: Record<PigeSourceMode, PigeProvider> = {
    manuel: manualProvider,
    scraping: scrapingProvider,
};

/** Source actuellement sélectionnée. Basculez ici lors du raccordement scraping. */
const ACTIVE_MODE: PigeSourceMode = 'manuel';

/** Renvoie le provider actif. */
export function getActivePigeProvider(): PigeProvider {
    return providers[ACTIVE_MODE];
}

/** Récupère les annonces via la source active. */
export async function fetchPigeListings(query: PigeQuery): Promise<ProspectingLead[]> {
    return getActivePigeProvider().fetchListings(query);
}

/** Indique si la source active est automatisée (utile pour l'affichage de transparence). */
export function isPigeSourceAutomated(): boolean {
    return getActivePigeProvider().isAutomated;
}

/** Libellé de la source active (affiché dans les bandeaux de transparence). */
export function getActivePigeSourceLabel(): string {
    return getActivePigeProvider().label;
}

/** Sources d'annonces reconnues par le parseur CSV / l'auto-remplissage. */
export const PIGE_SOURCE_LABELS: Record<ProspectingSource, string> = {
    leboncoin: 'LeBonCoin',
    pap: 'PAP',
    paruvendu: 'ParuVendu',
    boitage: 'Boîtage Terrain',
    porte_a_porte: 'Porte-à-porte Terrain',
    recommandation: 'Recommandation',
};
