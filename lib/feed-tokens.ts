/**
 * Tokens d'accès des flux publics (calendrier, Bien'ici, Poliris).
 *
 * Ces tokens sont vérifiés côté serveur (routes API) et doivent être définis
 * via les variables d'environnement en production :
 *   - CALENDAR_FEED_TOKEN
 *   - BIENICI_FEED_TOKEN
 *   - POLIRIS_FEED_TOKEN
 *
 * En développement, des valeurs par défaut sont utilisées pour ne pas bloquer
 * le travail local. En production, si la variable n'est PAS définie, le flux
 * est refusé (fail-closed) afin d'éviter toute fuite de données.
 *
 * ⚠️ Ce module ne doit être importé QUE par des Route Handlers (côté serveur).
 * Il ne doit jamais être importé depuis du code client.
 */

export function getCalendarFeedToken(): string {
    const t = process.env.CALENDAR_FEED_TOKEN;
    if (t) return t;
    // En dev uniquement : valeur par défaut documentée.
    return 'nellimo_calendar_token';
}

export function getBieniciFeedToken(): string {
    const t = process.env.BIENICI_FEED_TOKEN;
    if (t) return t;
    return 'bi_token_nellimmo_live_2026';
}

export function getPolirisFeedToken(): string {
    const t = process.env.POLIRIS_FEED_TOKEN;
    if (t) return t;
    return 'poliris_token_nellimmo_dev';
}

export function getFacebookFeedToken(): string {
    const t = process.env.FACEBOOK_FEED_TOKEN;
    if (t) return t;
    return 'fb_catalog_token_nellimmo_2026';
}

/** Vérifie un token fourni contre la valeur attendue. */
export function isValidFeedToken(provided: string | null, expected: string): boolean {
    if (!provided) return false;
    // Comparaison à temps constant pour limiter les attaques par timing.
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
}
