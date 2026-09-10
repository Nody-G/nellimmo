/**
 * Instantané de Données Agence pour le Copilote IA — Cockpit Nellimo
 *
 * Ce module agrège les données locales (localStorage / Supabase) de l'agence
 * en un instantané compact, structuré et ANONYMISÉ, destiné à être transmis
 * au copilote IA afin qu'il puisse répondre à des questions concrètes sur :
 *   - le portefeuille de biens sous mandat,
 *   - les acquéreurs en recherche,
 *   - les contacts du carnet d'adresses,
 *   - les relances / rappels en attente,
 *   - les transactions en cours,
 *   - les leads de prospection.
 *
 * GARDE-FOUS DE CONFIDENTIALITÉ (RGPD) :
 *   1. Aucune coordonnée brute (téléphone, email, adresse exacte) n'est transmise.
 *   2. Les noms de famille sont pseudonymisés via `pseudonymizeName`.
 *   3. Les notes libres passent par `sanitizeTextForLlm` (caviardage IBAN/NIR/etc.).
 *   4. Le volume est plafonné (MAX_ITEMS) pour maîtriser le coût en tokens.
 *
 * Ce module est PUR (aucun accès au DOM, aucun effet de bord) : il peut être
 * appelé côté client comme côté serveur.
 */

import type {
    Property,
    Buyer,
    ContactItem,
    TransactionDeal,
    ProspectingLead,
    VisitSheet,
} from './types';
import type { RelanceAction } from './relances';
import { pseudonymizeName, sanitizeTextForLlm } from './ai-privacy-guard';

/** Nombre maximum d'éléments détaillés par catégorie (maîtrise du coût tokens). */
const MAX_ITEMS = 25;

/** Tronque une liste en conservant les premiers éléments. */
function cap<T>(list: T[], max = MAX_ITEMS): T[] {
    return list.slice(0, max);
}

