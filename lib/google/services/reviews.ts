/**
 * Service Google Business Profile / Avis (Lot 7).
 *
 * Récupère les avis Google de l'établissement via l'API Business Profile v4.
 *
 * ⚠️ Ce service nécessite une approbation Google spécifique (Business Profile
 * API). Le scope `business.manage` est marqué `requiresApiApproval` dans
 * `lib/google/scopes.ts` : tant que l'approbation n'est pas accordée, les
 * appels renverront une erreur 403 explicite, correctement remontée à l'UI.
 *
 * Aucun appel direct : tout passe par le proxy `/api/google/proxy`.
 */

import { callGoogleProxy } from '../proxy-client';

/** Compte Business Profile. */
export interface GoogleBusinessAccount {
    name: string;
    accountName?: string;
    type?: string;
    role?: string;
}

/** Établissement Business Profile. */
export interface GoogleBusinessLocation {
    name: string;
    locationName?: string;
    storeCode?: string;
    primaryPhone?: string;
    primaryCategory?: { displayName?: string };
}

/** Avis Google. */
export interface GoogleReview {
    reviewId: string;
    reviewer?: { displayName?: string; profilePhotoUrl?: string };
    starRating?: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
    comment?: string;
    createTime?: string;
    updateTime?: string;
    reviewReply?: { comment?: string; updateTime?: string };
}

/** Réponse de `reviews:accounts.list`. */
export interface GoogleAccountsResponse {
    accounts?: GoogleBusinessAccount[];
    nextPageToken?: string;
}

/** Réponse de `reviews:locations.list`. */
export interface GoogleLocationsResponse {
    locations?: GoogleBusinessLocation[];
    nextPageToken?: string;
}

/** Réponse de `reviews:reviews.list`. */
export interface GoogleReviewsResponse {
    reviews?: GoogleReview[];
    averageRating?: number;
    totalReviewCount?: number;
    nextPageToken?: string;
}

/** Convertit une note Google en nombre d'étoiles (1-5). */
export function starRatingToNumber(rating?: GoogleReview['starRating']): number {
    switch (rating) {
        case 'ONE':
            return 1;
        case 'TWO':
            return 2;
        case 'THREE':
            return 3;
        case 'FOUR':
            return 4;
        case 'FIVE':
            return 5;
        default:
            return 0;
    }
}

/** Liste les comptes Business Profile accessibles. */
export async function listBusinessAccounts(): Promise<GoogleBusinessAccount[]> {
    const data = await callGoogleProxy<GoogleAccountsResponse>({
        service: 'reviews',
        action: 'accounts.list',
    });
    return data.accounts ?? [];
}

/** Liste les établissements d'un compte. */
export async function listBusinessLocations(
    accountId: string
): Promise<GoogleBusinessLocation[]> {
    const data = await callGoogleProxy<GoogleLocationsResponse>({
        service: 'reviews',
        action: 'locations.list',
        pathParams: { accountId },
    });
    return data.locations ?? [];
}

/**
 * Liste les avis d'un établissement.
 * @param accountId identifiant du compte (ex. `accounts/123`).
 * @param locationId identifiant de l'établissement (ex. `locations/456`).
 */
export async function listBusinessReviews(
    accountId: string,
    locationId: string
): Promise<GoogleReviewsResponse> {
    return callGoogleProxy<GoogleReviewsResponse>({
        service: 'reviews',
        action: 'reviews.list',
        pathParams: { accountId, locationId },
    });
}

/**
 * Récupère les avis du premier établissement disponible.
 * @returns les avis et la note moyenne, ou `null` si aucun établissement.
 */
export async function fetchPrimaryReviews(): Promise<GoogleReviewsResponse | null> {
    const accounts = await listBusinessAccounts();
    if (accounts.length === 0) return null;

    const accountId = accounts[0].name;
    const locations = await listBusinessLocations(accountId);
    if (locations.length === 0) return null;

    const locationId = locations[0].name;
    return listBusinessReviews(accountId, locationId);
}
