'use client';

/**
 * Hook d'envoi d'emails via Gmail (Lot 3).
 *
 * Remplace l'ouverture de Gmail Web par un envoi réel côté serveur, tout en
 * conservant un repli (`openGmailCompose`) si le compte Google n'est pas
 * connecté.
 *
 * Garde-fous : aucun polling, un seul envoi par action utilisateur, erreurs
 * exposées via `needsConnection`.
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { isConnectionError } from '@/lib/google/proxy-client';
import {
    sendGmailMessage,
    type GmailMessage,
    type GmailMessageInput,
} from '@/lib/google/services/gmail';
import { openGmailCompose } from '@/lib/gmail';

export interface UseGmailSenderResult {
    /** Un envoi est en cours. */
    isSending: boolean;
    /** Dernière erreur lisible (ou `null`). */
    error: string | null;
    /** `true` si l'erreur indique un compte Google non connecté. */
    needsConnection: boolean;
    /** Envoie un email via Gmail. Retourne le message créé ou `null`. */
    send: (input: GmailMessageInput) => Promise<GmailMessage | null>;
    /**
     * Ouvre Gmail Web en composition (repli sans connexion OAuth).
     */
    openCompose: (input: GmailMessageInput) => void;
}

export function useGmailSender(): UseGmailSenderResult {
    const { showToast } = useToast();
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsConnection, setNeedsConnection] = useState(false);

    const send = useCallback(
        async (input: GmailMessageInput): Promise<GmailMessage | null> => {
            setIsSending(true);
            setError(null);
            setNeedsConnection(false);
            try {
                const message = await sendGmailMessage(input);
                showToast('Email envoyé via Gmail.', 'success');
                return message;
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Échec de l’envoi de l’email.';
                setError(message);
                if (isConnectionError(err)) {
                    setNeedsConnection(true);
                    showToast(
                        'Compte Google non connecté : ouverture de Gmail Web à la place.',
                        'error'
                    );
                    openGmailCompose({
                        to: input.to,
                        cc: input.cc,
                        bcc: input.bcc,
                        subject: input.subject,
                        body: input.body,
                    });
                } else {
                    showToast(message, 'error');
                }
                return null;
            } finally {
                setIsSending(false);
            }
        },
        [showToast]
    );

    const openCompose = useCallback((input: GmailMessageInput) => {
        openGmailCompose({
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            subject: input.subject,
            body: input.body,
        });
    }, []);

    return { isSending, error, needsConnection, send, openCompose };
}
