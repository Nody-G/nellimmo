# Audit Fonctionnel — Visites, Signature Électronique, Transactions & Agenda

**Scope:** `app/cockpit/visites`, `components/cockpit/visites/**`, `components/cockpit/electronic-signature/**`, `lib/signature.ts`, `app/cockpit/transactions` + `components/cockpit/transactions/**`, `app/cockpit/agenda` + `components/cockpit/agenda/**`.
**Mode:** Analyse seule — aucun fichier modifié.
**Principe de priorisation:** légal/conformité > intégrité des données > UX > finition.

---

## 🔴 P1 — Légal / Conformité (risque juridique réel)

### 1.1 Signature électronique = pure simulation présentée comme réelle (eIDAS)

Le flux complet prétend produire une signature électronique « avancée » alors qu'il n'est qu'une simulation locale.

- [`lib/signature.ts`](lib/signature.ts:163) — Le certificat embarque une **IP fabriquée** codée en dur `'88.164.214.12 (Pélissanne, FR)'` et revendique [`eidas_level: 'avance'`](lib/signature.ts:164) sans aucune preuve eIDAS réelle.
- [`components/cockpit/electronic-signature/useElectronicSignature.ts`](components/cockpit/electronic-signature/useElectronicSignature.ts:61) — [`handleSendOtp`](components/cockpit/electronic-signature/useElectronicSignature.ts:61) **n'envoie aucun SMS/email** : il génère un code localement. [`handleVerifyOtp`](components/cockpit/electronic-signature/useElectronicSignature.ts:67) compare simplement la saisie au code local.
- [`components/cockpit/electronic-signature/electronic-signature-types.ts`](components/cockpit/electronic-signature/electronic-signature-types.ts:18) — `isOtpValid` accepte aussi le code démo codé en dur `'123456'`.
- [`components/cockpit/electronic-signature/SignatureOtpStep.tsx`](components/cockpit/electronic-signature/SignatureOtpStep.tsx:40) — Bandeau « Demo Simulation Alert » : « Simulation d'envoi SMS actif : Code OTP de test généré : {generatedOtp} (ou saisissez 123456) ».
- [`components/cockpit/electronic-signature/SignatureDrawStep.tsx`](components/cockpit/electronic-signature/SignatureDrawStep.tsx:102) — Libellé « Scellement cryptographique… » (faux).
- [`components/cockpit/electronic-signature/SignatureSuccessStep.tsx`](components/cockpit/electronic-signature/SignatureSuccessStep.tsx) — Affiche « validé par preuve SMS » et « inscrit immédiatement au Registre Officiel des Mandats Loi Hoguet » — **deux affirmations fausses**.
- [`components/cockpit/electronic-signature/SignatureContractStep.tsx`](components/cockpit/electronic-signature/SignatureContractStep.tsx:144) — Bouton « Envoyer le Code OTP par SMS » alors qu'aucun SMS n'est envoyé.

**Pourquoi c'est grave:** Présenter une simulation comme une signature eIDAS « avancée » et un enregistrement « officiel » est une tromperie à valeur probatoire nulle et expose à un contentieux (validité du mandat, preuve de consentement). C'est le point le plus critique du périmètre.
**Correctif suggéré:** Soit brancher un vrai prestataire (Docusign/Yousign/Universign) avec OTP réel + certificat horodaté + IP réelle côté serveur, soit retirer toute revendication eIDAS/« Registre Officiel » et afficher clairement « signature manuscrite numérisée, sans valeur eIDAS ».

### 1.2 Faux « scellement » SHA-256 et faux registre des visites

