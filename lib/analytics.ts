import type {
    Property,
    PropertyType,
    TransactionDeal,
    TransactionStatus,
    Buyer,
    VisitSheet,
    ContactLead,
    EstimationLead,
    ProspectingLead,
    ProposalHistory,
} from './types';

// ---------------------------------------------------------------------------
// ANALYTICS — Moteur de calcul pur du tableau de bord analytique
// ---------------------------------------------------------------------------
// Ce module ne dépend d'aucun état React : il prend les données brutes du
// store et une date de référence, et renvoie des agrégats prêts à afficher.
// Il est volontairement robuste aux données historiques ou incomplètes.

export type AnalyticsPeriod = '12m' | 'ytd' | 'all';

export interface AnalyticsInput {
    properties: Property[];
    transactions: TransactionDeal[];
    buyers: Buyer[];
    visits: VisitSheet[];
    contactLeads: ContactLead[];
    estimationLeads: EstimationLead[];
    prospectingLeads: ProspectingLead[];
    proposals: ProposalHistory[];
    referenceDate?: Date;
}

// --- Helpers de dates (cohérents avec lib/relances.ts) ---------------------

function toDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function parseDate(value?: string): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

function monthKeyOf(value?: string): string | null {
    const d = parseDate(value);
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function daysBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function monthLabel(key: string): string {
    const [y, m] = key.split('-').map(Number);
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return `${months[m - 1]} ${y}`;
}

// --- Types de sortie --------------------------------------------------------

export interface AnalyticsKpis {
    // Stock actif (instantané)
    activeMandates: number;
    activeExclusive: number;
    activeValueFai: number;
    activeFeesExpected: number;
    // Pipeline en cours
    pipelineDeals: number;
    pipelineFees: number;
    // Ventes clôturées (période)
    closedDeals: number;
    closedFeesReceived: number;
    closedValue: number;
    // Conversion & délais
    conversionRate: number; // 0..100
    avgDaysToClose: number | null;
    avgSalePrice: number | null;
    avgFeesPerSale: number | null;
    // Activité (période)
    mandatesSigned: number;
    visitsDone: number;
    buyersActive: number;
    leadsIncoming: number;
}

export interface PipelineStage {
    status: TransactionStatus;
    label: string;
    count: number;
    fees: number;
}

export interface DistributionSlice {
    key: string;
    label: string;
    count: number;
    value: number;
}

export interface MonthlyPoint {
    key: string; // 'YYYY-MM'
    label: string;
    mandates: number;
    closed: number;
    visits: number;
    leads: number;
}

export interface AnalyticsResult {
    period: AnalyticsPeriod;
    kpis: AnalyticsKpis;
    pipeline: PipelineStage[];
    byType: DistributionSlice[];
    byCity: DistributionSlice[];
    byMandateType: DistributionSlice[];
    monthly: MonthlyPoint[];
    topVisited: { propertyId: string; title: string; visits: number }[];
    topProposed: { propertyId: string; title: string; proposals: number }[];
}

// --- Libellés ---------------------------------------------------------------

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    maison: 'Maison',
    appartement: 'Appartement',
    terrain: 'Terrain',
    immeuble: 'Immeuble',
    local_commercial: 'Local commercial',
};

const PIPELINE_STAGES: { status: TransactionStatus; label: string }[] = [
    { status: 'offre_acceptee', label: 'Offres validées' },
    { status: 'compromis_signe', label: 'Compromis signé' },
    { status: 'delai_sru_en_cours', label: 'Délai SRU' },
    { status: 'sru_purgee', label: 'SRU purgée' },
    { status: 'attente_pret', label: 'Financement (prêt)' },
    { status: 'pret_accorde', label: 'Prêt accordé' },
    { status: 'acte_planifie', label: 'Acte planifié' },
];

const CLOSED_STATUSES: TransactionStatus[] = ['acte_signe'];
const CANCELLED_STATUSES: TransactionStatus[] = ['annule'];

// --- Période ----------------------------------------------------------------

function periodStart(period: AnalyticsPeriod, ref: Date): Date {
    if (period === '12m') return addMonths(startOfMonth(ref), -11);
    if (period === 'ytd') return new Date(ref.getFullYear(), 0, 1);
    return new Date(2000, 0, 1); // 'all'
}

