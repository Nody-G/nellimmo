'use client';

/**
 * Hook Google Business Profile / Avis (Lot 7).
 *
 * Récupère les avis Google de l'établissement. Ce service dépend de
 * l'approbation Google de la Business Profile API : si elle n'est pas
 * accordée, l'erreur 403 est remontée via `requiresApproval`.
 *
 * Garde-fous : aucun polling, chargement déclenché par action utilisateur.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { isConnectionError, GoogleProxyError } from '@/lib/google/proxy-client';
import {
    fetchPrimaryReviews,
    type GoogleReview,
} from '@/lib/google/services/reviews';

export interface UseGoogleReviewsResult {
    /** Un chargement est en cours. */
    isLoading: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si le compte Google n'est pas connecté. */
    needsConnection: boolean;
    /** `true` si l'API Business Profile n'est pas approuvée par Google. */
    requiresApproval: boolean;
    /** Liste des avis chargés. */
    reviews: GoogleReview[];
    /** Note moyenne renvoyée par Google (ou `null`). */
    averageRating: number | null;
    /** Nombre total d'avis (ou `null`). */
    totalReviewCount: number | null;
    /** Charge les avis du premier établissement disponible. */
    loadReviews: () => Promise<void>;
}

export function useGoogleReviews(): UseGoogleReviewsResult {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsConnection, setNeedsConnection] = useState(false);
    const [requiresApproval, setRequiresApproval] = useState(false);
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [totalReviewCount, setTotalReviewCount] = useState<number | null>(null);

    const loadReviews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setNeedsConnection(false);
        setRequiresApproval(false);
        try {
            const data = await fetchPrimaryReviews();
            if (!data) {
                setReviews([]);
                setAverageRating(null);
                setTotalReviewCount(null);
                showToast('Aucun établissement Google Business trouvé.', 'error');
                return;
            }
            setReviews(data.reviews ?? []);
            setAverageRating(data.averageRating ?? null);
            setTotalReviewCount(data.totalReviewCount ?? null);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Erreur de chargement des avis Google.';
            setError(message);
            if (isConnectionError(err)) {
                setNeedsConnection(true);
                showToast('Connectez votre compte Google pour charger les avis.', 'error');
            } else if (err instanceof GoogleProxyError && err.status === 403) {
                setRequiresApproval(true);
                showToast(
                    'L’API Google Business Profile doit être approuvée par Google.',
                    'error'
                );
            } else {
                showToast(message, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    return {
        isLoading,
        error,
        needsConnection,
        requiresApproval,
        reviews,
        averageRating,
        totalReviewCount,
        loadReviews,
    };
}
