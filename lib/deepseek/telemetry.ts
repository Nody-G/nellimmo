import { DeepSeekModelId, CostCalculationResult } from './pricing';

export type DeepSeekFeature =
  | 'redacteur'
  | 'copilot'
  | 'assistant'
  | 'database_query'
  | 'pige_sparring'
  | 'diagnostic';

export interface DeepSeekCallLog {
  id: string;
  timestamp: string;
  feature: DeepSeekFeature;
  featureLabel: string;
  model: DeepSeekModelId;
  promptTokens: number;
  promptCacheHitTokens: number;
  promptCacheMissTokens: number;
  completionTokens: number;
  reasoningTokens?: number;
  totalTokens: number;
  latencyMs: number;
  status: 'success' | 'fallback' | 'error';
  errorMessage?: string;
  cost: CostCalculationResult;
}

export interface BudgetConfig {
  monthlyLimitEur: number;
  alertThresholdPercent: number; // e.g. 80
  economyModeEnabled: boolean; // if true, forces deepseek-v4-flash or local fallback when over budget
}

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  monthlyLimitEur: 15.0,
  alertThresholdPercent: 80,
  economyModeEnabled: true,
};

const LOGS_STORAGE_KEY = 'nellimo_deepseek_logs_v1';
const BUDGET_STORAGE_KEY = 'nellimo_deepseek_budget_v1';

export function getStoredCallLogs(): DeepSeekCallLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load DeepSeek logs from localStorage', e);
    return [];
  }
}

export function saveCallLog(log: DeepSeekCallLog): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getStoredCallLogs();
    logs.unshift(log); // newest first
    // Limit to last 500 logs to preserve storage
    if (logs.length > 500) logs.length = 500;
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save DeepSeek log', e);
  }
}

export function clearCallLogs(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOGS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear logs', e);
  }
}

export function getBudgetConfig(): BudgetConfig {
  if (typeof window === 'undefined') return DEFAULT_BUDGET_CONFIG;
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
    return raw ? { ...DEFAULT_BUDGET_CONFIG, ...JSON.parse(raw) } : DEFAULT_BUDGET_CONFIG;
  } catch {
    return DEFAULT_BUDGET_CONFIG;
  }
}

export function saveBudgetConfig(config: Partial<BudgetConfig>): BudgetConfig {
  const current = getBudgetConfig();
  const updated = { ...current, ...config };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save budget config', e);
    }
  }
  return updated;
}

export interface TelemetrySummary {
  totalCalls: number;
  successCalls: number;
  fallbackCalls: number;
  totalCostEur: number;
  totalCostUsd: number;
  totalSavingsVsGpt4oEur: number;
  totalCacheSavingsEur: number;
  totalTokens: number;
  cacheHitTokens: number;
  cacheMissTokens: number;
  completionTokens: number;
  reasoningTokens: number;
  cacheHitRate: number; // 0 to 100%
  averageLatencyMs: number;
  featureBreakdown: Record<DeepSeekFeature, { count: number; costEur: number; tokens: number }>;
  budgetUsedPercent: number;
  budgetRemainingEur: number;
  isBudgetExceeded: boolean;
  isBudgetNearLimit: boolean;
}

export function computeTelemetrySummary(
  logs: DeepSeekCallLog[],
  budget: BudgetConfig = DEFAULT_BUDGET_CONFIG
): TelemetrySummary {
  let totalCostEur = 0;
  let totalCostUsd = 0;
  let totalSavingsVsGpt4oEur = 0;
  let totalCacheSavingsEur = 0;
  let totalTokens = 0;
  let cacheHitTokens = 0;
  let cacheMissTokens = 0;
  let completionTokens = 0;
  let reasoningTokens = 0;
  let totalLatency = 0;
  let successCalls = 0;
  let fallbackCalls = 0;

  const featureBreakdown: Record<DeepSeekFeature, { count: number; costEur: number; tokens: number }> = {
    redacteur: { count: 0, costEur: 0, tokens: 0 },
    copilot: { count: 0, costEur: 0, tokens: 0 },
    assistant: { count: 0, costEur: 0, tokens: 0 },
    database_query: { count: 0, costEur: 0, tokens: 0 },
    pige_sparring: { count: 0, costEur: 0, tokens: 0 },
    diagnostic: { count: 0, costEur: 0, tokens: 0 },
  };

  for (const log of logs) {
    if (log.status === 'success') successCalls++;
    else if (log.status === 'fallback') fallbackCalls++;

    totalCostEur += log.cost?.costEur || 0;
    totalCostUsd += log.cost?.costUsd || 0;
    totalSavingsVsGpt4oEur += log.cost?.savingsVsGpt4oEur || 0;
    totalCacheSavingsEur += log.cost?.cacheSavingsEur || 0;

    totalTokens += log.totalTokens || 0;
    cacheHitTokens += log.promptCacheHitTokens || 0;
    cacheMissTokens += log.promptCacheMissTokens || 0;
    completionTokens += log.completionTokens || 0;
    reasoningTokens += log.reasoningTokens || 0;
    totalLatency += log.latencyMs || 0;

    const feat = log.feature;
    if (featureBreakdown[feat]) {
      featureBreakdown[feat].count += 1;
      featureBreakdown[feat].costEur += log.cost?.costEur || 0;
      featureBreakdown[feat].tokens += log.totalTokens || 0;
    }
  }

  const totalInputTokens = cacheHitTokens + cacheMissTokens;
  const cacheHitRate = totalInputTokens > 0 ? (cacheHitTokens / totalInputTokens) * 100 : 0;
  const averageLatencyMs = logs.length > 0 ? Math.round(totalLatency / logs.length) : 0;

  const budgetUsedPercent = budget.monthlyLimitEur > 0
    ? (totalCostEur / budget.monthlyLimitEur) * 100
    : 0;
  const budgetRemainingEur = Math.max(0, budget.monthlyLimitEur - totalCostEur);
  const isBudgetExceeded = totalCostEur >= budget.monthlyLimitEur;
  const isBudgetNearLimit = budgetUsedPercent >= budget.alertThresholdPercent;

  return {
    totalCalls: logs.length,
    successCalls,
    fallbackCalls,
    totalCostEur,
    totalCostUsd,
    totalSavingsVsGpt4oEur,
    totalCacheSavingsEur,
    totalTokens,
    cacheHitTokens,
    cacheMissTokens,
    completionTokens,
    reasoningTokens,
    cacheHitRate,
    averageLatencyMs,
    featureBreakdown,
    budgetUsedPercent,
    budgetRemainingEur,
    isBudgetExceeded,
    isBudgetNearLimit,
  };
}
