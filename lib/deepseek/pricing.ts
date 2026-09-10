/**
 * Tarification DeepSeek — modèles réellement exposés par l'API officielle.
 * Source : api-docs.deepseek.com (deepseek-chat = V3, deepseek-reasoner = R1).
 *
 * Les tarifs ci-dessous sont des ordres de grandeur indicatifs destinés à
 * l'estimation locale des coûts. Ils ne remplacent pas la facturation officielle.
 */

export type DeepSeekModelId =
  | 'deepseek-chat'
  | 'deepseek-reasoner';

export interface ModelPricing {
  model: DeepSeekModelId;
  label: string;
  contextWindow: number; // 1M tokens
  offPeak: {
    cacheHitPerMillion: number;
    cacheMissPerMillion: number;
    outputPerMillion: number;
  };
  peak: {
    cacheHitPerMillion: number;
    cacheMissPerMillion: number;
    outputPerMillion: number;
  };
}

export const DEEPSEEK_PRICING: Record<DeepSeekModelId, ModelPricing> = {
  'deepseek-chat': {
    model: 'deepseek-chat',
    label: 'DeepSeek Chat (V3)',
    contextWindow: 131_072,
    offPeak: {
      cacheHitPerMillion: 0.07,
      cacheMissPerMillion: 0.27,
      outputPerMillion: 1.1,
    },
    peak: {
      cacheHitPerMillion: 0.07,
      cacheMissPerMillion: 0.27,
      outputPerMillion: 1.1,
    },
  },
  'deepseek-reasoner': {
    model: 'deepseek-reasoner',
    label: 'DeepSeek Reasoner (R1)',
    contextWindow: 131_072,
    offPeak: {
      cacheHitPerMillion: 0.14,
      cacheMissPerMillion: 0.55,
      outputPerMillion: 2.19,
    },
    peak: {
      cacheHitPerMillion: 0.14,
      cacheMissPerMillion: 0.55,
      outputPerMillion: 2.19,
    },
  },
};

/** @deprecated Conservé pour compatibilité — utiliser DEEPSEEK_PRICING. */
export const DEEPSEEK_V4_PRICING = DEEPSEEK_PRICING;

export const USD_TO_EUR_RATE = 0.92;

/**
 * Détermine si la date courante (ou spécifiée) correspond aux Heures Pleines officielles :
 * 01:00-04:00 UTC et 06:00-10:00 UTC, du lundi au vendredi.
 */
export function isPeakHour(date: Date = new Date()): boolean {
  const day = date.getUTCDay(); // 0 = Dimanche, 6 = Samedi
  if (day === 0 || day === 6) return false;

  const hour = date.getUTCHours();
  const isMorningWindow = hour >= 1 && hour < 4;
  const isDayWindow = hour >= 6 && hour < 10;
  return isMorningWindow || isDayWindow;
}

export interface CostCalculationParams {
  model: DeepSeekModelId;
  cacheHitTokens: number;
  cacheMissTokens: number;
  outputTokens: number;
  date?: Date;
}

export interface CostCalculationResult {
  costUsd: number;
  costEur: number;
  isPeak: boolean;
  cacheSavingsUsd: number;
  cacheSavingsEur: number;
  gpt4oCostEur: number;
  savingsVsGpt4oEur: number;
}

/**
 * Calcule le coût réel au micro-centime près selon la formule officielle DeepSeek V4.
 */
export function calculateCallCost({
  model,
  cacheHitTokens,
  cacheMissTokens,
  outputTokens,
  date = new Date(),
}: CostCalculationParams): CostCalculationResult {
  const pricing = DEEPSEEK_PRICING[model] || DEEPSEEK_PRICING['deepseek-chat'];
  const isPeak = isPeakHour(date);
  const tier = isPeak ? pricing.peak : pricing.offPeak;

  const costHitUsd = (cacheHitTokens / 1_000_000) * tier.cacheHitPerMillion;
  const costMissUsd = (cacheMissTokens / 1_000_000) * tier.cacheMissPerMillion;
  const costOutUsd = (outputTokens / 1_000_000) * tier.outputPerMillion;
  const costUsd = costHitUsd + costMissUsd + costOutUsd;
  const costEur = costUsd * USD_TO_EUR_RATE;

  // Économie réalisée grâce au Prompt Caching
  const fullPriceIfNoCacheUsd = (cacheHitTokens / 1_000_000) * tier.cacheMissPerMillion;
  const cacheSavingsUsd = Math.max(0, fullPriceIfNoCacheUsd - costHitUsd);
  const cacheSavingsEur = cacheSavingsUsd * USD_TO_EUR_RATE;

  // Comparatif OpenAI GPT-4o ($2.50 / M input, $10.00 / M output)
  const totalInput = cacheHitTokens + cacheMissTokens;
  const gpt4oCostUsd = (totalInput / 1_000_000) * 2.5 + (outputTokens / 1_000_000) * 10.0;
  const gpt4oCostEur = gpt4oCostUsd * USD_TO_EUR_RATE;
  const savingsVsGpt4oEur = Math.max(0, gpt4oCostEur - costEur);

  return {
    costUsd,
    costEur,
    isPeak,
    cacheSavingsUsd,
    cacheSavingsEur,
    gpt4oCostEur,
    savingsVsGpt4oEur,
  };
}
