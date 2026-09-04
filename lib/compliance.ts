import { Property } from './types';

export type ComplianceSeverity = 'error' | 'warning' | 'info';

export interface ComplianceIssue {
  severity: ComplianceSeverity;
  field: string;
  message: string;
}

export interface PropertyComplianceReport {
  propertyId: string;
  mandateNumber: number;
  score: number; // 0 - 100%
  status: 'compliant' | 'warning' | 'blocked';
  readyForPortals: boolean;
  issues: ComplianceIssue[];
  checkedAt: string;
}

/**
 * Analyse la conformité légale (Loi ALUR / Climat & Résilience)
 * et les critères techniques d'admission des portails (SeLoger, LeBonCoin, Bien'ici, Figaro).
 */
export function auditPropertyCompliance(property: Property): PropertyComplianceReport {
  const issues: ComplianceIssue[] = [];
  let score = 100;

  // 1. Diagnostics Énergétiques (DPE / GES) - Obligation d'ordre public
  if (!property.dpe_letter || property.dpe_letter === 'G' && !property.dpe_value) {
    if (!property.dpe_letter) {
      issues.push({
        severity: 'error',
        field: 'dpe_letter',
        message: 'Classe DPE manquante (bloquant SeLoger / LeBonCoin / Loi Climat).',
      });
      score -= 30;
    }
  }

  if (!property.dpe_value || property.dpe_value <= 0) {
    issues.push({
      severity: 'warning',
      field: 'dpe_value',
      message: 'Valeur chiffrée DPE (kWh/m²/an) non renseignée ou nulle.',
    });
    score -= 10;
  }

  if (!property.ges_letter) {
    issues.push({
      severity: 'warning',
      field: 'ges_letter',
      message: 'Classe GES manquante (recommandée sur Bien’ici et Figaro).',
    });
    score -= 5;
  }

  // 2. Photos & Visuels HD
  const photoCount = property.images?.length || 0;
  if (photoCount === 0) {
    issues.push({
      severity: 'error',
      field: 'images',
      message: 'Aucune photo attachée. Les portails rejettent les annonces sans visuel.',
    });
    score -= 35;
  } else if (photoCount < 3) {
    issues.push({
      severity: 'warning',
      field: 'images',
      message: `${photoCount} photo(s) : minimum 3 photos recommandé pour le référencement portails.`,
    });
    score -= 10;
  }

  // 3. Mentions Financières ALUR & Honoraires
  if (!property.price_fai || property.price_fai <= 0) {
    issues.push({
      severity: 'error',
      field: 'price_fai',
      message: 'Prix FAI nul ou manquant.',
    });
    score -= 25;
  }

  if (!property.fees_paid_by) {
    issues.push({
      severity: 'warning',
      field: 'fees_paid_by',
      message: 'Charge des honoraires non précisée (vendeur ou acquéreur obligatoire ALUR).',
    });
    score -= 10;
  }

  // 4. Surfaces & Caractéristiques
  if (!property.living_area || property.living_area <= 0) {
    issues.push({
      severity: 'error',
      field: 'living_area',
      message: 'Surface habitable nulle ou non renseignée.',
    });
    score -= 20;
  }

  if (!property.rooms_count || property.rooms_count <= 0) {
    issues.push({
      severity: 'warning',
      field: 'rooms_count',
      message: 'Nombre de pièces non spécifié.',
    });
    score -= 5;
  }

  // 5. Détection de Coordonnées Interdites dans le descriptif (Rejet direct LeBonCoin / SeLoger)
  const text = property.description || '';
  const phonePattern = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  if (phonePattern.test(text)) {
    issues.push({
      severity: 'error',
      field: 'description',
      message: 'Numéro de téléphone détecté dans le texte (rejet automatique LeBonCoin / SeLoger).',
    });
    score -= 25;
  }

  if (emailPattern.test(text)) {
    issues.push({
      severity: 'error',
      field: 'description',
      message: 'Adresse email détectée dans le texte (rejet automatique par les modérateurs portails).',
    });
    score -= 20;
  }

  if (text.length < 50) {
    issues.push({
      severity: 'warning',
      field: 'description',
      message: 'Descriptif trop court (< 50 caractères), pénalisant pour le SEO.',
    });
    score -= 10;
  }

  // Normalisation du score
  const finalScore = Math.max(0, Math.min(100, score));
  const hasErrors = issues.some((i) => i.severity === 'error');

  return {
    propertyId: property.id,
    mandateNumber: property.mandate_number,
    score: finalScore,
    status: hasErrors ? 'blocked' : finalScore < 90 ? 'warning' : 'compliant',
    readyForPortals: !hasErrors,
    issues,
    checkedAt: new Date().toISOString(),
  };
}
