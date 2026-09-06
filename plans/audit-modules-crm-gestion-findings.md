# Audit — Modules CRM & Gestion (Nell'Immo Cockpit)

**Scope:** parametres, contacts/gmail, acquereurs, relances, cles-panneaux, inter-agences, aide, simulateurs
**Type:** Analysis only — no files modified.
**Priority:** Legal/compliance > Data integrity > UX > Polish

---

## 🔴 P1 — Legal / Compliance

### 1.1 Legal identity hardcoded in the Delegation Contract (client-facing legal document)

- **File:** [`components/cockpit/inter-agences/DelegationContractModal.tsx`](components/cockpit/inter-agences/DelegationContractModal.tsx:54) (lines 54, 81)
- **Issue:** The "Convention Officielle de Délégation de Mandat de Vente" hardcodes the full legal identity of the delegating agency: `SASU NELL'IMMO, Capital 1 000 €, siège 145 Chemin des Oliviers, 13330 Pélissanne, représentée par Mme Nelly FERNANDEZ, titulaire de la Carte Professionnelle CPI 1310 2019 000 042 974 délivrée par la CCI d'Aix-Marseille-Provence, garantie financière GALIAN (120 000 €)`. Line 81 hardcodes `Nelly FERNANDEZ (Nell'Immo)` as the signatory.
- **Why it matters:** This is a **legally binding contract** printed/signed between two agencies. It does **not** read from `AgencySettings` — the page ([`app/cockpit/inter-agences/page.tsx`](app/cockpit/inter-agences/page.tsx:104)) passes only `delegation`, `property`, `partner` to the modal, never `settings`. Any change to the agency's legal name, capital, address, CPI, or guarantee would silently produce an **invalid contract**. Also non-reusable if the tool is ever rebranded.
- **Fix:** Pass `AgencySettings` into `DelegationContractModal` and interpolate `agency_name`, `legal_form`/`capital`, `address`, `agent_name`, `card_t_number`/CPI, `guarantee_fund_name` from the store. Remove hardcoded legal values.

### 1.2 SRU / Loi L271-1 withdrawal deadline computed incorrectly (off-by-one + no public-holiday handling)

- **File:** [`components/cockpit/aide/aide-types.ts`](components/cockpit/aide/aide-types.ts:44) (lines 42–48)
- **Issue:** `computeLegalDates` computes the SRU 10-day purge as `base + 11 days` (`sruDate.setDate(sruDate.getDate() + 11)`), with a comment "10 days (starting next day)". The legal 10-day withdrawal period from notification day D expires at the end of day D+10, so `D+11` is one day **late**. Additionally, the weekend rollover only handles Saturday/Sunday — it does **not** account for French public holidays, even though the modal's own footnote ([`LegalCalculatorModal.tsx`](components/cockpit/aide/LegalCalculatorModal.tsx:122)) explicitly claims "Si le 10e jour ... expire un samedi, dimanche ou **jour férié**, l'échéance est automatiquement reportée au premier jour ouvrable suivant".
- **Why it matters:** This date drives the legal validity of a compromise (when the buyer can no longer withdraw). An incorrect purge date is a **direct legal liability** for the agency and contradicts the tool's own stated rule.
- **Fix:** Compute the 10th day as `D+10` (or clarify the intended convention), and roll forward to the next business day when the expiry lands on a weekend **or** a French public holiday (add a holiday calendar).

### 1.3 Hardcoded / inconsistent agency contact data in client-facing simulator outputs

- **Files:**
  - [`components/cockpit/simulateurs/QuickFinanceModal.tsx`](components/cockpit/simulateurs/QuickFinanceModal.tsx:43) — WhatsApp summary ends with `Nelly Fernandez — Nell'Immo Pélissanne (04 90 55 55 55)`.
  - [`components/cockpit/simulateurs/LegalDeadlinesSimulator.tsx`](components/cockpit/simulateurs/LegalDeadlinesSimulator.tsx:43) — `agence Nell'Immo (Nelly Fernandez - 07 55 68 61 09)`.
  - [`components/cockpit/simulateurs/LoanCreditSimulator.tsx`](components/cockpit/simulateurs/LoanCreditSimulator.tsx:47) — `Simulateur certifié Nell'Immo — Salon-de-Provence & Pays Salonais`.
  - [`components/cockpit/simulateurs/RentalYieldSimulator.tsx`](components/cockpit/simulateurs/RentalYieldSimulator.tsx:82) — `ANALYSE RENTABILITÉ INVESTISSEUR — NELL'IMMO` and `CONSEIL NELL'IMMO`.
