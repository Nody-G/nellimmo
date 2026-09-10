'use client';

import React from 'react';
import Image from 'next/image';
import { getBrandLogo, type BrandKey } from '@/lib/brand-logos';

interface BrandLogoProps {
    /**
     * Clé de marque référencée dans `lib/brand-logos.ts`.
     * `undefined` => le composant ne rend rien (utile pour les listes où
     * certaines entrées n'ont pas de logo officiel disponible).
     */
    brand: BrandKey | string | undefined;
    /**
     * Taille en pixels du carré contenant le logo.
     * Le logo est toujours contenu (object-contain) dans ce carré.
     */
    size?: number;
    /** Classe CSS additionnelle appliquée au conteneur. */
    className?: string;
    /** Affiche le nom de la marque à côté du logo. */
    showLabel?: boolean;
    /** Classe CSS du libellé texte. */
    labelClassName?: string;
    /** Force un repli textuel même si un logo existe. */
    forceText?: boolean;
}

/**
 * Affiche le logo officiel d'une marque tierce (portail, réseau social,
 * partenaire). Si aucun asset officiel n'est disponible, replie proprement
 * sur le nom de la marque en texte — jamais d'image générée.
 *
 * Le composant est volontairement « muet » sur le style : il s'adapte au
 * conteneur appelant pour rester utilisable dans les cartes, les tableaux,
 * les en-têtes et les pieds de page.
 */
export function BrandLogo({
    brand,
    size = 20,
    className = '',
    showLabel = false,
    labelClassName = '',
    forceText = false,
}: BrandLogoProps) {
    // Aucune marque fournie : ne rien rendre (pas de repli textuel parasite).
    if (!brand) return null;

    const logo = getBrandLogo(brand);

    // Repli textuel : marque inconnue ou asset indisponible.
    if (!logo || forceText) {
        const fallbackLabel = logo?.label ?? String(brand);
        return (
            <span
                className={`inline-flex items-center justify-center font-bold text-gray-700 ${className}`}
                title={fallbackLabel}
            >
                <span className={labelClassName || 'text-xs'}>{fallbackLabel}</span>
            </span>
        );
    }

    const image = (
        <Image
            src={logo.src}
            alt={logo.label}
            width={logo.width}
            height={logo.height}
            className="object-contain"
            style={{ width: size, height: size }}
            unoptimized
        />
    );

    if (!showLabel) {
        return (
            <span
                className={`inline-flex items-center justify-center shrink-0 ${className}`}
                title={logo.label}
            >
                {image}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
            <span className="inline-flex items-center justify-center shrink-0">{image}</span>
            <span className={`truncate ${labelClassName || 'text-xs font-semibold text-gray-800'}`}>
                {logo.label}
            </span>
        </span>
    );
}

export default BrandLogo;
