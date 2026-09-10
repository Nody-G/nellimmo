/**
 * Client navigateur du proxy Google.
 *
 * Point d'entrée unique pour tous les hooks `useGoogle*` : ils n'appellent
 * jamais Google directement, mais passent par `/api/google/proxy`.
 *
 * ⚠️ Aucun jeton ne transite ici : le proxy injecte le token côté serveur.
 */

import type { GoogleServiceKey } from './scopes';

export interface GoogleProxyCall {
    service: GoogleServiceKey;
    action: string;
    payload?: unknown;
    query?: Record<string, string>;
    pathParams?: Record<string, string>;
}

export class GoogleProxyError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status: number
    ) {
        super(message);
        this.name = 'GoogleProxyError';
    }
}

/**
 * Appelle le proxy Google.
 * @throws GoogleProxyError avec un code exploitable par l'UI
 * (`not_connected`, `token_revoked`, `forbidden_action`, `google_api_error`).
 */
export async function callGoogleProxy<T = unknown>(call: GoogleProxyCall): Promise<T> {
    const res = await fetch('/api/google/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(call),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        const code = (json?.error as string) || 'unknown_error';
        const message = (json?.message as string) || `Erreur Google (HTTP ${res.status}).`;
        throw new GoogleProxyError(message, code, res.status);
    }

    return json.data as T;
}

/** Indique si une erreur correspond à un compte non connecté / révoqué. */
export function isConnectionError(error: unknown): boolean {
    return (
        error instanceof GoogleProxyError &&
        (error.code === 'not_connected' || error.code === 'token_revoked')
    );
}