- [`components/cockpit/visites/visites-types.ts`](components/cockpit/visites/visites-types.ts:71) — [`generateVisitHash()`](components/cockpit/visites/visites-types.ts:71) renvoie `'sha256-bv-' + Math.random()… + '-certifie'` : un **hash aléatoire fabriqué**, pas un vrai SHA-256.
- [`components/cockpit/visites/VisitRegisterTable.tsx`](components/cockpit/visites/VisitRegisterTable.tsx:142) — Affiche `'sha256-bv-' + v.id.slice(0,8) + '-certifie'` comme preuve d'intégrité.
- [`app/cockpit/visites/page.tsx`](app/cockpit/visites/page.tsx) — Utilise `generateVisitHash` pour le bon de visite imprimable.

**Pourquoi c'est grave:** Un « sceau » d'intégrité qui n'en est pas un (aucun hachage réel, aucune chaîne de confiance) donne une fausse assurance de non-altération sur un document de visite opposable.
**Correctif suggéré:** Calculer un vrai SHA-256 du contenu signé (côté serveur de préférence) ou supprimer le libellé « certifié sha256 » trompeur.

### 1.3 Coordonnées bancaires et identité d'agence fabriquées dans les factures

- [`components/cockpit/transactions/InvoicePrintModal.tsx`](components/cockpit/transactions/InvoicePrintModal.tsx:75) — IBAN fallback `'FR76 3000 4000 5000 6000 7000 123'` + BIC `'BNPAFRPP'` **fictifs** ; [`ligne 60`](components/cockpit/transactions/InvoicePrintModal.tsx:60) numéro de facture fallback `'FACT-2026-004'`.
- [`components/cockpit/transactions/invoice/InvoiceFactureSection.tsx`](components/cockpit/transactions/invoice/InvoiceFactureSection.tsx:97) — Mêmes IBAN/BIC fictifs ; [`ligne 94`](components/cockpit/transactions/invoice/InvoiceFactureSection.tsx:94) « SASU NELL'IMMO » codé en dur.
- [`components/cockpit/transactions/invoice/InvoiceSequestreSection.tsx`](components/cockpit/transactions/invoice/InvoiceSequestreSection.tsx:60) — Séquestre fallback `'15 000'` € et `5` % inventés.

**Pourquoi c'est grave:** Une facture professionnelle avec un RIB inexistant est un document comptable/fiscal invalide et dangereux à émettre.
**Correctif suggéré:** Lire `settings.agency_rib_iban`/`agency_rib_bic` depuis le store et **bloquer l'émission** si absents, plutôt que d'inventer des valeurs.

### 1.4 Incohérence du capital social entre documents légaux

- [`components/cockpit/visites/PrintableVisitModal.tsx`](components/cockpit/visites/PrintableVisitModal.tsx:55) — capital « **1 000 €** ».
- [`lib/signature.ts`](lib/signature.ts:44) et [`InvoiceAgencyHeader.tsx`](components/cockpit/transactions/invoice/InvoiceAgencyHeader.tsx:22) — capital « **2 000 €** ».

**Pourquoi c'est grave:** Deux documents légaux officiels affichent un capital social différent — incohérence juridique visible.
**Correctif suggéré:** Centraliser dans `settings.capital_social` et supprimer tous les fallbacks codés en dur.

---

## 🟠 P2 — Intégrité des données (données fausses persistées)

### 2.1 Données notaire/vendeur fabriquées à la création d'une transaction

[`app/cockpit/transactions/page.tsx`](app/cockpit/transactions/page.tsx:104) — [`handleCreateDeal`](app/cockpit/transactions/page.tsx:104) injecte automatiquement :

