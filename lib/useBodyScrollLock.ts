'use client';

import { useEffect } from 'react';

/**
 * Verrou de défilement du <body> centralisé et compté par références.
 *
 * Problème résolu : plusieurs modales peuvent être montées simultanément
 * (ex. fermeture d'une modale de détail pendant l'ouverture d'une modale
 * d'édition). Avec un simple `document.body.style.overflow = ''` dans chaque
 * cleanup, la dernière modale démontée écrasait l'état des autres et laissait
 * la page soit bloquée (overflow: hidden orphelin → page floue, impossible de
 * cliquer), soit déverrouillée à tort.
 *
 * Ce hook maintient un compteur global : le body est verrouillé tant qu'au
 * moins une modale est ouverte, et restauré uniquement quand la dernière
 * se ferme. Il préserve aussi la valeur d'overflow d'origine.
 */

let lockCount = 0;
let originalOverflow = '';

function acquireLock(): void {
    if (typeof document === 'undefined') return;
    if (lockCount === 0) {
        originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    lockCount += 1;
}

function releaseLock(): void {
    if (typeof document === 'undefined') return;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
    }
}

/**
 * Verrouille le défilement du body tant que `isActive` est vrai.
 * Sûr en cas d'empilement de plusieurs modales.
 */
export function useBodyScrollLock(isActive: boolean = true): void {
    useEffect(() => {
        if (!isActive) return;

        acquireLock();
        return () => {
            releaseLock();
        };
    }, [isActive]);
}
