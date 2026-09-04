import type { Property, MandateAvenant, AvenantType } from '@/lib/types';

/** Valeurs par défaut calculées à l'ouverture de la modale. */
export interface AvenantDefaults {
    newPriceFai: number;
    newFeesAmount: number;
    newEndDate: string;
}

/** Calcule les valeurs initiales (prix -4%, honoraires, échéance +3 mois). */
export function computeAvenantDefaults(property: Property): AvenantDefaults {
    const newPriceFai = Math.round(property.price_fai * 0.96); // -4% par défaut
    const newFeesAmount = Math.round(newPriceFai * (property.agency_fees_percentage / 100));
    const d = new Date(property.mandate_end_date || Date.now());
    d.setMonth(d.getMonth() + 3);
    return {
        newPriceFai,
        newFeesAmount,
        newEndDate: d.toISOString().slice(0, 10),
    };
}

/** Recalcule les honoraires selon le barème d'agence lors d'un changement de prix. */
export function computeFeesFromPrice(price: number, feesPercentage: number): number {
    const pct = feesPercentage || 4.0;
    return Math.round(price * (pct / 100));
}

/** Net vendeur résultant. */
export function computeNetSeller(priceFai: number, feesAmount: number): number {
    return priceFai - feesAmount;
}

/** Taux d'honoraires en % du prix FAI. */
export function computeFeesPercentage(feesAmount: number, priceFai: number): number {
    return priceFai > 0 ? Number(((feesAmount / priceFai) * 100).toFixed(2)) : 0;
}

/** Construit le payload d'enregistrement de l'avenant. */
export function buildAvenantPayload(params: {
    property: Property;
    avenantType: AvenantType;
    newPriceFai: number;
    newFeesAmount: number;
    newNetSeller: number;
    newEndDate: string;
    reason: string;
    avenantNumber: number;
}): Omit<MandateAvenant, 'id' | 'created_at'> {
    const { property, avenantType, newPriceFai, newFeesAmount, newNetSeller, newEndDate, reason, avenantNumber } = params;
    const isPriceDrop = avenantType === 'baisse_prix';
    return {
        mandate_number: property.mandate_number,
        property_id: property.id,
        avenant_number: avenantNumber,
        avenant_type: avenantType,
        previous_price_fai: property.price_fai,
        new_price_fai: isPriceDrop ? newPriceFai : property.price_fai,
        previous_price_net: property.price_net_seller,
        new_price_net: isPriceDrop ? newNetSeller : property.price_net_seller,
        previous_fees_amount: property.agency_fees_amount,
        new_fees_amount: isPriceDrop ? newFeesAmount : property.agency_fees_amount,
        new_end_date: avenantType === 'prorogation' ? newEndDate : property.mandate_end_date,
        reason,
        effective_date: new Date().toISOString().slice(0, 10),
        is_signed: true,
        signed_at: new Date().toISOString(),
        signature_sha256: 'sha256-avenant-' + Date.now().toString(16),
    };
}

/** Formate un montant en devise française. */
export function formatEuro(value: number): string {
    return value.toLocaleString('fr-FR');
}

/** Formate une date ISO en date française lisible. */
export function formatDateFr(iso?: string): string {
    if (!iso) return 'Non renseignée';
    return new Date(iso).toLocaleDateString('fr-FR');
}
