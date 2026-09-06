# Audit Fonctionnel — Modules Avis de Valeur / Pige / Comptes-Rendus

**Périmètre analysé (lecture seule, aucun fichier modifié)**

- `app/cockpit/avis-de-valeur/**` + `components/cockpit/avis-de-valeur/**`
- `app/cockpit/pige/**` + `components/cockpit/pige/**`
- `app/cockpit/comptes-rendus/**` + `components/cockpit/comptes-rendus/**`
- `lib/dvf.ts`, `lib/cadastre.ts`, `lib/pige-scraper.ts`, `lib/mock-data-dvf.ts`, `app/api/dvf/route.ts`

**Priorisation :** Légal / conformité > Intégrité des données > UX > Finition.

---

## A. Légal / Conformité (risque juridique & réputationnel)

### A1. Données DVF « officielles » issues d'un miroir non officiel

[`app/api/dvf/route.ts`](app/api/dvf/route.ts:51) interroge `https://api.cquest.org/dvf` (miroir personnel de Christian Quest, **non** officiel DGFiP/data.gouv.fr), mais [`app/api/dvf/route.ts`](app/api/dvf/route.ts:133) renvoie `sourceLabel: 'Données Officielles DGFiP / data.gouv.fr (Notaires)'` et `isOfficial: true`. En cas d'échec, [`app/api/dvf/route.ts`](app/api/dvf/route.ts:145) bascule silencieusement sur `MOCK_DVF_TRANSACTIONS` (fictif) tout en conservant le même label « officiel ».

- **Pourquoi ça compte :** présenter des données fictives ou d'un miroir tiers comme « données officielles DGFiP » est trompeur pour un vendeur et expose l'agence (avis de valeur = document à valeur probatoire). C'est le point le plus grave.
- **Correctif :** brancher la vraie API DGFiP/data.gouv.fr (ou un fournisseur sous licence), renommer le label en « Source : DVF (miroir tiers) » tant que ce n'est pas officiel, et marquer explicitement `isOfficial:false` + bannière « données de démonstration » dès qu'on retombe sur le mock.

### A2. `isDvfSourceOfficial()` peut mentir après repli sur mock

[`lib/dvf.ts`](lib/dvf.ts:131) : `isDvfSourceOfficial()` renvoie `lastFetchOfficial || getActiveDvfProvider().isOfficial`. Si le dernier fetch a échoué et est retombé sur le provider local (mock), la fonction peut quand même renvoyer `true` via le provider actif.

- **Correctif :** ne renvoyer `true` que si `lastFetchOfficial` est vrai **et** que le dernier fetch n'a pas utilisé le repli local.

### A3. Badge « Certifié » / « Officiel » sur des données simulées

- [`components/cockpit/avis-de-valeur/TriangulationPanel.tsx`](components/cockpit/avis-de-valeur/TriangulationPanel.tsx:24) : badge « DVF Notaires 2024-2026 **Certifié** » alors que la source peut être le mock.
- [`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:49) : « Avis de Valeur **Officiel** ».
- [`components/cockpit/comptes-rendus/VendorReportPreview.tsx`](components/cockpit/comptes-rendus/VendorReportPreview.tsx:52) : « Compte-Rendu … **Certifié** ».
- [`components/cockpit/comptes-rendus/ReportEditorForm.tsx`](components/cockpit/comptes-rendus/ReportEditorForm.tsx:132) : « Générer le Compte-Rendu Vendeur **Officiel** ».
- [`components/cockpit/pige/SparringPartnerPanel.tsx`](components/cockpit/pige/SparringPartnerPanel.tsx:34) : « réponse psychologique **certifiée** ».
- **Pourquoi ça compte :** « certifié »/« officiel » sans organisme certificateur ni source fiable = allégation infondée transmissible au client.
- **Correctif :** remplacer par des libellés factuels (« Estimation indicative », « Synthèse générée ») et réserver « certifié » à un vrai flux audité.

### A4. Disclaimer obsolète/contradictoire dans le dossier d'expertise

[`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:152) : le disclaimer affirme que les données sont « une simulation » et « seront remplacées par les vraies données DGFiP une fois connectées », alors que l'API est déjà connectée (A1) et que le WhatsApp/Gmail du même composant clame des « ventes réelles notariées » (B1).

- **Correctif :** aligner le disclaimer sur l'état réel de la source (officielle vs démo) et supprimer la mention « une fois connecté ».

---

## B. Intégrité des données (chiffres faux présentés comme réels)

### B1. « X ventes réelles notariées » même en mode mock

