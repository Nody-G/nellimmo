@AGENTS.md

# Nellimo Cockpit — Mémoire Projet (persistant)

> Ce fichier est la mémoire durable du projet. Il est chargé à chaque session. Mets-le à jour quand des décisions d'architecture importantes changent.

## Vue d'ensemble

Application CRM immobilier Next.js 16.3.4 (App Router) + React 19.2.8 + TypeScript + Tailwind CSS 4. Nom du package : `nellimo-cockpit@2.0.0`. Domaine : agence immobilière (Nellimo). Langue de l'interface : français.

## Décision stratégique (IMPORTANTE)

**On ne migre PAS vers Supabase pour l'instant.** L'utilisateur attend que Nelly crée un compte Supabase d'abord. En attendant :

- Le **localStorage est le stockage de données principal** (via React Context providers).
- Toutes les corrections doivent rester dans l'architecture localStorage actuelle, **sans rien casser**, tout en gardant des **coutures propres** pour la future intégration Supabase.
- Les migrations RLS Supabase sont déjà **préparées mais PAS exécutées** (voir `supabase/migrations/`).

## Architecture des données (deux providers)

- **`lib/store.tsx`** — `NellimoProvider` complet (cockpit authentifié). Contient TOUTES les collections (buyers, transactions, clés, panneaux, audit, prospection, avenants, propositions, leads internes, etc.).
- **`lib/public-store.tsx`** — `PublicNellimoProvider` allégé (route publique). N'importe QUE les données publiques. **Sanitise les visites** (`sanitizeVisits`) pour masquer la PII des acheteurs (email/phone/budget/villes cibles) exposée au public.
- **`lib/mock-data.ts`** — barrel de ré-export (rétro-compat) qui re-exporte `./mock-data-public` et `./mock-data-cockpit`.
- **`lib/mock-data-public.ts`** — données publiques uniquement (agency settings, properties, visits par `buyer_id` sans PII embarquée, vendor reports). N'importe que des types depuis `./types`.
- **`lib/mock-data-cockpit.ts`** — données cockpit (buyers avec PII complète, transactions DVF, clés, panneaux, audit, prospection, avenants, propositions, leads internes).

### Règle de cloisonnement (CRITIQUE)

Importer UN export d'un module charge TOUT le module dans le bundle. Les pages/route-groupes publiques ne doivent JAMAIS importer depuis `@/lib/store` ni `mock-data-cockpit` (sinon la PII cockpit fuit dans le bundle public). Les pages publiques utilisent le hook `useNellimoStore` depuis `lib/public-store.tsx`.

### Montage des providers

- `app/layout.tsx` : racine — seulement `ToastProvider`, AUCUN provider de données.
- `app/(public)/layout.tsx` : `PublicNellimoProvider`.
- `app/cockpit/layout.tsx` : `NellimoProvider` + `AuthGate`.

## Sécurité (corrections d'audit livrées)

- **Auth locale** : `lib/auth.ts` (hash SHA-256 + sel, session) + `components/cockpit/AuthGate.tsx` — interim avant Supabase Auth.
- **Espace Vendeur** : seuls les vrais `seller_token` fonctionnent (pas de fallback `properties[0]`). Génération via `generateSellerToken()` dans `lib/hoguet.ts`.
- **Flux calendrier** : `app/api/calendar/feed/route.ts` exige un jeton valide (`lib/feed-tokens.ts`).
- **Route IA** : `app/api/ai/generate-copy/route.ts` — plus de clé API fournie par le client.
- **Sync SFTP** : `app/api/cron/sync-sftp/route.ts` — pas de faux succès, sécurisé par secret.
- **Flux Bien'ici/Poliris** : jetons non codés en dur dans le bundle client, routes sécurisées.
- **Secrets au repos** : `lib/vault.ts` — chiffrement AES-GCM des secrets (SFTP, RIB, jetons) avant stockage localStorage. `splitSensitiveSettings()` / `saveSecretsToVault()` / `loadSecretsFromVault()`.

## Migrations Supabase (préparées, non exécutées)

Dans `supabase/migrations/` :

- `20260902_init_nellimo.sql` — schéma initial.
- `20260903_solo_agent_os.sql` — agent solo / OS.
- `20260903_rls_owner_scoped_public_split.sql` — scoping par `owner_id`, vues publiques sans PII (`public_properties`, `public_agency_settings`), politiques RLS par propriétaire, déclencheurs `set_default_owner()`.

Guide d'exécution : `supabase/MIGRATION_GUIDE.md`. Le site public devra lire via les vues `public_properties` / `public_agency_settings`.

## État de vérification

- `npm run build` : ✅ passe (41 routes, TypeScript propre).
- `npm run lint` : ✅ **0 erreur, 0 warning** (nettoyage lint terminé).
- `npx tsc --noEmit` : ✅ 0 erreur.
- Convention apostrophes dans le texte JSX : utiliser l'entité HTML `'` (apostrophe) ou l'apostrophe typographique `’` (U+2019) — jamais l'apostrophe ASCII nue `'` (règle `react/no-unescaped-entities`).
  - ⚠️ **Piège outil** : `apply_diff` et `write_to_file` **normalisent** `'` ↔ `'` (renvoient « Search and replace content are identical »). Pour échapper une apostrophe, préférer l'apostrophe typographique `’` (U+2019), qui n'est PAS normalisée et est typographiquement correcte en français.

## Chantier livré — Supériorité Hektor (DVF Live, Relances Proactives, Rapprochement A4, Pige DVF Gap, GPS)

> `tsc`, `eslint` (0 erreur, 0 warning) et `build` (41 routes) au vert.