- **Issue:** These summaries are copied to the clipboard / sent to **clients via WhatsApp**. They hardcode the agency name and, critically, **two different phone numbers** — `04 90 55 55 55` (QuickFinanceModal) vs `07 55 68 61 09` (LegalDeadlinesSimulator and everywhere else). The `04 90 55 55 55` number appears to be a **placeholder** that would reach a wrong/unknown line.
- **Why it matters:** Client-facing financial/legal summaries carrying a wrong phone number damage trust and can misdirect a serious buyer. Inconsistent identity also breaks the single-source-of-truth principle.
- **Fix:** Inject `agency_name`, `agent_name`, `phone`, `city` from `AgencySettings` into all summary builders; remove the stray `04 90 55 55 55`.

---

## 🟠 P2 — Data Integrity

### 2.1 Backup/restore does not cover all store collections

- **File:** [`components/cockpit/parametres/parametres-types.ts`](components/cockpit/parametres/parametres-types.ts:7) (lines 7–25)
- **Issue:** `BACKUP_STORAGE_KEYS` lists 17 collections (properties, buyers, visits, auditLogs, transactions, contactLeads, estimationLeads, prospectingLeads, vendorReports, keys, signboards, avenants, proposals, partners, delegations, relances, contacts). It does **not** include the separate stores used by other modules: `users` (and their roles), relance statuses/ignored actions, theme preference, and the inter-agency/partner stores if they live in separate keys.
- **Why it matters:** A "Master Backup" that silently omits user accounts, theme, and relance state gives a false sense of full recovery. Restoring after a reset would lose admin users and per-module state.
- **Fix:** Enumerate every persisted store key (audit `lib/store.tsx` + `lib/users.ts` + `lib/theme.tsx`) and include them in export/restore; version the backup payload.

### 2.2 Agency key stored in plaintext in localStorage

- **File:** [`lib/users.ts`](lib/users.ts:293) (lines 293–309)
- **Issue:** `setAgencyKey` stores the agency passphrase **in plaintext** at `nellimo_agency_key_v1` in localStorage; `getAgencyKey` reads it back unencrypted. Meanwhile sensitive settings are AES-GCM encrypted in the vault ([`lib/vault.ts`](lib/vault.ts:28)).
- **Why it matters:** The vault's whole purpose is to keep secrets out of plaintext, but the key that unlocks/derives them sits in plaintext beside them — defeating the protection. Any XSS or local inspection recovers the master key.
- **Fix:** Do not persist the raw passphrase; keep it only in memory/session for the current session (mirror the vault session pattern), or derive and store only a verifier hash.

### 2.3 Vault unlock key vs agency key mismatch risk

- **Files:** [`lib/vault.ts`](lib/vault.ts:96) (`unlockVault(password)`) vs [`lib/auth.ts`](lib/auth.ts:221) (`unlockVaultWithAgencyKey`)
- **Issue:** The vault derives its AES key from a **password** (`deriveKey(password)`), while `auth.ts` exposes `unlockVaultWithAgencyKey` which unlocks using the **agency key**. If the two flows use different secrets, secrets saved under one key cannot be decrypted under the other, producing silent decryption failures or data loss.
- **Why it matters:** Sensitive settings (SFTP passwords, API secrets) could become unreadable depending on which unlock path the user took — a data-integrity failure for the vault.
- **Fix:** Unify on a single key-derivation source (one secret) across `vault.ts` and `auth.ts`, and document/route all unlock flows through it.

### 2.4 Google "quick sync" and "test connection" are simulated, not real

- **Files:**
  - [`components/cockpit/parametres/GoogleSection.tsx`](components/cockpit/parametres/GoogleSection.tsx:27) — `handleQuickSync` only `setTimeout(700ms)` then sets `google_connected_at`; no network call.
  - [`components/cockpit/parametres/google/GoogleConnectModal.tsx`](components/cockpit/parametres/google/GoogleConnectModal.tsx:31) — `handleTestConnection` `setTimeout(900ms)` then `testSuccess = true`; `handleConfirm` only saves email/name/connected_at, no OAuth.
- **Why it matters:** The UI presents a real Google Workspace connection/sync, but nothing is actually connected or synced. A premium pro tool must not fake connectivity — it misleads the user into believing their Google data is linked.
- **Fix:** Either implement real OAuth + API sync, or relabel as "manual save / coming soon" and reflect an unconnected state.

### 2.5 Google account status always shows "Connecté"

- **File:** [`components/cockpit/parametres/google/GoogleAccountStatusCard.tsx`](components/cockpit/parametres/google/GoogleAccountStatusCard.tsx:20) (lines 20, 27, 42–47)
- **Issue:** Hardcodes `nellimmo.acte@gmail.com`, `"Compte Google Workspace de Nelly"`, a `connectedDate` fallback of `'1er septembre 2026'`, and always renders the green "Connecté" badge regardless of any real connection state.
- **Why it matters:** Misrepresents integration health; the "connected since" date is fabricated.
- **Fix:** Drive email, label, connected date, and badge from real stored connection state; show "Non connecté" when absent.

