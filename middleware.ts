import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'nellimmo_cockpit_auth';

function computeAuthToken(user: string, pass: string): string {
  let combined = `${user}:${pass}:nellimmo_cockpit_v1`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return btoa(`${user}:${hash}`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const validUser = process.env.COCKPIT_ADMIN_USER || 'admin_nelly';
  const validPassword = process.env.COCKPIT_ADMIN_PASSWORD || 'NellImmo2026!Secured';
  const expectedToken = computeAuthToken(validUser, validPassword);

  // 1. Vérification par cookie de session Cockpit
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (authCookie && authCookie === expectedToken) {
    return NextResponse.next();
  }

  // 2. Vérification par HTTP Basic Auth
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const b64 = authHeader.substring(6).trim();
      const decoded = atob(b64);
      const colonIdx = decoded.indexOf(':');
      if (colonIdx !== -1) {
        const user = decoded.substring(0, colonIdx);
        const pwd = decoded.substring(colonIdx + 1);

        if (user === validUser && pwd === validPassword) {
          const response = NextResponse.next();
          response.cookies.set(AUTH_COOKIE_NAME, expectedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 12 * 60 * 60, // 12 heures
          });
          return response;
        }
      }
    } catch {
      // Ignorer l'erreur de décodage base64 et passer au refus 401
    }
  }

  // 3. Accès non authentifié :
  // Si c'est un endpoint d'API interne sensible, renvoyer une réponse JSON 401
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      {
        success: false,
        error: 'unauthorized',
        message: 'Accès restreint aux utilisateurs authentifiés du Cockpit.',
      },
      { status: 401 }
    );
  }

  // Si c'est l'interface /cockpit, demander l'authentification HTTP Basic
  return new NextResponse('Accès Restreint au Cockpit Nell\'Immo', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Espace Cockpit Administration"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export const config = {
  matcher: [
    '/cockpit/:path*',
    '/api/settings/:path*',
    '/api/deepseek/:path*',
    '/api/ai/copilot',
    '/api/ai/generate-copy',
    '/api/feeds/download',
  ],
};
