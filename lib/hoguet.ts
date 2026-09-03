import { Property, DpeLetter, GesLetter, FeesPaidBy } from './types';

/**
 * Calcul de l'empreinte cryptographique SHA-256 pour sceller l'audit log
 */
/**
 * Génère un token d'accès unique et non devinable pour l'Espace Vendeur.
 * Utilise crypto.getRandomValues (cryptographiquement sûr) si disponible.
 */
export function generateSellerToken(): string {
  const bytes = new Uint8Array(18);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `token-${hex}`;
}

export async function computeSHA256(data: unknown): Promise<string> {
  const jsonString = JSON.stringify(data);

  // Utilisation de Web Crypto API compatible Edge, Node et Browser
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple pour les environnements de test
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Référence officielle du mandat (format agence)
 */
export function formatMandateRef(mandateNumber: number, year: number = 2026): string {
  return `NEL-${year}-${mandateNumber.toString().padStart(3, '0')}`;
}

/**
 * Détermination automatique de la lettre DPE (Seuils réglementaires 2021-2024)
 */
export function getDpeLetterFromValue(value?: number): DpeLetter | undefined {
  if (value === undefined || value === null || isNaN(value)) return undefined;
  if (value <= 70) return 'A';
  if (value <= 110) return 'B';
  if (value <= 180) return 'C';
  if (value <= 250) return 'D';
  if (value <= 330) return 'E';
  if (value <= 420) return 'F';
  return 'G';
}

/**
 * Détermination automatique de la lettre GES (Seuils réglementaires 2021-2024)
 */
export function getGesLetterFromValue(value?: number): GesLetter | undefined {
  if (value === undefined || value === null || isNaN(value)) return undefined;
  if (value <= 6) return 'A';
  if (value <= 11) return 'B';
  if (value <= 30) return 'C';
  if (value <= 50) return 'D';
  if (value <= 70) return 'E';
  if (value <= 100) return 'F';
  return 'G';
}

/**
 * Vérification de l'obligation d'audit énergétique (Loi Climat & Résilience : classes F et G)
 */
export function isAuditEnergetiqueObligatoire(dpeLetter?: string): boolean {
  return dpeLetter === 'F' || dpeLetter === 'G';
}

/**
 * Calculateur financier conforme Loi ALUR
 */
export function calculateFinancials(params: {
  priceNetSeller?: number;
  agencyFeesPercentage?: number;
  agencyFeesAmount?: number;
  feesPaidBy: FeesPaidBy;
}) {
  const net = params.priceNetSeller || 0;
  let feesAmount = params.agencyFeesAmount || 0;
  let feesPercentage = params.agencyFeesPercentage || 0;

  if (params.agencyFeesPercentage && !params.agencyFeesAmount && net > 0) {
    feesAmount = Math.round((net * params.agencyFeesPercentage) / 100);
  } else if (params.agencyFeesAmount && net > 0) {
    feesPercentage = Number(((feesAmount / net) * 100).toFixed(2));
  }

  const priceFai = net + feesAmount;

  return {
    priceNetSeller: net,
    agencyFeesAmount: feesAmount,
    agencyFeesPercentage: feesPercentage,
    priceFai: priceFai,
    feesPaidBy: params.feesPaidBy,
  };
}

/**
 * Algorithme de Matching CRM Acquéreurs (Score 0 - 100%)
 */
export function calculateMatchingScore(property: Property, buyer: import('./types').Buyer) {
  let score = 0;
  const matches = {
    budget: false,
    surface: false,
    rooms: false,
    propertyType: false,
    city: false,
    garden: false,
    garage: false,
  };

  // 1. Budget (Poids: 30 pts)
  if (property.price_fai <= buyer.budget_max) {
    score += 30;
    matches.budget = true;
  } else if (property.price_fai <= buyer.budget_max * 1.05) {
    score += 15; // Petite marge de 5%
    matches.budget = true;
  }

  // 2. Type de bien (Poids: 20 pts)
  if (buyer.target_property_types.includes(property.property_type)) {
    score += 20;
    matches.propertyType = true;
  }

  // 3. Localisation / Ville (Poids: 20 pts)
  if (buyer.target_cities.length === 0 || buyer.target_cities.some(c => c.toLowerCase() === property.city.toLowerCase())) {
    score += 20;
    matches.city = true;
  }

  // 4. Surface minimum (Poids: 10 pts)
  if (!buyer.min_surface || property.living_area >= buyer.min_surface) {
    score += 10;
    matches.surface = true;
  }

  // 5. Nombre de chambres / pièces (Poids: 10 pts)
  if (!buyer.min_bedrooms || property.bedrooms_count >= buyer.min_bedrooms) {
    score += 10;
    matches.rooms = true;
  }

  // 6. Jardin / Extérieur (Poids: 5 pts)
  if (!buyer.must_have_garden || (property.land_area && property.land_area > 0) || property.features.some(f => f.toLowerCase().includes('jardin') || f.toLowerCase().includes('terrasse'))) {
    score += 5;
    matches.garden = true;
  }

  // 7. Garage (Poids: 5 pts)
  if (!buyer.must_have_garage || property.features.some(f => f.toLowerCase().includes('garage') || f.toLowerCase().includes('parking'))) {
    score += 5;
    matches.garage = true;
  }

  return {
    score: Math.min(100, score),
    criteriaMatches: matches
  };
}
