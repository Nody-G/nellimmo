import { NextRequest, NextResponse } from 'next/server';
import { executeDeepSeekCall } from '@/lib/deepseek/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  // Diagnostic Ping en direct avec deepseek-v4-flash
  if (action === 'ping') {
    const overrideKey = req.headers.get('x-deepseek-key') || undefined;
    const result = await executeDeepSeekCall({
      feature: 'diagnostic',
      featureLabel: 'Test de connectivité API',
      messages: [
        {
          role: 'user',
          content: 'Réponds uniquement par le mot OK en un seul token.',
        },
      ],
      model: 'deepseek-v4-flash',
      maxTokens: 5,
      overrideApiKey: overrideKey,
    });

    return NextResponse.json({
      success: result.success,
      status: result.success ? 'connected' : 'error',
      latencyMs: result.log.latencyMs,
      log: result.log,
      error: result.error,
    });
  }

  const hasApiKey = Boolean(process.env.DEEPSEEK_API_KEY);
  return NextResponse.json({
    status: 'ready',
    hasServerApiKey: hasApiKey,
    defaultModel: 'deepseek-v4-flash',
    contextWindow: '1M tokens',
  });
}
