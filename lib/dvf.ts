import type { DVFTransaction } from './types';
import { MOCK_DVF_TRANSACTIONS } from './mock-data-dvf';

/**
 * Couture vers l'API DVF (DGFiP / data.gouv.fr / Notaires).
 *
 * Ce module est la "couture" entre le moteur d'estimation local et la source
 * officielle de ventes notariées. Il interroge en priorité la route API serveur
 * `/api/dvf` (connectée au flux ouvert open-data DVF), avec un repli automatique
 * et transparent vers les données locales de simulation si le réseau est indisponible.
 */

/** Sources de données DVF disponibles. */
export type DvfSource = 'local' | 'dgfip';

/** Paramètres de recherche des références DVF autour d'un bien. */
export interface DvfQuery {
    /** Ville ou adresse recherchée (ex. "Pélissanne"). */
    locality?: string;
    /** Code postal (ex. "13330"). */
    postalCode?: string;
    /** Rayon de recherche en mètres. */
    radiusMeters?: number;
    /** Type de bien souhaité (ex. "Maison"). */
    propertyType?: string;
}

/** Contrat commun à toutes les sources DVF. */
export interface DvfProvider {
    readonly id: DvfSource;
    readonly label: string;
    /** Indique si les données proviennent d'une vraie source officielle. */
    readonly isOfficial: boolean;
    /** Récupère les transactions comparables pour une requête donnée. */
    fetchTransactions(query: DvfQuery): Promise<DVFTransaction[]>;
}

/** État d'exécution mémorisé pour la transparence UI. */
let lastFetchOfficial = false;
let lastSourceLabel = 'API DGFiP / data.gouv.fr (Notaires de France)';

/** Provider local : jeu de données de démonstration (simulation). */
const localProvider: DvfProvider = {
    id: 'local',
    label: 'Données locales de démonstration (Simulation)',
    isOfficial: false,
    async fetchTransactions(query: DvfQuery): Promise<DVFTransaction[]> {
        let rows = MOCK_DVF_TRANSACTIONS;
        if (query.postalCode) {
            const filtered = rows.filter((t) => t.code_postal === query.postalCode);
            if (filtered.length > 0) rows = filtered;
        }
        if (query.propertyType) {
            const wanted = query.propertyType.trim().toLowerCase().replace(/[^a-z]/g, '');
            const typed = rows.filter((t) => t.type_local.trim().toLowerCase().replace(/[^a-z]/g, '') === wanted);
            if (typed.length > 0) rows = typed;
        }
        lastFetchOfficial = false;
        lastSourceLabel = 'Données locales de démonstration (Simulation)';
        return rows;
    },
};

/** Provider DGFiP : interroge /api/dvf qui contacte le flux open data officiel. */
const dgfipProvider: DvfProvider = {
    id: 'dgfip',
    label: 'API DGFiP / data.gouv.fr (Notaires de France)',
    isOfficial: true,
    async fetchTransactions(query: DvfQuery): Promise<DVFTransaction[]> {
        try {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams();
                if (query.postalCode) params.set('postal_code', query.postalCode);
                if (query.locality) params.set('locality', query.locality);
                if (query.propertyType) params.set('property_type', query.propertyType);

                const res = await fetch(`/api/dvf?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
                        lastFetchOfficial = Boolean(data.isOfficial);
                        lastSourceLabel = data.sourceLabel || (data.isOfficial ? 'Données Officielles DGFiP (Notaires)' : 'Données locales');
                        return data.transactions;
                    }
                }
            }
        } catch {
            // Repli transparent
        }

        // Si l'API échoue ou en mode hors-navigateur, repli sur localProvider
        return localProvider.fetchTransactions(query);
    },
};

/** Registre des providers disponibles. */
const providers: Record<DvfSource, DvfProvider> = {
    local: localProvider,
    dgfip: dgfipProvider,
};

/** Source actuellement sélectionnée. */
const ACTIVE_SOURCE: DvfSource = 'dgfip';

/** Renvoie le provider actif. */
export function getActiveDvfProvider(): DvfProvider {
    return providers[ACTIVE_SOURCE];
}

/** Récupère les transactions via la source active (avec repli local automatique). */
export async function fetchDvfTransactions(query: DvfQuery): Promise<DVFTransaction[]> {
    return getActiveDvfProvider().fetchTransactions(query);
}

/** Résultat complet avec métadonnées de transparence de source. */
export async function fetchDvfResult(query: DvfQuery): Promise<{
    transactions: DVFTransaction[];
    isOfficial: boolean;
    sourceLabel: string;
}> {
    const transactions = await fetchDvfTransactions(query);
    return {
        transactions,
        isOfficial: lastFetchOfficial,
        sourceLabel: lastSourceLabel,
    };
}

/** Indique si la dernière extraction provient d'une vraie source officielle. */
export function isDvfSourceOfficial(): boolean {
    return lastFetchOfficial || getActiveDvfProvider().isOfficial;
}

/** Libellé de la source (affiché dans les bandeaux de transparence). */
export function getActiveDvfSourceLabel(): string {
    return lastSourceLabel || getActiveDvfProvider().label;
}
