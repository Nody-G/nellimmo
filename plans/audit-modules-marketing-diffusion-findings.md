# Audit — Modules Marketing & Diffusion (Nell'Immo Cockpit)

**Scope:** diffusion, redacteur, lab, fiches-vitrine, reseaux-sociaux, import-hektor
**Type:** Analysis only — no files modified.
**Priority:** Legal/compliance > Data integrity > UX > Polish

---

## 🔴 P1 — Legal / Compliance

### 1.1 Legal identity hardcoded in AI copywriting system prompt

- **File:** [`app/api/ai/generate-copy/route.ts`](app/api/ai/generate-copy/route.ts:41) (lines 41–57)
- **Issue:** The DeepSeek system prompt hardcodes Nelly's full legal identity — CPI `1310 2019 000 042 974`, RCS `853 807 006`, address `26 avenue des Enjouvènes, 13330 Pélissanne`, phone `07 55 68 61 09`, email `nellimmo.acte@gmail.com`, `www.nellimmo.fr`. It does not read from `AgencySettings`.
- **Why it matters:** If the agency identity/legal numbers change (or the tool is ever reused/rebranded), every AI-generated ad silently carries **wrong legal identifiers** — a compliance and liability risk (mandatory legal mentions on real-estate ads).
- **Fix:** Inject legal/identity fields from `AgencySettings` (or a server-side agency config) into the prompt at request time; never hardcode.

### 1.2 Legal identity hardcoded across every copywriting template

- **File:** [`lib/copywriting.ts`](lib/copywriting.ts:191) (repeated at lines 213–215, 236–238, 266, 284, 303–305, 333, 362, 387–388, 404–405, 464–465)
- **Issue:** `generateListingCopy` bakes Nelly's phone/email/website/CPI/RCS/address into **all 12 style templates** (`signature_nelly`, `prestige`, `portails_standard`, `pitch_whatsapp`, `reseaux_sociaux`, `script_video_reel`, `investisseur_lmnp`, `international_en`, `relance_baisse_prix`, `negociation_contre_offre`, `objection_mandat_exclusif`, `mode_libre`).
- **Why it matters:** Same compliance risk as 1.1, plus the local fallback engine (used whenever the AI route fails) produces legally stale copy.
- **Fix:** Refactor templates to accept an `agency` context object and interpolate identity from `AgencySettings`; keep a single source of truth.

### 1.3 Hardcoded agency branding in fiches-vitrine (client-facing deliverables)

- **File:** [`components/cockpit/fiches-vitrine/FlyerCanvas.tsx`](components/cockpit/fiches-vitrine/FlyerCanvas.tsx:70) (lines 70–98, 160–166)
- **Issue:** Flyer canvas hardcodes `NELL'IMMO IMMOBILIER`, `Pélissanne & Pays Salonais • 07 55 68 61 09 • www.nellimmo.fr`, and `Conseillère Dédiée : Nelly FERNANDEZ &bull; SASU Nell'Immo` + email.
- **Why it matters:** These are **printed/distributed client documents**. Wrong/outdated contact or legal name on a flyer is a direct brand + compliance failure; also non-reusable for any other agent.
- **Fix:** Pull agency name, agent name, phone, email, website, and legal entity from `AgencySettings`.

### 1.4 Hardcoded agency identity in social generators

- **File:** [`components/cockpit/reseaux-sociaux/social-types.ts`](components/cockpit/reseaux-sociaux/social-types.ts:15) (lines 15–22, 47–118)
- **Issue:** `SOCIAL_BADGES` hardcode `EXCLUSIVITÉ NELL'IMMO` / `VENDU PAR NELL'IMMO`; `generateSocialCopy` hardcodes Nelly's phone/email/website in instagram/facebook/linkedin/tiktok copy.
- **Fix:** Derive badges and contact block from `AgencySettings`.

---

## 🟠 P2 — Data Integrity

### 2.1 Diffusion feeds serve MOCK data, not live listings