- **DVF Officiel en direct** : Route serveur `/api/dvf` (`app/api/dvf/route.ts`) connectée à l'API publique ouverte (DGFiP / data.gouv / Notaires de France) avec normalisation, détection de commune/code postal et repli automatique transparent sur les données locales (`lib/dvf.ts`).
- **Badge Dynamique Relances & Widget Dashboard** : Pastille temps réel vibrante sur le menu "Relances & Notifications" (`CockpitSidebar.tsx`) avec décompte des actions à traiter aujourd'hui, et bandeau d'alerte proactive dans `UrgentAlertsWidget.tsx`.
- **Rapprochement Acquéreurs Prestige A4 + Email VIP** : Dossier de sélection imprimable A4 haut de gamme avec en-tête d'agence SASU Nell'Immo (carte T, GALIAN, RCS), scores de matching %, liens vers les fiches web publiques et bouton d'envoi immédiat par Email en complément de WhatsApp (`BuyerSelectionModal.tsx`).
- **Pige Intelligente & Écart DVF Instantané** : Parseur de texte collé amélioré (détection fine des codes postaux, prix 'k€' et surfaces décimales) + calcul en temps réel de l'écart au m² et argument d'objection dans la modale d'ajout rapide (`pige-import.ts` & `NewLeadModal.tsx`).
- **Mobilité Terrain GPS 1 Clic** : Bouton d'accès direct Waze / Google Maps sur le bon de visite (`VisitHeader.tsx`) pour guidage immédiat sur le terrain.

## Règle d'architecture : PAS de god components (IMPORTANTE)

**L'utilisateur ne veut AUCUN « god component »** (composant monolithique géant qui gère trop de responsabilités : données + logique métier + multiples sections UI + modales dans une seule fonction). Raison : c'est **peu pratique pour ses IA** (difficile à lire/modifier par un agent, gros fichiers dépassant les fenêtres de contexte). Toute nouvelle feature ou refactor doit **décomposer en petits composants ciblés** (un fichier = une responsabilité), extraire les sous-sections UI, les modales et la logique métier dans des fichiers séparés.

### Audit god components (état réel — chantier de refactor en cours)

La plupart des « god components » historiques listés dans les anciennes versions de ce fichier ont **déjà été décomposés** en coquilles + sous-composants. État vérifié (comptage de lignes réel) :

**Déjà refactorés** (pages devenues des « coquilles » composant des sous-composants sous `components/`) :

- `app/cockpit/fiches-vitrine/page.tsx` → 261 l. (sous-composants dans `components/cockpit/fiches-vitrine/`)
- `app/cockpit/transactions/page.tsx` → 188 l. (`components/cockpit/transactions/`)
- `app/cockpit/agenda/page.tsx` → 193 l. (`components/cockpit/agenda/`)
- `components/cockpit/AlurGedManager.tsx` → 172 l.
- `app/cockpit/acquereurs/page.tsx` → 174 l. (`components/cockpit/acquereurs/`)
- `app/cockpit/aide/page.tsx` → 131 l. (`components/cockpit/aide/`)
- `app/cockpit/redacteur/page.tsx` → 278 l. (`components/cockpit/redacteur/`)
- `app/cockpit/parametres/page.tsx` → 79 l. (`components/cockpit/parametres/`)
- `app/(public)/biens/[id]/page.tsx` → **145 l.** (refactoré récemment ; sous-composants dans `components/public/property-detail/`)
- `app/cockpit/avis-de-valeur/page.tsx` → 130 l. (`components/cockpit/avis-de-valeur/`)
- `app/cockpit/pige/page.tsx` → 192 l. (`components/cockpit/pige/`)
- `app/cockpit/import-hektor/page.tsx` → 193 l.
- `components/cockpit/ElectronicSignatureModal.tsx` → 210 l.
- `app/cockpit/visites/page.tsx` → 210 l. (`components/cockpit/visites/`)
- `app/cockpit/mandats/nouveau/page.tsx` → ~120 l. (refactoré récemment ; l'état + orchestration du formulaire extraits dans `components/cockpit/mandats/nouveau/useNewMandateForm.ts`, UI déjà composée via `components/cockpit/mandats/wizard/`)

**Restants à refactorer** (fichiers encore volumineux, candidats au prochain chantier) :

- `lib/store.tsx` (~1354 l.) — gros provider central (store de données) ; **acceptable** comme store de données mais à surveiller (ne pas y ajouter d'UI).

> ✅ **Chantier « god components » terminé** : tous les fichiers de composants/pages monolithiques ont été décomposés. Il ne reste que `lib/store.tsx`, qui est un store de données (et non un composant UI) et reste volontairement centralisé.

**Non concernés** (gros mais PAS des god components) : `lib/mock-data-public.ts` (~4561 l.) et `lib/mock-data-cockpit.ts` (~684 l.) = données, pas de composants ; `lib/types.ts` = types. Ces fichiers de données peuvent rester volumineux.

### Bonnes pratiques à appliquer

- Un composant/page = une responsabilité ; extraire chaque modale, tableau, formulaire, onglet dans son propre fichier sous `components/`.
- Garder les fichiers de composants sous ~300-400 lignes idéalement.
- Extraire la logique métier pure dans `lib/` (fonctions testables) plutôt que dans le JSX.
- Les pages App Router restent des « coquilles » qui composent des sous-composants.

## Conventions techniques

- Fins de ligne CRLF sur Windows.
- React Compiler / règles react-hooks strictes (pas de refs pendant le rendu, pas de setState synchrone dans un effet).
- Next.js 16 : lire `node_modules/next/dist/docs/` avant d'écrire du code (APIs/conventions peuvent différer des données d'entraînement).
- UI : palette `#131B26` (sombre), `#E12B7B` (rose accent), `#FCFAF7` (fond), `#F3E8EE` (bordures).
