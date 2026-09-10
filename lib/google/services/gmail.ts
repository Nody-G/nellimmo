/**
 * Service Gmail (Lot 3).
 *
 * Envoi réel d'emails via l'API Gmail v1 (`users/me/messages/send`).
 * Le message est encodé en MIME puis en base64url, conformément à la
 * spécification Google.
 *
 * Aucun appel direct : tout passe par le proxy `/api/google/proxy`.
 */

import { callGoogleProxy } from '../proxy-client';

/** Destinataires et contenu d'un email. */
export interface GmailMessageInput {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    /** Corps en texte brut. */
    body: string;
    /** Corps HTML optionnel (alternative). */
    html?: string;
    /** Nom affiché de l'expéditeur (optionnel). */
    fromName?: string;
}

/** Message Gmail renvoyé par l'API. */
export interface GmailMessage {
    id: string;
    threadId?: string;
    labelIds?: string[];
}

/** Réponse de `gmail:messages.list`. */
export interface GmailMessageList {
    messages?: Array<{ id: string; threadId?: string }>;
    nextPageToken?: string;
    resultSizeEstimate?: number;
}

/** Réponse de `gmail:messages.get`. */
export interface GmailMessageDetail {
    id: string;
    threadId?: string;
    snippet?: string;
    labelIds?: string[];
    payload?: {
        headers?: Array<{ name: string; value: string }>;
        body?: { data?: string };
        parts?: Array<{ mimeType?: string; body?: { data?: string } }>;
    };
}

/** Encode une chaîne UTF-8 en base64 standard (avec padding). */
function toBase64(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    bytes.forEach((b) => {
        binary += String.fromCharCode(b);
    });
    return typeof btoa === 'function'
        ? btoa(binary)
        : Buffer.from(bytes).toString('base64');
}

/** Encode une chaîne UTF-8 en base64url (requis par Gmail pour le champ `raw`). */
export function toBase64Url(input: string): string {
    return toBase64(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Encode un en-tête MIME en RFC 2047 si nécessaire (caractères non ASCII). */
function encodeHeaderValue(value: string): string {
    // eslint-disable-next-line no-control-regex
    if (/^[\x00-\x7F]*$/.test(value)) return value;
    return `=?UTF-8?B?${toBase64Url(value)}?=`;
}

/** Construit le corps MIME brut d'un email. */
export function buildMimeMessage(input: GmailMessageInput): string {
    const headers: string[] = [];
    headers.push(`To: ${input.to}`);
    if (input.cc) headers.push(`Cc: ${input.cc}`);
    if (input.bcc) headers.push(`Bcc: ${input.bcc}`);
    headers.push(`Subject: ${encodeHeaderValue(input.subject)}`);
    headers.push('MIME-Version: 1.0');

    if (input.html) {
        const boundary = `nellimmo_${Date.now().toString(36)}`;
        headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
        const parts = [
            `--${boundary}`,
            'Content-Type: text/plain; charset="UTF-8"',
            'Content-Transfer-Encoding: base64',
            '',
            toBase64(input.body),
            `--${boundary}`,
            'Content-Type: text/html; charset="UTF-8"',
            'Content-Transfer-Encoding: base64',
            '',
            toBase64(input.html),
            `--${boundary}--`,
        ];
        return `${headers.join('\r\n')}\r\n\r\n${parts.join('\r\n')}`;
    }

    headers.push('Content-Type: text/plain; charset="UTF-8"');
    headers.push('Content-Transfer-Encoding: base64');
    return `${headers.join('\r\n')}\r\n\r\n${toBase64(input.body)}`;
}

/**
 * Envoie un email via Gmail.
 * @returns le message Gmail créé (avec son `id`).
 */
export async function sendGmailMessage(input: GmailMessageInput): Promise<GmailMessage> {
    // L'API Gmail attend le message MIME complet encodé en base64url dans `raw`.
    const raw = toBase64Url(buildMimeMessage(input));
    return callGoogleProxy<GmailMessage>({
        service: 'gmail',
        action: 'messages.send',
        payload: { raw },
    });
}

/** Liste les messages Gmail correspondant à une requête (syntaxe Gmail). */
export async function listGmailMessages(
    query?: string,
    maxResults = 20
): Promise<GmailMessageList> {
    const q: Record<string, string> = { maxResults: String(maxResults) };
    if (query) q.q = query;
    return callGoogleProxy<GmailMessageList>({
        service: 'gmail',
        action: 'messages.list',
        query: q,
    });
}

/** Récupère un message Gmail par son identifiant. */
export async function getGmailMessage(
    messageId: string,
    format: 'full' | 'metadata' | 'minimal' = 'metadata'
): Promise<GmailMessageDetail> {
    return callGoogleProxy<GmailMessageDetail>({
        service: 'gmail',
        action: 'messages.get',
        pathParams: { messageId },
        query: { format },
    });
}

/** Extrait la valeur d'un en-tête d'un message Gmail. */
export function getHeader(message: GmailMessageDetail, name: string): string | undefined {
    const headers = message.payload?.headers ?? [];
    const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return found?.value;
}
