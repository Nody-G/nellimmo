'use client';

import { useEffect } from 'react';

/**
 * Enregistre le service worker du cockpit (hors-ligne) au chargement.
 * Ne s'exécute que côté navigateur, uniquement en production ou en localhost
 * (le service worker exige un contexte sécurisé HTTPS ou localhost).
 */
export function PwaRegister() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        // En développement, on évite d'enregistrer le SW pour ne pas gêner le hot-reload.
        if (process.env.NODE_ENV !== 'production' && !window.location.hostname.includes('localhost')) {
            return;
        }

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none',
                });
                // Vérifier une mise à jour au retour au premier plan.
                const checkForUpdate = () => {
                    registration.update().catch(() => {
                        /* silencieux */
                    });
                };
                window.addEventListener('focus', checkForUpdate);
                return () => window.removeEventListener('focus', checkForUpdate);
            } catch {
                /* Le SW n'est pas disponible (contexte non sécurisé, etc.) — silencieux. */
            }
        };

        // Attendre que la page soit chargée avant d'enregistrer.
        if (document.readyState === 'complete') {
            register();
        } else {
            window.addEventListener('load', register);
            return () => window.removeEventListener('load', register);
        }
    }, []);

    return null;
}
