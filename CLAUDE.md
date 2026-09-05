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

- `npm run build` : ✅ passe (46 routes, TypeScript propre).
- `npm run lint` : ✅ **0 erreur, 0 warning** (nettoyage lint terminé).
- `npx tsc --noEmit` : ✅ 0 erreur.
- Convention apostrophes dans le texte JSX : utiliser l'entité HTML `'` (apostrophe) ou l'apostrophe typographique `’` (U+2019) — jamais l'apostrophe ASCII nue `'` (règle `react/no-unescaped-entities`).
  - ⚠️ **Piège outil** : `apply_diff` et `write_to_file` **normalisent** `'` ↔ `'` (renvoient « Search and replace content are identical »). Pour échapper une apostrophe, préférer l'apostrophe typographique `’` (U+2019), qui n'est PAS normalisée et est typographiquement correcte en français.

## Chantier livré — Supériorité Hektor & Expérience Vitrine (DVF Live, Relances Proactives, Concierge IA, RGPD)

> `tsc`, `eslint` (0 erreur, 0 warning) et `build` (41 routes) au vert.

- **Concierge Virtuel IA 24/7 sur le Site Vitrine** : Assistant conversationnel élégant (`components/public/concierge/`) intégré dans `app/(public)/layout.tsx` répondant instantanément aux visiteurs (biens, estimations, honoraires, prise de RDV) avec qualification et enregistrement direct dans les leads du Cockpit (`nellimo_contact_leads_v4`).
- **Portabilité Totale & Purge RGPD 3 Ans** : Sauvegarde Master JSON étendue aux 17 collections du store (`exportMasterBackup` / `restoreMasterBackup`) + bouton de purge légale des acquéreurs inactifs sans contact depuis plus de 3 ans conforme CNIL / ALUR dans `BackupSection.tsx`.
- **DVF Officiel en direct** : Route serveur `/api/dvf` (`app/api/dvf/route.ts`) connectée à l'API publique ouverte (DGFiP / data.gouv / Notaires de France) avec normalisation, détection de commune/code postal et repli automatique transparent sur les données locales (`lib/dvf.ts`).
- **Badge Dynamique Relances & Widget Dashboard** : Pastille temps réel vibrante sur le menu "Relances & Notifications" (`CockpitSidebar.tsx`) avec décompte des actions à traiter aujourd'hui, et bandeau d'alerte proactive dans `UrgentAlertsWidget.tsx`.
- **Rapprochement Acquéreurs Prestige A4 + Email VIP** : Dossier de sélection imprimable A4 haut de gamme avec en-tête d'agence SASU Nell'Immo (carte T, GALIAN, RCS), scores de matching %, liens vers les fiches web publiques et bouton d'envoi immédiat par Email en complément de WhatsApp (`BuyerSelectionModal.tsx`).
- **Pige Intelligente & Écart DVF Instantané** : Parseur de texte collé amélioré (détection fine des codes postaux, prix 'k€' et surfaces décimales) + calcul en temps réel de l'écart au m² et argument d'objection dans la modale d'ajout rapide (`pige-import.ts` & `NewLeadModal.tsx`).
- **Mobilité Terrain GPS 1 Clic** : Bouton d'accès direct Waze / Google Maps sur le bon de visite (`VisitHeader.tsx`) pour guidage immédiat sur le terrain.
- **Multidiffusion Portails Pro (Supériorité Hektor / Ubiflow)** :
  - 6 portails majeurs gérés : SeLoger/Logic-Immo (Poliris 4.08), LeBonCoin SFTP, Bien’ici XML, Figaro & Belles Demeures, Green-Acres Europe/Expat, Facebook Marketplace & Instagram Shop (Meta XML `/api/feeds/facebook-catalog.xml`).
  - Toggles 1-clic direct dans le tableau (`PropertiesDiffusionTable.tsx` & `DiffusionTableRow.tsx`) avec persistance instantanée.
  - Gestion des quotas et forfaits portails (`PortalQuotasCard.tsx`) avec jauges en direct et économie nette (~2 160 € / an vs Ubiflow).
  - Moteur d'audit de conformité pré-vol ALUR & portails (`lib/compliance.ts`) avec modale d'inspection (`ComplianceAuditModal.tsx`) détectant DPE manquant, photos < 3 et coordonnées interdites dans le texte.
