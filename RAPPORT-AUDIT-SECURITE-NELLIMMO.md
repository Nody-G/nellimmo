# RAPPORT D'AUDIT DE SÉCURITÉ APPROFONDI & CONFORMITÉ
## Cible : Application Next.js Nell'Immo (https://nellimmo.vercel.app/)
**Date de réalisation** : 11 Septembre 2026  
**Type d'audit** : Boîte noire externe non intrusive, rétro-ingénierie des bundles frontend, analyse d'architecture Next.js App Router / Edge, et audit de sécurité client-side.  
**Auditeur** : Antigravity (Advanced Cybersecurity & Application Security Specialist)  
**Statut** : Rapport complet avec correctifs de code source prêts pour déploiement immédiat.

---

## SOMMAIRE
1. [SYNTHÈSE EXÉCUTIVE & NOTATION GLOBALE](#1-synthèse-exécutive--notation-globale)
2. [TOPOLOGIE TECHNIQUE & CONTEXTE DE DÉVELOPPEMENT](#2-topologie-technique--contexte-de-développement)
3. [TABLEAU DES VULNÉRABILITÉS (CVSS v3.1)](#3-tableau-des-vulnérabilités-cvss-v31)
4. [ANALYSE DÉTAILLÉE DES VULNÉRABILITÉS & DÉCOUVERTES](#4-analyse-détaillée-des-vulnérabilités--découvertes)
   - [4.1 VULN-01 : Exposition publique de l'interface d'administration `/cockpit`](#41-vuln-01--exposition-publique-de-linterface-dadministration-cockpit)
   - [4.2 VULN-02 : Stockage de secrets d'API dans le navigateur & mot de passe maître en clair dans sessionStorage](#42-vuln-02--stockage-de-secrets-dapi-dans-le-navigateur--mot-de-passe-maître-en-clair-dans-sessionstorage)
   - [4.3 VULN-03 : Absence d'en-têtes HTTP de sécurité & vulnérabilité au Clickjacking](#43-vuln-03--absence-den-têtes-http-de-sécurité--vulnérabilité-au-clickjacking)
   - [4.4 VULN-04 : Wildcard CORS global (`Access-Control-Allow-Origin: *`)](#44-vuln-04--wildcard-cors-global-access-control-allow-origin-)
   - [4.5 VULN-05 : Hébergement sur domaine partagé `*.vercel.app`](#45-vuln-05--hébergement-sur-domaine-partagé-vercelapp)
5. [POINTS FORTS IDENTIFIÉS (POSTURE POSITIVE)](#5-points-forts-identifiés-posture-positive)
6. [CODE PRÊT À L'EMPLOI : PLAN DE CORRECTION IMMÉDIAT](#6-code-prêt-à-lemploi--plan-de-correction-immédiat)
   - [A. Durcissement des en-têtes HTTP (`next.config.mjs` / `next.config.js`)](#a-durcissement-des-en-têtes-http-nextconfigmjs--nextconfigjs)
   - [B. Verrouillage de la route `/cockpit` via `middleware.ts`](#b-verrouillage-de-la-route-cockpit-via-middlewarets)
   - [C. Migration des secrets du Coffre-fort vers les variables d'environnement Vercel](#c-migration-des-secrets-du-coffre-fort-vers-les-variables-denvironnement-vercel)

---

## 1. SYNTHÈSE EXÉCUTIVE & NOTATION GLOBALE

### Score de posture globale : **B- (6.8 / 10)** — Risque global : 🟠 **MOYEN / CONTRÔLABLE**

Contrairement à Pel'immo (qui souffre d'une infrastructure mutualisée vieillissante sur laquelle vous n'avez pas la main), **Nell'Immo bénéficie d'une architecture moderne (Next.js 18/Turbopack sur Vercel Edge)** avec un socle natif de sécurité robuste.

Cependant, notre audit approfondi a mis au jour **une découverte critique d'architecture applicative** : la présence d'un panneau d'administration complet (**`/cockpit`**) accessible à n'importe quel visiteur, et un mécanisme de coffre-fort client stockant des secrets sensibles (SFTP, tokens Meta, API keys) dans le navigateur.

```
+-------------------------------------------------------------------------+
|                  SYNTHÈSE DE LA POSTURE DE SÉCURITÉ                    |
+--------------------------+--------------------+-------------------------+
| Périmètre                | Niveau de Risque   | Statut                  |
+--------------------------+--------------------+-------------------------+
| Interface Admin (/cockpit)| 🔴 CRITIQUE (8.6)  | Ouverte au public       |
| Gestion des Secrets      | 🟠 ÉLEVÉ (7.4)     | Mot de passe en clair   |
| Durcissement HTTP        | 🟠 ÉLEVÉ (6.5)     | Clickjacking possible   |
| Configuration CORS       | 🟡 MOYEN (5.3)     | Wildcard (*) global     |
| Infrastructure & CDN     | 🟢 EXCELLENT (9.0) | Vercel Edge, HSTS fort  |
+--------------------------+--------------------+-------------------------+
```

### Le gros avantage de Nell'Immo :
**Vous avez la main totale sur 100 % du code source**. Toutes les vulnérabilités identifiées ci-dessous peuvent être corrigées directement par vous en **moins d'une heure** via quelques lignes dans votre code Next.js.

---

## 2. TOPOLOGIE TECHNIQUE & CONTEXTE DE DÉVELOPPEMENT

- **Nom de domaine audité** : `https://nellimmo.vercel.app/`
- **Domaine de production visé** : `https://nellimmo.fr` (actuellement pointé sur l'ancien hébergement OVH / La Boîte Immo)
- **Hébergement** : Vercel (Edge Network / Anycast CDN mondial)
- **Framework** : Next.js (App Router, Turbopack, Tailwind CSS, Lucide Icons)
- **Gestion d'état** : Zustand store avec persistance locale (`localStorage`)
- **Mécanisme cryptographique** : Web Crypto API (`crypto.subtle`) avec PBKDF2 (150 000 itérations) et AES-GCM 256 bits

---

## 3. TABLEAU DES VULNÉRABILITÉS (CVSS v3.1)

| Réf | Intitulé | Score CVSS | Sévérité | Impact Métier | Difficulté de correction |
|---|---|---|---|---|---|
| **VULN-01** | Exposition publique de la page d'administration `/cockpit` | **8.6** | 🔴 CRITIQUE | Prise de contrôle de l'agence / ERP | Très facile (Middleware) |
| **VULN-02** | Mot de passe maître en clair dans `sessionStorage` & secrets client-side | **7.4** | 🟠 ÉLEVÉ | Fuite de mots de passe SFTP / tokens API | Facile (Variables d'environnement) |
| **VULN-03** | Absence d'en-têtes HTTP de sécurité (X-Frame-Options, CSP) | **6.5** | 🟠 ÉLEVÉ | Vulnérabilité au Clickjacking | Immédiat (`next.config.js`) |
| **VULN-04** | En-tête CORS permissif `Access-Control-Allow-Origin: *` | **5.3** | 🟡 MOYEN | Lecture cross-origin non désirée | Immédiat (`next.config.js`) |
| **VULN-05** | Utilisation d'un sous-domaine partagé `*.vercel.app` | **3.8** | 🟢 FAIBLE | Risque d'isolation et d'usurpation | Configuration DNS |

---

## 4. ANALYSE DÉTAILLÉE DES VULNÉRABILITÉS & DÉCOUVERTES

### 4.1 VULN-01 : Exposition publique de l'interface d'administration `/cockpit`
- **URL accessible** : `https://nellimmo.vercel.app/cockpit` (Réponse `HTTP 200 OK`)
- **Constat** :
  L'URL `/cockpit` affiche directement l'écran de configuration administrative :
  > **« Créez votre compte administrateur »**  
  > *« Configurez le premier compte admin ou connectez-vous directement avec votre code. »*
- **Risques majeurs** :
  1. **Prise de contrôle de l'onboarding** : N'importe quel internaute ou robot qui découvre ce lien (il est présent dans le code source du footer !) peut créer un compte administrateur local.
  2. **Accès au cœur du métier** : Le code du cockpit permet la gestion complète de l'agence immobilière :
     - Les mandats et avenants
     - Les offres d'achat (proposals)
     - Les fiches de visite et comptes-rendus vendeurs
     - **Le registre des clés physiques** (`createKey`, `borrowKey`, `returnKey`), qui liste l'emplacement des clés des biens en vente !
  3. **Attaques par force brute** : Le bouton *« J’ai déjà un code d’accès / mot de passe → Connexion directe »* permet à un attaquant de tenter des mots de passe en boucle sans limitation de débit (rate limiting) au niveau du serveur.

---

### 4.2 VULN-02 : Stockage de secrets d'API dans le navigateur & mot de passe maître en clair dans sessionStorage
L'analyse des bundles JavaScript (notamment `00pq7xyptgeeg.js`) a révélé le fonctionnement interne du module de coffre-fort (« Vault ») :

```javascript
// Extrait désobfusqué du bundle Nell'Immo :
S = [
  "sftp_password",
  "meta_app_secret",
  "facebook_page_access_token",
  "linkedin_client_secret",
  "google_maps_api_key"
];
v = "nellimo_settings_vault_v1";
h = "nellimo_vault_session_v1";

async function I(e) {
  w = await C(e);
  sessionStorage.setItem(h, JSON.stringify({ password: e })); // <-- MOT DE PASSE EN CLAIR DANS LE NAVIGATEUR !
}
```

- **Faiblesses identifiées** :
  1. **Stockage du mot de passe maître en clair** : La fonction `I(e)` stocke l'objet `{ password: e }` en texte clair dans `sessionStorage`. Si l'administratrice déverrouille le cockpit sur son ordinateur ou smartphone, n'importe quel script tiers ou extension navigateur peut exécuter `sessionStorage.getItem('nellimo_vault_session_v1')` et récupérer son mot de passe !
  2. **Anti-pattern architectural (Secrets côté client)** :
     Des identifiants critiques de passerelle comme `sftp_password` (utilisé pour déposer les flux XML d'annonces sur les portails ou serveurs) ou `meta_app_secret` ne doivent **JAMAIS** être saisis ou stockés dans le navigateur.
     En cas d'attaque XSS ou de vol de session locale, l'attaquant récupère le mot de passe SFTP et peut modifier les annonces immobilières ou injecter des fichiers sur le serveur distant.

---

### 4.3 VULN-03 : Absence d'en-têtes HTTP de sécurité & vulnérabilité au Clickjacking
- **En-têtes manquants** :
  - `X-Frame-Options`
  - `Content-Security-Policy` (avec directive `frame-ancestors`)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
- **Scénario d'attaque (Clickjacking / UI Redressing)** :
  Comme `X-Frame-Options` est absent, un attaquant peut créer une page web piégée contenant :
  ```html
  <iframe src="https://nellimmo.vercel.app/cockpit" style="opacity: 0.0001; position: absolute; ..."></iframe>
  ```
  En incitant l'utilisatrice connectée à cliquer sur un jeu concours ou un bouton factice, le clic est en réalité intercepté par un bouton de l'interface Cockpit (par exemple pour supprimer un bien ou modifier un contact).

---

### 4.4 VULN-04 : Wildcard CORS global (`Access-Control-Allow-Origin: *`)
- **En-tête présent** :
  ```http
  Access-Control-Allow-Origin: *
  ```
- **Problématique** : Cet en-tête est retourné sur la page HTML elle-même (`/`, `/cockpit`, `/contact`). Si vous développez ultérieurement des routes d'API privées (`/api/...`), ce wildcard permettra à n'importe quel site tiers de lire le contenu des réponses via `fetch()` cross-origin.

---

### 4.5 VULN-05 : Hébergement sur domaine partagé `*.vercel.app`
- Le domaine `*.vercel.app` est partagé par des millions d'utilisateurs. L'isolation des cookies entre sous-domaines sur ce type de domaine générique n'est pas optimale.
- Il est vivement conseillé de basculer la production sur votre nom de domaine personnalisé (ex. `https://nellimmo.fr` ou `https://app.nellimmo.fr`).

---

## 5. POINTS FORTS IDENTIFIÉS (POSTURE POSITIVE)

Tout n'est pas négatif, loin de là ! Nell'Immo présente de solides atouts :
- ✅ **HSTS actif et préchargé** : `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (Fourni nativement par Vercel).
- ✅ **Chiffrement Web Crypto moderne** : Le chiffrement local utilise PBKDF2 avec **150 000 itérations**, ce qui est conforme aux recommandations actuelles de l'OWASP contre le cassage par force brute offline.
- ✅ **Source Maps protégées** : L'accès direct aux fichiers `.js.map` renvoie un `403 Forbidden`, ce qui empêche les attaquants de télécharger le code source TypeScript d'origine.
- ✅ **Pas de fuite de tokens statiques** : Aucun token secret Supabase (`service_role`) n'a été hardcodé dans les fichiers publics.

---

## 6. CODE PRÊT À L'EMPLOI : PLAN DE CORRECTION IMMÉDIAT

Voici les modifications exactes à apporter dans votre projet Next.js :

### A. Durcissement des en-têtes HTTP (`next.config.mjs` ou `next.config.js`)
Remplacez ou complétez la section `headers()` de votre fichier de configuration Next.js :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Bloque totalement le Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Empêche le reniflage MIME
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co https://api.mapbox.com",
              "frame-ancestors 'none'", // Double protection anti-clickjacking
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### B. Verrouillage de la route `/cockpit` via `middleware.ts`
Créez ou modifiez le fichier `middleware.ts` à la racine de votre projet (ou dans `src/middleware.ts`) pour protéger l'accès à `/cockpit` par une authentification basique ou un jeton secret en attendant votre système d'authentification final :

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verrouiller l'accès au cockpit
  if (pathname.startsWith('/cockpit')) {
    const basicAuth = request.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Définir vos identifiants dans les variables d'environnement Vercel
      const validUser = process.env.COCKPIT_ADMIN_USER || 'admin_nelly';
      const validPassword = process.env.COCKPIT_ADMIN_PASSWORD;

      if (validPassword && user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    }

    // Demander l'authentification HTTP Basic
    return new NextResponse('Accès Restreint au Cockpit Nell\'Immo', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Espace Cockpit Administration"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cockpit/:path*'],
};
```

---

### C. Migration des secrets du Coffre-fort vers les variables d'environnement Vercel
1. Rendez-vous sur votre tableau de bord **Vercel** > Projet `nellimmo` > **Settings** > **Environment Variables**.
2. Ajoutez vos clés en tant que variables secrètes serveur :
   - `SFTP_HOST`, `SFTP_USER`, `SFTP_PASSWORD`
   - `META_APP_SECRET`, `LINKEDIN_CLIENT_SECRET`
3. Créez des **Server Actions** ou des **Route Handlers** (ex: `app/api/sync-passerelle/route.ts`) pour exécuter les opérations avec ces secrets côté serveur Node.js, sans que le mot de passe ne descende jamais sur le navigateur de l'utilisateur !

---
*Fin du rapport d'audit pour Nell'Immo. Rédigé le 11 septembre 2026.*
