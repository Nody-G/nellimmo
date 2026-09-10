import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const KEY_FILE_PATH = path.join(process.cwd(), '.deepseek_key');

/**
 * Lit la clé persistée localement sur le serveur si elle existe
 */
function readServerPersistedKey(): string {
  try {
    if (fs.existsSync(KEY_FILE_PATH)) {
      return fs.readFileSync(KEY_FILE_PATH, 'utf8').trim();
    }
  } catch {
    // Ignore file error
  }
  return '';
}

/**
 * Sauvegarde la clé sur le serveur local
 */
function saveServerPersistedKey(key: string): void {
  try {
    fs.writeFileSync(KEY_FILE_PATH, key.trim(), 'utf8');
  } catch {
    // Ignore
  }
}

/**
 * Supprime la clé du serveur local
 */
function deleteServerPersistedKey(): void {
  try {
    if (fs.existsSync(KEY_FILE_PATH)) {
      fs.unlinkSync(KEY_FILE_PATH);
    }
  } catch {
    // Ignore
  }
}

export async function GET(req: NextRequest) {
  const cookieKey = req.cookies.get('nellimmo_deepseek_key')?.value?.trim();
  const envKey = process.env.DEEPSEEK_API_KEY?.trim();
  const fileKey = readServerPersistedKey();

  const effectiveKey = cookieKey || envKey || fileKey || '';
  const hasKey = effectiveKey.length > 5;

  let maskedKey = '';
  if (hasKey) {
    maskedKey = effectiveKey.startsWith('sk-')
      ? `sk-••••••••••••${effectiveKey.slice(-4)}`
      : `••••••••••••${effectiveKey.slice(-4)}`;
  }

  return NextResponse.json({
    hasKey,
    maskedKey,
    source: cookieKey ? 'cookie' : (envKey ? 'env' : (fileKey ? 'server_file' : 'none')),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = (body.apiKey || '').toString().trim();

    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Format de clé DeepSeek invalide (doit commencer par sk-).' },
        { status: 400 }
      );
    }

    // Test de validation direct auprès des serveurs DeepSeek officiels
    const startPing = Date.now();
    const testRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Ping connection test. Reply with OK.' }],
        max_tokens: 5,
      }),
      signal: AbortSignal.timeout(6000),
    });

    const latencyMs = Date.now() - startPing;

    if (!testRes.ok) {
      const errText = await testRes.text();
      let userFriendlyMsg = `Erreur DeepSeek (HTTP ${testRes.status})`;
      if (testRes.status === 401) {
        userFriendlyMsg = 'Clé API DeepSeek invalide ou non autorisée (401 Unauthorized). Vérifiez votre clé sur platform.deepseek.com.';
      } else if (testRes.status === 402) {
        userFriendlyMsg = 'Solde de compte DeepSeek insuffisant (402 Payment Required). Rechargez vos crédits API.';
      }

      return NextResponse.json(
        { success: false, error: userFriendlyMsg, details: errText },
        { status: 400 }
      );
    }

    // Clé validée : mettre à jour le runtime et persister
    process.env.DEEPSEEK_API_KEY = apiKey;
    saveServerPersistedKey(apiKey);

    const maskedKey = apiKey.startsWith('sk-')
      ? `sk-••••••••••••${apiKey.slice(-4)}`
      : `••••••••••••${apiKey.slice(-4)}`;

    const res = NextResponse.json({
      success: true,
      latencyMs,
      maskedKey,
      message: 'Clé API DeepSeek V4.1 Flash vérifiée et connectée avec succès sur toute l’application.',
    });

    res.cookies.set('nellimmo_deepseek_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 an
      path: '/',
    });

    return res;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Erreur réseau';
    return NextResponse.json(
      { success: false, error: `Impossible de tester la clé DeepSeek : ${errMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  process.env.DEEPSEEK_API_KEY = '';
  deleteServerPersistedKey();

  const res = NextResponse.json({
    success: true,
    message: 'Clé DeepSeek déconnectée. Le système bascule sur le modèle de secours local certifié.',
  });

  res.cookies.delete('nellimmo_deepseek_key');
  return res;
}
