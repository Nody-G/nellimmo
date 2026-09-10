'use client';

/**
 * Hook de la modale de connexion Google au démarrage.
 *
 * Rôle : décider si l'invitation à connecter Google doit s'afficher, et
 * mémoriser le choix de l'utilisateur.
 *
 * Règles :
 * - Un seul appel à `/api/google/oauth/status` au montage (aucun polling).
 * - La modale ne s'affiche jamais si le compte est déjà connecté.
 * - Elle ne s'affiche plus après un clic sur « Plus tard » (persistant).
 * - Elle s'affiche même si la configuration serveur est incomplète, mais
 *   dans ce cas le composant présente un encart d'aide au lieu du bouton.
 *
 * Aucun jeton ne transite par ce hook : uniquement des métadonnées.
 */

import { useCallback, useEffect, useState } from 'react';
import { useGoogleConnection } from '@/components/cockpit/parametres/google/useGoogleConnection';

/** Clé `localStorage` mémorisant le refus de connexion. */
export const GOOGLE_PROMPT_DISMISSED_KEY = 'nellimmo_google_prompt_dismissed';

/** Délai avant affichage, pour laisser le cockpit se peindre (ms). */
const PROMPT_DELAY_MS = 1200;

function readDismissed(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(GOOGLE_PROMPT_DISMISSED_KEY) === '1';
    } catch {
        return false;
    }
}

function writeDismissed(value: boolean): void {
    if (typeof window === 'undefined') return;
    try {
        if (value) {
            window.localStorage.setItem(GOOGLE_PROMPT_DISMISSED_KEY, '1');
        } else {
            window.localStorage.removeItem(GOOGLE_PROMPT_DISMISSED_KEY);
        }
    } catch {
        /* stockage indisponible : on ignore silencieusement */
    }
}

export function useGoogleStartupPrompt() {
    const { status, isLoading, error, isConnected, isConfigured, connect, refreshStatus } =
        useGoogleConnection();

    const [isDismissed, setIsDismissed] = useState<boolean>(() => readDismissed());
    const [isOpen, setIsOpen] = useState(false);

    // Efface le refus dès qu'une connexion réussit, afin de pouvoir
    // ré-inviter l'utilisateur s'il se déconnecte plus tard.
    useEffect(() => {
        if (isConnected && isDismissed) {
            writeDismissed(false);
            setIsDismissed(false);
        }
    }, [isConnected, isDismissed]);

    // Décide de l'ouverture, une seule fois le statut connu.
    useEffect(() => {
        if (isLoading) return;
        if (isConnected) return;
        if (isDismissed) return;

        const timer = window.setTimeout(() => setIsOpen(true), PROMPT_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [isLoading, isConnected, isDismissed]);

    /** Ferme la modale et mémorise le refus de façon persistante. */
    const dismiss = useCallback(() => {
        writeDismissed(true);
        setIsDismissed(true);
        setIsOpen(false);
    }, []);

    /** Ferme la modale sans mémoriser (ex. fermeture par Échap). */
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    /** Lance la redirection vers l'écran de consentement Google. */
    const startConnection = useCallback(() => {
        setIsOpen(false);
        connect();
    }, [connect]);

    return {
        /** La modale doit-elle être visible ? */
        isOpen,
        /** Statut réel de la connexion Google. */
        status,
        /** Vérification du statut en cours. */
        isLoading,
        /** Erreur éventuelle de lecture du statut. */
        error,
        /** Compte Google déjà connecté. */
        isConnected,
        /** Variables d'environnement OAuth présentes côté serveur. */
        isConfigured,
        /** Ferme et mémorise le refus. */
        dismiss,
        /** Ferme sans mémoriser. */
        close,
        /** Redirige vers Google. */
        startConnection,
        /** Recharge le statut. */
        refreshStatus,
    };
}
