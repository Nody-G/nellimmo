'use client';

/**
 * Hook de synchronisation Google Contacts (Lot 5).
 *
 * Pousse un contact Nellimmo vers Google Contacts (création ou mise à jour
 * idempotente via `google_resource_name`) et permet de lister les contacts
 * Google pour un rapprochement manuel.
 *
 * Garde-fous : aucun polling, appels déclenchés par action utilisateur,
 * erreurs de connexion exposées via `needsConnection`.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { isConnectionError } from '@/lib/google/proxy-client';
import {
    listGoogleContacts,
    upsertGoogleContact,
    type GooglePerson,
} from '@/lib/google/services/contacts';
import type { ContactItem } from '@/lib/types';

export interface UseGoogleContactsResult {
    /** Une synchronisation est en cours. */
    isSyncing: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si l'erreur indique un compte Google non connecté. */
    needsConnection: boolean;
    /**
     * Synchronise un contact vers Google.
     * @returns le `resourceName` Google à stocker sur le contact, ou `null`.
     */
    syncContact: (contact: ContactItem) => Promise<string | null>;
    /** Liste les contacts Google de l'utilisateur. */
    listContacts: () => Promise<GooglePerson[]>;
}

export function useGoogleContacts(): UseGoogleContactsResult {
    const { showToast } = useToast();
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsConnection, setNeedsConnection] = useState(false);

    const run = useCallback(
        async <T,>(fn: () => Promise<T>, successMessage?: string): Promise<T | null> => {
            setIsSyncing(true);
            setError(null);
            setNeedsConnection(false);
            try {
                const result = await fn();
                if (successMessage) showToast(successMessage, 'success');
                return result;
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Erreur de synchronisation des contacts.';
                setError(message);
                if (isConnectionError(err)) {
                    setNeedsConnection(true);
                    showToast('Connectez votre compte Google pour synchroniser les contacts.', 'error');
                } else {
                    showToast(message, 'error');
                }
                return null;
            } finally {
                setIsSyncing(false);
            }
        },
        [showToast]
    );

    const syncContact = useCallback(
        async (contact: ContactItem): Promise<string | null> => {
            const result = await run(
                () => upsertGoogleContact(contact),
                'Contact synchronisé avec Google.'
            );
            return result?.resourceName ?? null;
        },
        [run]
    );

    const listContacts = useCallback(async (): Promise<GooglePerson[]> => {
        const result = await run(() => listGoogleContacts());
        return result ?? [];
    }, [run]);

    return { isSyncing, error, needsConnection, syncContact, listContacts };
}
