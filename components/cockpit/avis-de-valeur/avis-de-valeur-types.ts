import type { DVFTransaction } from '@/lib/types';

/** All editable inputs of the valuation laboratory. */
export interface ValuationInputs {
    addressSearch: string;
    propertyType: string;
    surfaceInput: number;
    landInput: number;
    roomsInput: number;
    ownerName: string;
    // DVF weight adjustments (%)
    stateAdjustment: number;
    poolAdjustment: number;
    quietAdjustment: number;
    dpeAdjustment: number;
    viewAdjustment: number;
    // Capitalization method
    estimatedMonthlyRent: number;
    targetCapRate: number;
    // Replacement cost method
    landValueM2: number;
    buildCostM2: number;
    depreciationPct: number;
}

export type MethodTab = 'dvf' | 'cap' | 'cost';

export interface ValuationResults {
    baseDvfM2: number;
    totalAdjustmentPct: number;
    adjustedDvfM2: number;
    dvfEstimatedTotal: number;
    annualRent: number;
    capitalizationEstimatedTotal: number;
    rawLandValue: number;
    rawBuildValue: number;
    replacementEstimatedTotal: number;
    compositeEstimatedPrice: number;
    priceAttack: number;
    priceTarget: number;
    priceHigh: number;
}

/** Normalizes a DVF local type so it can be compared to the form's property type. */
function normalizeType(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z]/g, '');
}

/** Number of full months between a date string and the reference date (>= 0). */
function monthsBetween(dateStr: string, referenceDate: Date): number {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return 0;
    const months = (referenceDate.getFullYear() - d.getFullYear()) * 12 + (referenceDate.getMonth() - d.getMonth());
    return Math.max(0, months);
}

/**
 * Filters the DVF references to those comparable to the given property type.
 * Falls back to all transactions when no comparable type is found.
 */
export function filterComparableTransactions(
    transactions: DVFTransaction[],
    propertyType?: string
): DVFTransaction[] {
    if (!propertyType) return transactions;
    const wanted = normalizeType(propertyType);
    const matched = transactions.filter((t) => normalizeType(t.type_local) === wanted);
    return matched.length > 0 ? matched : transactions;
}

/**
 * Computes a fiabilized DVF price per m²: comparable-type references only,
 * weighted by distance (closer = more representative) and recency (more recent = more representative).
 */
export function computeWeightedDvfM2(
    transactions: DVFTransaction[],
    propertyType?: string,
    referenceDate: Date = new Date()
): number {
    const comparable = filterComparableTransactions(transactions, propertyType);
    if (comparable.length === 0) return 0;

    let totalWeight = 0;
    let weightedSum = 0;
    for (const t of comparable) {
        const dist = t.distance_metres ?? 500;
        const distanceWeight = 1 / (1 + dist / 200);
        const monthsAgo = monthsBetween(t.date_mutation, referenceDate);
        const recencyWeight = 1 / (1 + monthsAgo / 12);
        const weight = distanceWeight * recencyWeight;
        totalWeight += weight;
        weightedSum += t.prix_m2 * weight;
    }
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/** Computes the average raw DVF price per m² from the notary transactions (kept for compatibility). */
export function computeBaseDvfM2(transactions: DVFTransaction[]): number {
    if (transactions.length === 0) return 0;
    return Math.round(transactions.reduce((sum, t) => sum + t.prix_m2, 0) / transactions.length);
}

/** Computes every derived valuation figure from the current inputs. */
export function computeValuationResults(inputs: ValuationInputs, transactions: DVFTransaction[]): ValuationResults {
    const baseDvfM2 = computeWeightedDvfM2(transactions, inputs.propertyType);
    const totalAdjustmentPct =
        inputs.stateAdjustment + inputs.poolAdjustment + inputs.quietAdjustment + inputs.dpeAdjustment + inputs.viewAdjustment;
    const adjustedDvfM2 = Math.round(baseDvfM2 * (1 + totalAdjustmentPct / 100));
    const dvfEstimatedTotal = Math.round(inputs.surfaceInput * adjustedDvfM2);

    const annualRent = inputs.estimatedMonthlyRent * 12;
    const capitalizationEstimatedTotal = Math.round(annualRent / (inputs.targetCapRate / 100));

    const rawLandValue = inputs.landInput * inputs.landValueM2;
    const rawBuildValue = inputs.surfaceInput * inputs.buildCostM2 * (1 - inputs.depreciationPct / 100);
    const replacementEstimatedTotal = Math.round(rawLandValue + rawBuildValue);

    const compositeEstimatedPrice = Math.round(
        dvfEstimatedTotal * 0.55 + capitalizationEstimatedTotal * 0.25 + replacementEstimatedTotal * 0.2
    );

    const priceAttack = Math.round(compositeEstimatedPrice * 0.94);
    const priceTarget = compositeEstimatedPrice;
    const priceHigh = Math.round(compositeEstimatedPrice * 1.07);

    return {
        baseDvfM2,
        totalAdjustmentPct,
        adjustedDvfM2,
        dvfEstimatedTotal,
        annualRent,
        capitalizationEstimatedTotal,
        rawLandValue,
        rawBuildValue,
        replacementEstimatedTotal,
        compositeEstimatedPrice,
        priceAttack,
        priceTarget,
        priceHigh,
    };
}

/** Formats a number in French locale. */
export function formatFr(value: number): string {
    return value.toLocaleString('fr-FR');
}

/** Formats a signed percentage (e.g. +5% or -3%). */
export function formatSignedPct(value: number): string {
    return value > 0 ? `+${value}%` : `${value}%`;
}
