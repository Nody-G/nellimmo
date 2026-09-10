'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Types d'entités interconnectables dans l'application.
 * Chaque `kind` correspond à une cible canonique de deep-link (cf. plans/interconnectivite-redirections.md).
 */
export type EntityKind =
    | 'property'
    | 'contact'
    | 'buyer'
    | 'deal'
    | 'visit'
    | 'partner'
    | 'delegation'
    | 'key'
    | 'signboard'
    | 'lead'
    | 'event';

/**
 * Table de mapping centralisée : source unique de vérité pour la construction
 * des URLs de deep-link par entité.
 */
export const ENTITY_ROUTES: Record<EntityKind, (id: string) => string> = {
    property: (id) => `/cockpit/mandats/${id}`,
    contact: (id) => `/cockpit/contacts?id=${id}`,
    buyer: (id) => `/cockpit/acquereurs?id=${id}`,
    deal: (id) => `/cockpit/transactions?id=${id}`,
    visit: (id) => `/cockpit/visites?propertyId=${id}`,
    partner: (id) => `/cockpit/inter-agences?partnerId=${id}`,
    delegation: (id) => `/cockpit/inter-agences?delegationId=${id}`,
    key: (id) => `/cockpit/cles-panneaux?keyId=${id}`,
    signboard: (id) => `/cockpit/cles-panneaux?signboardId=${id}`,
    lead: (id) => `/cockpit/pige?leadId=${id}`,
    event: (id) => `/cockpit/agenda?eventId=${id}`,
};

export interface EntityLinkProps {
    /** Type d'entité cible. */
    kind: EntityKind;
    /** Identifiant de l'entité cible. Si vide/undefined, un `<span>` neutre est rendu. */
    id?: string | null;
    /** Contenu affiché (texte, badge, etc.). */
    children: React.ReactNode;
    /** Affiche un chevron discret révélé au survol. */
    withIcon?: boolean;
    /** Classes additionnelles. */
    className?: string;
    /** Empêche la propagation du clic (cartes cliquables, lignes de tableau). */
    stopPropagation?: boolean;
    /** Tooltip natif. */
    title?: string;
}

/**
 * Lien d'entité normalisé : style hover cohérent, chevron optionnel,
 * gestion `stopPropagation` et dégradation gracieuse si l'id est absent.
 *
 * Composant purement présentationnel (doctrine god-component).
 */
export function EntityLink({
    kind,
    id,
    children,
    withIcon = false,
    className = '',
    stopPropagation = false,
    title,
}: EntityLinkProps) {
    const baseClass = `text-inherit hover:text-[#E12B7B] hover:underline underline-offset-2 transition-colors ${className}`.trim();

    // Dégradation gracieuse : pas d'id => pas de lien cassé.
    if (!id) {
        return <span className={className}>{children}</span>;
    }

    const href = ENTITY_ROUTES[kind](id);

    return (
        <Link
            href={href}
            title={title}
            className={`${baseClass} group/entitylink inline-flex items-center gap-0.5`}
            onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        >
            <span>{children}</span>
            {withIcon && (
                <span
                    aria-hidden="true"
                    className="opacity-0 group-hover/entitylink:opacity-100 transition-opacity text-[#E12B7B]"
                >
                    ›
                </span>
            )}
        </Link>
    );
}
