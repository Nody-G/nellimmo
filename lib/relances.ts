/**
 * Moteur de relances planifiées (Phase B1).
 *
 * Module PUR : aucune dépendance React ni DOM. Il scanne les données du store
 * (biens, visites, transactions, acquéreurs) par rapport à une date de
 * référence (aujourd'hui par défaut) et génère la liste des actions
 * « à envoyer aujourd'hui » selon les règles métier :
 *
 *  - Visites        : rappel J-1 (confirmation) et relance J+1 (retour/merci)
 *  - Transactions   : alerte J-15 accord de prêt, fin de délai SRU,
 *                     approche de la date d'acte
 *  - Mandats        : échéance du mandat sous 60 jours
 *
 * Chaque action embarque un message WhatsApp pré-formaté. L'envoi réel
 * (WhatsApp Business API) sera branché plus tard via une couture ; pour
 * l'instant on ouvre wa.me avec le message pré-rempli.
 */

import type {
    Property,
    VisitSheet,
    TransactionDeal,
    Buyer,
    AgencySettings,
} from './types';

export type RelanceCategory =
    | 'visite_rappel'
    | 'visite_relance'
    | 'transaction_pret'
    | 'transaction_sru'
    | 'transaction_acte'
    | 'mandat_echeance';

export type RelanceStatus = 'a_faire' | 'faite' | 'ignoree';

/** Carte persistée des statuts par identifiant d'action (clé = action.id). */
export type RelanceStatusMap = Record<string, RelanceStatus>;

export interface RelanceAction {
    /** Identifiant stable par (catégorie, source) — sert de clé de persistance. */
    id: string;
    category: RelanceCategory;
    /** Titre court affiché dans la liste. */
    title: string;
    contactName: string;
    contactPhone: string;
    /** Message WhatsApp pré-formaté. */
    message: string;
    /** Libellé humain de la date d'échéance (ex. « demain », « 15 sept. »). */
    dueLabel: string;
    /** Référence source (id du bien / de la visite / de la transaction). */
    sourceId: string;
    /** Libellé source (ex. titre du bien). */
    sourceLabel: string;
    status: RelanceStatus;
}

export interface RelanceEngineInput {
    properties: Property[];
    visits: VisitSheet[];
    transactions: TransactionDeal[];
    buyers: Buyer[];
    settings: AgencySettings;
    /** Date de référence (aujourd'hui par défaut). */
    referenceDate?: Date;
}

/** Fenêtres d'alerte (en jours) par catégorie. */
const WINDOWS: Record<Exclude<RelanceCategory, 'visite_rappel' | 'visite_relance'>, number> = {
    transaction_pret: 15,
    transaction_sru: 10,
    transaction_acte: 15,
    mandat_echeance: 60,
};

/** Catégories qui restent actives tant que la source est dans la fenêtre. */
const WINDOW_CATEGORIES: RelanceCategory[] = [
    'transaction_pret',
    'transaction_sru',
    'transaction_acte',
    'mandat_echeance',
];

/* ------------------------------------------------------------------ */
/* Helpers de dates (pures, sans mutation d'état)                      */
/* ------------------------------------------------------------------ */