[`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:33) : le message WhatsApp clame « X ventes réelles notariées » sans vérifier que les transactions proviennent bien du flux officiel (elles peuvent être le mock).

- **Correctif :** conditionner cette phrase à `isOfficial` ; sinon dire « X transactions comparables analysées ».

### B2. « Micromarché DVF Réel … à 500 m » mais distances jusqu'à 940 m

[`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:102) et [`components/cockpit/avis-de-valeur/DvfTransactionsTable.tsx`](components/cockpit/avis-de-valeur/DvfTransactionsTable.tsx:30) affirment « dans un rayon de 500 m », or les transactions mock vont jusqu'à ~940 m.

- **Correctif :** soit filtrer réellement à 500 m, soit afficher le rayon réellement couvert.

### B3. Benchmarks DVF codés en dur présentés comme « prix notariés réels »

- [`components/cockpit/pige/pige-types.ts`](components/cockpit/pige/pige-types.ts:94) : `computeDvfGap` code en dur `3450 / 3000 / 3250` €/m² (commentaire « Benchmarks DVF Pélissanne ~3250… ») et l'affiche comme écart au « Marché Notaires DVF ».
- [`components/cockpit/pige/pige-import.ts`](components/cockpit/pige/pige-import.ts:339) : `DVF_SECTOR_MEDIANS` statique « Prix médians notariés DVF indicatifs par commune (base DGFiP) » + repli `3200` (ligne 361).
- [`components/cockpit/pige/LeadCard.tsx`](components/cockpit/pige/LeadCard.tsx:95) : « Écart avec le Marché Notaires DVF (~X €/m²) » et ligne 98 « actes réels ».
- **Pourquoi ça compte :** des constantes locales sont présentées comme des statistiques notariales réelles à un prospect/vendeur.
- **Correctif :** alimenter ces benchmarks depuis le vrai flux DVF (médiane calculée sur les transactions réelles du secteur) ou les étiqueter « estimation interne indicative ».

### B4. Estimation « DVF Marché » basée sur un calcul grossier

[`components/cockpit/pige/SellerDiscoveryModal.tsx`](components/cockpit/pige/SellerDiscoveryModal.tsx:37) : `basePricePerM2 = city.includes('salon') ? 3400 : 3800`, piscine +25000, garage +15000 ; affiché via [`SellerDiscoveryDvfCard.tsx`](components/cockpit/pige/SellerDiscoveryDvfCard.tsx:26) comme « Estimation DVF Marché ».

- **Correctif :** étiqueter « estimation indicative » et idéalement remplacer par la médiane DVF réelle de la commune.

### B5. Métriques par défaut fabriquées dans le compte-rendu vendeur

[`components/cockpit/comptes-rendus/useVendorReportState.ts`](components/cockpit/comptes-rendus/useVendorReportState.ts:26) : valeurs par défaut codées en dur (vues 340/510/185/95, leads 8, visites 3, retours 2/1/0) qui apparaissent pré-remplies dans l'éditeur et peuvent être générées telles quelles.

- **Correctif :** démarrer à 0 (ou à vide) et forcer la saisie réelle ; ne pré-remplir que depuis un historique existant.

### B6. Synthèse narrative fabriquée

[`components/cockpit/comptes-rendus/useVendorReportState.ts`](components/cockpit/comptes-rendus/useVendorReportState.ts:81) : le résumé généré affirme « Les retours soulignent unanimement la luminosité et l'emplacement recherché » même si aucun retour n'a été saisi ; ligne 84 « 3 biens concurrents arrivés sur {city} » est un chiffre inventé.

- **Correctif :** générer la synthèse à partir des données réellement saisies (verbatims, retours) et supprimer les affirmations non étayées.

---

## C. Identité agence codée en dur (non personnalisable via AgencySettings)

`lib/types.ts` définit `AgencySettings` (lignes 334-407) avec `agency_name`, `agent_name`, `phone`, `email`, `card_t_number`, etc. Or ces valeurs sont codées en dur dans les flux sortants :

