# Configuration Google OAuth — Guide pas à pas

Ce document décrit la configuration **unique** à réaliser pour que Nell'Immo puisse se connecter à votre compte Google et synchroniser vos services (Agenda, Gmail, Drive, Contacts, Tasks, Avis).

> **Pourquoi cette étape est manuelle ?**
> Google exige qu'une application soit identifiée par un *Client ID* et un *Client Secret* liés à **votre** compte Google. Aucune application ne peut s'y substituer. Cette configuration se fait une seule fois, puis la connexion se fait en un clic depuis le cockpit.

---

## 1. Créer le projet Google Cloud

1. Ouvrir la [Google Cloud Console](https://console.cloud.google.com/).
2. En haut de page, cliquer sur le sélecteur de projet → **Nouveau projet**.
3. Nom du projet : `Nellimmo Cockpit` (ou tout autre nom explicite).
4. Cliquer sur **Créer**, puis sélectionner ce projet.

---

## 2. Configurer l'écran de consentement OAuth

1. Menu **APIs & Services → OAuth consent screen**.
2. Type d'utilisateur :
   - **External** : compte Gmail personnel (recommandé pour démarrer).
   - **Internal** : compte Google Workspace d'entreprise (pas de mode test).
3. Renseigner :
   - **App name** : `Nell'Immo Cockpit`
   - **User support email** : l'email de l'agence
   - **Developer contact information** : l'email de l'agence
4. Cliquer sur **Save and Continue**.
5. Étape **Scopes** : cliquer sur **Add or Remove Scopes** et ajouter les scopes listés en [§4](#4-activer-les-apis-et-déclarer-les-scopes).
6. Étape **Test users** : ajouter l'adresse Gmail qui sera connectée.
   > ⚠️ Tant que l'application reste en mode **Testing**, seuls les utilisateurs de test déclarés peuvent se connecter. Les jetons expirent alors au bout de 7 jours. Pour un usage durable, publier l'application (**Publish App**).
7. Cliquer sur **Save and Continue**, puis **Back to Dashboard**.

---

## 3. Créer les identifiants OAuth

1. Menu **APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID**.
3. Application type : **Web application**.
4. Nom : `Nellimmo Web`.
5. **Authorized JavaScript origins** :
   - `http://localhost:3000`
   - `https://<votre-domaine-de-production>`
6. **Authorized redirect URIs** — ajouter **exactement** ces deux URL :
   - `http://localhost:3000/api/google/oauth/callback`
   - `https://<votre-domaine-de-production>/api/google/oauth/callback`
   > ⚠️ L'URI doit correspondre **au caractère près** à la variable `GOOGLE_REDIRECT_URI`. Une erreur `redirect_uri_mismatch` vient toujours de là.
7. Cliquer sur **Create**.
8. Copier le **Client ID** et le **Client Secret** affichés (le secret peut être re-téléchargé via l'icône de téléchargement).

---

## 4. Activer les APIs et déclarer les scopes

Activer chaque API dans **APIs & Services → Library** :

| Service | API à activer | Scope OAuth |
|---------|---------------|-------------|
| Agenda | Google Calendar API | `https://www.googleapis.com/auth/calendar` |
| Gmail | Gmail API | `https://www.googleapis.com/auth/gmail.send`<br>`https://www.googleapis.com/auth/gmail.readonly` |
| Drive | Google Drive API | `https://www.googleapis.com/auth/drive.file` |
| Contacts | People API | `https://www.googleapis.com/auth/contacts` |
| Tasks | Google Tasks API | `https://www.googleapis.com/auth/tasks` |
| Avis | Business Profile API | `https://www.googleapis.com/auth/business.manage` |

> **Note sur les Avis Google** : l'API Business Profile nécessite une **demande d'accès spécifique** auprès de Google (formulaire d'approbation). Tant qu'elle n'est pas accordée, le service Avis renverra une erreur 403 — c'est normal et sans impact sur les autres services.

---

## 5. Créer le fichier `.env.local`

À la **racine du projet**, créer un fichier `.env.local` (il est ignoré par Git, voir [`.gitignore`](.gitignore:34)) :

```env
# Identifiants OAuth (Console Google Cloud → Credentials)
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx

# Doit correspondre EXACTEMENT à l'URI déclarée dans Google Cloud
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback

# Clé de chiffrement AES-256-GCM des jetons (32 octets en base64)
# Générer avec : openssl rand -base64 32
GOOGLE_TOKEN_ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=

# Secret HMAC pour signer les cookies d'état OAuth
# Générer avec : openssl rand -base64 32
GOOGLE_OAUTH_STATE_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=
```

### Générer les deux secrets

Sous Windows (PowerShell) :

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Sous macOS / Linux :

```bash
openssl rand -base64 32
```

Exécuter la commande **deux fois** : une valeur pour `GOOGLE_TOKEN_ENCRYPTION_KEY`, une autre pour `GOOGLE_OAUTH_STATE_SECRET`.

---

## 6. Appliquer la migration Supabase (mode cloud uniquement)

Si l'application est connectée à Supabase, exécuter le script [`supabase/migrations/20260910_google_oauth_tokens.sql`](supabase/migrations/20260910_google_oauth_tokens.sql:1) dans le **SQL Editor** de Supabase.

Cette migration crée la table `google_oauth_tokens` avec :
- Row Level Security (RLS) activée,
- chiffrement des colonnes sensibles,
- index sur `owner_id`.

> En **mode local** (sans Supabase), les jetons sont stockés dans un cookie `httpOnly` chiffré. Aucune migration n'est nécessaire.

---

## 7. Redémarrer le serveur

Les variables d'environnement ne sont lues qu'au **démarrage** du serveur :

```bash
npm run dev
```

---

## 8. Vérifier la configuration

1. Ouvrir le cockpit : `http://localhost:3000/cockpit`.
2. La **modale de connexion Google** apparaît au démarrage (si le compte n'est pas encore connecté).
3. Cliquer sur **Connecter Google** → l'écran de consentement Google s'ouvre.
4. Sélectionner le compte, accepter les permissions.
5. Retour automatique sur le cockpit, compte connecté.

### Vérification manuelle de l'état

L'endpoint [`/api/google/oauth/status`](app/api/google/oauth/status/route.ts:21) renvoie l'état réel :

```json
{
  "configured": true,
  "connected": true,
  "email": "agence@gmail.com",
  "name": "Nell'Immo",
  "services": { "calendar": true, "gmail": true, "drive": true },
  "encryptionReady": true
}
```

Si `configured` vaut `false`, une variable d'environnement manque ou le serveur n'a pas été redémarré.

---

## 9. Dépannage

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| « La configuration OAuth serveur est incomplète » | `.env.local` absent ou serveur non redémarré | Créer `.env.local` (§5) puis relancer `npm run dev` |
| `redirect_uri_mismatch` | `GOOGLE_REDIRECT_URI` ≠ URI déclarée | Aligner les deux valeurs au caractère près (§3) |
| `access_denied` | Compte non listé comme *test user* | Ajouter l'email dans **Test users** (§2) |
| Jeton expiré tous les 7 jours | Application en mode **Testing** | Publier l'application (**Publish App**) |
| Erreur 403 sur les Avis | API Business Profile non approuvée | Demander l'accès à Google (sans impact sur les autres services) |
| `encryptionReady: false` | `GOOGLE_TOKEN_ENCRYPTION_KEY` invalide | Générer une clé base64 de 32 octets (§5) |

---

## 10. Révoquer l'accès

- **Depuis Nell'Immo** : *Paramètres → Google → Déconnecter*. Le jeton est révoqué côté Google.
- **Depuis Google** : [myaccount.google.com/permissions](https://myaccount.google.com/permissions) → sélectionner l'application → **Supprimer l'accès**.

---

## Récapitulatif des variables d'environnement

| Variable | Obligatoire | Rôle |
|----------|-------------|------|
| `GOOGLE_CLIENT_ID` | ✅ | Identifiant public de l'application OAuth |
| `GOOGLE_CLIENT_SECRET` | ✅ | Secret de l'application OAuth |
| `GOOGLE_REDIRECT_URI` | ✅ | URI de retour après consentement |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | ✅ | Chiffrement AES-256-GCM des jetons au repos |
| `GOOGLE_OAUTH_STATE_SECRET` | ✅ | Signature HMAC des cookies d'état (anti-CSRF) |
