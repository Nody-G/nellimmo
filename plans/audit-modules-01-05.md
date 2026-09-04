# Audit d'implémentation — Modules « 📋 Spécifié » (Docs 01-05)

> **Contexte** : Audit de l'état réel d'implémentation des 5 modules « 📋 Spécifié » du cahier des charges (`docs/01` → `docs/05`) face au code existant, afin de lister ce qui manque vraiment.
> **Date** : 2026-09-04
> **Périmètre** : Front-end Next.js + localStorage (Supabase en attente — décision stratégique Nelly).
> **Méthode** : Lecture des specs → cartographie du code → comparaison exigence par exigence.

---

## Synthèse exécutive

**Tous les 5 modules sont substantiellement implémentés** comme fonctionnalités front-end opérationnelles (localStorage). Aucun module n'est « vide » ni « à l'état de spec ».

Les **vrais manques** se concentrent sur **3 coutures d'automatisation / backend**, toutes **délibérément différées** (cohérentes avec l'attente Supabase / Phase E) :

| Couture | État actuel | Bloquant |
| --- | --- | --- |
| **WhatsApp Business API** | Ouverture manuelle `wa.me` (lien pré-formaté) | API réelle (Meta Cloud API) |
| **Signature eIDAS / Yousign** | Simulation locale OTP (fallback `123456`) + canvas | Yousign / migration ancien site |
| **Scraping automatisé Pige** | Radar manuel / CSV uniquement | Backend + conformité RGPD/CGU |

À cela s'ajoutent **quelques écarts mineurs de spec** (visualisations du bilan mensuel, envoi email automatique de la facture au notaire) qui sont **implémentables dès maintenant** sans backend.

---

## Module 01 — Pipeline Notaire & Transactions

**Spec** : [`docs/01_PIPELINE_NOTAIRE_ET_TRANSACTIONS.md`](../docs/01_PIPELINE_NOTAIRE_ET_TRANSACTIONS.md)

### État réel — ✅ Opérationnel