- **Files:**
  - [`app/api/feeds/bienici.xml/route.ts`](app/api/feeds/bienici.xml/route.ts:15) — `generateBienIciXmlFeed(INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS)`
  - [`app/api/feeds/seloger-poliris/route.ts`](app/api/feeds/seloger-poliris/route.ts:15) — `generatePolirisAnnoncesCsv(INITIAL_PROPERTIES, 'NEL13')`
  - [`app/api/feeds/facebook-catalog.xml/route.ts`](app/api/feeds/facebook-catalog.xml/route.ts:15) — `generateMetaRealEstateCatalog(INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS)`
- **Issue:** All three "live" feed endpoints serialize `INITIAL_PROPERTIES` / `DEFAULT_AGENCY_SETTINGS` from mock-data, **not** the actual store/Supabase listings.
- **Why it matters:** Portals (Bien'ici, SeLoger/Poliris, Meta catalog) would ingest **fake demo listings** if these URLs were ever wired to a real portal account — a severe data-integrity and reputational failure. The UI presents these as live diffusion feeds.
- **Fix:** Read properties + agency settings from the real data source (Supabase) in the route handlers; remove mock fallbacks.

### 2.2 "Auto-sync every 6h" has no scheduler; cron syncs mock data

- **Files:**
  - [`components/cockpit/diffusion/AutomatedSyncBox.tsx`](components/cockpit/diffusion/AutomatedSyncBox.tsx:35) — claims "Vos flux sont automatiquement mis à jour et synchronisés toutes les 6 heures."
  - [`app/api/cron/sync-sftp/route.ts`](app/api/cron/sync-sftp/route.ts:92) — GET handler builds payload from `INITIAL_PROPERTIES`/`DEFAULT_AGENCY_SETTINGS`; header comment (lines 6–15) states SFTP is **not configured** and channels are `not_configured`.
- **Issue:** The marketing copy promises automatic 6-hourly sync, but there is no scheduler wiring it, and the cron endpoint itself documents SFTP as unconfigured and would push mock data.
- **Why it matters:** Users are told their diffusion is automated when it is not — a trust/UX failure, and if a cron were pointed at the GET handler it would upload demo listings.
- **Fix:** Either implement a real scheduler + SFTP/portal push against live data, or remove/soften the "automatique toutes les 6 heures" claim and mark sync as manual.

### 2.3 Channel status always shows green "Actif"

- **File:** [`components/cockpit/diffusion/ChannelsStatusGrid.tsx`](components/cockpit/diffusion/ChannelsStatusGrid.tsx:92)
- **Issue:** Every channel renders a green `bg-emerald-500` "Actif" dot regardless of actual configuration/connectivity.
- **Why it matters:** Misrepresents diffusion health; a premium pro tool must reflect real per-channel status.
- **Fix:** Derive status from real config (tokens, SFTP host, agency code, last sync) and show amber/red + reason when not configured.

### 2.4 Import success banner claims data was "synchronised" into the register

- **File:** [`components/cockpit/import-hektor/ImportSuccessBanner.tsx`](components/cockpit/import-hektor/ImportSuccessBanner.tsx:21)
- **Issue:** Banner states records "ont été intégrés et **synchronisés** dans votre registre Cockpit", but [`handleCommitImport`](app/cockpit/import-hektor/page.tsx:88) only writes to the in-memory/local Zustand store via `createProperty`/`createBuyer` — no Supabase persistence/sync.
- **Why it matters:** Overstates persistence; data may be lost on reload if the store isn't backed by a durable source.
- **Fix:** Persist to Supabase (or reword the banner to "ajoutés à la session" until real sync exists).

### 2.5 Hardcoded agency code 'NEL13' / 'NELLIMMO-13330' fallbacks

- **Files:**
  - [`lib/poliris.ts`](lib/poliris.ts:32) — default `agencyCode = 'NEL13'`
  - [`app/cockpit/diffusion/page.tsx`](app/cockpit/diffusion/page.tsx:27) — `settings.seloger_agency_code || 'NEL13'`
  - [`components/cockpit/diffusion/ChannelsStatusGrid.tsx`](components/cockpit/diffusion/ChannelsStatusGrid.tsx:26) — `|| 'NELLIMMO-13330'`
- **Issue:** Hardcoded portal agency identifiers used as fallbacks.
- **Fix:** Require the code from `AgencySettings` and surface a config warning when missing rather than silently substituting.

### 2.6 Hardcoded base URL & Unsplash fallbacks in Meta catalog

- **File:** [`lib/meta-catalog.ts`](lib/meta-catalog.ts:28) (baseUrl `https://www.nellimmo.fr`), line 42 (Unsplash fallback image)
- **Issue:** Catalog links point to hardcoded domain; missing images fall back to random Unsplash stock.
- **Why it matters:** Wrong domain breaks catalog click-throughs; stock fallback images can be misleading in a paid Meta catalog.
- **Fix:** Read site URL from settings; use a branded/neutral placeholder or omit items lacking a real image.

---

## 🟡 P3 — UX / Misleading "AI" & "automatic" claims

### 3.1 "Publish to Meta" is a simulated 1.2s delay, not a real API call

- **File:** [`components/cockpit/redacteur/useRedacteurStudio.ts`](components/cockpit/redacteur/useRedacteurStudio.ts:74) (lines 74–92)
- **Issue:** `handlePublishToMeta` just `await new Promise(r => setTimeout(r, 1200))`; with a token it shows "Publication réussie sur Instagram & Facebook via Meta Graph API !" but **never calls the Meta API**.
- **Why it matters:** Users believe content was actually published to their social accounts when nothing was sent — a serious trust failure for a "1-click publish" feature.
- **Fix:** Implement a real Meta Graph API call (or clearly label the button as "Préparer / copier pour publication" until integration exists).

### 3.2 Lab "AI" output is hardcoded heuristic templates

- **File:** [`components/cockpit/lab/lab-types.ts`](components/cockpit/lab/lab-types.ts:39)
- **Issue:** `generateLabFallbackOutput` returns canned templates (ideation/negotiation/legal_clauses/vip_events) presented as generated output; `LAB_PRESETS` hardcode Pélissanne references.
- **Fix:** Either route through the real AI endpoint or label output as "modèle local" rather than implying AI generation.

### 3.3 Social "Planifier dans le Social Planner" is localStorage-only

- **Files:**
  - [`components/cockpit/reseaux-sociaux/SocialCopywriterTabs.tsx`](components/cockpit/reseaux-sociaux/SocialCopywriterTabs.tsx:80) — `handleSchedulePost` adds a post with `scheduled_at` tomorrow.
  - [`app/cockpit/reseaux-sociaux/page.tsx`](app/cockpit/reseaux-sociaux/page.tsx:68) — posts persist only to `localStorage`.
- **Issue:** "Planifier" implies an actual scheduler/publisher; it only stores a draft in the browser. Nothing auto-publishes.
- **Fix:** Rename to "Enregistrer dans le planning (brouillon)" or implement a real scheduling/publishing backend.

### 3.4 Hardcoded follower count & handle in Instagram grid preview

- **File:** [`components/cockpit/reseaux-sociaux/InstagramGridPreview.tsx`](components/cockpit/reseaux-sociaux/InstagramGridPreview.tsx:57) (lines 57, 62, 65)
- **Issue:** Hardcodes `@nellimmo_provence`, `1 850 abonnés`, `Pélissanne & Pays Salonais`.
- **Why it matters:** Fabricated follower count shown as if live; misleading in a pro tool.
- **Fix:** Pull handle from settings; remove or make follower count editable/optional rather than a hardcoded figure.

### 3.5 Hardcoded social handle fallback in visual canvas

- **File:** [`components/cockpit/reseaux-sociaux/SocialVisualCanvas.tsx`](components/cockpit/reseaux-sociaux/SocialVisualCanvas.tsx:76)
- **Issue:** Falls back to `@nellimmo_provence` when no `instagram_business_id`.
- **Fix:** Read from `AgencySettings`; if absent, omit the handle rather than showing a wrong one.

---

## ⚪ P4 — Polish / Hardcoded defaults

### 4.1 Hardcoded agency identity in Hektor import defaults & backup

- **Files:**
  - [`lib/hektor.ts`](lib/hektor.ts:191) — defaults city `Pélissanne`, postal `13330` (lines 191–192); fake price defaults `350000/336000/14000` (207–209); Unsplash fallback image (248); default description mentions "l'agence Nell'Immo" (258); fake seller phone `06 00 00 00 00` (312); default cities `Pélissanne, Salon-de-Provence` (424).
  - [`app/cockpit/import-hektor/page.tsx`](app/cockpit/import-hektor/page.tsx:128) — backup export hardcodes agency `"Nell'Immo Immobilier (Pélissanne)"`.
- **Issue:** Imported records silently get Pélissanne defaults and fake phone/price values when source columns are missing — corrupting data integrity; backup JSON is branded to one agency.
- **Fix:** Make missing values explicit (empty/null + warning) instead of injecting plausible-looking fake data; read agency name from settings for the backup header.

### 4.2 Hardcoded contact in flyer QR / social caption helpers

- **Files:**
  - [`components/cockpit/fiches-vitrine/flyer-types.ts`](components/cockpit/fiches-vitrine/flyer-types.ts:111) — `https://www.nellimmo.fr` fallback; lines 113–114 `wa.me/33755686109` + "Bonjour Nelly Fernandez"; line 157 `buildSocialCaption` hardcodes Nelly contact.
  - [`components/cockpit/reseaux-sociaux/SocialCopywriterTabs.tsx`](components/cockpit/reseaux-sociaux/SocialCopywriterTabs.tsx:35) — `property.url || 'https://www.nellimmo.fr/biens/${id}'`.
- **Fix:** Centralize in `AgencySettings`.

### 4.3 Hardcoded default portal quotas

- **File:** [`components/cockpit/diffusion/PortalQuotasCard.tsx`](components/cockpit/diffusion/PortalQuotasCard.tsx:13) (lines 13–20)
- **Issue:** Default quotas `{seloger:15, leboncoin:10, bienici:20, figaro:10, greenacres:10, facebook:25}` hardcoded.
- **Fix:** Read from `settings.portal_quotas`; only fall back to defaults when unset.

### 4.4 Hardcoded download filenames in feed download proxy

- **File:** [`app/api/feeds/download/route.ts`](app/api/feeds/download/route.ts:32) (line 32 `import_nellimo_poliris.zip`, line 66 `meta_catalog_nellimo.xml`)
- **Issue:** Branded filenames hardcoded.
- **Fix:** Derive from agency slug/settings.

### 4.5 Unsplash stock images in sample/social seed data

- **Files:** [`components/cockpit/reseaux-sociaux/page.tsx`](app/cockpit/reseaux-sociaux/page.tsx:21) (INITIAL_SOCIAL_POSTS), [`components/cockpit/import-hektor/import-hektor-types.ts`](components/cockpit/import-hektor/import-hektor-types.ts:30) (sample CSV rows)
- **Issue:** Demo/seed content uses Unsplash stock photos.
- **Fix:** Acceptable for sample templates, but ensure they are never surfaced as real listings/posts in production views.

---

## Suggested remediation order

1. **P1 legal identity** (1.1–1.4): centralize agency identity in `AgencySettings` and thread through copywriting, AI prompt, flyers, social generators.
2. **P2 data integrity** (2.1–2.6): make feed/cron routes read live data; fix channel status; persist Hektor imports; remove fake fallback values.
3. **P3 misleading claims** (3.1–3.5): implement or relabel Meta publish, Lab AI, and Social Planner; remove fabricated follower count.
4. **P4 polish** (4.1–4.5): replace hardcoded defaults with settings-driven values.