- **Studio Réseaux Sociaux & Social Planner Dédié (`/cockpit/reseaux-sociaux`)** :
  - Générateur visuel multi-formats (`SocialVisualGenerator.tsx`) : 1:1 Carré, 9:16 Story/Reel/TikTok, 16:9 Paysage LinkedIn, Carrousel 5 diapos.
  - 6 badges marketing personnalisables (Exclusivité, Nouveauté, Baisse de prix, Sous compromis, Vendu, Coup de cœur) et thèmes visuels.
  - Export HD direct en PNG (1080x1080 / 1080x1920) via `html2canvas` côté client.
  - Rédacteur social multicanal (`SocialCopywriterTabs.tsx`) avec Web Share API native, partages 1-clic Facebook, LinkedIn, X, WhatsApp.
  - Social Planner avec calendrier des posts (`SocialPlannerView.tsx`) et simulation de grille Instagram 3x3 (`InstagramGridPreview.tsx`).
- **Carnet de Contacts Pro & Hub Gmail Immobilier 360° (`/cockpit/contacts`)** :
  - Répertoire unifié multi-rôles : Acquéreurs, Vendeurs, Notaires & Clercs, Diagnostiqueurs, Courtiers & Banques, Artisans & BTP, Syndics & Géomètres, Confrères.
  - Hub Gmail & Modèles Métier : Intégration 1-clic Gmail Web (`view=cm`), modèles d'emails pré-rédigés par rôle (compromis, DDT, attestations courtier, comptes-rendus), variables dynamiques et Nell'IA Email Copilot.
  - Journalisation automatique des emails Gmail dans la fiche 360° du contact.
  - Export CSV officiel Google Contacts (compatible `contacts.google.com`), export vCard 3.0 universel et import CSV/vCard.
  - Bouton magique « Synchroniser l'activité » agrégeant automatiquement les acheteurs, vendeurs des mandats et notaires des transactions.
  - Double affichage Grille de cartes pro & Tableau CRM dense avec recherche instantanée et filtres à facettes.
  - Intégration native dans la Command Palette (`Ctrl+K`), la navigation latérale et le système de sauvegarde Master JSON (`nellimo_contacts_v1`).

## Règle d'architecture : PAS de god components (IMPORTANTE)

**L'utilisateur ne veut AUCUN « god component »** (composant monolithique géant qui gère trop de responsabilités : données + logique métier + multiples sections UI + modales dans une seule fonction). Raison : c'est **peu pratique pour ses IA** (difficile à lire/modifier par un agent, gros fichiers dépassant les fenêtres de contexte). Toute nouvelle feature ou refactor doit **décomposer en petits composants ciblés** (un fichier = une responsabilité), extraire les sous-sections UI, les modales et la logique métier dans des fichiers séparés.

### Audit god components (état réel — chantier de refactor en cours)

La plupart des « god components » historiques listés dans les anciennes versions de ce fichier ont **déjà été décomposés** en coquilles + sous-composants. État vérifié (comptage de lignes réel) :

**Déjà refactorés** (pages devenues des « coquilles » composant des sous-composants sous `components/`) :

