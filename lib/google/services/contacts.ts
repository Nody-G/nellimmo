/**
 * Service Google Contacts / People API (Lot 5).
 *
 * Synchronise les contacts Nellimmo vers Google Contacts et inversement.
 * La correspondance repose sur `google_resource_name` (stocké sur le
 * `ContactItem`) pour des mises à jour idempotentes.
 *
 * Aucun appel direct : tout passe par le proxy `/api/google/proxy`.
 */

import { callGoogleProxy } from '../proxy-client';
import type { ContactItem } from '@/lib/types';

/** Personne Google (sous-ensemble utile). */
export interface GooglePerson {
    resourceName: string;
    etag?: string;
    names?: Array<{ displayName?: string; givenName?: string; familyName?: string }>;
    emailAddresses?: Array<{ value?: string; type?: string }>;
    phoneNumbers?: Array<{ value?: string; type?: string }>;
    organizations?: Array<{ name?: string; title?: string }>;
    addresses?: Array<{ streetAddress?: string; city?: string; postalCode?: string }>;
    biographies?: Array<{ value?: string }>;
}

/** Réponse de `contacts:people.connections`. */
export interface GoogleConnectionsResponse {
    connections?: GooglePerson[];
    nextPageToken?: string;
    totalPeople?: number;
}

/** Champs People demandés systématiquement. */
const PERSON_FIELDS =
    'names,emailAddresses,phoneNumbers,organizations,addresses,biographies';

/** Construit le corps `people.createContact` à partir d'un contact Nellimmo. */
export function contactToGooglePerson(contact: ContactItem): Record<string, unknown> {
    const displayName =
        contact.company ||
        [contact.first_name, contact.last_name].filter(Boolean).join(' ').trim();

    const person: Record<string, unknown> = {
        names: [
            {
                givenName: contact.first_name || undefined,
                familyName: contact.last_name || undefined,
                displayName: displayName || undefined,
            },
        ],
    };

    const emails: Array<{ value: string; type?: string }> = [];
    if (contact.email) emails.push({ value: contact.email, type: 'work' });
    if (contact.secondary_email) emails.push({ value: contact.secondary_email, type: 'home' });
    if (emails.length) person.emailAddresses = emails;

    const phones: Array<{ value: string; type?: string }> = [];
    if (contact.phone) phones.push({ value: contact.phone, type: 'mobile' });
    if (contact.secondary_phone) phones.push({ value: contact.secondary_phone, type: 'home' });
    if (phones.length) person.phoneNumbers = phones;

    if (contact.company || contact.specialty) {
        person.organizations = [
            { name: contact.company || undefined, title: contact.specialty || undefined },
        ];
    }

    if (contact.address || contact.city || contact.postal_code) {
        person.addresses = [
            {
                streetAddress: contact.address || undefined,
                city: contact.city || undefined,
                postalCode: contact.postal_code || undefined,
            },
        ];
    }

    if (contact.notes) {
        person.biographies = [{ value: contact.notes }];
    }

    return person;
}

/** Crée un contact dans Google Contacts. */
export async function createGoogleContact(contact: ContactItem): Promise<GooglePerson> {
    return callGoogleProxy<GooglePerson>({
        service: 'contacts',
        action: 'people.createContact',
        payload: contactToGooglePerson(contact),
        query: { personFields: PERSON_FIELDS },
    });
}

/** Met à jour un contact Google existant. */
export async function updateGoogleContact(
    resourceName: string,
    contact: ContactItem
): Promise<GooglePerson> {
    return callGoogleProxy<GooglePerson>({
        service: 'contacts',
        action: 'people.updateContact',
        pathParams: { resourceName },
        payload: contactToGooglePerson(contact),
        query: { updatePersonFields: PERSON_FIELDS, personFields: PERSON_FIELDS },
    });
}

/** Liste les contacts Google de l'utilisateur. */
export async function listGoogleContacts(pageSize = 200): Promise<GooglePerson[]> {
    const data = await callGoogleProxy<GoogleConnectionsResponse>({
        service: 'contacts',
        action: 'people.connections',
        query: {
            personFields: PERSON_FIELDS,
            pageSize: String(pageSize),
            sortOrder: 'LAST_MODIFIED_DESCENDING',
        },
    });
    return data.connections ?? [];
}

/**
 * Crée ou met à jour un contact Google selon la présence de
 * `google_resource_name`.
 * @returns la personne Google et son `resourceName`.
 */
export async function upsertGoogleContact(
    contact: ContactItem
): Promise<{ person: GooglePerson; resourceName: string }> {
    if (contact.google_resource_name) {
        const person = await updateGoogleContact(contact.google_resource_name, contact);
        return { person, resourceName: person.resourceName || contact.google_resource_name };
    }
    const person = await createGoogleContact(contact);
    return { person, resourceName: person.resourceName };
}

/** Extrait le nom d'affichage d'une personne Google. */
export function googlePersonDisplayName(person: GooglePerson): string {
    return person.names?.[0]?.displayName ?? '';
}

/** Extrait le premier email d'une personne Google. */
export function googlePersonEmail(person: GooglePerson): string {
    return person.emailAddresses?.[0]?.value ?? '';
}

/** Extrait le premier téléphone d'une personne Google. */
export function googlePersonPhone(person: GooglePerson): string {
    return person.phoneNumbers?.[0]?.value ?? '';
}
