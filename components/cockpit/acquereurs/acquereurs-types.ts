import type { Buyer, Property, FinancingStatus } from '@/lib/types';
import { calculateMatchingScore } from '@/lib/hoguet';

/** Financing status display metadata (label + badge color classes). */
export const FINANCING_STATUS_META: Record<
    FinancingStatus,
    { label: string; badge: string }
> = {
    accord_bancaire_valide: {
        label: 'Accord bancaire validé',
        badge: 'bg-emerald-100 text-emerald-800',
    },
    comptant: {
        label: 'Achat comptant',
        badge: 'bg-emerald-100 text-emerald-800',
    },
    etude_courtier: {
        label: 'Dossier courtier en cours',
        badge: 'bg-blue-100 text-blue-800',
    },
    en_attente: {
        label: 'Financement à vérifier',
        badge: 'bg-amber-100 text-amber-800',
    },
};

/** Ordered financing statuses for the filter dropdown. */
export const FINANCING_STATUS_OPTIONS: { value: FinancingStatus; label: string }[] = [
    { value: 'accord_bancaire_valide', label: 'Accord bancaire validé' },
    { value: 'etude_courtier', label: 'Dossier en cours chez un courtier' },
    { value: 'comptant', label: 'Achat comptant (Fonds propres)' },
    { value: 'en_attente', label: 'À vérifier avant signature' },
];

/** Returns the badge color for a buyer financing status. */
export function financingBadge(status: FinancingStatus): string {
    return FINANCING_STATUS_META[status]?.badge ?? 'bg-amber-100 text-amber-800';
}

/** Returns the human label for a buyer financing status. */
export function financingLabel(status: FinancingStatus): string {
    return FINANCING_STATUS_META[status]?.label ?? status.replace(/_/g, ' ');
}

/** Filters buyers by search query and financing status. */
export function filterBuyers(
    buyers: Buyer[],
    searchQuery: string,
    statusFilter: string
): Buyer[] {
    const q = searchQuery.trim().toLowerCase();
    return buyers.filter((b) => {
        const matchesSearch =
            !q ||
            b.first_name.toLowerCase().includes(q) ||
            b.last_name.toLowerCase().includes(q) ||
            b.phone.includes(q) ||
            b.target_cities.some((c) => c.toLowerCase().includes(q));
        const matchesStatus = statusFilter === 'all' || b.financing_status === statusFilter;
        return matchesSearch && matchesStatus;
    });
}

/** Computes the matching properties (score >= 50) for a given buyer. */
export function getMatchingProperties(
    activeProperties: Property[],
    buyer: Buyer,
    minScore = 50
): { property: Property; score: number }[] {
    return activeProperties
        .map((p) => ({ property: p, score: calculateMatchingScore(p, buyer).score }))
        .filter((m) => m.score >= minScore)
        .sort((a, b) => b.score - a.score);
}

/** Ranks all buyers against a target property (score >= 50), best first. */
export function rankBuyersForProperty(
    buyers: Buyer[],
    property: Property,
    minScore = 50
): { buyer: Buyer; score: number }[] {
    return buyers
        .map((b) => ({ buyer: b, score: calculateMatchingScore(property, b).score }))
        .filter((m) => m.score >= minScore)
        .sort((a, b) => b.score - a.score);
}

/** Builds the teaser message used for a broadcast campaign on a property. */
export function buildBroadcastTeaser(property: Property): string {
    return `Bonjour [Prénom], en exclusivité chez Nell\u2019Immo : une nouvelle opportunité correspond précisément à vos critères à ${property.city} (${property.living_area} m², ${property.rooms_count} pièces, ${property.price_fai.toLocaleString('fr-FR')} € FAI).\nConsultez la fiche complète : https://nellimmo.fr/biens/${property.id}\nSouhaitez-vous organiser une visite privée cette semaine ?\nNelly Fernandez (07 55 68 61 09).`;
}

/** Builds the personal WhatsApp message for a buyer on a broadcast campaign. */
export function buildBroadcastMessage(buyer: Buyer, property: Property): string {
    return `Bonjour ${buyer.first_name}, c\u2019est Nelly de l\u2019agence Nell\u2019Immo ! Je viens de rentrer un bien en exclusivité qui coche vos critères à ${property.city} (${property.living_area} m², ${property.price_fai.toLocaleString('fr-FR')} € FAI). Je vous le propose en avant-première avant diffusion officielle. Souhaitez-vous que je vous envoie la fiche et qu\u2019on prévoie une visite ? Belle journée !`;
}

/** Builds the personal WhatsApp message for a buyer card quick contact. */
export function buildBuyerContactMessage(buyer: Buyer): string {
    return `Bonjour ${buyer.first_name}, c\u2019est Nelly de l\u2019agence Nell\u2019Immo. J\u2019espère que vos recherches immobilières avancent bien !`;
}

/** Normalizes a French phone number into an international wa.me format. */
export function toWhatsAppNumber(phone: string): string {
    return phone.replace(/\s+/g, '').replace(/^0/, '33');
}

/** Opens a WhatsApp chat to the given phone with the given message. */
export function openWhatsApp(phone: string, message: string): void {
    const url = `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

/** Loan simulation inputs. */
export interface LoanSimulationInput {
    purchasePrice: number;
    downPayment: number;
    durationYears: number;
    interestRate: number;
    insuranceRate: number;
}

/** Loan simulation computed results. */
export interface LoanSimulationResult {
    notaryFees: number;
    totalCost: number;
    loanAmount: number;
    baseMonthlyPayment: number;
    monthlyInsurance: number;
    totalMonthlyPayment: number;
    totalLoanCost: number;
    minRequiredHouseholdIncome: number;
}

/** Computes the full HCSF loan simulation from raw inputs. */
export function computeLoanSimulation(input: LoanSimulationInput): LoanSimulationResult {
    const notaryFees = Math.round(input.purchasePrice * 0.075);
    const totalCost = input.purchasePrice + notaryFees;
    const loanAmount = Math.max(0, totalCost - input.downPayment);
    const monthlyInterestRate = input.interestRate / 100 / 12;
    const totalMonths = input.durationYears * 12;
    const baseMonthlyPayment =
        monthlyInterestRate > 0
            ? Math.round(
                (loanAmount * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -totalMonths))
            )
            : Math.round(loanAmount / totalMonths);
    const monthlyInsurance = Math.round((loanAmount * (input.insuranceRate / 100)) / 12);
    const totalMonthlyPayment = baseMonthlyPayment + monthlyInsurance;
    const totalLoanCost = Math.round(totalMonthlyPayment * totalMonths - loanAmount);
    // HCSF 35% max debt-to-income threshold
    const minRequiredHouseholdIncome = Math.round(totalMonthlyPayment / 0.35);
    return {
        notaryFees,
        totalCost,
        loanAmount,
        baseMonthlyPayment,
        monthlyInsurance,
        totalMonthlyPayment,
        totalLoanCost,
        minRequiredHouseholdIncome,
    };
}
