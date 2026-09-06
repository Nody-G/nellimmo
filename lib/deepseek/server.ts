import { calculateCallCost, DeepSeekModelId } from './pricing';
import { DeepSeekCallLog, DeepSeekFeature } from './telemetry';

export interface DeepSeekServerCallOptions {
  feature: DeepSeekFeature;
  featureLabel: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  model?: DeepSeekModelId;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' | 'text' };
  overrideApiKey?: string;
}

export interface DeepSeekServerCallResult {
  success: boolean;
  content: string;
  log: DeepSeekCallLog;
  rawUsage?: Record<string, unknown>;
  error?: string;
}

/**
 * Client serveur officiel pour DeepSeek V4 (Flash / Pro).
 * Gère automatiquement le prompt caching, le décompte d'usage officiel et le calcul de coût.
 */
export async function executeDeepSeekCall({
  feature,
  featureLabel,
  messages,
  model = 'deepseek-v4-flash',
  temperature = 0.7,
  maxTokens = 2048,
  responseFormat,
  overrideApiKey,
}: DeepSeekServerCallOptions): Promise<DeepSeekServerCallResult> {
  const apiKey = overrideApiKey || process.env.DEEPSEEK_API_KEY || '';
  const startTime = Date.now();
  const logId = `ds_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  if (!apiKey) {
    const latencyMs = Date.now() - startTime;
    const emptyCost = calculateCallCost({
      model,
      cacheHitTokens: 0,
      cacheMissTokens: 0,
      outputTokens: 0,
    });

    const fallbackLog: DeepSeekCallLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      feature,
      featureLabel,
      model,
      promptTokens: 0,
      promptCacheHitTokens: 0,
      promptCacheMissTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      latencyMs,
      status: 'fallback',
      errorMessage: 'Aucune clé API DeepSeek configurée.',
      cost: emptyCost,
    };

    return {
      success: false,
      content: '',
      log: fallbackLog,
      error: 'NO_API_KEY',
    };
  }

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        ...(responseFormat ? { response_format: responseFormat } : {}),
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errText = await res.text();
      const emptyCost = calculateCallCost({
        model,
        cacheHitTokens: 0,
        cacheMissTokens: 0,
        outputTokens: 0,
      });

      const errorLog: DeepSeekCallLog = {
        id: logId,
        timestamp: new Date().toISOString(),
        feature,
        featureLabel,
        model,
        promptTokens: 0,
        promptCacheHitTokens: 0,
        promptCacheMissTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs,
        status: 'error',
        errorMessage: `Erreur API (${res.status}): ${errText}`,
        cost: emptyCost,
      };

      return {
        success: false,
        content: '',
        log: errorLog,
        error: `HTTP_${res.status}: ${errText}`,
      };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    const usage = data.usage || {};

    const promptCacheHitTokens = Number(usage.prompt_cache_hit_tokens) || 0;
    const promptCacheMissTokens = Number(usage.prompt_cache_miss_tokens) ||
      Math.max(0, (Number(usage.prompt_tokens) || 0) - promptCacheHitTokens);
    const completionTokens = Number(usage.completion_tokens) || 0;
    const reasoningTokens = Number(usage.completion_tokens_details?.reasoning_tokens) || 0;
    const totalTokens = Number(usage.total_tokens) || (promptCacheHitTokens + promptCacheMissTokens + completionTokens);

    const cost = calculateCallCost({
      model,
      cacheHitTokens: promptCacheHitTokens,
      cacheMissTokens: promptCacheMissTokens,
      outputTokens: completionTokens,
    });

    const successLog: DeepSeekCallLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      feature,
      featureLabel,
      model,
      promptTokens: promptCacheHitTokens + promptCacheMissTokens,
      promptCacheHitTokens,
      promptCacheMissTokens,
      completionTokens,
      reasoningTokens,
      totalTokens,
      latencyMs,
      status: 'success',
      cost,
    };

    return {
      success: true,
      content,
      log: successLog,
      rawUsage: usage,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errMessage = error instanceof Error ? error.message : 'Erreur réseau';
    const emptyCost = calculateCallCost({
      model,
      cacheHitTokens: 0,
      cacheMissTokens: 0,
      outputTokens: 0,
    });

    const networkErrorLog: DeepSeekCallLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      feature,
      featureLabel,
      model,
      promptTokens: 0,
      promptCacheHitTokens: 0,
      promptCacheMissTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      latencyMs,
      status: 'error',
      errorMessage: errMessage,
      cost: emptyCost,
    };

    return {
      success: false,
      content: '',
      log: networkErrorLog,
      error: errMessage,
    };
  }
}
