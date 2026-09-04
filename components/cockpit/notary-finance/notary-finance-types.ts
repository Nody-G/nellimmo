export type NotaryTab = 'notary' | 'capital_gains';
export type PropertyState = 'ancien' | 'neuf';
export type WorksOption = 'forfait' | 'reel';

export interface NotaryInputs {
    purchasePrice: number;
    furnitureValue: number;
    propertyState: PropertyState;
    departmentRate: number;
}

export interface CapitalGainsInputs {
    salePrice: number;
    initialPurchasePrice: number;
    holdingYears: number;
    isPrincipalResidence: boolean;
    worksOption: WorksOption;
    realWorksAmount: number;
}

export interface NotaryResults {
    taxableBase: number;
    emolsHT: number;
    emolsTTC: number;
    transferTaxes: number;
    csi: number;
    disbursements: number;
    totalNotaryFees: number;
    notaryPercent: string;
    savingsFromFurniture: number;
}

export interface CapitalGainsResults {
    acquisitionCostsAllowance: number;
    worksAllowance: number;
    adjustedAcquisitionPrice: number;
    grossCapitalGain: number;
    irAbatementRate: number;
    psAbatementRate: number;
    taxableGainIR: number;
    taxableGainPS: number;
    taxIR: number;
    taxPS: number;
    highGainSurtax: number;
    totalCapitalGainsTax: number;
    netSellerProceeds: number;
}

/** Calcul des frais de notaire (Décret 2020-179). */
export function computeNotaryResults(inputs: NotaryInputs): NotaryResults {
    const { purchasePrice, furnitureValue, propertyState, departmentRate } = inputs;
    const taxableBase = Math.max(0, purchasePrice - furnitureValue);

    // Émoluments de vente proportionnels HT
    let emolsHT = 0;
    if (taxableBase <= 6500) {
        emolsHT = taxableBase * 0.0387;
    } else if (taxableBase <= 17000) {
        emolsHT = 6500 * 0.0387 + (taxableBase - 6500) * 0.01596;
    } else if (taxableBase <= 60000) {
        emolsHT = 6500 * 0.0387 + (17000 - 6500) * 0.01596 + (taxableBase - 17000) * 0.01064;
    } else {
        emolsHT =
            6500 * 0.0387 +
            (17000 - 6500) * 0.01596 +
            (60000 - 17000) * 0.01064 +
            (taxableBase - 60000) * 0.00799;
    }

    const emolsTTC = emolsHT * 1.2;

    // Droits de mutation (Taxe de publicité foncière)
    const transferTaxes =
        propertyState === 'ancien' ? taxableBase * (departmentRate / 100) : taxableBase * 0.00715;

    // Contribution de sécurité immobilière (0.10%)
    const csi = Math.max(15, taxableBase * 0.001);

    // Débours et formalités administratives forfaitaires
    const disbursements = 1350;

    const totalNotaryFees = Math.round(emolsTTC + transferTaxes + csi + disbursements);
    const notaryPercent = ((totalNotaryFees / purchasePrice) * 100).toFixed(2);
    const savingsFromFurniture = Math.round(furnitureValue * (departmentRate / 100));

    return {
        taxableBase,
        emolsHT,
        emolsTTC,
        transferTaxes,
        csi,
        disbursements,
        totalNotaryFees,
        notaryPercent,
        savingsFromFurniture,
    };
}

/** Calcul de la plus-value immobilière. */
export function computeCapitalGainsResults(inputs: CapitalGainsInputs): CapitalGainsResults {
    const {
        salePrice,
        initialPurchasePrice,
        holdingYears,
        isPrincipalResidence,
        worksOption,
        realWorksAmount,
    } = inputs;

    // Frais d'acquisition forfaitaires (7.5%)
    const acquisitionCostsAllowance = initialPurchasePrice * 0.075;

    // Forfait travaux (15% si détention > 5 ans)
    const worksAllowance =
        worksOption === 'forfait'
            ? holdingYears >= 5
                ? initialPurchasePrice * 0.15
                : 0
            : realWorksAmount;

    const adjustedAcquisitionPrice = initialPurchasePrice + acquisitionCostsAllowance + worksAllowance;
    const grossCapitalGain = Math.max(0, salePrice - adjustedAcquisitionPrice);

    // Abattements IR (19%)
    let irAbatementRate = 0;
    if (isPrincipalResidence) {
        irAbatementRate = 100;
    } else if (holdingYears < 6) {
        irAbatementRate = 0;
    } else if (holdingYears <= 21) {
        irAbatementRate = (holdingYears - 5) * 6;
    } else if (holdingYears === 22) {
        irAbatementRate = 16 * 6 + 4; // 100%
    } else {
        irAbatementRate = 100;
    }

    // Abattements Prélèvements Sociaux (17.2%)
    let psAbatementRate = 0;
    if (isPrincipalResidence) {
        psAbatementRate = 100;
    } else if (holdingYears < 6) {
        psAbatementRate = 0;
    } else if (holdingYears <= 21) {
        psAbatementRate = (holdingYears - 5) * 1.65;
    } else if (holdingYears === 22) {
        psAbatementRate = 16 * 1.65 + 1.6;
    } else if (holdingYears <= 30) {
        psAbatementRate = 16 * 1.65 + 1.6 + (holdingYears - 22) * 9;
    } else {
        psAbatementRate = 100;
    }
    psAbatementRate = Math.min(100, psAbatementRate);

    const taxableGainIR = grossCapitalGain * (1 - irAbatementRate / 100);
    const taxableGainPS = grossCapitalGain * (1 - psAbatementRate / 100);

    const taxIR = Math.round(taxableGainIR * 0.19);
    const taxPS = Math.round(taxableGainPS * 0.172);

    // Surtaxe plus-value élevée (> 50 000€)
    let highGainSurtax = 0;
    if (!isPrincipalResidence && taxableGainIR > 50000) {
        if (taxableGainIR <= 100000) highGainSurtax = taxableGainIR * 0.02;
        else if (taxableGainIR <= 150000) highGainSurtax = taxableGainIR * 0.03;
        else if (taxableGainIR <= 200000) highGainSurtax = taxableGainIR * 0.04;
        else if (taxableGainIR <= 250000) highGainSurtax = taxableGainIR * 0.05;
        else highGainSurtax = taxableGainIR * 0.06;
    }

    const totalCapitalGainsTax = isPrincipalResidence
        ? 0
        : Math.round(taxIR + taxPS + highGainSurtax);
    const netSellerProceeds = Math.round(salePrice - totalCapitalGainsTax);

    return {
        acquisitionCostsAllowance,
        worksAllowance,
        adjustedAcquisitionPrice,
        grossCapitalGain,
        irAbatementRate,
        psAbatementRate,
        taxableGainIR,
        taxableGainPS,
        taxIR,
        taxPS,
        highGainSurtax,
        totalCapitalGainsTax,
        netSellerProceeds,
    };
}

/** Formate un montant en devise française. */
export function formatEuro(value: number): string {
    return value.toLocaleString('fr-FR');
}
