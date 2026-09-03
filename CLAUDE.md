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
- `npm run build` : ✅ passe (36 routes, TypeScript propre).
- `npm run lint` : 8 erreurs + 257 warnings, **tous préexistants** dans des fichiers non modifiés par l'audit :
  - `app/cockpit/parametres/page.tsx` (4 × `react/no-unescaped-entities`)
  - `lib/store.tsx` (3 × React Compiler : refs pendant rendu, variable avant déclaration, mémorisation)
  - `app/cockpit/visites/page.tsx` (1 × setState dans un effet — cas limite React Compiler)
  - Laissés intacts par priorité « ne rien casser » ; à traiter séparément si besoin.

## Règle d'architecture : PAS de god components (IMPORTANTE)
**L'utilisateur ne veut AUCUN « god component »** (composant monolithique géant qui gère trop de responsabilités : données + logique métier + multiples sections UI + modales dans une seule fonction). Raison : c'est **peu pratique pour ses IA** (difficile à lire/modifier par un agent, gros fichiers dépassant les fenêtres de contexte). Toute nouvelle feature ou refactor doit **décomposer en petits composants ciblés** (un fichier = une responsabilité), extraire les sous-sections UI, les modales et la logique métier dans des fichiers séparés.

### Audit god components (état constaté — à refactorer progressivement)
Fichiers monolithiques existants (une seule grande fonction composant, >500 lignes) :
- `app/cockpit/fiches-vitrine/page.tsx` (~971 l., `WindowFlyersContent`)
- `app/cockpit/transactions/page.tsx` (~945 l., `TransactionsPipelinePage`)
- `app/cockpit/agenda/page.tsx` (~934 l., `AgendaPage`)
- `components/cockpit/AlurGedManager.tsx` (~835 l.)
- `app/cockpit/acquereurs/page.tsx` (~760 l., `BuyersCrmPage`)
- `app/cockpit/aide/page.tsx` (~720 l., `HelpAcademyContent`)
- `app/cockpit/redacteur/page.tsx` (~706 l., `RedacteurPage`)
- `app/cockpit/parametres/page.tsx` (~647 l., `AgencySettingsPage`)
- `app/(public)/biens/[id]/page.tsx` (~673 l., `PropertyDetailPage`)
- `app/cockpit/avis-de-valeur/page.tsx` (~617 l., `ValuationDvfContent`)
- `app/cockpit/pige/page.tsx` (~561 l., `ProspectingPage`)
- `app/cockpit/import-hektor/page.tsx` (~536 l., `HektorMigrationPage`)
- `app/cockpit/mandats/nouveau/page.tsx` (~530 l., `NewMandatePage`)
- `components/cockpit/ElectronicSignatureModal.tsx` (~506 l.)
- `app/cockpit/visites/page.tsx` (~443 l., `VisitSheetsContent`)
- `lib/store.tsx` (~1074 l.) — gros provider central (store de données) ; acceptable comme store mais à surveiller.

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