- `deposit_amount` = 5 % auto,
- `seller_phone` fallback `'07 55 68 61 09'` (téléphone de l'agence !),
- `seller_notary_email: 'notaire@notaires.fr'` (**faux**),
- `seller_notary_phone: '04 90 00 00 00'` (**faux**),
- `seller_notary_office: 'Office Notarial'` (générique).

**Pourquoi c'est grave:** Des coordonnées de notaire fausses sont persistées dans le pipeline et peuvent être envoyées à des clients/relances — données corrompues à la source.
**Correctif suggéré:** Rendre ces champs obligatoires dans le formulaire (voir 3.1) et ne jamais écrire de valeurs par défaut fictives.

### 2.2 Horodatage trompeur du bon de visite

[`components/cockpit/visites/PrintableVisitModal.tsx`](components/cockpit/visites/PrintableVisitModal.tsx:170) — Utilise `new Date().toISOString()` **au moment du rendu** comme « horodatage » du document, pas l'heure réelle de la visite/signature.
**Correctif suggéré:** Persister et afficher l'horodatage réel de la signature/visite.

### 2.3 Numéros de mandat / facture fallback

- [`components/cockpit/visites/PrintableVisitModal.tsx`](components/cockpit/visites/PrintableVisitModal.tsx:69) — numéro de mandat fallback `'227'`.
- [`components/cockpit/transactions/InvoicePrintModal.tsx`](components/cockpit/transactions/InvoicePrintModal.tsx:60) et [`InvoiceFactureSection.tsx`](components/cockpit/transactions/invoice/InvoiceFactureSection.tsx:24) — `'FACT-2026-004'`.

**Correctif suggéré:** Générer depuis une séquence réelle ou bloquer si absent.

---

## 🟡 P3 — Identité d'agence codée en dur (au lieu du store AgencySettings)

Le store [`lib/store.tsx`](lib/store.tsx:1509) expose `useAgencySettings()` (champs `agent_name`, `agency_name`, `address`, `siren`, `cci_card_t`, `agency_rib_iban`, etc.) qui doit être la source unique. Or de nombreux composants codent en dur :

| Fichier | Ligne | Valeur codée en dur |
| --- | --- | --- |
| [`PrintableVisitModal.tsx`](components/cockpit/visites/PrintableVisitModal.tsx:55) | 55-64 | NELL'IMMO, adresse, RCS, CPI, GALIAN, MMA |
| [`PrintableVisitModal.tsx`](components/cockpit/visites/PrintableVisitModal.tsx:136) | 136-140 | « Nelly FERNANDEZ (Dirigeante) » |
| [`LegalClause.tsx`](components/cockpit/visites/LegalClause.tsx:18) | 18 | « SASU Nell'Immo » |
| [`InstantOfferModal.tsx`](components/cockpit/visites/InstantOfferModal.tsx:61) | 61 | « SASU Nell'Immo … Carte Pro CPI 1310 2019 000 042 974 » |
| [`VisitDebriefWhatsAppModal.tsx`](components/cockpit/visites/VisitDebriefWhatsAppModal.tsx:56) | 56-57 | « Nelly Fernandez — Nell'Immo Pélissanne / 📞 07 55 68 61 09 … » |
| [`InvoicePrintModal.tsx`](components/cockpit/transactions/InvoicePrintModal.tsx:65) | 65, 74, 192 | « SASU Nell'Immo », « Présidente SASU Nell'Immo » |
| [`InvoiceFactureSection.tsx`](components/cockpit/transactions/invoice/InvoiceFactureSection.tsx:94) | 94 | « SASU NELL'IMMO » |
| [`InvoiceSequestreSection.tsx`](components/cockpit/transactions/invoice/InvoiceSequestreSection.tsx:70) | 70 | « SASU Nell'Immo » |
| [`DealActionButtons.tsx`](components/cockpit/transactions/detail/DealActionButtons.tsx:26) | 26-27 | « Agence Nell'Immo », « Nelly FERNANDEZ — SASU NELL'IMMO / 📞 07 55 68 61 09 … » |
| [`SignatureDrawStep.tsx`](components/cockpit/electronic-signature/SignatureDrawStep.tsx:81) | 81 | « SASU Nell'Immo » |
| [`lib/signature.ts`](lib/signature.ts:44) | 44, 50 | « SASU NELL'IMMO », « Mme Nelly FERNANDEZ » |
| [`agenda-types.ts`](components/cockpit/agenda/agenda-types.ts:187) | 187 | « Agence Nell'Immo - Armoire A » |
| [`WeekView.tsx`](components/cockpit/agenda/WeekView.tsx:104) / [`DayView.tsx`](components/cockpit/agenda/DayView.tsx:48) / [`ListView.tsx`](components/cockpit/agenda/ListView.tsx:37) | — | note par défaut « Rendez-vous agence Nell'Immo » |
| [`agenda-types.ts`](components/cockpit/agenda/agenda-types.ts:311) | 311, 314 | PRODID iCal « SASU NellImmo » / « NellImmo Agenda Professionnel » |

**Pourquoi c'est important:** Toute évolution de l'identité (changement d'adresse, de RCS, de garant, de capital, rebranding) exige de modifier N fichiers au lieu d'un seul réglage — source d'incohérences (cf. 1.4) et de documents obsolètes.
**Correctif suggéré:** Remplacer chaque valeur par la lecture de `useAgencySettings()` avec un fallback neutre (pas de valeurs réelles codées en dur).

---

## 🟢 P4 — « Automatique » qui est en réalité manuel (UX trompeuse)

### 4.1 WhatsApp = liens wa.me manuels

- [`VisitDebriefWhatsAppModal.tsx`](components/cockpit/visites/VisitDebriefWhatsAppModal.tsx:63) — lien wa.me manuel.
- [`InstantOfferModal.tsx`](components/cockpit/visites/InstantOfferModal.tsx:74) — lien wa.me manuel.
- [`agenda-types.ts`](components/cockpit/agenda/agenda-types.ts:303) — [`openWhatsAppConfirmation`](components/cockpit/agenda/agenda-types.ts:300) ouvre un lien wa.me.
- [`app/cockpit/transactions/page.tsx`](app/cockpit/transactions/page.tsx:45) — [`sendWhatsAppLoanReminder`](app/cockpit/transactions/page.tsx:45) et [`sendGoogleReviewRequest`](app/cockpit/transactions/page.tsx:53) sont des liens wa.me manuels avec « Nelly Fernandez » codé en dur.

**Correctif suggéré:** Renommer les libellés en « Ouvrir WhatsApp » (pas « envoyer automatiquement ») et lire le numéro depuis les settings.

### 4.2 « PDF » = window.print()

- [`DealActionButtons.tsx`](components/cockpit/transactions/detail/DealActionButtons.tsx:107) — « Note d'Honoraires (PDF) » ne fait que `window.print()`.
- [`InvoicePrintModal.tsx`](components/cockpit/transactions/InvoicePrintModal.tsx:85) — message « Pensez à joindre votre facture PDF » : aucun PDF n'est généré/attaché.
- [`app/cockpit/transactions/page.tsx`](app/cockpit/transactions/page.tsx:86) — toast « pensez à joindre le PDF A4 ».

**Correctif suggéré:** Soit générer un vrai PDF (html2pdf / API), soit reformuler en « Imprimer ».

### 4.3 Google Meet « généré » = simple texte ajouté

[`NewEventModal.tsx`](components/cockpit/agenda/NewEventModal.tsx:123) — Le bouton « générer un lien Meet » se contente d'ajouter `https://meet.google.com/new` au champ lieu ; aucun vrai meeting n'est créé.
**Correctif suggéré:** Retirer l'option ou intégrer l'API Google Calendar/Meet.

### 4.4 Email « automatique » = mailto

[`DealPartiesCards.tsx`](components/cockpit/transactions/detail/DealPartiesCards.tsx:29) et [`DealActionButtons.tsx`](components/cockpit/transactions/detail/DealActionButtons.tsx:23) — [`handleEmailNotary`](components/cockpit/transactions/detail/DealActionButtons.tsx:23) et `openGmailCompose` ouvrent un mailto (client mail local), pas un envoi serveur.
**Correctif suggéré:** Reformuler en « Rédiger un email » si aucun backend d'envoi n'existe.

---

## ⚪ P5 — Flux incomplets / UX / finition

### 5.1 Formulaire de nouvelle transaction incomplet

[`NewDealModal.tsx`](components/cockpit/transactions/NewDealModal.tsx) — Ne capture que bien, prix (fallback `450000`), honoraires (fallback `18000`), nom/tél acheteur, nom notaire (placeholder « Me Bertrand VIDAL (Pélissanne) »). **Manquent** : email acheteur, infos vendeur, email/bureau notaire, séquestre. Ce manque alimente directement les données fabriquées de 2.1.
**Correctif suggéré:** Étendre le formulaire avec validation des champs notaire/vendeur obligatoires.

### 5.2 Valeurs par défaut d'agenda codées en dur

- [`useAgendaNewEvent.ts`](components/cockpit/agenda/useAgendaNewEvent.ts:27) — lieu par défaut `'Pélissanne'`.
- [`useAgendaNewEvent.ts`](components/cockpit/agenda/useAgendaNewEvent.ts:35) — ne valide que le titre.
- [`agenda-types.ts`](components/cockpit/agenda/agenda-types.ts:83) et [`ligne 213`](components/cockpit/agenda/agenda-types.ts:213) — téléphone de contact fallback = téléphone de l'agence `'07 55 68 61 09'` ; [`ligne 106`](components/cockpit/agenda/agenda-types.ts:106) notaire fallback `'04 90 00 00 00'`.
- [`agenda-types.ts`](components/cockpit/agenda/agenda-types.ts:293) et [`ligne 296`](components/cockpit/agenda/agenda-types.ts:296) — « Nelly Fernandez de Nell'Immo » codé en dur dans les messages WhatsApp.

**Correctif suggéré:** Lire depuis les settings et retirer les faux numéros de fallback.

### 5.3 Valeurs démo par défaut dans la signature

[`useElectronicSignature.ts`](components/cockpit/electronic-signature/useElectronicSignature.ts:36) — email signataire par défaut `'vendeur.nellimmo@gmail.com'`, téléphone `'06 12 34 56 78'`, OTP initial `'748291'`.
**Correctif suggéré:** Champs vides obligatoires, pas de valeurs démo.

### 5.4 Divers

- [`SignatureCanvas.tsx`](components/cockpit/visites/SignatureCanvas.tsx) — capture canvas uniquement, aucune vérification de signature.
- [`CalendarSyncModal.tsx`](components/cockpit/visites/CalendarSyncModal.tsx) — à vérifier (copie de lien ICS probablement manuelle).
- Aucun bouton « à venir » / TODO majeur trouvé dans les modules audités (les `disabled` rencontrés sont légitimes, liés aux états async).

---

## Synthèse priorisée

| # | Sévérité | Thème | Impact |
| --- | --- | --- | --- |
| 1.1 | 🔴 Légal | Signature eIDAS simulée présentée comme réelle | Contentieux, preuve nulle |
| 1.2 | 🔴 Légal | Faux scellement SHA-256 / registre | Fausse assurance d'intégrité |
| 1.3 | 🔴 Légal | RIB/BIC fictifs sur factures | Document comptable invalide |
| 1.4 | 🔴 Légal | Capital social incohérent (1 000 vs 2 000 €) | Incohérence juridique |
| 2.1 | 🟠 Données | Notaire/vendeur fabriqués à la création | Données corrompues persistées |
| 2.2 | 🟠 Données | Horodatage au rendu, pas réel | Document trompeur |
| 3.x | 🟡 Identité | Identité d'agence codée en dur (≈15 fichiers) | Incohérences, maintenance |
| 4.x | 🟢 UX | « Automatique » = wa.me / print / mailto | Promesses non tenues |
| 5.x | ⚪ Finition | Flux incomplets, valeurs démo | Qualité perçue |

**Recommandation n°1 (bloquant):** Traiter 1.1/1.2 en priorité — soit brancher un vrai prestataire eIDAS, soit retirer toute revendication de signature avancée / registre officiel / scellement cryptographique pour ne pas exposer l'agence.
