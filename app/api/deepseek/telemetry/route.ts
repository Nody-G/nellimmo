import { NextRequest, NextResponse } from 'next/server';
import { executeDeepSeekCall, resolveDeepSeekApiKey } from '@/lib/deepseek/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  // Diagnostic Ping en direct avec deepseek-chat
  if (action === 'ping') {
    const result = await executeDeepSeekCall({
      feature: 'diagnostic',
      featureLabel: 'Test de connectivité API',
      messages: [
        {
          role: 'user',
          content: 'Réponds uniquement par le mot OK en un seul token.',
        },
      ],
      model: 'deepseek-chat',
      maxTokens: 5,
      req,
    });

    return NextResponse.json({
      success: result.success,
      status: result.success ? 'connected' : 'error',
      latencyMs: result.log.latencyMs,
      log: result.log,
      error: result.error,
    });
  }

  const hasApiKey = Boolean(resolveDeepSeekApiKey(req));
  return NextResponse.json({
    status: 'ready',
    hasServerApiKey: hasApiKey,
    defaultModel: 'deepseek-chat',
    contextWindow: '128k tokens',
  });
}