- [`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:33) : WhatsApp « Nelly Fernandez — Nell'Immo (07 55 68 61 09) ».
- [`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:41) : Gmail « SASU Nell'Immo Pélissanne, 📞 07 55 68 61 09 | ✉️ <nellimmo.acte@gmail.com> ».
- [`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:163) : « Nelly FERNANDEZ • Carte CPI 1310 2019 000 042 974 » ; ligne 164 « SASU Nell'Immo — Pélissanne ».
- [`components/cockpit/comptes-rendus/useVendorReportState.ts`](components/cockpit/comptes-rendus/useVendorReportState.ts:148) : WhatsApp « Nelly FERNANDEZ — SASU Nell'Immo (07 55 68 61 09) » ; ligne 126 « COMPTE-RENDU VENDEUR NELL'IMMO ».
- [`components/cockpit/pige/pige-types.ts`](components/cockpit/pige/pige-types.ts:105) : `buildWhatsAppMessage` « Nelly Fernandez, gérante de l'agence Nell'Immo à Pélissanne ».
- [`components/cockpit/avis-de-valeur/TriangulationPanel.tsx`](components/cockpit/avis-de-valeur/TriangulationPanel.tsx:44) : « Prix Cible Recommandé Nell'Immo ».
- [`components/cockpit/comptes-rendus/editor/ReportPortalViewsSection.tsx`](components/cockpit/comptes-rendus/editor/ReportPortalViewsSection.tsx:68) : label « Vues Site Nell'Immo ».
- [`components/cockpit/avis-de-valeur/page.tsx`](components/cockpit/avis-de-valeur/page.tsx:18) : ville par défaut « Pélissanne » ; ligne 20 propriétaire « M. et Mme Dupont ».

**Pourquoi ça compte :** un outil « premium » censé être multi-agence / personnalisable envoie des documents au nom d'une agence codée en dur ; toute autre agence ou un changement de coordonnées produirait des documents faux.
**Correctif :** centraliser dans un helper `agencyIdentity()`/`agencyContact()` lisant `AgencySettings` du store et l'utiliser partout (WhatsApp, Gmail, en-têtes, signatures, labels).

---

## D. Honoraires / frais / communes / rayons codés en dur

- [`components/cockpit/pige/usePigeActions.ts`](components/cockpit/pige/usePigeActions.ts:84) : `price_net_seller = price_asked * 0.95` ; ligne 85 `agency_fees_amount = *0.05` ; ligne 86 `agency_fees_percentage: 5` (honoraires 5 % codés en dur).
- [`components/cockpit/pige/SellerDiscoveryModal.tsx`](components/cockpit/pige/SellerDiscoveryModal.tsx:59) : honoraires 5 % codés en dur.
- [`components/cockpit/pige/usePigeActions.ts`](components/cockpit/pige/usePigeActions.ts:35) : mapping code postal codé en dur (Pélissanne 13330 / Salon 13300 / sinon 13410).
- [`components/cockpit/pige/usePigeActions.ts`](components/cockpit/pige/usePigeActions.ts:43) : `rooms_count: 5` ; ligne 90 `bedrooms_count: 3` ; ligne 92 `features: ['Jardin','Calme']` codés en dur à la conversion en mandat.
- [`components/cockpit/pige/usePigeActions.ts`](components/cockpit/pige/usePigeActions.ts:75) : `seller_email: 'contact@vendeur.fr'` (placeholder).
- [`components/cockpit/pige/pige-import.ts`](components/cockpit/pige/pige-import.ts:217) : `propertyType: 'maison'` pour tous les imports ; ligne 229 `rooms_count: 5`.
- [`components/cockpit/pige/NewLeadModal.tsx`](components/cockpit/pige/NewLeadModal.tsx:128) : quartiers codés en dur `['Enjouvènes','Viougues','Costes','Centre','Colline']`.

**Pourquoi ça compte :** honoraires et caractéristiques du bien doivent venir des paramètres agence / des données réelles du lead, pas de constantes.
**Correctif :** lire `agency_fees_percentage` depuis `AgencySettings`, dériver code postal/quartiers d'une vraie table de communes, et reporter les caractéristiques réellement saisies dans le lead.

---

## E. Fonctionnalités « IA » / « automatique » / « en direct » qui sont statiques ou simulées

- [`components/cockpit/pige/SparringPartnerPanel.tsx`](components/cockpit/pige/SparringPartnerPanel.tsx:31) : « Sparring-Partner **IA** » mais n'affiche que des scripts statiques `OBJECTION_SCRIPTS` (aucun appel IA) ; ligne 39 « Méthode R1 Exclusivité ».
- [`components/cockpit/pige/PigeHeader.tsx`](components/cockpit/pige/PigeHeader.tsx:23) : « comparateur DVF **en direct** » alors que les benchmarks sont statiques (B3).
- [`components/cockpit/pige/LeadCard.tsx`](components/cockpit/pige/LeadCard.tsx:155) : « Transformer en Mandat Officiel (1 Clic) » — le clic crée un brouillon avec données codées en dur (D), pas un mandat « officiel ».
- [`lib/pige-scraper.ts`](lib/pige-scraper.ts:60) : `scrapingProvider` lève « Scraping automatisé non raccordé » ; `ACTIVE_MODE='manuel'` (ligne 77). Le module « Pige » est donc purement manuel/import CSV, sans collecte automatique.

**Pourquoi ça compte :** promettre « IA », « en direct » ou « automatique » pour du contenu statique/manuel nuit à la crédibilité d'un outil premium.
**Correctif :** soit brancher un vrai moteur (IA/scraping), soit reformuler les libellés (« Scripts d'argumentaire », « Comparateur DVF indicatif », « Créer un mandat brouillon »).

---

## F. Flux incomplets / placeholders / UI inachevée

### F1. « Dossier d'expertise 8 pages » sans contenu réel

[`components/cockpit/avis-de-valeur/ExpertiseDossier.tsx`](components/cockpit/avis-de-valeur/ExpertiseDossier.tsx:82) : promet un « dossier prestige 8 pages » mais n'affiche qu'une grille de descriptions de chapitres ; les chapitres 2, 6 et 8 n'ont aucun contenu généré.

- **Correctif :** soit générer réellement les 8 sections, soit réduire l'ambition affichée à ce qui est réellement produit.

### F2. Conversion de prospect en mandat incomplète

[`components/cockpit/pige/usePigeActions.ts`](components/cockpit/pige/usePigeActions.ts:65) : `handleConvertToMandate` crée un brouillon avec `seller_email: 'contact@vendeur.fr'`, adresse « Quartier {city} », caractéristiques codées en dur (D) — le mandat n'est pas réellement « obtenu » ni exploitable sans retouche manuelle lourde.

- **Correctif :** collecter email/adresse/caractéristiques réels lors de la conversion ou ouvrir l'éditeur de mandat pré-rempli pour complétion.

### F3. Valeurs par défaut « démo » dans l'avis de valeur

[`app/cockpit/avis-de-valeur/page.tsx`](app/cockpit/avis-de-valeur/page.tsx:18) : ville « Pélissanne », propriétaire « M. et Mme Dupont », adresse « 145 Chemin des Oliviers » pré-remplis.

- **Correctif :** démarrer sur un formulaire vide ou sur le dernier bien réellement sélectionné.

### F4. Poids de la méthode composite codés en dur

[`components/cockpit/avis-de-valeur/avis-de-valeur-types.ts`](components/cockpit/avis-de-valeur/avis-de-valeur-types.ts:118) : pondération 55/25/20 (DVF/capitalisation/coût) codée en dur sans justification ni paramétrage.

- **Correctif :** exposer la pondération comme paramètre (avec valeurs par défaut documentées).

---

## G. Points correctement traités (à préserver / répliquer)

- [`components/cockpit/avis-de-valeur/DvfTransactionsTable.tsx`](components/cockpit/avis-de-valeur/DvfTransactionsTable.tsx:43) : bannière de transparence distinguant données officielles vs démo — bon modèle à généraliser.
- [`components/cockpit/comptes-rendus/DvfPositioningSection.tsx`](components/cockpit/comptes-rendus/DvfPositioningSection.tsx:31) : utilise le vrai seam `fetchDvfTransactions` avec bannière de transparence — bien fait.
- [`lib/cadastre.ts`](lib/cadastre.ts:253) : intégration IGN réelle et fonctionnelle (pas de mock).
- [`lib/mock-data-dvf.ts`](lib/mock-data-dvf.ts) : données clairement étiquetées « fictives » — bonne pratique à conserver.

---

## Synthèse des priorités d'action

| # | Priorité | Problème | Fichier(s) clé(s) |
| --- | ---------- | ---------- | ------------------- |
| A1-A2 | Légal | DVF « officiel » via miroir tiers + repli mock non signalé | `app/api/dvf/route.ts`, `lib/dvf.ts` |
| A3-A4 | Légal | Badges « Certifié/Officiel » + disclaimer obsolète | `TriangulationPanel`, `ExpertiseDossier`, `VendorReportPreview`, `ReportEditorForm`, `SparringPartnerPanel` |
| B1-B6 | Données | Chiffres mock/statiques présentés comme réels | `ExpertiseDossier`, `pige-types`, `pige-import`, `LeadCard`, `SellerDiscoveryModal`, `useVendorReportState` |
| C | Données | Identité agence codée en dur partout | `ExpertiseDossier`, `useVendorReportState`, `pige-types`, `TriangulationPanel`, `page.tsx` |
| D | Données | Honoraires 5 %, communes, rayons, caractéristiques codés en dur | `usePigeActions`, `SellerDiscoveryModal`, `pige-import`, `NewLeadModal` |
| E | UX | « IA »/« en direct »/« automatique » statiques | `SparringPartnerPanel`, `PigeHeader`, `LeadCard`, `pige-scraper` |
| F | UX | Flux incomplets / placeholders / démo pré-remplie | `ExpertiseDossier`, `usePigeActions`, `page.tsx`, `avis-de-valeur-types` |