### 2.6 Gmail "AI" generation is canned text, not AI

- **File:** [`components/cockpit/contacts/GmailComposeModal.tsx`](components/cockpit/contacts/GmailComposeModal.tsx:68) (lines 68–76)
- **Issue:** `handleGenerateAi` `setTimeout(600ms)` then injects a fixed canned paragraph hardcoding `Agence Nell'Immo — Salon-de-Provence` and `07 55 68 61 09`. There is no AI call.
- **Why it matters:** Users are led to believe the compose assistant is AI-powered; the output is static and carries hardcoded identity. Misleading capability + stale identity.
- **Fix:** Wire to the real AI route (as in the marketing module) or relabel as a template; inject identity from settings.

### 2.7 Google Sync modal is CSV-only despite "bidirectional Google Workspace" claim

- **File:** [`components/cockpit/contacts/GoogleSyncModal.tsx`](components/cockpit/contacts/GoogleSyncModal.tsx:89)
- **Issue:** Header claims "Liaison bidirectionnelle Google Workspace", but the modal only downloads/uploads a CSV file ([`lib/gmail.ts`](lib/gmail.ts:387)). No Google Contacts API sync exists.
- **Why it matters:** Overstates capability; users expect their Google Contacts to actually sync.
- **Fix:** Implement real Google Contacts sync or reword to "Export/Import CSV".

---

## 🟡 P3 — UX / Functional Gaps

### 3.1 Delegation type and clauses are hardcoded in the creation flow

- **File:** [`components/cockpit/inter-agences/NewDelegationModal.tsx`](components/cockpit/inter-agences/NewDelegationModal.tsx:55) (lines 55, 59, 127)
- **Issue:** `handleSubmit` always sends `delegation_type: 'co_exclusivite'` (the type union also supports `'simple_delegation'`, but there is no selector), and always writes a fixed `special_clauses` string. Fee-share option labels hardcode `Nell'Immo` (line 127).
- **Why it matters:** The user cannot actually choose a simple delegation or customize clauses despite the data model supporting it; the generated contract may not match the intended deal.
- **Fix:** Add a delegation-type selector and a free-text clauses field; pass them through to the contract.

### 3.2 Hardcoded agency identity in buyer-selection deliverables and messages

- **Files:**
  - [`components/cockpit/acquereurs/BuyerSelectionModal.tsx`](components/cockpit/acquereurs/BuyerSelectionModal.tsx:52) (lines 52–71, 83) — hardcodes `Nelly Fernandez de l'agence Nell'Immo`, `Nelly Fernandez — SASU Nell'Immo`, `06 12 34 56 78`, origin `https://nellimmo.fr`, subject `— Nell'Immo`.
  - [`components/cockpit/acquereurs/selection/BuyerSelectionPrintSheet.tsx`](components/cockpit/acquereurs/selection/BuyerSelectionPrintSheet.tsx:108) — `Nelly Fernandez — Directrice d'Agence • 06 12 34 56 78 • contact@nellimmo.fr`, `SASU Nell'Immo`.
  - [`components/cockpit/acquereurs/acquereurs-types.ts`](components/cockpit/acquereurs/acquereurs-types.ts:90) — `buildBroadcastTeaser`/`buildBroadcastMessage`/`buildBuyerContactMessage` hardcode `Nell'Immo`, `https://nellimmo.fr/biens/`, `Nelly Fernandez (07 55 68 61 09)`.
- **Issue:** These are **client-facing** (WhatsApp/email/print). Note the phone inconsistency again: `06 12 34 56 78` here vs `07 55 68 61 09` elsewhere. The functions do not receive `AgencySettings`.
- **Why it matters:** Wrong/placeholder phone on printed buyer sheets and broadcast messages is a direct client-facing error.
- **Fix:** Pass `AgencySettings` into these builders/modals and interpolate agent name, agency name, phone, email, website.

### 3.3 Hardcoded agency identity in Google review / Maps helpers

- **File:** [`lib/google.ts`](lib/google.ts:383) (lines 383–410, plus default `city = 'Pélissanne'` throughout lines 18–107)
- **Issue:** `createGoogleReviewMessage` hardcodes `Nelly Fernandez de l'agence Nell'Immo`, `07 55 68 61 09`, review URL `https://g.page/r/nellimmo/review`, city `Pélissanne`. Many Maps URL builders default `city = 'Pélissanne'` and one hardcodes `26 avenue des Enjouvènes, 13330 Pélissanne` (line 42).
- **Why it matters:** Review-request messages and Maps links are client-facing; wrong city/address/phone degrade the experience and the review funnel.
- **Fix:** Read agency identity/address/city from `AgencySettings`; remove hardcoded defaults.

