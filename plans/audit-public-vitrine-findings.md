# Audit Fonctionnel — Vitrine Publique (Marketing Site) Nell'Immo Cockpit

**Scope:** `app/(public)/**`, `components/public/**`, `lib/public-store.tsx`, `lib/mock-data-public.ts`, `lib/useFavorites.ts`
**Nature:** Analyse uniquement — aucun fichier modifié.
**Priorisation:** Légal/conformité > Intégrité des données > UX > Polish.

---

## A. LÉGAL / CONFORMITÉ (impact le plus élevé)

### A1. Fausses allégations de certification des avis (ISO 20252 / Opinion System)

- **Fichiers:** [`components/public/reviews/ReviewsScoreCard.tsx`](components/public/reviews/ReviewsScoreCard.tsx:21), [`components/public/Footer.tsx`](components/public/Footer.tsx:24), [`components/public/home/ReviewsHighlightSection.tsx`](components/public/home/ReviewsHighlightSection.tsx:13)
- **Problème:** La vitrine affirme « Avis Clients Contrôlés & Certifiés ISO 20252 », « adhérente à Opinion System », « Contrôlés et certifiés conformes ISO 20252 par Opinion System », et « Témoignages Vérifiés » / « Consulter tous les avis (98%) ». Aucune preuve d'adhésion réelle à Opinion System ni de certification ISO 20252 n'existe dans le code (pas d'ID Opinion System, pas de widget tiers, pas de lien de vérification). Chaque avis affiche un badge « Vérifié » ([`ReviewsList.tsx`](components/public/reviews/ReviewsList.tsx:40)).
- **Pourquoi c'est grave:** Allégations commerciales fausses sur des certifications/avis = pratique commerciale trompeuse (Loi Consommation, art. L121-2), risque DGCCRF et réputationnel majeur pour un outil « premium ».
- **Correctif:** Retirer toute mention ISO 20252 / Opinion System / « Vérifié » tant qu'une vraie intégration (widget Opinion System, ID client) n'est pas en place. Sinon brancher réellement l'API Opinion System et n'afficher que les avis réellement collectés.

### A2. Avis clients entièrement fabriqués présentés comme réels

- **Fichiers:** [`app/(public)/avis-clients/page.tsx`](app/(public)/avis-clients/page.tsx:13) (`INITIAL_REVIEWS`), [`components/public/home/ReviewsHighlightSection.tsx`](components/public/home/ReviewsHighlightSection.tsx:28)
- **Problème:** 4 avis codés en dur avec noms (« Michel et Marie-Hélène D. », « Thomas et Sophie V. »…), dates, rôles et commentaires détaillés, affichés comme témoignages authentiques avec badge « Vérifié ». Les mêmes personnes réapparaissent sur la home.
- **Pourquoi c'est grave:** Avis faux = tromperie du consommateur + risque juridique. Incohérent avec une promesse « premium » de transparence.
- **Correctif:** Alimenter les avis depuis une source réelle (Opinion System / Google Reviews via l'API) ou les marquer explicitement « Avis de démonstration » si le site est un template de démo. Ne jamais afficher de badge « Vérifié » sur du contenu non vérifié.

### A3. Formulaire d'avis qui « certifie » un avis non modéré et non persistant

- **Fichiers:** [`components/public/reviews/SubmitReviewModal.tsx`](components/public/reviews/SubmitReviewModal.tsx:62), [`app/(public)/avis-clients/page.tsx`](app/(public)/avis-clients/page.tsx:61)
- **Problème:** Après soumission, le modal affiche « Votre avis est certifié et s'affiche désormais parmi nos retours d'expérience vérifiés » ([`SubmitReviewModal.tsx`](components/public/reviews/SubmitReviewModal.tsx:69)). En réalité `handleAddReview` ajoute l'avis à un `useState` local ([`avis-clients/page.tsx`](app/(public)/avis-clients/page.tsx:74)) — il disparaît au rechargement, n'est pas modéré, pas lié à une transaction réelle, et n'est pas envoyé au cockpit.
- **Pourquoi c'est grave:** Double tromperie (fausse certification + fausse publication) et perte de données prospects.
- **Correctif:** Soit supprimer la promesse de certification/publication, soit persister l'avis (Supabase `reviews`), le soumettre à modération, et n'afficher qu'après validation.

### A4. Liens légaux morts / trompeurs dans le footer

- **Fichiers:** [`components/public/Footer.tsx`](components/public/Footer.tsx:186)
- **Problème:** « Barème d'honoraires » pointe vers `/agence` (pas de page barème dédiée) et « Mentions légales & RGPD » pointe vers `/contact` (pas de page mentions légales). Le barème officiel référencé dans les settings (`bareme_honoraires_url: "/honoraires"`, [`lib/mock-data-public.ts`](lib/mock-data-public.ts:25)) n'existe pas comme route.
- **Pourquoi c'est grave:** Obligations légales (mentions légales, barème honoraires Loi ALUR/Hoguet) non satisfaites ; liens morts nuisibles à la crédibilité.
- **Correctif:** Créer de vraies routes `/mentions-legales`, `/honoraires` (ou `/agence#bareme` avec ancre réelle) et y brancher les données légales depuis `AgencySettings`.

### A5. Exposition publique du lien « Espace Admin » / cockpit

- **Fichiers:** [`components/public/Footer.tsx`](components/public/Footer.tsx:164)
- **Problème:** Le footer public expose un bouton « Accès Espace Admin » → `/cockpit` visible par tout visiteur.
- **Pourquoi c'est grave:** Surface d'attaque inutile sur un site marketing ; signale l'existence du back-office au public.
- **Correctif:** Retirer ce lien du footer public (l'accès admin se fait par URL directe / login).

---

## B. INTÉGRITÉ DES DONNÉES

### B1. Identité/coordonnées de l'agence codées en dur partout (au lieu de `settings`)

- **Fichiers (non exhaustif):** [`components/public/Footer.tsx`](components/public/Footer.tsx:78), [`components/public/agence/AgencePracticalInfo.tsx`](components/public/agence/AgencePracticalInfo.tsx:13), [`components/public/agence/AgenceStorySection.tsx`](components/public/agence/AgenceStorySection.tsx:25), [`components/public/contact/ContactInfoCards.tsx`](components/public/contact/ContactInfoCards.tsx:19), [`components/public/property-detail/PropertySidebar.tsx`](components/public/property-detail/PropertySidebar.tsx:49), [`components/public/property-detail/PropertyFastContactBar.tsx`](components/public/property-detail/PropertyFastContactBar.tsx:40), [`components/public/favorites/FavoritesFooter.tsx`](components/public/favorites/FavoritesFooter.tsx:31), [`components/public/concierge/concierge-types.ts`](components/public/concierge/concierge-types.ts:77), [`components/public/home/AgencyValuePropsSection.tsx`](components/public/home/AgencyValuePropsSection.tsx:52), [`components/public/reviews/ReviewsCtaBox.tsx`](components/public/reviews/ReviewsCtaBox.tsx:25), [`components/public/ShareModal.tsx`](components/public/ShareModal.tsx:55), [`app/(public)/layout.tsx`](app/(public)/layout.tsx:25)
- **Problème:** Nom (Nelly Fernandez), téléphone (`07 55 68 61 09`), email (`nellimmo.acte@gmail.com`), adresse (`26 Avenue des Enjouvènes, 13330 Pélissanne`), CPI (`1310 2019 000 042 974`), horaires, liens WhatsApp (`wa.me/33755686109`) sont codés en dur dans ~15 composants, alors que `AgencySettings` (déjà chargé via `useNellimoStore().settings`) contient ces valeurs ([`lib/mock-data-public.ts`](lib/mock-data-public.ts:3)). Toute modification dans les Paramètres du cockpit ne se reflète pas sur la vitrine.
- **Pourquoi c'est grave:** Incohérence de données entre cockpit et vitrine ; rebranding/implantation impossible sans réécrire du code ; risque d'informations obsolètes (ex: le prompt mentionne un ancien numéro `04 90 55 55 55` qui n'est plus utilisé nulle part — signe de valeurs historiques figées).
- **Correctif:** Centraliser via un hook `useAgency()` qui lit `settings` et remplacer toutes les valeurs en dur (téléphone, email, adresse, CPI, WhatsApp, horaires, nom). Générer les liens `tel:`/`wa.me:` depuis `settings.phone`.

### B2. Métadonnées SEO / JSON-LD statiques et non synchronisées

- **Fichiers:** [`app/(public)/layout.tsx`](app/(public)/layout.tsx:8)
- **Problème:** `metadata` (title/description/keywords) et le JSON-LD `RealEstateAgent` sont des constantes codées en dur (nom, téléphone, email, adresse, horaires, geo) — pas lus depuis `AgencySettings`. Le layout est un composant serveur qui ne peut pas accéder au store client.
- **Pourquoi c'est grave:** SEO incohérent avec les vraies données ; si l'agence change d'adresse/téléphone, le schema.org reste faux.
- **Correctif:** Générer metadata/JSON-LD côté serveur depuis une source partagée (settings chargés serveur ou fichier de config unique) plutôt que des constantes dupliquées.

### B3. Concierge « IA » = réponses à base de templates + lead non synchronisé

- **Fichiers:** [`components/public/concierge/concierge-types.ts`](components/public/concierge/concierge-types.ts:51), [`components/public/concierge/ConciergeChat.tsx`](components/public/concierge/ConciergeChat.tsx:33)
- **Problème:** (a) Le chat appelle `/api/ai/assistant` mais retombe systématiquement sur `getLocalConciergeAnswer` (simple `if/else` sur mots-clés, [`concierge-types.ts`](components/public/concierge/concierge-types.ts:51)) — pas de vraie IA. (b) `saveConciergeLead` ([`concierge-types.ts`](components/public/concierge/concierge-types.ts:89)) écrit **directement** dans `localStorage` (`nellimo_contact_leads_v4`) au lieu d'appeler `addContactLead` du store, donc **ne synchronise jamais vers Supabase** et contourne la logique centralisée. (c) Le bouton « Être rappelé(e) par Nelly » ([`ConciergeInputBar.tsx`](components/public/concierge/ConciergeInputBar.tsx:47)) affiche « Demande enregistrée » mais ne fait que du localStorage.
- **Pourquoi c'est grave:** Promesse « IA » non tenue (trompeur) ; leads du concierge perdus si Supabase est configuré (incohérence avec la boîte de réception cockpit).
- **Correctif:** Brancher `saveConciergeLead` sur `addContactLead` du store (qui gère Supabase) ; soit implémenter une vraie IA, soit retirer les mentions « IA »/« assistante virtuelle » et qualifier le widget de FAQ.

### B4. Données DVF / cadastre / statistiques vendeur fabriquées présentées comme réelles

- **Fichiers:** [`components/public/estimation/EstimationStepSpecs.tsx`](components/public/estimation/EstimationStepSpecs.tsx:15) (`CITY_RATES` codés en dur, affichés « Base DVF ~X €/m² »), [`app/(public)/espace-vendeur/[token]/page.tsx`](app/(public)/espace-vendeur/[token]/page.tsx:54) (fallbacks vues 340/510/185/95, leads 8, verbatims codés en dur), [`components/public/espace-vendeur/SellerVisitsJournal.tsx`](components/public/espace-vendeur/SellerVisitsJournal.tsx:59) (points forts codés en dur), [`components/public/espace-vendeur/SellerStatsCards.tsx`](components/public/espace-vendeur/SellerStatsCards.tsx:56) (« +18% cette semaine » codé en dur)
- **Problème:** L'estimation affiche une fourchette « Repère Marché Indicatif • Base DVF » calculée à partir de taux €/m² **codés en dur** par ville, sans appel aux vraies données DVF. L'Espace Vendeur affiche des vues/leads/verbatims de repli codés en dur comme s'ils étaient réels, avec « Mise à jour en direct » ([`SellerStatsCards.tsx`](components/public/espace-vendeur/SellerStatsCards.tsx:41)) et « +18% cette semaine ».
- **Pourquoi c'est grave:** Présenter des chiffres inventés comme des données notariales DVF réelles = tromperie du vendeur (client premium) et risque légal sur les avis de valeur.
- **Correctif:** Soit connecter aux vraies sources DVF/cadastre (routes `/api/dvf`, `/api/cadastre` existent), soit afficher clairement « estimation indicative de démonstration » et masquer les fallbacks quand aucune donnée réelle n'existe.

### B5. Composants cockpit importés dans le bundle public

- **Fichiers:** [`app/(public)/espace-vendeur/[token]/page.tsx`](app/(public)/espace-vendeur/[token]/page.tsx:7) (importe `DvfPositioningSection` depuis `@/components/cockpit/...`), [`components/public/espace-vendeur/SellerFeedbackSynthesis.tsx`](components/public/espace-vendeur/SellerFeedbackSynthesis.tsx:5) (importe `AvisDonutChart` depuis `@/components/cockpit/...`)
- **Problème:** Contredit l'architecture documentée dans [`lib/public-store.tsx`](lib/public-store.tsx:21) qui garantit que les datasets cockpit ne sont jamais bundlés côté public. Ces imports tirent du code cockpit (et potentiellement des données) dans le bundle public.
- **Pourquoi c'est grave:** Fuite potentielle de code/données internes ; gonflement du bundle ; violation de la séparation public/cockpit.
- **Correctif:** Extraire ces composants DVF/donut vers un dossier partagé `components/shared` ou dupliquer une version publique allégée, sans dépendance cockpit.

---

## C. UX / FONCTIONNEL

### C1. Honoraires / taux codés en dur non configurables

- **Fichiers:** [`components/public/FeeCalculator.tsx`](components/public/FeeCalculator.tsx:15) (`nellimmoRate = 0.035`, min 6500, `traditionalRate = 0.055`), [`components/public/LoanCalculator.tsx`](components/public/LoanCalculator.tsx:15) (`insuranceRate = 0.34`, notaire `0.075`)
- **Problème:** Le simulateur d'honoraires affiche « Barème Nell'Immo ~3,5 % » et « économie vs 5,5 % » en dur. Le simulateur de prêt utilise assurance 0,34 % et frais notaire 7,5 % en dur. Aucune de ces valeurs ne vient des settings ni du barème réel du mandat (les biens ont pourtant `agency_fees_percentage` réel, ex. 4,0 % dans [`lib/mock-data-public.ts`](lib/mock-data-public.ts:104)).
- **Pourquoi c'est grave:** Le simulateur peut contredire le barème réel affiché sur les fiches biens (3,5 % vs 4,0 %) → incohérence de données trompeuse pour un outil pro.
- **Correctif:** Rendre le taux configurable (settings `bareme_honoraires`) et, idéalement, aligner le simulateur sur le barème réel de l'agence.

### C2. Boutons/CTA « fantômes » sans action réelle

- **Fichiers:** [`components/public/concierge/ConciergeInputBar.tsx`](components/public/concierge/ConciergeInputBar.tsx:47) (rappel « enregistré » sans envoi réel), [`components/public/reviews/SubmitReviewModal.tsx`](components/public/reviews/SubmitReviewModal.tsx:165) (publication non persistée), [`components/public/Footer.tsx`](components/public/Footer.tsx:186) (liens légaux morts)
- **Problème:** Plusieurs boutons affichent une confirmation de succès sans action backend réelle (voir A3, B3).
- **Correctif:** Uniformiser via le store `addContactLead`/`addEstimationLead` et ne montrer un succès qu'après persistance réelle.

### C3. Espace Vendeur : « Espace de démonstration » et token de démo exposés

- **Fichiers:** [`app/(public)/espace-vendeur/page.tsx`](app/(public)/espace-vendeur/page.tsx:120)
- **Problème:** Un encart « Espace de démonstration » avec le code `token_dupont_2024` cliquable est visible sur la page publique d'accès vendeur.
- **Pourquoi c'est grave:** Rappelle que le produit est une démo ; expose un token de démo ; peu « premium ».
- **Correctif:** Retirer l'encart de démo en production (ou le masquer derrière un flag d'environnement).

### C4. Formulaire de visite : créneaux génériques, pas de vraie disponibilité

- **Fichiers:** [`components/public/property-detail/PropertyVisitForm.tsx`](components/public/property-detail/PropertyVisitForm.tsx:33)
- **Problème:** Les « créneaux » sont 4 libellés statiques (« Semaine matin », « Samedi »…) sans lien avec l'agenda réel du cockpit (module visites/agenda existe côté cockpit).
- **Correctif:** Idéalement exposer de vrais créneaux depuis l'agenda ; à défaut, reformuler comme « préférences » plutôt que créneaux confirmables.

---

## D. POLISH / SEO

### D1. Pages biens et fiches biens sans Schema.org produit

- **Fichiers:** [`app/(public)/biens/[id]/page.tsx`](app/(public)/biens/[id]/page.tsx:1) (`'use client'`, aucune balise JSON-LD `Product`/`RealEstateListing`/`Offer`), [`app/(public)/biens/page.tsx`](app/(public)/biens/page.tsx:1)
- **Problème:** Aucun schema.org `Product`/`Offer`/`RealEstateListing` sur les fiches biens (prix, DPE, adresse, images). Le seul JSON-LD est l'agence dans le layout. Les pages sont des composants client (pas de `generateMetadata`), donc pas de title/description SEO par bien.
- **Pourquoi c'est grave:** SEO immobilier faible (rich results produits/immobilier absents) pour un site dont le métier est la vente de biens.
- **Correctif:** Ajouter `generateMetadata` et JSON-LD `Product`/`RealEstateListing` par fiche (titre, prix, DPE, images, adresse) — nécessite de rendre la page serveur ou d'injecter le JSON-LD.

### D2. DPE affiché en texte brut, pas de badge visuel réglementaire

- **Fichiers:** [`components/public/property-detail/PropertyDescription.tsx`](components/public/property-detail/PropertyDescription.tsx:21)
- **Problème:** Le DPE/GES est ajouté comme une ligne de texte dans la description (« DPE Classe A (45 kWh/m²/an)… ») au lieu d'un badge/échelle DPE visuel. Un composant `DpeBadge`/échelle DPE existe dans [`components/ui/dpe/`](components/ui/dpe/) mais n'est pas utilisé sur la fiche publique.
- **Pourquoi c'est grave:** Le DPE est un critère d'achat majeur et une obligation d'affichage ; le présenter en texte brut est un manque de polish et de lisibilité.
- **Correctif:** Réutiliser les composants `DpeBadge`/`DpeScaleColumn`/`GesScaleColumn` sur la fiche bien.

### D3. Incohérences de contenu « premium »

- **Fichiers:** [`components/public/agence/AgenceHeader.tsx`](components/public/agence/AgenceHeader.tsx:15) (« près de 20 ans d'expérience ») vs [`components/public/estimation/EstimationBenefitsSidebar.tsx`](components/public/estimation/EstimationBenefitsSidebar.tsx:16) (« plus de 15 ans ») vs [`components/public/agence/AgenceStorySection.tsx`](components/public/agence/AgenceStorySection.tsx:43) (« plus de 15 années ») ; [`components/public/Footer.tsx`](components/public/Footer.tsx:17) (« 20 Ans d'Expertise »)
- **Problème:** Le nombre d'années d'expérience varie (15 vs 20) selon les sections ; la home affiche « Consulter tous les avis (98%) » sans source.
- **Correctif:** Uniformiser les chiffres marketing via une source unique de copywriting.

### D4. Horaires incohérents entre footer et JSON-LD

- **Fichiers:** [`components/public/Footer.tsx`](components/public/Footer.tsx:94) (« Lundi au Vendredi 08h-18h »), [`app/(public)/layout.tsx`](app/(public)/layout.tsx:42) (JSON-LD ajoute le samedi 09h-18h), [`components/public/agence/AgencePracticalInfo.tsx`](components/public/agence/AgencePracticalInfo.tsx:21) (« et sur RDV le samedi »)
- **Correctif:** Centraliser les horaires dans `AgencySettings` et les lire partout (footer, agence, JSON-LD).

---

## RÉSUMÉ PRIORISÉ (ordre d'action recommandé)

| # | Priorité | Problème | Fichiers clés |
| --- | ---------- | ---------- | --------------- |
| 1 | Légal | Fausses certifications ISO 20252 / Opinion System / « Vérifié » | ReviewsScoreCard, Footer, ReviewsList |
| 2 | Légal | Avis 100 % fabriqués présentés comme réels | avis-clients/page, ReviewsHighlightSection |
| 3 | Légal | Formulaire d'avis « certifie » un avis non modéré/non persisté | SubmitReviewModal, avis-clients/page |
| 4 | Légal | Liens légaux morts (mentions légales, barème) | Footer |
| 5 | Légal | Lien « Espace Admin » exposé au public | Footer |
| 6 | Données | Identité/coordonnées codées en dur (~15 fichiers) au lieu de `settings` | Footer, PropertySidebar, ContactInfoCards, layout… |
| 7 | Données | Concierge « IA » template + lead non synchronisé Supabase | concierge-types, ConciergeChat |
| 8 | Données | DVF/cadastre/stats vendeur fabriqués présentés comme réels | EstimationStepSpecs, espace-vendeur/[token] |
| 9 | Données | Composants cockpit importés dans le bundle public | espace-vendeur/[token], SellerFeedbackSynthesis |
| 10 | Données | SEO/JSON-LD statiques non synchronisés | layout.tsx |
| 11 | UX | Honoraires/taux codés en dur, incohérents avec le barème réel | FeeCalculator, LoanCalculator |
| 12 | UX | Boutons « fantômes » (rappel concierge, publication avis) | ConciergeInputBar, SubmitReviewModal |
| 13 | UX | « Espace de démonstration » + token de démo exposés | espace-vendeur/page |
| 14 | UX | Créneaux de visite génériques non liés à l'agenda | PropertyVisitForm |
| 15 | Polish | Pas de Schema.org produit sur les fiches biens | biens/[id]/page |
| 16 | Polish | DPE en texte brut au lieu d'un badge visuel | PropertyDescription |
| 17 | Polish | Incohérences « 15 vs 20 ans » et horaires | AgenceHeader, Footer, layout |
