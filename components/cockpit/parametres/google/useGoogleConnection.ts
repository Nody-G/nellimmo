'use client';

/**
 * Hook de gestion de la connexion Google OAuth.
 *
 * Expose l'état réel (issu de `/api/google/oauth/status`), la connexion
 * (redirection vers `/api/google/oauth/start`) et la déconnexion.
 *
 * Aucun jeton ne transite par ce hook : uniquement des métadonnées.
 */

import { useCallback, useEffect, useState } from 'react';
import type { GoogleServiceKey } from '@/lib/google/scopes';

export interface GoogleConnectionStatus {
    configured: boolean;
    connected: boolean;
    email: string | null;
    name: string | null;
    scopes: string[];
    expiresAt: string | null;
    services: Partial<Record<GoogleServiceKey, boolean>>;
    encryptionReady: boolean;
}

const INITIAL_STATUS: GoogleConnectionStatus = {
    configured: false,
    connected: false,
    email: null,
    name: null,
    scopes: [],
    expiresAt: null,
    services: {},
    encryptionReady: false,
};

export function useGoogleConnection() {
    const [status, setStatus] = useState<GoogleConnectionStatus>(INITIAL_STATUS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/google/oauth/status', { cache: 'no-store' });
            const data = (await res.json()) as GoogleConnectionStatus;
            setStatus({ ...INITIAL_STATUS, ...data });
        } catch {
            setError('Impossible de vérifier l\'état de la connexion Google.');
            setStatus(INITIAL_STATUS);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshStatus();
    }, [refreshStatus]);

    /**
     * Redirige vers l'écran de consentement Google.
     * @param services Services à autoriser (optionnel).
     * @param returnTo Page de retour après le callback (défaut : page courante).
     */
    const connect = useCallback((services?: GoogleServiceKey[], returnTo?: string) => {
        const params = new URLSearchParams();
        if (services && services.length > 0) params.set('services', services.join(','));
        const target =
            returnTo ?? (typeof window !== 'undefined' ? window.location.pathname : '/cockpit');
        params.set('returnTo', target);
        window.location.href = `/api/google/oauth/start?${params.toString()}`;
    }, []);

    /** Révoque le jeton et repasse à l'état déconnecté. */
    const disconnect = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/google/oauth/disconnect', { method: 'POST' });
            if (!res.ok) throw new Error('Échec de la déconnexion.');
            await refreshStatus();
        } catch {
            setError('Impossible de déconnecter le compte Google.');
            setIsLoading(false);
        }
    }, [refreshStatus]);

    /** Force un rafraîchissement explicite du jeton. */
    const refreshToken = useCallback(async () => {
        try {
            const res = await fetch('/api/google/oauth/refresh', { method: 'POST' });
            if (!res.ok) throw new Error('Échec du rafraîchissement.');
            await refreshStatus();
            return true;
        } catch {
            setError('Le jeton Google a expiré. Reconnectez votre compte.');
            return false;
        }
    }, [refreshStatus]);

    return {
        status,
        isLoading,
        error,
        isConnected: status.connected,
        isConfigured: status.configured,
        connect,
        disconnect,
        refreshStatus,
        refreshToken,
    };
}