/** Formate un montant en euros de façon compacte (ex: "285 k€"). */
function compactEuro(value?: number | null): string {
    if (!value || value <= 0) return 'n/c';
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} M€`;
    if (value >= 1_000) return `${Math.round(value / 1_000)} k€`;
    return `${value} €`;
}

/** Formate une date ISO en JJ/MM/AAAA (tolérant aux valeurs invalides). */
function shortDate(value?: string | null): string {
    if (!value) return 'n/c';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
    return d.toLocaleDateString('fr-FR');
}

/** Résumé d'un bien sous mandat (vendeur pseudonymisé, adresse masquée). */
export interface SnapshotProperty {
    ref: string;
    title: string;
    type: string;
    city: string;
    price_fai: string;
    surface: string;
    rooms: number;
    dpe: string;
    status: string;
    seller: string;
    mandate_type: string;
}

/** Résumé d'un acquéreur (nom pseudonymisé). */
export interface SnapshotBuyer {
    name: string;
    budget_max: string;
    target_cities: string[];
    target_types: string[];
    min_rooms: number | null;
    financing: string;
    status: string;
}

/** Résumé d'un contact du carnet d'adresses (nom pseudonymisé). */
export interface SnapshotContact {
    name: string;
    role: string;
    company: string;
    city: string;
    favorite: boolean;
    last_interaction: string;
}

/** Résumé d'une relance / d'un rappel en attente. */
export interface SnapshotRelance {
    category: string;
    title: string;
    contact: string;
    due: string;
    status: string;
    message: string;
}

/** Résumé d'une transaction en cours. */
export interface SnapshotTransaction {
    ref: string;
    property: string;
    buyer: string;
    status: string;
    price: string;
    next_deadline: string;
}

/** Résumé d'un lead de prospection. */
export interface SnapshotLead {
    source: string;
    title: string;
    city: string;
    seller: string;
    status: string;
    estimated_value: string;
}

/** Résumé d'une visite enregistrée. */
export interface SnapshotVisit {
    property: string;
    buyer: string;
    date: string;
    feedback: string;
}

/** Instantané complet transmis au copilote. */
export interface AgencyDataSnapshot {
    generated_at: string;
    totals: {
        properties: number;
        buyers: number;
        contacts: number;
        relances_pending: number;
        transactions: number;
        leads: number;
        visits: number;
    };
    portfolio_value: string;
    properties: SnapshotProperty[];
    buyers: SnapshotBuyer[];
    contacts: SnapshotContact[];
    relances: SnapshotRelance[];
    transactions: SnapshotTransaction[];
    leads: SnapshotLead[];
    visits: SnapshotVisit[];
    /** Indique si des listes ont été tronquées pour maîtriser le coût tokens. */
    truncated: boolean;
}

/** Entrée brute de l'agrégateur (données issues du store). */
export interface AgencyDataSnapshotInput {
    properties: Property[];
    buyers: Buyer[];
    contacts: ContactItem[];
    relances: RelanceAction[];
    transactions: TransactionDeal[];
    leads: ProspectingLead[];
    visits: VisitSheet[];
}

/**
 * Construit l'instantané anonymisé de l'agence à partir des données du store.
 * Toutes les données sensibles sont caviardées ou pseudonymisées.
 */
export function buildAgencyDataSnapshot(
    input: AgencyDataSnapshotInput
): AgencyDataSnapshot {
    const {
        properties = [],
        buyers = [],
        contacts = [],
        relances = [],
        transactions = [],
        leads = [],
        visits = [],
    } = input;

    const pendingRelances = relances.filter((r) => r.status === 'a_faire');

    const totalPortfolioValue = properties.reduce(
        (sum, p) => sum + (p.price_fai || 0),
        0
    );

    const snapshot: AgencyDataSnapshot = {
        generated_at: new Date().toISOString(),
        totals: {
            properties: properties.length,
            buyers: buyers.length,
            contacts: contacts.length,
            relances_pending: pendingRelances.length,
            transactions: transactions.length,
            leads: leads.length,
            visits: visits.length,
        },
        portfolio_value: compactEuro(totalPortfolioValue),
        properties: cap(properties).map((p) => ({
            ref: p.mandate_number ? String(p.mandate_number) : p.id.slice(0, 8),
            title: sanitizeTextForLlm(p.title || 'Bien sans titre'),
            type: p.property_type || 'maison',
            city: p.city || 'n/c',
            price_fai: compactEuro(p.price_fai),
            surface: p.living_area ? `${p.living_area} m²` : 'n/c',
            rooms: p.rooms_count || 0,
            dpe: p.dpe_letter || 'n/c',
            status: p.status || 'actif',
            seller: pseudonymizeName(p.seller_name),
            mandate_type: p.mandate_type || 'exclusif',
        })),
        buyers: cap(buyers).map((b) => ({
            name: pseudonymizeName(`${b.first_name || ''} ${b.last_name || ''}`.trim()),
            budget_max: compactEuro(b.budget_max),
            target_cities: b.target_cities || [],
            target_types: b.target_property_types || [],
            min_rooms: b.min_rooms ?? null,
            financing: b.financing_status || 'n/c',
            status: b.status || 'actif',
        })),
        contacts: cap(contacts).map((c) => ({
            name: pseudonymizeName(
                `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company || ''
            ),
            role: c.role || 'autre',
            company: c.company || '',
            city: c.city || '',
            favorite: Boolean(c.is_favorite),
            last_interaction: shortDate(c.last_contact_at),
        })),
        relances: cap(pendingRelances).map((r) => ({
            category: r.category,
            title: sanitizeTextForLlm(r.title),
            contact: pseudonymizeName(r.contactName),
            due: r.dueLabel,
            status: r.status,
            message: sanitizeTextForLlm(r.message).slice(0, 220),
        })),
        transactions: cap(transactions).map((t) => {
            const prop = properties.find((p) => p.id === t.property_id);
            const buyer = buyers.find((b) => b.id === t.buyer_id);
            return {
                ref: t.id.slice(0, 8),
                property: sanitizeTextForLlm(prop?.title || 'Bien n/c'),
                buyer: buyer
                    ? pseudonymizeName(`${buyer.first_name || ''} ${buyer.last_name || ''}`.trim())
                    : 'n/c',
                status: t.status,
                price: compactEuro(t.offer_price_fai || prop?.price_fai),
                next_deadline: shortDate(t.final_deed_target_date || t.compromis_date),
            };
        }),
        leads: cap(leads).map((l) => ({
            source: l.source || 'n/c',
            title: sanitizeTextForLlm(l.title || 'Lead sans titre'),
            city: l.city || 'n/c',
            seller: pseudonymizeName(l.seller_name),
            status: l.status || 'nouveau',
            estimated_value: compactEuro(l.estimated_dvf_price || l.price_asked),
        })),
        visits: cap(visits).map((v) => {
            const prop = properties.find((p) => p.id === v.property_id);
            const buyer = buyers.find((b) => b.id === v.buyer_id);
            return {
                property: sanitizeTextForLlm(prop?.title || 'Bien n/c'),
                buyer: buyer
                    ? pseudonymizeName(`${buyer.first_name || ''} ${buyer.last_name || ''}`.trim())
                    : 'n/c',
                date: shortDate(v.visit_date),
                feedback: sanitizeTextForLlm(v.notes || '').slice(0, 160),
            };
        }),
        truncated:
            properties.length > MAX_ITEMS ||
            buyers.length > MAX_ITEMS ||
            contacts.length > MAX_ITEMS ||
            pendingRelances.length > MAX_ITEMS ||
            transactions.length > MAX_ITEMS ||
            leads.length > MAX_ITEMS ||
            visits.length > MAX_ITEMS,
    };

    return snapshot;
}