function inPeriod(value: string | undefined, start: Date, ref: Date): boolean {
    const d = parseDate(value);
    if (!d) return false;
    return d.getTime() >= start.getTime() && d.getTime() <= ref.getTime();
}

// --- Moteur principal -------------------------------------------------------

export function computeAnalytics(input: AnalyticsInput, period: AnalyticsPeriod = '12m'): AnalyticsResult {
    const ref = input.referenceDate ?? new Date();
    const start = periodStart(period, ref);

    const { properties, transactions, buyers, visits } = input;

    // --- Stock actif (instantané, indépendant de la période) ---
    const active = properties.filter((p) => p.status === 'actif');
    const activeExclusive = active.filter((p) => p.mandate_type === 'exclusif').length;
    const activeValueFai = active.reduce((s, p) => s + (p.price_fai || 0), 0);
    const activeFeesExpected = active.reduce((s, p) => s + (p.agency_fees_amount || 0), 0);

    // --- Pipeline en cours (instantané) ---
    const pipelineDeals = transactions.filter(
        (t) => !CLOSED_STATUSES.includes(t.status) && !CANCELLED_STATUSES.includes(t.status)
    );
    const pipelineFees = pipelineDeals.reduce((s, t) => s + (t.agency_fees_amount || 0), 0);

    // --- Ventes clôturées sur la période ---
    const closed = transactions.filter(
        (t) => t.status === 'acte_signe' && inPeriod(t.actual_closing_date ?? t.updated_at, start, ref)
    );
    const closedFeesReceived = closed.reduce((s, t) => s + (t.fees_received ? t.agency_fees_amount || 0 : 0), 0);
    const closedValue = closed.reduce((s, t) => s + (t.offer_price_fai || 0), 0);

    // --- Mandats signés sur la période ---
    const mandatesSigned = properties.filter((p) => inPeriod(p.mandate_date, start, ref)).length;

    // --- Visites sur la période ---
    const visitsDone = visits.filter((v) => inPeriod(v.visit_date, start, ref)).length;

    // --- Leads entrants sur la période ---
    const leadsIncoming =
        input.contactLeads.filter((l) => inPeriod(l.created_at, start, ref)).length +
        input.estimationLeads.filter((l) => inPeriod(l.created_at, start, ref)).length +
        input.prospectingLeads.filter((l) => inPeriod(l.created_at, start, ref)).length;

    // --- Conversion & délais ---
    const conversionRate =
        mandatesSigned > 0 ? Math.min(100, (closed.length / mandatesSigned) * 100) : 0;

    const closedWithDates = closed
        .map((t) => {
            const prop = properties.find((p) => p.id === t.property_id);
            const mandateDate = prop ? parseDate(prop.mandate_date) : null;
            const closeDate = parseDate(t.actual_closing_date ?? t.updated_at);
            if (!mandateDate || !closeDate) return null;
            const days = daysBetween(mandateDate, closeDate);
            return days >= 0 ? days : null;
        })
        .filter((d): d is number => d !== null);
    const avgDaysToClose =
        closedWithDates.length > 0
            ? Math.round(closedWithDates.reduce((s, d) => s + d, 0) / closedWithDates.length)
            : null;

    const avgSalePrice = closed.length > 0 ? Math.round(closedValue / closed.length) : null;
    const avgFeesPerSale =
        closed.length > 0
            ? Math.round(closed.reduce((s, t) => s + (t.agency_fees_amount || 0), 0) / closed.length)
            : null;

    const buyersActive = buyers.filter((b) => b.status === 'actif').length;

    const kpis: AnalyticsKpis = {
        activeMandates: active.length,
        activeExclusive,
        activeValueFai,
        activeFeesExpected,
        pipelineDeals: pipelineDeals.length,
        pipelineFees,
        closedDeals: closed.length,
        closedFeesReceived,
        closedValue,
        conversionRate,
        avgDaysToClose,
        avgSalePrice,
        avgFeesPerSale,
        mandatesSigned,
        visitsDone,
        buyersActive,
        leadsIncoming,
    };

    // --- Pipeline funnel ---
    const pipeline: PipelineStage[] = PIPELINE_STAGES.map((stage) => {
        const deals = transactions.filter((t) => t.status === stage.status);
        return {
            status: stage.status,
            label: stage.label,
            count: deals.length,
            fees: deals.reduce((s, t) => s + (t.agency_fees_amount || 0), 0),
        };
    }).filter((s) => s.count > 0);

    // --- Répartitions ---
    const byType: DistributionSlice[] = Object.entries(PROPERTY_TYPE_LABELS)
        .map(([key, label]) => {
            const items = active.filter((p) => p.property_type === key);
            return {
                key,
                label,
                count: items.length,
                value: items.reduce((s, p) => s + (p.price_fai || 0), 0),
            };
        })
        .filter((s) => s.count > 0)
        .sort((a, b) => b.count - a.count);

    const cityMap = new Map<string, DistributionSlice>();
    active.forEach((p) => {
        const city = p.city || 'Autre';
        const existing = cityMap.get(city);
        if (existing) {
            existing.count += 1;
            existing.value += p.price_fai || 0;
        } else {
            cityMap.set(city, { key: city, label: city, count: 1, value: p.price_fai || 0 });
        }
    });
    const byCity = Array.from(cityMap.values()).sort((a, b) => b.count - a.count);

    const mandateTypeMap = new Map<string, DistributionSlice>();
    active.forEach((p) => {
        const label =
            p.mandate_type === 'exclusif'
                ? 'Exclusif'
                : p.mandate_type === 'semi-exclusif'
                    ? 'Semi-exclusif'
                    : 'Simple';
        const existing = mandateTypeMap.get(label);
        if (existing) {
            existing.count += 1;
            existing.value += p.price_fai || 0;
        } else {
            mandateTypeMap.set(label, { key: label, label, count: 1, value: p.price_fai || 0 });
        }
    });
    const byMandateType = Array.from(mandateTypeMap.values()).sort((a, b) => b.count - a.count);

    // --- Série temporelle mensuelle ---
    const monthly: MonthlyPoint[] = [];
    const cursor = new Date(start);
    while (cursor.getTime() <= ref.getTime()) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
        const next = addMonths(cursor, 1);
        const inMonth = (value?: string) => {
            const d = parseDate(value);
            return !!d && d.getTime() >= cursor.getTime() && d.getTime() < next.getTime();
        };
        monthly.push({
            key,
            label: monthLabel(key),
            mandates: properties.filter((p) => inMonth(p.mandate_date)).length,
            closed: transactions.filter(
                (t) => t.status === 'acte_signe' && inMonth(t.actual_closing_date ?? t.updated_at)
            ).length,
            visits: visits.filter((v) => inMonth(v.visit_date)).length,
            leads:
                input.contactLeads.filter((l) => inMonth(l.created_at)).length +
                input.estimationLeads.filter((l) => inMonth(l.created_at)).length +
                input.prospectingLeads.filter((l) => inMonth(l.created_at)).length,
        });
        cursor.setTime(next.getTime());
    }

    // --- Top biens visités / proposés ---
    const visitCount = new Map<string, number>();
    visits.forEach((v) => {
        visitCount.set(v.property_id, (visitCount.get(v.property_id) ?? 0) + 1);
    });
    const topVisited = Array.from(visitCount.entries())
        .map(([propertyId, count]) => {
            const prop = properties.find((p) => p.id === propertyId);
            return { propertyId, title: prop?.title ?? 'Bien', visits: count };
        })
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 5);

    const proposalCount = new Map<string, number>();
    input.proposals.forEach((pr) => {
        proposalCount.set(pr.property_id, (proposalCount.get(pr.property_id) ?? 0) + 1);
    });
    const topProposed = Array.from(proposalCount.entries())
        .map(([propertyId, count]) => {
            const prop = properties.find((p) => p.id === propertyId);
            return { propertyId, title: prop?.title ?? 'Bien', proposals: count };
        })
        .sort((a, b) => b.proposals - a.proposals)
        .slice(0, 5);

    return {
        period,
        kpis,
        pipeline,
        byType,
        byCity,
        byMandateType,
        monthly,
        topVisited,
        topProposed,
    };
}

// --- Helpers de formatage ---------------------------------------------------

export function formatEuro(value: number): string {
    return `${Math.round(value).toLocaleString('fr-FR')} €`;
}

export function formatCompactEuro(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M€`;
    if (value >= 1_000) return `${Math.round(value / 1_000).toLocaleString('fr-FR')} k€`;
    return `${Math.round(value).toLocaleString('fr-FR')} €`;
}

export function monthKeyOfDate(d: Date): string {
    return monthKeyOf(toDateKey(d)) ?? '';
}