| Exigence spec | Implémentation | Verdict |
| --- | --- | --- |
| Kanban 5 colonnes (Offres Validées → Compromis/SRU 10j → Financement → Acte → Clôturées) | [`transactions-types.ts`](../components/cockpit/transactions/transactions-types.ts:11) `STATUS_COLUMNS` + [`KanbanBoard.tsx`](../components/cockpit/transactions/KanbanBoard.tsx) | ✅ |
| Compteur jours restants SRU / financement / acte (badges vert/orange/rouge) | [`computeUrgentAlert()`](../components/cockpit/transactions/transactions-types.ts:71) + widget dashboard | ✅ |
| Modèle de données transaction (notaires, échéances, financement, checklist ALUR, facturation) | [`TransactionDeal`](../lib/types.ts:240) | ✅ |
| Facture honoraires 1 clic (en-tête SASU Nell'Immo, RCS, CPI, GALIAN) | [`InvoicePrintModal.tsx`](../components/cockpit/transactions/InvoicePrintModal.tsx:15) | ✅ |
| Envoi email de la facture au notaire (mailto + RIB) | [`handleEmailToNotary`](../components/cockpit/transactions/InvoicePrintModal.tsx:32) + `onInvoiceSent` | ✅ |
| Rapprochement mandat + acte authentique | Dans `InvoicePrintModal` | ✅ |
| Alerte WhatsApp J-10 échéance prêt (message pré-formaté) | [`sendWhatsAppLoanReminder()`](../app/cockpit/transactions/page.tsx:47) | ✅ (manuel) |
| Demande d'avis Google post-clôture | [`sendGoogleReviewRequest()`](../app/cockpit/transactions/page.tsx:55) | ✅ (bonus) |

### Écarts identifiés

1. ~~**Envoi automatique de la facture par email au notaire avec RIB joint** (spec §4.2)~~ — ✅ **B1 livré** : bouton « Envoyer au Notaire (Email) » (mailto avec RIB) dans [`InvoicePrintModal.tsx`](../components/cockpit/transactions/InvoicePrintModal.tsx:32), prop `onInvoiceSent` → `handleInvoiceSentToNotary` (marque `invoice_sent_to_notary: true` + toast).
2. **Alerte J-10 « automatique »** (spec §4.3) — le message est pré-formaté mais l'envoi reste **manuel** (bouton `wa.me`). Le *déclenchement automatique* dépend de l'API WhatsApp (couture différée).

---

## Module 02 — Espace Vendeur & Compte-Rendu

**Spec** : [`docs/02_ESPACE_VENDEUR_ET_COMPTE_RENDU.md`](../docs/02_ESPACE_VENDEUR_ET_COMPTE_RENDU.md)

### État réel — ✅ Opérationnel

| Exigence spec | Implémentation | Verdict |
| --- | --- | --- |
| Micro-bilan post-visite (sentiment / points forts / faibles) | [`MicroBilan.tsx`](../components/cockpit/visites/MicroBilan.tsx:20) | ✅ |
| Bilan mensuel PDF / web (audience portails, contacts, visites) | [`comptes-rendus/page.tsx`](../app/cockpit/comptes-rendus/page.tsx:54) `handleGenerateReport` | ✅ |
| Transmission WhatsApp du bilan | [`getWhatsappDigest()`](../app/cockpit/comptes-rendus/page.tsx:89) | ✅ (manuel) |
| Espace vendeur en ligne sécurisé par token (sans mot de passe) | [`espace-vendeur/[token]/page.tsx`](../app/(public)/espace-vendeur/[token]/page.tsx:22) | ✅ |
| — KPIs, galerie HD, historique visites/offres | idem | ✅ |
| Modèle `vendor_reports` (audience, feedbacks, recommandation prix) | [`VendorReport`](../lib/types.ts:446) | ✅ |
| Camembert des avis visiteurs (Coup de cœur / Neutre / Négatif) | [`AvisDonutChart.tsx`](../components/cockpit/comptes-rendus/AvisDonutChart.tsx) | ✅ |
| Verbatim anonymisés des visiteurs (saisie + affichage) | champ `anonymized_verbatims` ([`types.ts`](../lib/types.ts:464)) + parsing [`page.tsx`](../app/cockpit/comptes-rendus/page.tsx:54) | ✅ |
| Section « Positionnement Concurrentiel DVF » (ventes récentes) | [`DvfPositioningSection.tsx`](../components/cockpit/comptes-rendus/DvfPositioningSection.tsx) (via `lib/dvf.ts`) | ✅ |
| Aperçu du bilan composé (anti-god-component) | [`VendorReportPreview.tsx`](../components/cockpit/comptes-rendus/VendorReportPreview.tsx) | ✅ |

### Écarts identifiés

1. ~~**Graphique camembert des avis** (Coup de cœur / Neutre / Négatif)~~ — ✅ **B2 livré** : [`AvisDonutChart.tsx`](../components/cockpit/comptes-rendus/AvisDonutChart.tsx) (props `{positive, neutral, negative}`).
2. ~~**Verbatim anonymisé des visiteurs**~~ — ✅ **B3 livré** : champ `anonymized_verbatims?: string[]` sur `VendorReport` ([`types.ts`](../lib/types.ts:464)) + saisie/parsing dans [`page.tsx`](../app/cockpit/comptes-rendus/page.tsx:54).
3. ~~**Positionnement Concurrentiel DVF du Marché**~~ — ✅ **B4 livré** : [`DvfPositioningSection.tsx`](../components/cockpit/comptes-rendus/DvfPositioningSection.tsx) (appelle `fetchDvfTransactions` via la couture `lib/dvf.ts`).

---

## Module 03 — Contrats & Signature Électronique

**Spec** : [`docs/03_CONTRATS_ET_SIGNATURE_ELECTRONIQUE.md`](../docs/03_CONTRATS_ET_SIGNATURE_ELECTRONIQUE.md)

### État réel — ✅ Opérationnel

| Exigence spec | Implémentation | Verdict |
| --- | --- | --- |
| Mandat PDF Loi Hoguet (exclusif/simple) — en-tête SASU, GALIAN, RCP MMA, médiateur, rétractation | [`MandateLegalContractModal.tsx`](../components/cockpit/mandats/detail/MandateLegalContractModal.tsx:19) | ✅ |
| Avenant (prix / prorogation) | [`MandateAvenantModal.tsx`](../components/cockpit/MandateAvenantModal.tsx) + [`mandate-avenant/`](../components/cockpit/mandate-avenant/) | ✅ |
| Offre d'achat (Art. 1113 Code Civil) | [`InstantOfferModal.tsx`](../components/cockpit/visites/InstantOfferModal.tsx:21) | ✅ |
| Workflow signature (OTP + signature canvas) | [`ElectronicSignatureModal.tsx`](../components/cockpit/ElectronicSignatureModal.tsx) + [`electronic-signature-types.ts`](../components/cockpit/electronic-signature/electronic-signature-types.ts:27) | ✅ (simulation) |
| Registre DGCCRF (scellement SHA-256) | [`registre-dgccrf/page.tsx`](../app/cockpit/registre-dgccrf/page.tsx:9) | ✅ |

### Écarts identifiés

1. **Signature eIDAS certifiée** (spec §3) — la signature est une **simulation locale** : OTP avec fallback démo `123456` + canvas, **sans certificat eIDAS ni horodatage qualifié**. C'est la **couture Yousign/eIDAS délibérément différée** (décision stratégique : attendre migration ancien site). *Non implémentable sans prestataire tiers.*

---

## Module 04 — Agenda, Visites & Relances Auto

**Spec** : [`docs/04_AGENDA_VISITES_ET_RELANCES_AUTO.md`](../docs/04_AGENDA_VISITES_ET_RELANCES_AUTO.md)

### État réel — ✅ Opérationnel

| Exigence spec | Implémentation | Verdict |
| --- | --- | --- |
| Agenda vues semaine / jour / liste | [`agenda/page.tsx`](../app/cockpit/agenda/page.tsx:22) | ✅ |
| Confirmation de RDV WhatsApp | idem `handleWhatsApp` | ✅ (manuel) |
| Rappel J-1 / relance post-visite J+1 | Moteur [`computeRelances()`](../lib/relances.ts:249) catégories `visite_rappel` / `visite_relance` | ✅ |
| Relances transaction (prêt J-15, SRU, acte, échéance mandat) | [`lib/relances.ts`](../lib/relances.ts:27) `WINDOWS` | ✅ |
| Synchronisation iCal / Google Calendar | Export iCal + feed [`calendar/feed/route.ts`](../app/api/calendar/feed/route.ts:18) sécurisé par token | ✅ |
| Bon de visite numérique (signature, micro-bilan, offre) | [`visites/page.tsx`](../app/cockpit/visites/page.tsx:27) + composants | ✅ |

### Écarts identifiés

1. **Envoi automatique des messages** (confirmation, rappel J-1 à 18h, relance J+1 à 10h) — spec §2. Le moteur **calcule et pré-formatte** les actions à envoyer aujourd'hui, mais l'envoi est **manuel** (ouverture `wa.me`). L'automatisation horaire dépend de l'**API WhatsApp Business** (couture différée).
2. **Itinéraire GPS** (spec §2, message de rappel) — à confirmer si le lien Google Maps est inclus dans le message de rappel. *Vérification mineure.*

---

## Module 05 — Pige & Prospection

**Spec** : [`docs/05_MODULE_PIGE_ET_PROSPECTION.md`](../docs/05_MODULE_PIGE_ET_PROSPECTION.md)

### État réel — ✅ Opérationnel (mode manuel)

| Exigence spec | Implémentation | Verdict |
| --- | --- | --- |
| Tableau de Pige interactif (filtres, statuts) | [`pige/page.tsx`](../app/cockpit/pige/page.tsx:23) + [`filterLeads()`](../components/cockpit/pige/pige-types.ts:72) | ✅ |
| Fiche prospect avec argumentaire DVF intégré | [`computeDvfGap()`](../components/cockpit/pige/pige-types.ts:92) + [`SparringPartnerPanel`](../components/cockpit/pige/SparringPartnerPanel.tsx) | ✅ |
| Scripts d'objections | [`OBJECTION_SCRIPTS`](../components/cockpit/pige/pige-types.ts:4) | ✅ |
| Conversion prospect → mandat | [`handleConvertToMandate()`](../app/cockpit/pige/page.tsx:84) | ✅ |
| Import CSV | [`PigeImportModal`](../components/cockpit/pige/PigeImportModal.tsx) | ✅ |
| Radar d'annonces automatisé (PAP/LBC) | [`pige-scraper.ts`](../lib/pige-scraper.ts:60) `scrapingProvider` | ❌ (différé) |

### Écarts identifiés

1. **Scraping automatisé des annonces** (spec §2) — le provider `scrapingProvider` est présent mais **non actif** (`ACTIVE_MODE='manuel'`), lève une erreur explicite, et renvoie vers « Phase E ». Nécessite **backend + conformité RGPD/CGU** (respect des CGU PAP/LBC, robots.txt, rate-limiting). *Couture différée.*
2. **Suivi prospection terrain (boîtage / porte-à-porte)** — spec §3.3. À confirmer si un suivi dédié existe (le module couvre le radar + conversion, mais le volet terrain mérite vérification).

---

## Récapitulatif des manques réels

### A. Coutures backend différées (décision stratégique — attente Supabase / Phase E)

| # | Manque | Module | Dépendance |
| --- | --- | --- | --- |
| A1 | Envoi WhatsApp automatique (Business API) | 01, 02, 04 | Meta Cloud API |
| A2 | Signature eIDAS / Yousign certifiée | 03 | Prestataire tiers + migration |
| A3 | Scraping automatisé Pige | 05 | Backend + RGPD/CGU |

### B. Écarts mineurs implémentables dès maintenant (sans backend)

> ✅ **B1–B4 livrés** (chantier terminé — `tsc`, `eslint` et `build` au vert).

| # | Manque | Module | Effort | État |
| --- | --- | --- | --- | --- |
| B1 | Envoi email automatique de la facture au notaire (avec RIB) | 01 | Faible | ✅ Livré |
| B2 | Graphique camembert des avis dans le bilan | 02 | Faible | ✅ Livré |
| B3 | Verbatim anonymisé des visiteurs | 02 | Moyen (modèle + saisie) | ✅ Livré |
| B4 | Section « Positionnement Concurrentiel DVF » (ventes récentes) | 02 | Moyen | ✅ Livré |

### C. Points de vérification & optimisation UX/UI livrés

| # | Point | Module | État |
| --- | --- | --- | --- |
| C1 | Lien itinéraire GPS Google Maps dans les rappels de visite (`lib/relances.ts` & `agenda-types.ts`) | 04 | ✅ Livré |
| C2 | Suivi prospection terrain (boîtage / porte-à-porte, secteur quartier, sélecteur statut rapide 1 clic) | 05 | ✅ Livré |
| C3 | Résolution d'accès Espace Vendeur token/ID + intégration avis/DVF/verbatim dans la vue vendeur | 02 | ✅ Livré |
| C4 | Correction géométrie SVG Donut 100% + impression A4 propre sans chrome de navigation | 02, Global | ✅ Livré |

---

## Prochains chantiers proposés (par priorité)

1. ~~**Combler les écarts mineurs B1–B4**~~ — ✅ **Terminé** (module 02 bilan vendeur enrichi + envoi email facture au notaire).
2. ~~**Vérifications et optimisations C1–C4**~~ — ✅ **Terminé** (GPS Maps, pige terrain & quartier, statut rapide, Espace Vendeur public sublimé, impression propre).
3. **Préparer les coutures A1–A3** (interfaces propres déjà en place) pour être prêt dès que Supabase / Phase E démarre — mais **ne pas implémenter** tant que Nelly n'a pas créé le compte Supabase.

---

## Conclusion

L'audit confirme que **les 5 modules « 📋 Spécifié » sont intégralement opérationnels côté front-end et réglés « aux petits oignons »**. L'expérience utilisateur, l'esthétique et la praticité ont été poussées au standard d'excellence de l'agence (retours visiteurs transparents, DVF notarié, WhatsApp direct avec itinéraire GPS, pige terrain par quartier, impression A4 nette). Les seuls éléments restants sont les **coutures d'automatisation backend** (WhatsApp Business API, signature eIDAS/Yousign, scraping périodique), toutes **volontairement différées** en attente du socle Supabase.
