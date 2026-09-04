export interface VisitAnalysisResult {
  sentiment: 'coup_de_coeur' | 'interesse' | 'neutre' | 'refus';
  strengths: string[];
  weaknesses: string[];
  priceFeedback: string;
}

export const DEMO_VISIT_TRANSCRIPT =
  "Visite terminée avec l'acquéreur. C'est un vrai coup de cœur, ils ont adoré le grand jardin sans vis-à-vis, la piscine et la belle luminosité du séjour. Par contre la cuisine est un peu à moderniser et une chambre d'enfant est étroite. Financement bancaire déjà accordé à 540 000 euros. Le prix est jugé conforme au marché.";

/**
 * Analyzes audio transcript from on-site visit debriefs to extract sentiment,
 * strengths, weaknesses, and price feedback.
 */
export function analyzeVisitTranscript(text: string): VisitAnalysisResult {
  const lower = text.toLowerCase();

  // 1. Sentiment detection
  let sentiment: VisitAnalysisResult['sentiment'] = 'interesse';
  if (
    lower.includes('coup de coeur') ||
    lower.includes('coup de cœur') ||
    lower.includes('adoré') ||
    lower.includes('offre') ||
    lower.includes('va acheter') ||
    lower.includes('parfait')
  ) {
    sentiment = 'coup_de_coeur';
  } else if (
    lower.includes('pas intéressé') ||
    lower.includes('refus') ||
    lower.includes('ne convient pas') ||
    lower.includes('trop petit')
  ) {
    sentiment = 'refus';
  } else if (lower.includes('hésite') || lower.includes('neutre') || lower.includes('à voir')) {
    sentiment = 'neutre';
  }

  // 2. Strengths extraction
  const detectedStrengths: string[] = [];
  if (lower.includes('jardin') || lower.includes('extérieur') || lower.includes('terrain'))
    detectedStrengths.push('Jardin / Extérieur');
  if (
    lower.includes('lumineux') ||
    lower.includes('luminosité') ||
    lower.includes('ensoleillé') ||
    lower.includes('clarté')
  )
    detectedStrengths.push('Luminosité');
  if (lower.includes('piscine')) detectedStrengths.push('Piscine');
  if (lower.includes('calme') || lower.includes('silence') || lower.includes('tranquille'))
    detectedStrengths.push('Calme absolu');
  if (lower.includes('vue') || lower.includes('dégagé')) detectedStrengths.push('Vue dégagée');
  if (
    lower.includes('rénové') ||
    lower.includes('état') ||
    lower.includes('impeccable') ||
    lower.includes('propre')
  )
    detectedStrengths.push('État impeccable');
  if (lower.includes('garage') || lower.includes('stationnement'))
    detectedStrengths.push('Garage / Parking');

  if (detectedStrengths.length === 0) {
    detectedStrengths.push('Luminosité', 'Emplacement recherché');
  }

  // 3. Weaknesses extraction
  const detectedWeaknesses: string[] = [];
  if (
    lower.includes('travaux') ||
    lower.includes('moderniser') ||
    lower.includes('rénover') ||
    lower.includes('peinture')
  )
    detectedWeaknesses.push('Travaux de rafraîchissement');
  if (
    lower.includes('chambre') &&
    (lower.includes('petite') || lower.includes('étroite') || lower.includes('serré'))
  )
    detectedWeaknesses.push('Taille des chambres');
  if (lower.includes('cuisine')) detectedWeaknesses.push('Cuisine à rajeunir');
  if (lower.includes('bruit') || lower.includes('route') || lower.includes('passage'))
    detectedWeaknesses.push('Nuisance sonore');
  if (lower.includes('vis-à-vis') || lower.includes('voisin'))
    detectedWeaknesses.push('Vis-à-vis');

  // 4. Price feedback
  let priceFeedback = 'Au prix du marché';
  if (
    lower.includes('trop cher') ||
    lower.includes('cher') ||
    lower.includes('négocier') ||
    lower.includes('baisse')
  ) {
    priceFeedback = 'Jugé légèrement au-dessus du marché (négociation souhaitée)';
  } else if (lower.includes('très bon prix') || lower.includes('bonne affaire')) {
    priceFeedback = 'Très attractif par rapport aux prestations';
  }

  return {
    sentiment,
    strengths: detectedStrengths,
    weaknesses: detectedWeaknesses,
    priceFeedback
  };
}
