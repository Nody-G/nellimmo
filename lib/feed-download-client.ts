import type { Property, AgencySettings } from './types';

/**
 * Téléchargement des flux portails côté navigateur.
 *
 * ⚠️ POURQUOI POST ET PAS UN SIMPLE LIEN GET ?
 * La route GET `/api/feeds/download?feed=...` lit les données depuis Supabase
 * (mode serveur). Tant que Nelly n'a pas créé son compte Supabase, cette route
 * ne peut rien produire. Le mode POST, lui, transmet les données réelles de la
 * session locale (`properties` + `settings`) et génère le fichier à la volée :
 * il fonctionne donc immédiatement, sans backend.
 *
 * Ce module centralise ce comportement pour que TOUS les canaux de la page
 * Multidiffusion (SeLoger, LeBonCoin, Bien'ici, Figaro, Green-Acres, Meta, PAP)
 * utilisent le même mécanisme fiable.
 */

export type FeedKey =
    | 'poliris'
    | 'leboncoin'
    | 'bienici'
    | 'figaro'
    | 'greenacres'
    | 'facebook'
    | 'pap';

/** Nom de fichier proposé au téléchargement pour chaque flux. */
export const FEED_FILENAMES: Record<FeedKey, string> = {
    poliris: 'import_nellimo_poliris.zip',
    leboncoin: 'import_leboncoin_nellimo.csv',
    bienici: 'flux_bienici_nellimo.xml',
    figaro: 'flux_figaro_nellimo.xml',
    greenacres: 'flux_greenacres_nellimo.xml',
    facebook: 'meta_catalog_nellimo.xml',
    pap: 'flux_pap_nellimo.xml',
};

export interface DownloadFeedResult {
    ok: boolean;
    error?: string;
}

/**
 * Génère et télécharge un flux portail à partir des données locales.
 *
 * @param feed       Clé du flux (poliris, leboncoin, ...).
 * @param properties Biens à exporter (généralement les biens actifs).
 * @param settings   Paramètres agence issus de la session locale.
 */
export async function downloadFeed(
    feed: FeedKey,
    properties: Property[],
    settings: AgencySettings
): Promise<DownloadFeedResult> {
    if (!properties || properties.length === 0) {
        return {
            ok: false,
            error: 'Aucun bien actif à exporter. Activez au moins un mandat.',
        };
    }

    try {
        const res = await fetch(`/api/feeds/download?feed=${feed}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties, settings }),
        });

        if (!res.ok) {
            let message = 'Échec de la génération du flux.';
            try {
                const data = await res.json();
                if (data?.error) message = data.error;
            } catch {
                // Réponse non-JSON : on conserve le message générique.
            }
            return { ok: false, error: message };
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = FEED_FILENAMES[feed];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { ok: true };
    } catch (err) {
        return {
            ok: false,
            error:
                err instanceof Error
                    ? err.message
                    : 'Erreur réseau lors du téléchargement du flux.',
        };
    }
}
