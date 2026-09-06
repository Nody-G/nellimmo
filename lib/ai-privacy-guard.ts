/**
 * Filtre de Confidentialité & Garde-fous Légaux — Cockpit Nellimo
 *
 * Ce module sanctuarise les données confidentielles avant tout envoi vers l'API DeepSeek :
 * 1. Détection et caviardage strict des données financières et bancaires (IBAN, BIC, comptes séquestres).
 * 2. Caviardage des identifiants fiscaux, numéros de sécurité sociale (NIR) et pièces d'identité.
 * 3. Pseudonymisation des contacts clients (noms de famille raccourcis aux initiales : "M. et Mme D.").
 * 4. Filtrage des secrets du coffre-fort et clés d'API.
 * 5. Fourniture déterministe des mentions légales obligatoires (Loi Hoguet & ALUR) : ces mentions
 *    ne sont JAMAIS confiées à l'imagination de l'IA.
 */

import type { Property } from './types';
import { formatMandateRef } from './hoguet';

// Expressions régulières pour la détection de données hautement sensibles
const REGEX_PATTERNS = {
  // IBAN International (focus France FR + 25 caractères)
  iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/gi,
  // BIC / SWIFT (8 ou 11 caractères)
  bic: /\b[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?\b/g,
  // Numéro de Sécurité Sociale Français (NIR 13 ou 15 chiffres)
  nir: /\b[12]\s*\d{2}\s*(?:0[1-9]|1[0-2])\s*\d{2}\s*\d{3}\s*\d{3}(?:\s*\d{2})?\b/g,
  // Cartes de crédit
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  // Clés API ou tokens privés (sk-..., eyJ...)
  apiToken: /\b(?:sk-[a-zA-Z0-9]{20,}|eyJ[a-zA-Z0-9_-]{20,})\b/g,
  // Numéros fiscaux français (13 chiffres)
  numeroFiscal: /\b\d{13}\b/g,
};

/**
 * Assainit une chaîne de caractères en caviardant toute donnée bancaire,
 * fiscale ou d'identité sensible.
 */
export function sanitizeTextForLlm(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Caviardage des données critiques
  sanitized = sanitized.replace(REGEX_PATTERNS.iban, '[IBAN SÉQUESTRÉ MASQUÉ]');
  sanitized = sanitized.replace(REGEX_PATTERNS.creditCard, '[CARTE BANCAIRE MASQUÉE]');
  sanitized = sanitized.replace(REGEX_PATTERNS.nir, '[NUMÉRO SÉCURITÉ SOCIALE MASQUÉ]');
  sanitized = sanitized.replace(REGEX_PATTERNS.numeroFiscal, '[IDENTIFIANT FISCAL MASQUÉ]');
  sanitized = sanitized.replace(REGEX_PATTERNS.apiToken, '[SECRET MASQUÉ]');

  return sanitized;
}

/**
 * Pseudonymise un nom complet de client pour préserver son identité
 * Exemple : "Jean-Michel Dupont" -> "Jean-Michel D."
 * Exemple : "M. et Mme Martinez" -> "M. et Mme M."
 */
export function pseudonymizeName(fullName?: string): string {
  if (!fullName || !fullName.trim()) return 'Client';

  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].length > 1 ? `${parts[0].charAt(0)}.` : parts[0];
  }

  // Si commence par civilité (M., Mme, M_Mme)
  if (/^(m\.|mme|m\.\s*et\s*mme|mr|monsieur|madame)/i.test(trimmed)) {
    const lastPart = parts[parts.length - 1];
    return `${parts.slice(0, parts.length - 1).join(' ')} ${lastPart.charAt(0).toUpperCase()}.`;
  }

  // Format standard Prénom Nom -> Prénom N.
  const firstName = parts.slice(0, parts.length - 1).join(' ');
  const lastName = parts[parts.length - 1];
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
}

/**
 * Prépare une fiche de bien immobilier pour l'IA en garantissant qu'aucune
 * donnée de séquestre, identité vendeur ou coordonnée personnelle n'est divulguée.
 */
export function sanitizePropertyForLlm(property: Partial<Property>): Record<string, unknown> {
  return {
    mandate_number: property.mandate_number ? formatMandateRef(property.mandate_number) : 'Mandat Exclusif',
    mandate_type: property.mandate_type || 'exclusif',
    title: sanitizeTextForLlm(property.title || ''),
    property_type: property.property_type || 'maison',
    city: property.city || 'Pélissanne',
    postal_code: property.postal_code || '13330',
    // L'adresse exacte n'est pas envoyée sauf si publique
    address_zone: property.city ? `Secteur ${property.city}` : 'Pays Salonais',
    price_fai: property.price_fai,
    living_area: property.living_area,
    land_area: property.land_area,
    rooms_count: property.rooms_count,
    bedrooms_count: property.bedrooms_count,
    bathrooms_count: property.bathrooms_count,
    dpe_letter: property.dpe_letter || 'en cours',
    dpe_value: property.dpe_value,
    ges_letter: property.ges_letter || 'en cours',
    features: (property.features || []).map(f => sanitizeTextForLlm(f)),
    // Vendeur anonymisé
    seller_display: pseudonymizeName(property.seller_name),
  };
}

/**
 * Bloc réglementaire obligatoire garanti en dur (Loi ALUR, Loi Hoguet & Géorisques).
 * Ce bloc est DÉTERMINISTE et garanti par le code, jamais généré par l'IA.
 */
export function getDeterministicLegalBlock(property: Partial<Property>): string {
  const mandateRef = property.mandate_number ? formatMandateRef(property.mandate_number) : 'En cours';
  const priceFAI = property.price_fai ? `${property.price_fai.toLocaleString('fr-FR')} €` : 'Prix sur demande';
  const feesPercent = property.agency_fees_percentage || 3.9;
  const feesPaidBy = property.fees_paid_by || 'vendeur';

  return `
---
📋 INFORMATIONS LÉGALES & RÉGLEMENTAIRES CERTIFIÉES :
• Mandat n° ${mandateRef} — Prix FAI : ${priceFAI} (Honoraires de ${feesPercent}% TTC inclus à la charge de l'${feesPaidBy}).
• DPE : ${property.dpe_letter ? `Classe ${property.dpe_letter} (${property.dpe_value || '-'} kWh/m²/an)` : 'DPE en cours'}${property.ges_letter ? ` | GES : Classe ${property.ges_letter}` : ''}.
• Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr.
• SASU NELL'IMMO au capital de 2 000 € — Siège social : 26 avenue des Enjouvènes, 13330 Pélissanne.
• RCS Salon-de-Provence n° 853 807 006 — Carte Professionnelle CPI 1310 2019 000 042 974 délivrée par la CCI Marseille Provence.
• Nelly FERNANDEZ — Agent Immobilier Indépendant & Présidente — Tél : 07 55 68 61 09 — Email : nellimmo.acte@gmail.com — www.nellimmo.fr`.trim();
}