### 3.4 Cosmetic / non-functional settings sections

- **Files:**
  - [`components/cockpit/parametres/AiSection.tsx`](components/cockpit/parametres/AiSection.tsx:7) — purely informational, no inputs or save.
  - [`components/cockpit/parametres/SocialSection.tsx`](components/cockpit/parametres/SocialSection.tsx:79) — auto-publish toggles default `true` but there is no evidence they are wired to any publishing job.
  - [`components/cockpit/parametres/google/GoogleServicesGrid.tsx`](components/cockpit/parametres/google/GoogleServicesGrid.tsx:22) — toggles only store enabled flags; no actual service wiring.
- **Why it matters:** Settings that look actionable but do nothing (or default to "on") mislead the user about automation that isn't running.
- **Fix:** Either implement the behavior or clearly mark as "planned" and default toggles to off until wired.

### 3.5 Hardcoded fallback identity in the settings form inputs

- **Files:**
  - [`components/cockpit/parametres/IdentitySection.tsx`](components/cockpit/parametres/IdentitySection.tsx:69) — `cci_card_t || 'CCI Marseille Provence'`, `siren || '853 807 006'` (line 80), `postal_code || '13330'` / `city || 'Pélissanne'` (lines 137–138).
  - [`components/cockpit/parametres/GuaranteeBankingCard.tsx`](components/cockpit/parametres/GuaranteeBankingCard.tsx:27) — `guarantee_fund_name || 'GALIAN Assurances (120 000 €)'`, `insurance_name || 'MMA Entreprise (Police n° 114.240.230)'`, `mediator_name || 'ANM Conso / Médiation FNAIM'`, `agency_rib_iban || 'FR76 3000 4000 5000 6000 7000 123'`, `agency_rib_bic || 'BNPAFRPP'`.
- **Issue:** Inputs display hardcoded demo values as if they were the saved settings, even when the store is empty.
- **Why it matters:** A user could believe these legal/financial values are already configured and saved; a demo RIB/CPI shown as real is a compliance hazard.
- **Fix:** Show empty/placeholder when the setting is absent; only display real stored values.

---

## ⚪ P4 — Polish

### 4.1 Hardcoded branding in static help/coaching copy

- **Files:** [`lib/help-content.ts`](lib/help-content.ts:367) (many lines), [`components/cockpit/aide/AideHeader.tsx`](components/cockpit/aide/AideHeader.tsx:52), [`components/cockpit/aide/detail/ObjectiveCard.tsx`](components/cockpit/aide/detail/ObjectiveCard.tsx:18)
- **Issue:** The help academy content is heavily personalized with `Nelly`, `Nell'Immo`, `Pélissanne`, and the phone `07 55 68 61 09` baked into scripts/examples (e.g., line 376 `rappelez-moi au 07 55 68 61 09`).
- **Why it matters:** This is intentionally personalized coaching content, so it is lower priority — but the phone is still hardcoded and would go stale if the number changes.
- **Fix (optional):** Parameterize the contact number/name in the script templates so a number change propagates everywhere.

### 4.2 Hardcoded agency name in inter-agency email subject

- **File:** [`components/cockpit/inter-agences/PartnersDirectory.tsx`](components/cockpit/inter-agences/PartnersDirectory.tsx:89)
- **Issue:** Email subject `Partenariat inter-agences — Nell'Immo` hardcodes the agency name.
- **Fix:** Use `settings.agency_name`.

---

## Summary of highest-impact items

| # | Finding | Module | Impact |
| --- | --------- | -------- | -------- |
| 1.1 | Legal identity hardcoded in Delegation Contract | inter-agences | Legal |
| 1.2 | SRU deadline off-by-one + no holiday handling | aide/simulateurs | Legal |
| 1.3 | Wrong phone `04 90 55 55 55` in client WhatsApp summary | simulateurs | Legal/UX |
| 2.1 | Backup omits users/theme/relance stores | parametres | Data integrity |
| 2.2 | Agency key in plaintext | parametres/auth | Security |
| 2.3 | Vault key vs agency-key mismatch | parametres | Data integrity |
| 2.4–2.7 | Fake Google/Gmail sync & AI | parametres/contacts | Data integrity/UX |
| 3.1 | Delegation type/clauses hardcoded | inter-agences | Functional |
| 3.2–3.3 | Hardcoded identity in buyer/Google client outputs | acquereurs/google | UX |