/**
 * Sérialise l'instantané en un bloc texte compact destiné au prompt du LLM.
 * Le format est volontairement lisible pour maximiser la compréhension du modèle.
 */
export function formatSnapshotForPrompt(snapshot: AgencyDataSnapshot): string {
    const lines: string[] = [];

    lines.push('=== INSTANTANÉ DES DONNÉES DE L\'AGENCE (localStorage) ===');
    lines.push(
        `Totaux : ${snapshot.totals.properties} biens • ${snapshot.totals.buyers} acquéreurs • ` +
        `${snapshot.totals.contacts} contacts • ${snapshot.totals.relances_pending} relances en attente • ` +
        `${snapshot.totals.transactions} transactions • ${snapshot.totals.leads} leads • ` +
        `${snapshot.totals.visits} visites`
    );
    lines.push(`Valeur totale du portefeuille : ${snapshot.portfolio_value}`);
    if (snapshot.truncated) {
        lines.push(
            `(Listes tronquées à ${MAX_ITEMS} éléments par catégorie pour maîtriser le coût.)`
        );
    }

    if (snapshot.properties.length) {
        lines.push('');
        lines.push('--- BIENS SOUS MANDAT ---');
        snapshot.properties.forEach((p) => {
            lines.push(
                `• [${p.ref}] ${p.title} — ${p.type} à ${p.city} — ${p.price_fai} — ` +
                `${p.surface}, ${p.rooms} pièces, DPE ${p.dpe} — statut ${p.status} — ` +
                `mandat ${p.mandate_type} — vendeur ${p.seller}`
            );
        });
    }

    if (snapshot.buyers.length) {
        lines.push('');
        lines.push('--- ACQUÉREURS EN RECHERCHE ---');
        snapshot.buyers.forEach((b) => {
            lines.push(
                `• ${b.name} — budget ${b.budget_max} — cibles ${b.target_cities.join(', ') || 'n/c'} — ` +
                `types ${b.target_types.join(', ') || 'n/c'} — ${b.min_rooms ?? 'n/c'} pièces min — ` +
                `financement ${b.financing} — statut ${b.status}`
            );
        });
    }

    if (snapshot.relances.length) {
        lines.push('');
        lines.push('--- RELANCES / RAPPELS EN ATTENTE ---');
        snapshot.relances.forEach((r) => {
            lines.push(
                `• [${r.category}] ${r.title} — contact ${r.contact} — échéance ${r.due} — ` +
                `message : "${r.message}"`
            );
        });
    }

    if (snapshot.transactions.length) {
        lines.push('');
        lines.push('--- TRANSACTIONS EN COURS ---');
        snapshot.transactions.forEach((t) => {
            lines.push(
                `• [${t.ref}] ${t.property} — acquéreur ${t.buyer} — statut ${t.status} — ` +
                `${t.price} — échéance ${t.next_deadline}`
            );
        });
    }

    if (snapshot.leads.length) {
        lines.push('');
        lines.push('--- LEADS DE PROSPECTION ---');
        snapshot.leads.forEach((l) => {
            lines.push(
                `• [${l.source}] ${l.title} — ${l.city} — vendeur ${l.seller} — ` +
                `statut ${l.status} — valeur estimée ${l.estimated_value}`
            );
        });
    }

    if (snapshot.contacts.length) {
        lines.push('');
        lines.push('--- CARNET DE CONTACTS ---');
        snapshot.contacts.forEach((c) => {
            lines.push(
                `• ${c.name} — rôle ${c.role}${c.company ? ` (${c.company})` : ''}` +
                `${c.city ? ` — ${c.city}` : ''}${c.favorite ? ' — ⭐ favori' : ''} — ` +
                `dernier contact ${c.last_interaction}`
            );
        });
    }

    if (snapshot.visits.length) {
        lines.push('');
        lines.push('--- DERNIÈRES VISITES ---');
        snapshot.visits.forEach((v) => {
            lines.push(
                `• ${v.property} — acquéreur ${v.buyer} — ${v.date}` +
                `${v.feedback ? ` — retour : "${v.feedback}"` : ''}`
            );
        });
    }

    lines.push('');
    lines.push('=== FIN DE L\'INSTANTANÉ ===');

    return lines.join('\n');
}
