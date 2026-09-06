/**
 * Tarification Officielle DeepSeek V4 & Grille Tarifaire (16 Août 2026)
 * Source officielle : api-docs.deepseek.com
 */

export type DeepSeekModelId =
  | 'deepseek-v4-flash'
  | 'deepseek-v4-pro'
  | 'deepseek-v4-flash-vision-exp';

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

export const DEEPSEEK_V4_PRICING: Record<DeepSeekModelId, ModelPricing> = {
  'deepseek-v4-flash': {
    model: 'deepseek-v4-flash',
    label: 'DeepSeek V4 Flash (0731)',
    contextWindow: 1_048_576,
    offPeak: {
      cacheHitPerMillion: 0.007,
      cacheMissPerMillion: 0.22,
      outputPerMillion: 0.66,
    },
    peak: {
      cacheHitPerMillion: 0.014,
      cacheMissPerMillion: 0.44,
      outputPerMillion: 1.32,
    },
  },
  'deepseek-v4-pro': {
    model: 'deepseek-v4-pro',
    label: 'DeepSeek V4 Pro (0813 Reasoning)',
    contextWindow: 1_048_576,
    offPeak: {
      cacheHitPerMillion: 0.022,
      cacheMissPerMillion: 0.66,
      outputPerMillion: 1.98,
    },
    peak: {
      cacheHitPerMillion: 0.044,
      cacheMissPerMillion: 1.32,
      outputPerMillion: 3.96,
    },
  },
  'deepseek-v4-flash-vision-exp': {
    model: 'deepseek-v4-flash-vision-exp',
    label: 'DeepSeek V4 Flash Vision',
    contextWindow: 1_048_576,
    offPeak: {
      cacheHitPerMillion: 0.007,
      cacheMissPerMillion: 0.22,
      outputPerMillion: 0.66,
    },
    peak: {
      cacheHitPerMillion: 0.014,
      cacheMissPerMillion: 0.44,
      outputPerMillion: 1.32,
    },
  },
};

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
  const pricing = DEEPSEEK_V4_PRICING[model] || DEEPSEEK_V4_PRICING['deepseek-v4-flash'];
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