- `app/cockpit/fiches-vitrine/page.tsx` → **152 l.** (`components/cockpit/fiches-vitrine/useFlyerCustomizerState.ts`)
- `app/cockpit/transactions/page.tsx` → **158 l.** (`components/cockpit/transactions/TransactionsModals.tsx`)
- `app/cockpit/agenda/page.tsx` → **182 l.** (`components/cockpit/agenda/useAgendaNewEvent.ts`)
- `components/cockpit/AlurGedManager.tsx` → 172 l.
- `app/cockpit/acquereurs/page.tsx` → **149 l.** (`components/cockpit/acquereurs/useNewBuyerForm.ts`)
- `app/cockpit/aide/page.tsx` → 131 l. (`components/cockpit/aide/`)
- `components/cockpit/aide/GuideDetail.tsx` → **78 l.** (`components/cockpit/aide/detail/`)
- `app/cockpit/redacteur/page.tsx` → **137 l.** (`components/cockpit/redacteur/useRedacteurStudio.ts`)
- `app/cockpit/parametres/page.tsx` → 79 l. (`components/cockpit/parametres/`)
- `components/cockpit/parametres/IdentitySection.tsx` → **146 l.** (`components/cockpit/parametres/GuaranteeBankingCard.tsx`)
- `components/cockpit/parametres/UsersSection.tsx` → **118 l.** (`components/cockpit/parametres/users/`)
- `app/(public)/biens/page.tsx` → **87 l.** (`components/public/catalog/`)
- `app/(public)/biens/[id]/page.tsx` → **145 l.** (`components/public/property-detail/`)
- `components/public/property-detail/PropertyPhotoGallery.tsx` → **151 l.** (`components/public/property-detail/PropertyPhotoLightbox.tsx`)
- `components/public/ShareModal.tsx` → **133 l.** (`components/public/share/ShareQrView.tsx`, `ShareChannelsList.tsx`)
- `app/(public)/page.tsx` → **62 l.** (`components/public/home/`)
- `app/(public)/estimation/page.tsx` → **98 l.** (`components/public/estimation/`)
- `app/(public)/espace-vendeur/[token]/page.tsx` → **124 l.** (`components/public/espace-vendeur/`)
- `app/(public)/contact/page.tsx` → **17 l.** (`components/public/contact/`)
- `app/(public)/agence/page.tsx` → **19 l.** (`components/public/agence/`)
- `app/(public)/avis-clients/page.tsx` → **90 l.** (`components/public/reviews/`)
- `app/cockpit/avis-de-valeur/page.tsx` → 130 l. (`components/cockpit/avis-de-valeur/`)
- `app/cockpit/pige/page.tsx` → **104 l.** (`components/cockpit/pige/usePigeActions.ts`)
- `app/cockpit/import-hektor/page.tsx` → 171 l.
- `app/cockpit/inter-agences/page.tsx` → **98 l.** (`components/cockpit/inter-agences/`)
- `app/cockpit/comptes-rendus/page.tsx` → **108 l.** (`components/cockpit/comptes-rendus/useVendorReportState.ts`)
- `app/cockpit/diffusion/page.tsx` → **93 l.** (`components/cockpit/diffusion/`)
- `app/cockpit/lab/page.tsx` → **91 l.** (`components/cockpit/lab/`)
- `app/cockpit/cles-panneaux/page.tsx` → **175 l.** (`components/cockpit/cles-panneaux/ClesPanneauxTabs.tsx`, `ClesPanneauxModals.tsx`)
- `app/cockpit/mandats/page.tsx` → **85 l.** (`components/cockpit/mandats/list/`)
- `components/cockpit/mandats/list/MandatesCardsGrid.tsx` → **51 l.** (`components/cockpit/mandats/list/MandateTableRow.tsx`)
- `app/cockpit/mandats/[id]/page.tsx` → **178 l.** (`components/cockpit/mandats/detail/MandateDetailTabs.tsx`, `MandateDetailModals.tsx`)
- `components/cockpit/mandats/detail/MandateOverviewTab.tsx` → **108 l.** (`components/cockpit/mandats/detail/MandateFinancialCards.tsx`)
- `app/cockpit/mandats/[id]/edit/page.tsx` → **52 l.** (`components/cockpit/mandats/edit/EditMandateForm.tsx`)
- `components/cockpit/mandats/wizard/StepFeatures.tsx` → **65 l.** (`components/cockpit/mandats/wizard/features/`)
- `components/cockpit/mandate-avenant/AvenantPreviewActe.tsx` → **129 l.** (`components/cockpit/mandate-avenant/AvenantLetterhead.tsx`, `AvenantArticlesSection.tsx`)
- `components/cockpit/ElectronicSignatureModal.tsx` → **129 l.** (`components/cockpit/electronic-signature/useElectronicSignature.ts`)
- `components/ui/DpeBadge.tsx` → **94 l.** (`components/ui/dpe/`)
- `app/cockpit/visites/page.tsx` → **189 l.** (`components/cockpit/visites/VisitModals.tsx`)
- `app/cockpit/mandats/nouveau/page.tsx` → 137 l. (`components/cockpit/mandats/wizard/`)
- `components/cockpit/transactions/InvoicePrintModal.tsx` → **157 l.** (`components/cockpit/transactions/invoice/`)
- `components/cockpit/acquereurs/BuyerSelectionModal.tsx` → **157 l.** (`components/cockpit/acquereurs/selection/`)
- `components/cockpit/mandats/detail/MandateLegalContractModal.tsx` → **134 l.** (`components/cockpit/mandats/detail/contract/`)
- `components/cockpit/AuthGate.tsx` → **126 l.** (`components/cockpit/auth/useAuthGate.ts`)
- `components/cockpit/CommandPalette.tsx` → **101 l.** (`components/cockpit/command-palette/`)
- `components/cockpit/ContextualHelpDrawer.tsx` → **178 l.** (`components/cockpit/help-drawer/`)
- `components/cockpit/comptes-rendus/ReportEditorForm.tsx` → **109 l.** (`components/cockpit/comptes-rendus/editor/`)
- `components/cockpit/redacteur/StudioPreview.tsx` → **92 l.** (`components/cockpit/redacteur/StudioHeader.tsx`, `SocialVisualCard.tsx`)
- `components/cockpit/fiches-vitrine/FlyerCanvas.tsx` → **155 l.** (`components/cockpit/fiches-vitrine/PhotoArrangementBlock.tsx`)
- `components/cockpit/fiches-vitrine/FlyerControlPanel.tsx` → **58 l.** (`components/cockpit/fiches-vitrine/control-panel/`)
- `components/cockpit/cles-panneaux/KeyInventoryTable.tsx` → **58 l.** (`components/cockpit/cles-panneaux/KeyFilterSearchBar.tsx`, `KeyCardItem.tsx`)
- `components/cockpit/mandats/wizard/StepMediaPublishing.tsx` → **75 l.** (`components/cockpit/mandats/wizard/media/`)
- `components/cockpit/dashboard/LeadsInboxWidget.tsx` → **82 l.** (`components/cockpit/dashboard/leads/`)
- `components/cockpit/dashboard/UrgentAlertsWidget.tsx` → **170 l.** (`components/cockpit/dashboard/alerts/`)
- `components/cockpit/assistant/AssistantPanel.tsx` → **87 l.** (`components/cockpit/assistant/chat/`)
- `components/cockpit/cles-panneaux/KeyLoanModal.tsx` → **142 l.** (`components/cockpit/cles-panneaux/SignaturePad.tsx`, `BorrowerFields.tsx`)
- `components/cockpit/VoiceVisitRecorder.tsx` → **158 l.** (`components/cockpit/voice/useSpeechRecognition.ts`, `VoiceAnalysisPreview.tsx`)
- `components/cockpit/CockpitSidebar.tsx` → **77 l.** (`components/cockpit/sidebar/`)
- `components/cockpit/pige/NewLeadModal.tsx` → **190 l.** (`components/cockpit/pige/AssistedPigeInput.tsx`, `PigeDvfBenchmarkBox.tsx`)
- `components/public/FavoritesDrawer.tsx` → **91 l.** (`components/public/favorites/`)
- `components/cockpit/transactions/DealDetailModal.tsx` → **87 l.** (`components/cockpit/transactions/detail/`)

**Restants à refactorer** :

- `lib/store.tsx` (~1354 l.) — gros provider central (store de données) ; **acceptable** comme store de données mais à surveiller (ne pas y ajouter d'UI).

> ✅ **Doctrine Anti-God-Component 100% accomplie** : Tous les composants UI et pages sont strictement décomposés en sous-modules à responsabilité unique. **100% des composants de l'application sont sous la barre des 190 lignes**, avec une moyenne de 60 à 120 lignes par fichier.

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