/** Normalise une date ISO (avec ou sans heure) en clé `yyyy-mm-dd`. */
export function toDateKey(value: string | Date): string {
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** Construit une date à minuit local depuis une clé `yyyy-mm-dd`. */
function dateFromKey(key: string): Date {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
}

/** Nombre de jours calendaires entre deux clés (b - a). */
export function daysBetween(aKey: string, bKey: string): number {
    const a = dateFromKey(aKey).getTime();
    const b = dateFromKey(bKey).getTime();
    return Math.round((b - a) / 86400000);
}

/** Ajoute `n` jours à une clé `yyyy-mm-dd`. */
export function addDaysToKey(key: string, n: number): string {
    const d = dateFromKey(key);
    d.setDate(d.getDate() + n);
    return toDateKey(d);
}

/** Formate une clé `yyyy-mm-dd` en français lisible (ex. « 15 sept. 2026 »). */
export function formatDateKey(key: string): string {
    if (!key) return '';
    return dateFromKey(key).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/** Formate une clé en « demain » / « aujourd'hui » / « hier » sinon date. */
export function formatRelativeLabel(key: string, todayKey: string): string {
    const diff = daysBetween(todayKey, key);
    if (diff === 0) return "aujourd'hui";
    if (diff === 1) return 'demain';
    if (diff === -1) return 'hier';
    return formatDateKey(key);
}

/* ------------------------------------------------------------------ */
/* Construction des messages WhatsApp                                  */
/* ------------------------------------------------------------------ */

function agentName(settings: AgencySettings): string {
    return settings.agent_name || 'Nelly Fernandez';
}

function agencyName(settings: AgencySettings): string {
    return settings.agency_name || "l'agence Nell'Immo";
}

function firstName(fullName: string): string {
    const clean = (fullName || '').trim();
    return clean.split(' ')[0] || clean;
}

/** Message de confirmation de visite (J-1). */
function buildVisitReminderMessage(
    action: { contactName: string; sourceLabel: string; dueLabel: string; location?: string },
    settings: AgencySettings
): string {
    const mapsLink = action.location
        ? `\n📍 Itinéraire GPS : https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(action.location)}`
        : '';
    return `Bonjour ${firstName(action.contactName)}, c'est ${agentName(settings)} de ${agencyName(settings)}. Je vous confirme notre visite prévue ${action.dueLabel} pour le bien « ${action.sourceLabel} ».${mapsLink}\nPensez à vous munir d'une pièce d'identité pour le bon de visite légal. Au plaisir de vous faire découvrir ce bien !`;
}

/** Message de relance post-visite (J+1). */
function buildVisitFollowUpMessage(
    action: { contactName: string; sourceLabel: string },
    settings: AgencySettings
): string {
    return `Bonjour ${firstName(action.contactName)}, c'est ${agentName(settings)} de ${agencyName(settings)}. Merci pour votre visite du bien « ${action.sourceLabel} » ! Avez-vous eu le temps d'en parler ? Je reste à votre disposition pour toute question ou pour organiser une contre-visite. Belle journée à vous.`;
}

/** Message d'alerte accord de prêt (J-15). */
function buildLoanMessage(
    action: { contactName: string; sourceLabel: string; dueLabel: string },
    settings: AgencySettings
): string {
    return `Bonjour ${firstName(action.contactName)}, c'est ${agentName(settings)} de ${agencyName(settings)}. Concernant le dossier « ${action.sourceLabel} », la date limite d'accord de prêt approche (${action.dueLabel}). Avez-vous une confirmation de votre banque ou de votre courtier ? N'hésitez pas à me tenir informé pour sécuriser la vente.`;
}

/** Message d'alerte fin de délai SRU. */
function buildSruMessage(
    action: { contactName: string; sourceLabel: string; dueLabel: string },
    settings: AgencySettings
): string {
    return `Bonjour ${firstName(action.contactName)}, c'est ${agentName(settings)} de ${agencyName(settings)}. Le délai de rétractation SRU du dossier « ${action.sourceLabel} » arrive à échéance le ${action.dueLabel}. Je vous confirme que tout est en ordre pour la suite du dossier.`;
}

/** Message d'approche de la date d'acte. */
function buildDeedMessage(
    action: { contactName: string; sourceLabel: string; dueLabel: string },
    settings: AgencySettings
): string {
    return `Bonjour ${firstName(action.contactName)}, c'est ${agentName(settings)} de ${agencyName(settings)}. La signature de l'acte pour « ${action.sourceLabel} » est prévue le ${action.dueLabel}. Je vous recontacte pour confirmer l'organisation (pièces, rendez-vous notaire). Très bonne journée.`;
}

/** Message d'échéance de mandat. */
function buildMandateMessage(
    action: { contactName: string; sourceLabel: string; dueLabel: string },
    settings: AgencySettings
): string {
    return `Bonjour ${firstName(action.contactName)}, c'est ${agentName(settings)} de ${agencyName(settings)}. Votre mandat pour le bien « ${action.sourceLabel} » arrive à échéance le ${action.dueLabel}. Souhaitez-vous le renouveler ou en discuter ? Je reste à votre entière disposition.`;
}

/* ------------------------------------------------------------------ */
/* Moteur principal                                                    */
/* ------------------------------------------------------------------ */

function makeAction(
    category: RelanceCategory,
    sourceId: string,
    sourceLabel: string,
    contactName: string,
    contactPhone: string,
    title: string,
    message: string,
    dueLabel: string
): RelanceAction {
    return {
        id: `${category}-${sourceId}`,
        category,
        title,
        contactName,
        contactPhone,
        message,
        dueLabel,
        sourceId,
        sourceLabel,
        status: 'a_faire',
    };
}

function buyerOf(buyers: Buyer[], buyerId?: string): Buyer | undefined {
    if (!buyerId) return undefined;
    return buyers.find((b) => b.id === buyerId);
}

function propertyOf(properties: Property[], propertyId: string): Property | undefined {
    return properties.find((p) => p.id === propertyId);
}

function propertyLabel(p?: Property): string {
    if (!p) return 'bien';
    return p.title || `${p.property_type} à ${p.city}` || 'bien';
}

/**
 * Calcule la liste des relances dues à la date de référence.
 * Retourne uniquement les actions pertinentes (fenêtres d'alerte actives).
 */
export function computeRelances(input: RelanceEngineInput): RelanceAction[] {
    const today = input.referenceDate ? toDateKey(input.referenceDate) : toDateKey(new Date());
    const { properties, visits, transactions, buyers, settings } = input;
    const actions: RelanceAction[] = [];

    /* --- Visites : rappel J-1 --- */
    visits.forEach((v) => {
        const visitKey = toDateKey(v.visit_date);
        if (!visitKey) return;
        const prop = propertyOf(properties, v.property_id);
        const buyer = buyerOf(buyers, v.buyer_id);
        const contactName = buyer ? `${buyer.first_name} ${buyer.last_name}` : v.buyer?.first_name ? `${v.buyer.first_name} ${v.buyer.last_name}` : 'l\'acquéreur';
        const contactPhone = buyer?.phone || v.buyer?.phone || '';

        // Rappel J-1 : la visite a lieu demain.
        if (visitKey === addDaysToKey(today, 1)) {
            const dueLabel = formatRelativeLabel(visitKey, today);
            const location = prop
                ? `${prop.address}, ${prop.postal_code} ${prop.city}`
                : undefined;
            actions.push(
                makeAction(
                    'visite_rappel',
                    v.id,
                    propertyLabel(prop),
                    contactName,
                    contactPhone,
                    'Confirmer la visite de demain',
                    buildVisitReminderMessage({ contactName, sourceLabel: propertyLabel(prop), dueLabel, location }, settings),
                    dueLabel
                )
            );
        }

        // Relance J+1 : la visite a eu lieu hier.
        if (visitKey === addDaysToKey(today, -1)) {
            actions.push(
                makeAction(
                    'visite_relance',
                    v.id,
                    propertyLabel(prop),
                    contactName,
                    contactPhone,
                    'Relancer l\'acquéreur après la visite',
                    buildVisitFollowUpMessage({ contactName, sourceLabel: propertyLabel(prop) }, settings),
                    formatRelativeLabel(visitKey, today)
                )
            );
        }
    });

    /* --- Transactions : alertes de délais --- */
    transactions.forEach((t) => {
        const prop = propertyOf(properties, t.property_id);
        const label = propertyLabel(prop);
        const contactName = t.buyer_name || 'l\'acquéreur';
        const contactPhone = t.buyer_phone || '';

        // Alerte J-15 accord de prêt (statut en attente de prêt).
        if (t.status === 'attente_pret' && t.loan_approval_deadline) {
            const deadlineKey = toDateKey(t.loan_approval_deadline);
            const diff = daysBetween(today, deadlineKey);
            if (diff >= 0 && diff <= WINDOWS.transaction_pret) {
                actions.push(
                    makeAction(
                        'transaction_pret',
                        t.id,
                        label,
                        contactName,
                        contactPhone,
                        'Relancer l\'accord de prêt (J-15)',
                        buildLoanMessage({ contactName, sourceLabel: label, dueLabel: formatDateKey(deadlineKey) }, settings),
                        formatRelativeLabel(deadlineKey, today)
                    )
                );
            }
        }

        // Fin de délai SRU (délai de rétractation).
        if (t.sru_expiry_date && (t.status === 'delai_sru_en_cours' || t.status === 'compromis_signe')) {
            const expiryKey = toDateKey(t.sru_expiry_date);
            const diff = daysBetween(today, expiryKey);
            if (diff >= 0 && diff <= WINDOWS.transaction_sru) {
                actions.push(
                    makeAction(
                        'transaction_sru',
                        t.id,
                        label,
                        contactName,
                        contactPhone,
                        'Suivi fin de délai SRU',
                        buildSruMessage({ contactName, sourceLabel: label, dueLabel: formatDateKey(expiryKey) }, settings),
                        formatRelativeLabel(expiryKey, today)
                    )
                );
            }
        }

        // Approche de la date d'acte.
        if (t.final_deed_target_date && t.status !== 'acte_signe' && t.status !== 'annule') {
            const deedKey = toDateKey(t.final_deed_target_date);
            const diff = daysBetween(today, deedKey);
            if (diff >= 0 && diff <= WINDOWS.transaction_acte) {
                actions.push(
                    makeAction(
                        'transaction_acte',
                        t.id,
                        label,
                        contactName,
                        contactPhone,
                        'Préparer la signature de l\'acte',
                        buildDeedMessage({ contactName, sourceLabel: label, dueLabel: formatDateKey(deedKey) }, settings),
                        formatRelativeLabel(deedKey, today)
                    )
                );
            }
        }
    });

    /* --- Mandats : échéance sous 60 jours --- */
    properties.forEach((p) => {
        if (p.status !== 'actif') return;
        if (!p.mandate_end_date) return;
        const endKey = toDateKey(p.mandate_end_date);
        const diff = daysBetween(today, endKey);
        if (diff >= 0 && diff <= WINDOWS.mandat_echeance) {
            actions.push(
                makeAction(
                    'mandat_echeance',
                    p.id,
                    propertyLabel(p),
                    p.seller_name || 'le vendeur',
                    p.seller_phone || '',
                    'Mandat arrivant à échéance',
                    buildMandateMessage(
                        { contactName: p.seller_name || 'le vendeur', sourceLabel: propertyLabel(p), dueLabel: formatDateKey(endKey) },
                        settings
                    ),
                    formatRelativeLabel(endKey, today)
                )
            );
        }
    });

    return actions;
}

/* ------------------------------------------------------------------ */
/* Catégorisation & tri                                                 */
/* ------------------------------------------------------------------ */

export const RELANCE_CATEGORY_META: Record<
    RelanceCategory,
    { label: string; shortLabel: string }
> = {
    visite_rappel: { label: 'Confirmation de visite', shortLabel: 'Visite J-1' },
    visite_relance: { label: 'Relance après visite', shortLabel: 'Visite J+1' },
    transaction_pret: { label: 'Accord de prêt', shortLabel: 'Prêt J-15' },
    transaction_sru: { label: 'Fin de délai SRU', shortLabel: 'SRU' },
    transaction_acte: { label: 'Signature de l\'acte', shortLabel: 'Acte' },
    mandat_echeance: { label: 'Échéance de mandat', shortLabel: 'Mandat' },
};

export const RELANCE_CATEGORY_ORDER: RelanceCategory[] = [
    'visite_rappel',
    'visite_relance',
    'transaction_pret',
    'transaction_sru',
    'transaction_acte',
    'mandat_echeance',
];

/** Trie les actions : prioritaires d'abord, puis par date d'échéance. */
export function sortRelances(actions: RelanceAction[]): RelanceAction[] {
    return [...actions].sort((a, b) => {
        const ia = RELANCE_CATEGORY_ORDER.indexOf(a.category);
        const ib = RELANCE_CATEGORY_ORDER.indexOf(b.category);
        if (ia !== ib) return ia - ib;
        return a.sourceLabel.localeCompare(b.sourceLabel, 'fr');
    });
}

/** Filtre les actions selon un filtre de catégorie ('' = toutes). */
export function filterRelancesByCategory(
    actions: RelanceAction[],
    category: RelanceCategory | ''
): RelanceAction[] {
    if (!category) return actions;
    return actions.filter((a) => a.category === category);
}

/* ------------------------------------------------------------------ */
/* Ouverture WhatsApp (couture — remplacée plus tard par l'API)         */
/* ------------------------------------------------------------------ */

/** Nettoie un numéro de téléphone pour wa.me (espace + 0 initial -> 33). */
export function cleanPhone(phone: string): string {
    return (phone || '').replace(/\s+/g, '').replace(/^0/, '33');
}

/** Ouvre WhatsApp avec le message pré-rempli de l'action. */
export function openRelanceWhatsApp(action: RelanceAction): void {
    if (typeof window === 'undefined') return;
    const clean = cleanPhone(action.contactPhone);
    if (!clean) return;
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(action.message)}`, '_blank');
}

/** Comptage par catégorie (pour les badges de la page). */
export function countByCategory(actions: RelanceAction[]): Record<RelanceCategory, number> {
    const counts = {
        visite_rappel: 0,
        visite_relance: 0,
        transaction_pret: 0,
        transaction_sru: 0,
        transaction_acte: 0,
        mandat_echeance: 0,
    } as Record<RelanceCategory, number>;
    actions.forEach((a) => {
        counts[a.category] += 1;
    });
    return counts;
}

/** Indique si une catégorie est une alerte de fenêtre (récurrente). */
export function isWindowCategory(category: RelanceCategory): boolean {
    return WINDOW_CATEGORIES.includes(category);
}
